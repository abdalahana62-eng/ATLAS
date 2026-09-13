-- 013_hardening_fixes: search_path pinning for SECURITY DEFINER functions.
-- Prevents schema-hijack (attacker creating public.check_and_bump_ai_quota shadow).
-- Safe + idempotent. Run in Supabase Dashboard → SQL Editor.

CREATE OR REPLACE FUNCTION check_and_bump_ai_quota(p_email TEXT, p_cap INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c INT;
BEGIN
  INSERT INTO ai_usage_by_email (day, email, count)
  VALUES (CURRENT_DATE, lower(trim(p_email)), 1)
  ON CONFLICT (day, email)
  DO UPDATE SET count = ai_usage_by_email.count + 1
  RETURNING ai_usage_by_email.count INTO c;
  RETURN c <= p_cap;
END;
$$;

REVOKE ALL ON FUNCTION check_and_bump_ai_quota(TEXT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION check_and_bump_ai_quota(TEXT, INT) TO service_role;

-- Pin search_path on other admin helpers if they exist.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_admin_stats') THEN
    EXECUTE 'ALTER FUNCTION get_admin_stats() SET search_path = public';
    REVOKE ALL ON FUNCTION get_admin_stats() FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION get_admin_stats() TO service_role;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'bump_ai_usage') THEN
    EXECUTE 'ALTER FUNCTION bump_ai_usage(TEXT) SET search_path = public';
    REVOKE ALL ON FUNCTION bump_ai_usage(TEXT) FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION bump_ai_usage(TEXT) TO service_role;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') THEN
    EXECUTE 'ALTER FUNCTION public.handle_new_user() SET search_path = public';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at') THEN
    EXECUTE 'ALTER FUNCTION handle_updated_at() SET search_path = public';
  END IF;
END $$;
