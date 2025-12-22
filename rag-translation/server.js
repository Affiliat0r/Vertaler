require('dotenv').config();
const express = require('express');
const { GeminiService } = require('./src/geminiService');
const { SupabaseService } = require('./src/supabaseService');
const { EmailService } = require('./src/emailService');
const { Document, Packer } = require('docx');
const fs = require('fs');
const path = require('path');
const config = require('./src/config');
const { documentStyles, pageProperties } = require('./src/styles');

// Import document generators
const {
  generateMarriageCertificate,
  generateAuthenticationPage,
  generateCivilRegistration,
  generateBirthCertificate,
  generateDiploma,
  generateCertificate,
  generateDrivingLicense,
  generateConsularDocument,
  generateFamilyRecordBook,
  generateEmployerStatement,
  generateBrpExtract,
  generateCourtDocument,
  generateNotarialDeed
} = require('./src/documents');

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Al-Bayaan Translation Pipeline' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

/**
 * Generate translated document
 */
async function generateDocument(documentData = {}, outputPath = null) {
  const allContent = [];

  if (documentData.marriageCertificate && Object.keys(documentData.marriageCertificate).length > 0) {
    allContent.push(...generateMarriageCertificate(documentData.marriageCertificate));
  }
  if (documentData.authentication && Object.keys(documentData.authentication).length > 0) {
    allContent.push(...generateAuthenticationPage(documentData.authentication));
  }
  if (documentData.civilRegistration && Object.keys(documentData.civilRegistration).length > 0) {
    allContent.push(...generateCivilRegistration(documentData.civilRegistration));
  }
  if (documentData.birthCertificate && Object.keys(documentData.birthCertificate).length > 0) {
    allContent.push(...generateBirthCertificate(documentData.birthCertificate));
  }
  if (documentData.diploma && Object.keys(documentData.diploma).length > 0) {
    allContent.push(...generateDiploma(documentData.diploma));
  }
  if (documentData.certificate && Object.keys(documentData.certificate).length > 0) {
    allContent.push(...generateCertificate(documentData.certificate));
  }
  if (documentData.drivingLicense && Object.keys(documentData.drivingLicense).length > 0) {
    allContent.push(...generateDrivingLicense(documentData.drivingLicense));
  }
  if (documentData.consularDocument && Object.keys(documentData.consularDocument).length > 0) {
    allContent.push(...generateConsularDocument(documentData.consularDocument));
  }
  if (documentData.familyRecordBook && Object.keys(documentData.familyRecordBook).length > 0) {
    allContent.push(...generateFamilyRecordBook(documentData.familyRecordBook));
  }
  if (documentData.employerStatement && Object.keys(documentData.employerStatement).length > 0) {
    allContent.push(...generateEmployerStatement(documentData.employerStatement));
  }
  if (documentData.brpExtract && Object.keys(documentData.brpExtract).length > 0) {
    allContent.push(...generateBrpExtract(documentData.brpExtract));
  }
  if (documentData.courtDocument && Object.keys(documentData.courtDocument).length > 0) {
    allContent.push(...generateCourtDocument(documentData.courtDocument));
  }
  if (documentData.notarialDeed && Object.keys(documentData.notarialDeed).length > 0) {
    allContent.push(...generateNotarialDeed(documentData.notarialDeed));
  }

  const doc = new Document({
    styles: documentStyles,
    sections: [{
      properties: pageProperties,
      children: allContent
    }]
  });

  const parentDir = path.dirname(outputPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  return outputPath;
}

/**
 * Process a single submission
 */
async function processSubmission(submission, gemini, supabaseService, emailService) {
  const submissionId = submission.id;
  const shortId = submissionId.slice(0, 8);

  console.log(`Processing submission: ${shortId}...`);

  try {
    await supabaseService.updateSubmissionStatus(submissionId, 'processing');

    const { source, target } = supabaseService.parseLanguageDirection(submission.language_direction);
    console.log(`Direction: ${source} → ${target}`);

    const tempDir = path.resolve(`./temp/${shortId}`);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const localFiles = await supabaseService.downloadSubmissionFiles(submission, tempDir);

    if (localFiles.length === 0) {
      throw new Error('No files could be downloaded');
    }

    const pdfFile = localFiles.find(f => f.toLowerCase().endsWith('.pdf')) ||
                    localFiles.find(f => /\.(png|jpg|jpeg)$/i.test(f));

    if (!pdfFile) {
      throw new Error('No PDF or image file found in submission');
    }

    console.log('Extracting and translating...');
    const documentData = await gemini.extractAndTranslate(pdfFile, source, target);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeName = submission.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const outputFilename = `Translation_${safeName}_${timestamp}.docx`;
    const outputPath = path.join(tempDir, outputFilename);

    await generateDocument(documentData, outputPath);

    const publicUrl = await supabaseService.uploadTranslatedDocument(outputPath, submissionId);

    await emailService.sendSubmissionWithTranslation(submission, outputPath, publicUrl);

    await supabaseService.updateSubmissionStatus(submissionId, 'translated');

    // Clean up
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}

    console.log(`Submission ${shortId} completed!`);
    return { success: true, submissionId, outputUrl: publicUrl };

  } catch (error) {
    console.error(`Error processing ${shortId}:`, error.message);

    try {
      await supabaseService.updateSubmissionStatus(submissionId, 'error');
    } catch (statusError) {}

    return { success: false, submissionId, error: error.message };
  }
}

/**
 * Webhook endpoint - triggered by Supabase on new submissions
 */
app.post('/webhook', async (req, res) => {
  console.log('Webhook received:', new Date().toISOString());

  // Verify webhook secret (optional security)
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (webhookSecret && req.headers['x-webhook-secret'] !== webhookSecret) {
    console.log('Invalid webhook secret');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = req.body;
  console.log('Payload type:', payload.type);

  // Only process INSERT events with files
  if (payload.type !== 'INSERT') {
    return res.json({ message: 'Ignored non-INSERT event' });
  }

  const submission = payload.record;

  // Check if submission has files
  if (!submission.file_urls || submission.file_urls.length === 0) {
    console.log('No files in submission, skipping translation');
    return res.json({ message: 'No files to process' });
  }

  // Respond immediately, process in background
  res.json({ message: 'Processing started', submissionId: submission.id });

  // Process asynchronously
  try {
    const gemini = new GeminiService(process.env.GEMINI_API_KEY);
    const supabaseService = new SupabaseService();
    const emailService = new EmailService();

    await processSubmission(submission, gemini, supabaseService, emailService);
  } catch (error) {
    console.error('Webhook processing error:', error.message);
  }
});

/**
 * Manual trigger endpoint - process all pending submissions
 */
app.post('/process-pending', async (req, res) => {
  console.log('Manual processing triggered');

  try {
    const gemini = new GeminiService(process.env.GEMINI_API_KEY);
    const supabaseService = new SupabaseService();
    const emailService = new EmailService();

    const submissions = await supabaseService.getPendingSubmissions();

    if (submissions.length === 0) {
      return res.json({ message: 'No pending submissions' });
    }

    // Respond immediately
    res.json({ message: `Processing ${submissions.length} submission(s)` });

    // Process in background
    for (const submission of submissions) {
      await processSubmission(submission, gemini, supabaseService, emailService);
    }
  } catch (error) {
    console.error('Processing error:', error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Translation Pipeline Server running on port ${PORT}`);
  console.log(`Webhook endpoint: POST /webhook`);
  console.log(`Manual trigger: POST /process-pending`);
});
