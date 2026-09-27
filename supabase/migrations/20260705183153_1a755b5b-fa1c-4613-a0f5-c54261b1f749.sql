-- Tighten SECURITY DEFINER function execute grants
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;

-- has_role is invoked from RLS policies evaluated as the querying role
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- claim_first_admin is called by signed-in users via RPC; keep authenticated but no anon
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated, service_role;