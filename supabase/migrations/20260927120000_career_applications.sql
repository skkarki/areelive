-- Additive: creator/agency applications and referrals are unchanged.
BEGIN;
CREATE TABLE public.career_applications (
  id uuid PRIMARY KEY,
  full_name text NOT NULL CHECK (length(btrim(full_name)) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (length(email) BETWEEN 3 AND 254 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone text NOT NULL CHECK (length(btrim(phone)) BETWEEN 4 AND 40),
  country_city text NOT NULL CHECK (length(btrim(country_city)) BETWEEN 1 AND 120),
  position text NOT NULL CHECK (length(btrim(position)) BETWEEN 1 AND 200),
  cover_letter text CHECK (length(cover_letter) <= 3000),
  cv_path text NOT NULL,
  cv_name text NOT NULL CHECK (length(cv_name) BETWEEN 1 AND 255),
  recommendation_path text,
  recommendation_name text CHECK (length(recommendation_name) BETWEEN 1 AND 255),
  consent boolean NOT NULL CHECK (consent),
  consent_at timestamptz NOT NULL DEFAULT now(),
  status public.application_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (cv_path ~ ('^' || id::text || '/cv\.(pdf|doc|docx)$')),
  CHECK ((recommendation_path IS NULL AND recommendation_name IS NULL) OR
    (recommendation_path IS NOT NULL AND recommendation_name IS NOT NULL AND
      recommendation_path ~ ('^' || id::text || '/recommendation\.(pdf|doc|docx)$')))
);
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.career_applications TO anon, authenticated;
GRANT SELECT ON public.career_applications TO authenticated;
GRANT UPDATE (status) ON public.career_applications TO authenticated;
GRANT ALL ON public.career_applications TO service_role;
CREATE POLICY "Applicants submit pending careers" ON public.career_applications
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND consent);
CREATE POLICY "Admins read careers" ON public.career_applications
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins review careers" ON public.career_applications
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER career_applications_set_updated_at BEFORE UPDATE ON public.career_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX career_applications_created_at_idx ON public.career_applications (created_at DESC);

-- Documents are private: applicants can upload; only admins can read/download.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('career-documents', 'career-documents', false, 10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
CREATE POLICY "Applicants upload career documents" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (
    bucket_id = 'career-documents' AND
    name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/(cv|recommendation)\.(pdf|doc|docx)$'
  );
CREATE POLICY "Admins read career documents" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'career-documents' AND private.has_role(auth.uid(), 'admin')
  );
COMMIT;
