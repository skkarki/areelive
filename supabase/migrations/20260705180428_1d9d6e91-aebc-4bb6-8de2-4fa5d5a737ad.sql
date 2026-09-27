
-- Enums
CREATE TYPE public.application_role AS ENUM ('agency','recruiter','host','admin','agency_manager');
CREATE TYPE public.application_status AS ENUM ('pending','reviewed','approved','rejected');
CREATE TYPE public.referral_status AS ENUM ('pending','contacted','approved','active','bonus_eligible','bonus_paid','rejected');
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');

-- Roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Bootstrap: first authenticated user can claim admin
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (uid, 'admin')
    ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- Updated-at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Applications
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  country_city text NOT NULL,
  applying_for public.application_role NOT NULL,
  has_experience boolean NOT NULL DEFAULT false,
  capacity_estimate text,
  portfolio_link text,
  agency_name text,
  preferred_language text,
  message text,
  consent boolean NOT NULL,
  status public.application_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.applications TO anon, authenticated;
GRANT SELECT, UPDATE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application" ON public.applications FOR INSERT TO anon, authenticated
  WITH CHECK (
    consent = true
    AND length(full_name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 254
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND length(phone) BETWEEN 4 AND 40
    AND length(country_city) BETWEEN 1 AND 120
    AND (capacity_estimate IS NULL OR length(capacity_estimate) <= 120)
    AND (portfolio_link IS NULL OR length(portfolio_link) <= 500)
    AND (agency_name IS NULL OR length(agency_name) <= 200)
    AND (preferred_language IS NULL OR length(preferred_language) <= 80)
    AND (message IS NULL OR length(message) <= 2000)
    AND status = 'pending'
    AND admin_notes IS NULL
  );

CREATE POLICY "Admins read applications" ON public.applications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update applications" ON public.applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER applications_set_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Broadcaster referrals
CREATE TABLE public.broadcaster_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_areelive_id text NOT NULL,
  referrer_name text NOT NULL,
  referrer_phone text NOT NULL,
  friend_name text NOT NULL,
  friend_phone text NOT NULL,
  friend_country_city text NOT NULL,
  friend_social_link text,
  friend_prior_experience boolean NOT NULL DEFAULT false,
  note text,
  status public.referral_status NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.broadcaster_referrals TO anon, authenticated;
GRANT SELECT, UPDATE ON public.broadcaster_referrals TO authenticated;
GRANT ALL ON public.broadcaster_referrals TO service_role;
ALTER TABLE public.broadcaster_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a referral" ON public.broadcaster_referrals FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(referrer_areelive_id) BETWEEN 1 AND 80
    AND length(referrer_name) BETWEEN 1 AND 120
    AND length(referrer_phone) BETWEEN 4 AND 40
    AND length(friend_name) BETWEEN 1 AND 120
    AND length(friend_phone) BETWEEN 4 AND 40
    AND length(friend_country_city) BETWEEN 1 AND 120
    AND (friend_social_link IS NULL OR length(friend_social_link) <= 500)
    AND (note IS NULL OR length(note) <= 2000)
    AND status = 'pending'
    AND admin_notes IS NULL
  );

CREATE POLICY "Admins read referrals" ON public.broadcaster_referrals FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update referrals" ON public.broadcaster_referrals FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER broadcaster_referrals_set_updated_at BEFORE UPDATE ON public.broadcaster_referrals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
