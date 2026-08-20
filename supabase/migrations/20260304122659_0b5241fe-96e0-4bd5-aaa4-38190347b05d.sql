-- Create storage bucket for form attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('form-attachments', 'form-attachments', true);

-- Allow anyone to upload files to the form-attachments bucket
CREATE POLICY "Anyone can upload form attachments"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'form-attachments');

-- Allow anyone to read form attachments
CREATE POLICY "Anyone can read form attachments"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'form-attachments');

-- Allow admins to delete form attachments
CREATE POLICY "Admins can delete form attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'form-attachments' AND public.has_role(auth.uid(), 'admin'));
