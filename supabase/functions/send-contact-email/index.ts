// Supabase Edge Function to trigger the translation pipeline on new contact submissions
// The translation pipeline will send the email with the DOCX attachment

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const TRANSLATION_WEBHOOK_URL = 'https://albayaan-translator-production.up.railway.app/webhook'

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

    const payload: WebhookPayload = await req.json()

    // Only process INSERT events
    if (payload.type !== 'INSERT') {
      return new Response(
        JSON.stringify({ message: 'Ignored non-INSERT event' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    const submission = payload.record
    console.log(`New submission received: ${submission.id} from ${submission.name}`)

    // Trigger the translation pipeline (don't wait for completion)
    // The pipeline will send the email with the translated DOCX
    fetch(TRANSLATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(err => {
      console.error('Failed to trigger translation pipeline:', err)
    })

    console.log(`Translation pipeline triggered for submission ${submission.id}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Translation pipeline triggered',
        submissionId: submission.id
      }),
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
