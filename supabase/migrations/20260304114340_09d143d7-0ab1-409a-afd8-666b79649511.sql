
-- Drop the overly permissive policy
DROP POLICY "Anyone can submit queries" ON public.form_queries;

-- Recreate with explicit anon + authenticated roles for INSERT only
CREATE POLICY "Anyone can submit queries" ON public.form_queries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND email IS NOT NULL
  );
