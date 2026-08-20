ALTER TABLE public.form_queries 
ADD COLUMN IF NOT EXISTS project_link text,
ADD COLUMN IF NOT EXISTS attachment_url text;