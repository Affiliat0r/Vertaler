const fs = require('fs');
const path = require('path');

/**
 * Service for sending emails with translated documents via Resend API
 */
class EmailService {
  constructor() {
    this.apiKey = process.env.RESEND_API_KEY;
    // Send to both recipients
    this.recipientEmails = [
      'marwanmrait@gmail.com',
      'hasan.atesci90@gmail.com'
    ];

    if (!this.apiKey) {
      console.warn('   ⚠️ RESEND_API_KEY not set - email sending disabled');
    }
  }

  /**
   * Send submission notification with translated document attached
   * This combines the submission notification AND the translation in one email
   * @param {Object} submission - The submission data
   * @param {string} docxPath - Path to the translated DOCX file
   * @param {string} publicUrl - Public URL of the uploaded file
   * @returns {Promise<boolean>} Success status
   */
  async sendSubmissionWithTranslation(submission, docxPath, publicUrl) {
    if (!this.apiKey) {
      console.log('   ⚠️ Email sending skipped (no API key)');
      return false;
    }

    console.log(`   📧 Sending submission + translation to ${this.recipientEmails.join(', ')}...`);

    try {
      // Read the DOCX file for attachment
      const fileBuffer = fs.readFileSync(docxPath);
      const base64Content = fileBuffer.toString('base64');
      const fileName = path.basename(docxPath);

      // Format submission date
      const submissionDate = new Date(submission.created_at).toLocaleString('nl-NL', {
        timeZone: 'Europe/Amsterdam',
        dateStyle: 'long',
        timeStyle: 'short'
      });

      // Format original file links
      const originalFiles = (submission.file_urls || [])
        .map(url => `<a href="${url}" style="color: #007bff;">${path.basename(url)}</a>`)
        .join('<br>') || 'Geen bestanden';

      // Build combined email HTML (notification + translation)
      const emailHtml = `
        <h2>Nieuwe offerte aanvraag + Vertaling - Al-Bayaan Vertalingen</h2>

        <h3 style="color: #333; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">📋 Klantgegevens</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5; width: 150px;">Naam</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${submission.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">E-mail</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${submission.email}">${submission.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Telefoon</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${submission.phone || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Taalrichting</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${submission.language_direction || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Bericht</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${submission.message || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Aanvraagdatum</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${submissionDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Originele bestanden</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${originalFiles}</td>
          </tr>
        </table>

        <h3 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">✅ Automatische Vertaling</h3>
        <p style="padding: 15px; background: #e8f5e9; border-radius: 5px; border-left: 4px solid #4CAF50;">
          <strong>Het vertaalde document is als bijlage toegevoegd aan deze e-mail.</strong><br>
          <span style="color: #666;">Bestandsnaam: ${fileName}</span>
        </p>

        <p><strong>Download link (Supabase):</strong><br>
        <a href="${publicUrl}" style="color: #007bff; word-break: break-all;">${publicUrl}</a></p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">
          Dit bericht is automatisch verzonden via het Al-Bayaan vertaalsysteem.<br>
          De vertaling is gegenereerd met AI en dient gecontroleerd te worden.
        </p>
      `;

      // Send via Resend API
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Al-Bayaan Vertalingen <noreply@albayaanvertalingen.nl>',
          to: this.recipientEmails,
          subject: `Nieuwe aanvraag + Vertaling: ${submission.name} (${submission.language_direction || 'Vertaling'})`,
          html: emailHtml,
          reply_to: submission.email,
          attachments: [
            {
              filename: fileName,
              content: base64Content,
            }
          ]
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('   ❌ Email sending failed:', result);
        return false;
      }

      console.log(`   ✅ Email sent successfully (ID: ${result.id})`);
      return true;

    } catch (error) {
      console.error('   ❌ Email error:', error.message);
      return false;
    }
  }
}

module.exports = { EmailService };
