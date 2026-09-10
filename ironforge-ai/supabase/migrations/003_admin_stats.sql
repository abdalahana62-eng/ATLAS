-- Admin stats function (SECURITY DEFINER bypasses RLS; called only from owner-gated API)
-- Run in Supabase Dashboard → SQL Editor
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  u INT; s INT; p INT; t INT;
BEGIN
  SELECT COUNT(*) INTO u FROM profiles;
  SELECT COUNT(*) INTO s FROM subscriptions WHERE status = 'active' AND expires_at > NOW();
  SELECT COUNT(*) INTO p FROM payment_requests WHERE status = 'pending';
  SELECT COUNT(*) INTO t FROM payment_requests;
  RETURN jsonb_build_object('users', u, 'activeSubs', s, 'pending', p, 'totalRequests', t);
END;
$$;

GRANT EXECUTE ON FUNCTION get_admin_stats() TO anon, authenticated;
