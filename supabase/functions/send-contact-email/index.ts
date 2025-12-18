// Supabase Edge Function to send email notifications for contact form submissions
// Uses Resend API to send emails to marwanmrait@gmail.com

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
// TODO: Change back to 'marwanmrait@gmail.com' after verifying domain in Resend
const RECIPIENT_EMAIL = Deno.env.get('RECIPIENT_EMAIL') || 'marwanmrait@gmail.com'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  document_type: string | null
  language_direction: string | null
  message: string
  whatsapp_followup: boolean
  file_urls: string[]
  status: string
  created_at: string
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: ContactSubmission
  schema: string
  old_record: ContactSubmission | null
}

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const payload: WebhookPayload = await req.json()

    // Only process INSERT events
    if (payload.type !== 'INSERT') {
      return new Response(
        JSON.stringify({ message: 'Ignored non-INSERT event' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    const submission = payload.record

    // Format the email HTML
    const emailHtml = `
      <h2>Nieuwe offerte aanvraag - Al-Bayaan Vertalingen</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Naam</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${submission.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">E-mail</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${submission.email}">${submission.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Telefoon</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${submission.phone || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Taalrichting</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${submission.language_direction || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Bericht</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${submission.message || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Bestanden</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${submission.file_urls?.length > 0 ? submission.file_urls.join('<br>') : 'Geen bestanden'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Datum</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${new Date(submission.created_at).toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; color: #666;">
        Dit bericht is automatisch verzonden via het contactformulier op albayaanvertalingen.nl
      </p>
    `

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Al-Bayaan Vertalingen <onboarding@resend.dev>',
        to: [RECIPIENT_EMAIL],
        subject: `Nieuwe offerte aanvraag van ${submission.name}`,
        html: emailHtml,
        reply_to: submission.email,
      }),
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: resendData }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('Email sent successfully:', resendData)
    return new Response(
      JSON.stringify({ success: true, emailId: resendData.id }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
