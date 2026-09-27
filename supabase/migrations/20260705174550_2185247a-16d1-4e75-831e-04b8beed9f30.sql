DROP POLICY IF EXISTS "Anyone can join the waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join the waitlist" ON public.waitlist
FOR INSERT TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) <= 254
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND (source IS NULL OR length(source) <= 64)
  AND (user_agent IS NULL OR length(user_agent) <= 512)
);