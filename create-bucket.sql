-- Create the documents storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view files
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Allow authenticated and anonymous uploads
CREATE POLICY IF NOT EXISTS "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');
