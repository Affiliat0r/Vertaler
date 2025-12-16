-- ==========================================================================
-- Al-Bayaan Contact Form - Supabase Setup
-- Run this in Supabase Dashboard > SQL Editor
-- ==========================================================================

-- 1. Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  document_type TEXT,
  language_direction TEXT,
  message TEXT NOT NULL,
  whatsapp_followup BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new',
  file_urls TEXT[] DEFAULT '{}'
);

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
ON contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status
ON contact_submissions(status);

-- 3. Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Allow anyone to INSERT (submit forms)
CREATE POLICY "Allow public insert" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- 5. RLS Policy: Only authenticated users can SELECT (view submissions)
-- This means Marwan needs to login to Supabase dashboard to see submissions
CREATE POLICY "Allow authenticated select" ON contact_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 6. Create storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policy: Allow public uploads to documents bucket
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'documents');

-- 8. Storage policy: Allow authenticated users to view/download
CREATE POLICY "Allow authenticated downloads" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
