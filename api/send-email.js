// Vercel Serverless Function to send contact form emails via Resend
// POST /api/send-email

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RECIPIENT_EMAIL = 'marwanmrait@gmail.com';

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const { name, email, phone, languageDirection, message, fileUrls } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Format the email HTML
    const emailHtml = `
      <h2>Nieuwe offerte aanvraag - Al-Bayaan Vertalingen</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Naam</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">E-mail</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Telefoon</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${phone || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Taalrichting</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${languageDirection || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Bericht</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${message || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Bestanden</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${fileUrls?.length > 0 ? fileUrls.map((url, i) => {
            const fileName = url.split('/').pop();
            return `<a href="${url}" target="_blank" style="color: #1a73e8; text-decoration: underline;">📎 ${fileName}</a>`;
          }).join('<br>') : 'Geen bestanden'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Datum</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; color: #666;">
        Dit bericht is automatisch verzonden via het contactformulier op albayaanvertalingen.nl
      </p>
    `;

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Al-Bayaan Vertalingen <noreply@albayaanvertalingen.nl>',
        to: [RECIPIENT_EMAIL],
        subject: `Nieuwe offerte aanvraag van ${name}`,
        html: emailHtml,
        reply_to: email,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return res.status(500).json({ error: 'Failed to send email', details: resendData });
    }

    console.log('Email sent successfully:', resendData);
    return res.status(200).json({ success: true, emailId: resendData.id });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
