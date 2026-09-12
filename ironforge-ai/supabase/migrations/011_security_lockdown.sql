-- 011_security_lockdown: close open anon policies, per-user AI quota
-- Run in Supabase Dashboard → SQL Editor AFTER deploying the app code that
-- uses SUPABASE_SERVICE_ROLE_KEY (server routes), otherwise admin/data reads break.
--
-- What this does:
-- 1) subscriptions / trial_starts: NO anon access (server-only via service_role)
-- 2) payment_requests: anon INSERT only (submit); reads/updates server-only
-- 3) user_presence: anon write-only heartbeat; reads server-only (admin API)
-- 4) suggestions: anon INSERT only; admin reads via server API
-- 5) ai_usage: revoke public access (server rpc only)
-- 6) per-email daily AI quota table + atomic check-and-bump function

-- ---------- subscriptions: server-only ----------
DROP POLICY IF EXISTS "Anyone can read subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Anyone can upsert subscription" ON subscriptions;
DROP POLICY IF EXISTS "Anyone can update subscription" ON subscriptions;

-- ---------- payment_requests: public submit, nothing else ----------
DROP POLICY IF EXISTS "Anyone can update payment request" ON payment_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON payment_requests;
-- (kept) "Anyone can submit payment request" FOR INSERT

-- ---------- trial_starts: server-only ----------
DROP POLICY IF EXISTS "Anyone can read trial_starts" ON trial_starts;
DROP POLICY IF EXISTS "Anyone can write trial_starts" ON trial_starts;

-- ---------- user_presence: heartbeat write-only ----------
DROP POLICY IF EXISTS "Anyone can read presence" ON user_presence;
-- (kept) write + update for heartbeat

-- ---------- suggestions: public submit, admin reads server-side ----------
DROP POLICY IF EXISTS "Anyone can read suggestions" ON suggestions;
DROP POLICY IF EXISTS "Anyone can update suggestion" ON suggestions;
DROP POLICY IF EXISTS "Anyone can delete suggestion" ON suggestions;
-- (kept) "Anyone can submit suggestion" FOR INSERT

-- ---------- ai_usage: server-only ----------
DROP POLICY IF EXISTS "Anyone can write ai_usage" ON ai_usage;
DROP POLICY IF EXISTS "Anyone can update ai_usage" ON ai_usage;
DROP POLICY IF EXISTS "Anyone can read ai_usage" ON ai_usage;

-- ---------- lock down helper functions ----------
REVOKE ALL ON FUNCTION get_admin_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_admin_stats() TO service_role;

REVOKE ALL ON FUNCTION bump_ai_usage(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION bump_ai_usage(TEXT) TO service_role;

-- ---------- per-email daily AI quota ----------
CREATE TABLE IF NOT EXISTS ai_usage_by_email (
  day DATE NOT NULL,
  email TEXT NOT NULL,
  count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (day, email)
);

ALTER TABLE ai_usage_by_email ENABLE ROW LEVEL SECURITY;
-- No anon policies on purpose: only service_role (bypasses RLS) touches it.

CREATE OR REPLACE FUNCTION check_and_bump_ai_quota(p_email TEXT, p_cap INT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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
