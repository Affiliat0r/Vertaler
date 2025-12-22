const { Document, Packer } = require('docx');
const fs = require('fs');
const path = require('path');

// Load configuration
const config = require('./config');
const { documentStyles, pageProperties } = require('./styles');
const { GeminiService } = require('./geminiService');
const { SupabaseService } = require('./supabaseService');
const { EmailService } = require('./emailService');

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
} = require('./documents');

/**
 * Main function to generate the translated document
 */
async function generateDocument(documentData = {}, outputPath = null) {
  console.log('\n📄 Starting document generation...');

  const allContent = [];

  // Generate content based on detected document types or available data
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

  // Create the document
  const doc = new Document({
    styles: documentStyles,
    sections: [{
      properties: pageProperties,
      children: allContent
    }]
  });

  // Use provided path or default from config
  if (!outputPath) {
    const outputDir = path.resolve(config.output.dir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    outputPath = path.join(outputDir, config.output.filename);
  }

  // Ensure parent directory exists
  const parentDir = path.dirname(outputPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  // Generate the document
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  console.log(`   ✅ Document generated: ${outputPath}`);
  return outputPath;
}

/**
 * Process a single submission from Supabase
 */
async function processSubmission(submission, gemini, supabaseService, emailService) {
  const submissionId = submission.id;
  const shortId = submissionId.slice(0, 8);

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📋 Processing submission: ${shortId}...`);
  console.log(`   Name: ${submission.name}`);
  console.log(`   Email: ${submission.email}`);
  console.log(`   Language: ${submission.language_direction || 'Not specified'}`);
  console.log(`   Files: ${submission.file_urls?.length || 0}`);

  try {
    // Update status to processing
    await supabaseService.updateSubmissionStatus(submissionId, 'processing');

    // Parse language direction
    const { source, target } = supabaseService.parseLanguageDirection(submission.language_direction);
    console.log(`   Direction: ${source} → ${target}`);

    // Create temp directory for this submission
    const tempDir = path.resolve(`./temp/${shortId}`);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Download files
    console.log('\n   📥 Downloading files...');
    const localFiles = await supabaseService.downloadSubmissionFiles(submission, tempDir);

    if (localFiles.length === 0) {
      throw new Error('No files could be downloaded');
    }

    // Process each file (for now, just the first PDF)
    const pdfFile = localFiles.find(f => f.toLowerCase().endsWith('.pdf')) ||
                    localFiles.find(f => /\.(png|jpg|jpeg)$/i.test(f));

    if (!pdfFile) {
      throw new Error('No PDF or image file found in submission');
    }

    // Extract and translate using Gemini
    console.log('\n   🤖 Extracting and translating...');
    const documentData = await gemini.extractAndTranslate(pdfFile, source, target);

    // Generate output filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const safeName = submission.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    const outputFilename = `Translation_${safeName}_${timestamp}.docx`;
    const outputPath = path.join(tempDir, outputFilename);

    // Generate the Word document
    await generateDocument(documentData, outputPath);

    // Upload translated document to Supabase
    const publicUrl = await supabaseService.uploadTranslatedDocument(outputPath, submissionId);

    // Send email with submission info + DOCX attachment
    await emailService.sendSubmissionWithTranslation(submission, outputPath, publicUrl);

    // Update submission with success status
    await supabaseService.updateSubmissionStatus(submissionId, 'translated');
    console.log(`   📎 Translation URL: ${publicUrl}`);

    // Clean up temp files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }

    console.log(`\n   ✅ Submission ${shortId} completed!`);
    return { success: true, submissionId, outputUrl: publicUrl };

  } catch (error) {
    console.error(`\n   ❌ Error processing ${shortId}:`, error.message);

    // Update status to error
    try {
      await supabaseService.updateSubmissionStatus(submissionId, 'error');
    } catch (statusError) {
      console.error(`   ❌ Could not update status:`, statusError.message);
    }

    return { success: false, submissionId, error: error.message };
  }
}

/**
 * Process all pending submissions from Supabase
 */
async function processSupabaseSubmissions() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║      Document Translator - Supabase Integration        ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  // Check for required environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY not found in .env file');
    process.exit(1);
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env file');
    process.exit(1);
  }

  try {
    // Initialize services
    const gemini = new GeminiService(apiKey);
    const supabaseService = new SupabaseService();
    const emailService = new EmailService();

    // Fetch pending submissions
    const submissions = await supabaseService.getPendingSubmissions();

    if (submissions.length === 0) {
      console.log('\n✅ No pending submissions to process.');
      return [];
    }

    console.log(`\n🔄 Processing ${submissions.length} submission(s)...`);

    // Process each submission
    const results = [];
    for (const submission of submissions) {
      const result = await processSubmission(submission, gemini, supabaseService, emailService);
      results.push(result);
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`\n${'═'.repeat(60)}`);
    console.log('📊 SUMMARY');
    console.log(`   Total: ${results.length}`);
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`${'═'.repeat(60)}`);

    return results;

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

/**
 * Find PDF files in the input directory (for local mode)
 */
function findInputPdf() {
  const inputDir = path.resolve('./input');
  if (!fs.existsSync(inputDir)) {
    return null;
  }

  const files = fs.readdirSync(inputDir);
  const pdfFile = files.find(f => f.toLowerCase().endsWith('.pdf'));

  if (pdfFile) {
    return path.join(inputDir, pdfFile);
  }
  return null;
}

/**
 * Process local file (original mode)
 */
async function processLocalFile() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║          Document Translator with Gemini AI            ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY not found in .env file');
    process.exit(1);
  }

  const pdfPath = findInputPdf();
  if (!pdfPath) {
    console.error('❌ Error: No PDF file found in ./input directory');
    console.error('   Please place your PDF document in the input folder.');
    process.exit(1);
  }

  console.log(`\n📁 Found input document: ${path.basename(pdfPath)}`);
  console.log(`   Source language: ${config.language.source}`);
  console.log(`   Target language: ${config.language.target}`);

  try {
    const gemini = new GeminiService(apiKey);
    const documentData = await gemini.extractAndTranslate(
      pdfPath,
      config.language.source,
      config.language.target
    );

    // Log summary
    console.log('\n📋 Extracted data summary:');
    if (documentData.marriageCertificate?.serialNumber) {
      console.log(`   📜 Marriage Certificate: Serial #${documentData.marriageCertificate.serialNumber}`);
    }
    if (documentData.birthCertificate?.newbornFullName) {
      console.log(`   👶 Birth Certificate: ${documentData.birthCertificate.newbornFullName}`);
    }
    if (documentData.diploma?.holderFullName) {
      console.log(`   🎓 Diploma: ${documentData.diploma.holderFullName}`);
    }

    const outputPath = await generateDocument(documentData);
    console.log('\n🎉 All done! Your translated document is ready.');
    return outputPath;

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Main entry point
 */
async function main() {
  // Check command line arguments
  const args = process.argv.slice(2);

  if (args.includes('--supabase') || args.includes('-s')) {
    // Process submissions from Supabase
    await processSupabaseSubmissions();
  } else if (args.includes('--watch') || args.includes('-w')) {
    // Watch mode - poll Supabase every 30 seconds
    console.log('👀 Watch mode enabled - polling every 30 seconds...');
    console.log('   Press Ctrl+C to stop.\n');

    const poll = async () => {
      await processSupabaseSubmissions();
      setTimeout(poll, 30000);
    };
    await poll();
  } else {
    // Default: process local file
    await processLocalFile();
  }
}

// Run the main function
main();
