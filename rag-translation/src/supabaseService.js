const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

/**
 * Service for interacting with Supabase
 * - Fetches pending submissions
 * - Downloads files from storage
 * - Updates submission status
 */
class SupabaseService {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'documents';
  }

  /**
   * Parse language direction string to extract source and target languages
   * @param {string} languageDirection - e.g., "arabic → dutch" or "dutch → arabic"
   * @returns {{ source: string, target: string }}
   */
  parseLanguageDirection(languageDirection) {
    if (!languageDirection) {
      return { source: 'Arabic', target: 'Dutch' };
    }

    // Handle both → and -> separators
    const parts = languageDirection.split(/[→\->]+/).map(s => s.trim().toLowerCase());

    if (parts.length !== 2) {
      console.warn(`   ⚠️ Could not parse language direction: "${languageDirection}", using defaults`);
      return { source: 'Arabic', target: 'Dutch' };
    }

    // Capitalize first letter
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return {
      source: capitalize(parts[0]),
      target: capitalize(parts[1])
    };
  }

  /**
   * Fetch pending submissions (status = 'new') that have files
   * @returns {Promise<Array>} Array of submission objects
   */
  async getPendingSubmissions() {
    console.log('\n📥 Fetching pending submissions from Supabase...');

    const { data, error } = await this.supabase
      .from('contact_submissions')
      .select('*')
      .eq('status', 'new')
      .not('file_urls', 'is', null)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('   ❌ Error fetching submissions:', error.message);
      throw error;
    }

    // Filter to only include submissions with actual files
    const withFiles = (data || []).filter(s => s.file_urls && s.file_urls.length > 0);

    console.log(`   Found ${withFiles.length} submission(s) with files`);
    return withFiles;
  }

  /**
   * Get a single submission by ID
   * @param {string} submissionId
   * @returns {Promise<Object|null>}
   */
  async getSubmissionById(submissionId) {
    const { data, error } = await this.supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (error) {
      console.error(`   ❌ Error fetching submission ${submissionId}:`, error.message);
      return null;
    }

    return data;
  }

  /**
   * Download a file from Supabase storage
   * @param {string} fileUrl - The file URL or path
   * @param {string} outputDir - Directory to save the file
   * @returns {Promise<string|null>} Local file path or null if failed
   */
  async downloadFile(fileUrl, outputDir) {
    try {
      // Extract file path from URL
      // URLs can be like: https://xxx.supabase.co/storage/v1/object/public/documents/path/file.pdf
      // or just: path/file.pdf
      let filePath = fileUrl;

      if (fileUrl.includes('/storage/v1/object/')) {
        // Extract path after bucket name
        const match = fileUrl.match(/\/storage\/v1\/object\/(?:public|sign)\/[^/]+\/(.+)/);
        if (match) {
          filePath = match[1];
        }
      }

      console.log(`   Downloading: ${filePath}`);

      const { data, error } = await this.supabase.storage
        .from(this.storageBucket)
        .download(filePath);

      if (error) {
        console.error(`   ❌ Error downloading ${filePath}:`, error.message);
        return null;
      }

      // Save to local file
      const fileName = path.basename(filePath);
      const localPath = path.join(outputDir, fileName);

      // Convert blob to buffer and write
      const buffer = Buffer.from(await data.arrayBuffer());
      fs.writeFileSync(localPath, buffer);

      console.log(`   ✅ Saved: ${localPath}`);
      return localPath;
    } catch (err) {
      console.error(`   ❌ Download failed:`, err.message);
      return null;
    }
  }

  /**
   * Download all files for a submission
   * @param {Object} submission - The submission object
   * @param {string} outputDir - Directory to save files
   * @returns {Promise<string[]>} Array of local file paths
   */
  async downloadSubmissionFiles(submission, outputDir) {
    const fileUrls = submission.file_urls || [];
    const localPaths = [];

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const fileUrl of fileUrls) {
      const localPath = await this.downloadFile(fileUrl, outputDir);
      if (localPath) {
        localPaths.push(localPath);
      }
    }

    return localPaths;
  }

  /**
   * Update submission status
   * @param {string} submissionId
   * @param {string} status - 'new', 'processing', 'translated', 'error'
   * @param {Object} additionalData - Additional fields to update
   */
  async updateSubmissionStatus(submissionId, status, additionalData = {}) {
    console.log(`   📝 Updating submission ${submissionId.slice(0, 8)}... status → ${status}`);

    // Only include status - don't include columns that may not exist
    const updateData = { status };

    const { error } = await this.supabase
      .from('contact_submissions')
      .update(updateData)
      .eq('id', submissionId);

    if (error) {
      console.error(`   ❌ Error updating status:`, error.message);
      throw error;
    }
  }

  /**
   * Upload translated document back to Supabase storage
   * @param {string} localPath - Path to the translated document
   * @param {string} submissionId - Submission ID for organizing
   * @returns {Promise<string|null>} Public URL or null if failed
   */
  async uploadTranslatedDocument(localPath, submissionId) {
    try {
      const fileName = path.basename(localPath);
      const storagePath = `translations/${submissionId}/${fileName}`;

      console.log(`   📤 Uploading translated document: ${fileName}`);

      const fileBuffer = fs.readFileSync(localPath);

      const { data, error } = await this.supabase.storage
        .from(this.storageBucket)
        .upload(storagePath, fileBuffer, {
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          upsert: true
        });

      if (error) {
        console.error(`   ❌ Upload error:`, error.message);
        return null;
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage
        .from(this.storageBucket)
        .getPublicUrl(storagePath);

      console.log(`   ✅ Uploaded: ${urlData.publicUrl}`);
      return urlData.publicUrl;
    } catch (err) {
      console.error(`   ❌ Upload failed:`, err.message);
      return null;
    }
  }
}

module.exports = { SupabaseService };
