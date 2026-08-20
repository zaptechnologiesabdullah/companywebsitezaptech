
-- Create enums
CREATE TYPE public.landing_page_type AS ENUM ('job', 'services', 'course_request', 'custom');
CREATE TYPE public.section_type AS ENUM ('heading', 'text', 'image', 'rich_text');
CREATE TYPE public.form_field_type AS ENUM ('text', 'email', 'phone', 'textarea', 'select', 'file');

-- Landing pages table
CREATE TABLE public.landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  page_type landing_page_type NOT NULL DEFAULT 'custom',
  is_visible BOOLEAN NOT NULL DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Landing page sections
CREATE TABLE public.landing_page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  section_type section_type NOT NULL DEFAULT 'text',
  title TEXT,
  content JSONB DEFAULT '{}'::jsonb,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Landing page form fields
CREATE TABLE public.landing_page_form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  field_label TEXT NOT NULL,
  field_type form_field_type NOT NULL DEFAULT 'text',
  is_required BOOLEAN NOT NULL DEFAULT false,
  options JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER DEFAULT 0
);

-- Landing page submissions
CREATE TABLE public.landing_page_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  attachment_urls JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_submissions ENABLE ROW LEVEL SECURITY;

-- RLS: landing_pages
CREATE POLICY "Anyone can view visible landing pages" ON public.landing_pages FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can manage landing pages" ON public.landing_pages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: landing_page_sections
CREATE POLICY "Anyone can view sections of visible pages" ON public.landing_page_sections FOR SELECT USING (EXISTS (SELECT 1 FROM public.landing_pages WHERE id = landing_page_id AND is_visible = true));
CREATE POLICY "Admins can manage sections" ON public.landing_page_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: landing_page_form_fields
CREATE POLICY "Anyone can view form fields of visible pages" ON public.landing_page_form_fields FOR SELECT USING (EXISTS (SELECT 1 FROM public.landing_pages WHERE id = landing_page_id AND is_visible = true));
CREATE POLICY "Admins can manage form fields" ON public.landing_page_form_fields FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: landing_page_submissions
CREATE POLICY "Anyone can submit forms" ON public.landing_page_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view submissions" ON public.landing_page_submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON public.landing_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_landing_page_sections_updated_at BEFORE UPDATE ON public.landing_page_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
