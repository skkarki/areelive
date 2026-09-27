-- Create private schema not exposed by the Data API
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO postgres, service_role;

-- Recreate has_role in private schema
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
-- Policies evaluate function calls as the querying role; grant execute there
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Repoint any existing RLS policies from public.has_role to private.has_role
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname, cmd, qual, with_check, roles, permissive
    FROM pg_policies
    WHERE qual LIKE '%has_role%' OR with_check LIKE '%has_role%'
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    EXECUTE format(
      'CREATE POLICY %I ON %I.%I AS %s FOR %s TO %s%s%s',
      r.policyname, r.schemaname, r.tablename,
      r.permissive,
      CASE r.cmd WHEN 'ALL' THEN 'ALL' WHEN 'SELECT' THEN 'SELECT' WHEN 'INSERT' THEN 'INSERT' WHEN 'UPDATE' THEN 'UPDATE' WHEN 'DELETE' THEN 'DELETE' END,
      array_to_string(r.roles, ', '),
      CASE WHEN r.qual IS NOT NULL THEN ' USING (' || replace(r.qual, 'has_role(', 'private.has_role(') || ')' ELSE '' END,
      CASE WHEN r.with_check IS NOT NULL THEN ' WITH CHECK (' || replace(r.with_check, 'has_role(', 'private.has_role(') || ')' ELSE '' END
    );
  END LOOP;
END $$;

-- Drop old public.has_role now that policies no longer reference it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- Move claim_first_admin to private, expose via SECURITY INVOKER wrapper? 
-- Simpler: keep logic in private, callable only by service_role. Provide a
-- SECURITY INVOKER public RPC that validates auth.uid() and inserts directly
-- when no admin exists (RLS is bypassed via a scoped policy).

DROP FUNCTION IF EXISTS public.claim_first_admin();

-- Allow authenticated users to insert their own admin row only when no admin exists yet
CREATE POLICY "Bootstrap first admin"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'admin'::public.app_role
  AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::public.app_role)
);

-- SECURITY INVOKER wrapper for the client to keep the existing RPC name
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::public.app_role) THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (uid, 'admin'::public.app_role)
  ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;