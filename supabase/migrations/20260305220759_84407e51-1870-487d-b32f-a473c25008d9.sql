
-- Make the insert policy slightly more restrictive
DROP POLICY "Anyone can submit forms" ON public.landing_page_submissions;
CREATE POLICY "Anyone can submit forms" ON public.landing_page_submissions FOR INSERT WITH CHECK (
  form_data IS NOT NULL AND landing_page_id IS NOT NULL
  AND EXISTS (SELECT 1 FROM public.landing_pages WHERE id = landing_page_id AND is_visible = true)
);
