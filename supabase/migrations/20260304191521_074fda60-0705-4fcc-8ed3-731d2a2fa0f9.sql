
-- Meeting types table
CREATE TABLE public.meeting_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 30,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.meeting_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active meeting types"
  ON public.meeting_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage meeting types"
  ON public.meeting_types FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_type_id uuid REFERENCES public.meeting_types(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rescheduled', 'cancelled')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (client_name IS NOT NULL AND client_email IS NOT NULL);

CREATE POLICY "Anyone can view bookings for conflict check"
  ON public.bookings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage bookings"
  ON public.bookings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Working hours config
CREATE TABLE public.booking_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_start_time time NOT NULL DEFAULT '09:00',
  work_end_time time NOT NULL DEFAULT '17:00',
  slot_duration_minutes integer NOT NULL DEFAULT 30,
  working_days integer[] NOT NULL DEFAULT '{1,2,3,4,5}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view booking settings"
  ON public.booking_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage booking settings"
  ON public.booking_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default settings
INSERT INTO public.booking_settings (work_start_time, work_end_time, slot_duration_minutes, working_days)
VALUES ('09:00', '17:00', 30, '{1,2,3,4,5}');

-- Insert default meeting types
INSERT INTO public.meeting_types (name, description, duration_minutes, sort_order) VALUES
  ('Consultation', '30-minute free consultation to discuss your needs', 30, 1),
  ('Project Discussion', '1-hour discussion about a new project', 60, 2),
  ('Technical Support', '45-minute technical troubleshooting session', 45, 3),
  ('Custom Meeting', 'Custom meeting - describe your requirements', 30, 4);
