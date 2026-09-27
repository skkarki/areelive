
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS consent_at timestamptz;
ALTER TABLE public.broadcaster_referrals ADD COLUMN IF NOT EXISTS consent boolean NOT NULL DEFAULT false;
ALTER TABLE public.broadcaster_referrals ADD COLUMN IF NOT EXISTS consent_at timestamptz;

DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;
CREATE POLICY "Anyone can submit an application" ON public.applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    consent = true
    AND consent_at IS NOT NULL
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
    AND status = 'pending'::application_status
    AND admin_notes IS NULL
  );

DROP POLICY IF EXISTS "Anyone can submit a referral" ON public.broadcaster_referrals;
CREATE POLICY "Anyone can submit a referral" ON public.broadcaster_referrals
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    consent = true
    AND consent_at IS NOT NULL
    AND length(referrer_areelive_id) BETWEEN 1 AND 80
    AND length(referrer_name) BETWEEN 1 AND 120
    AND length(referrer_phone) BETWEEN 4 AND 40
    AND length(friend_name) BETWEEN 1 AND 120
    AND length(friend_phone) BETWEEN 4 AND 40
    AND length(friend_country_city) BETWEEN 1 AND 120
    AND (friend_social_link IS NULL OR length(friend_social_link) <= 500)
    AND (note IS NULL OR length(note) <= 2000)
    AND status = 'pending'::referral_status
    AND admin_notes IS NULL
  );
