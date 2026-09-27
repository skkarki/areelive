ALTER TABLE public.applications ADD CONSTRAINT applications_portfolio_link_scheme_check CHECK (portfolio_link IS NULL OR portfolio_link ~* '^https?://') NOT VALID;
ALTER TABLE public.broadcaster_referrals ADD CONSTRAINT broadcaster_referrals_friend_social_link_scheme_check CHECK (friend_social_link IS NULL OR friend_social_link ~* '^https?://') NOT VALID;
ALTER TABLE public.applications VALIDATE CONSTRAINT applications_portfolio_link_scheme_check;
ALTER TABLE public.broadcaster_referrals VALIDATE CONSTRAINT broadcaster_referrals_friend_social_link_scheme_check;