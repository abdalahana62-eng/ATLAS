-- 012_defense_in_depth: idempotent re-lock for open anon policies.
-- Safe to run ANY time (before or after 011). Uses ONLY DROP POLICY IF EXISTS
-- for the dangerous USING(true) read/write policies — never touches the
-- legitimate public INSERT policies (payment submit / suggestion submit /
-- presence heartbeat). Server routes use SUPABASE_SERVICE_ROLE_KEY (bypasses
-- RLS) so admin reads keep working.
--
-- Run in Supabase Dashboard → SQL Editor. Then verify:
--   SELECT policyname, cmd, roles FROM pg_policies
--   WHERE tablename IN ('subscriptions','payment_requests','trial_starts',
--                       'user_presence','suggestions','ai_usage');
-- Expected: only INSERT policies for anon remain (submit/heartbeat), no SELECT
-- USING(true) on PII tables.

-- subscriptions: client reads via /api/subscriptions (service_role), never anon.
DROP POLICY IF EXISTS "Anyone can read subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Anyone can upsert subscription" ON subscriptions;
DROP POLICY IF EXISTS "Anyone can update subscription" ON subscriptions;

-- payment_requests: keep "Anyone can submit payment request" (INSERT) only.
DROP POLICY IF EXISTS "Anyone can update payment request" ON payment_requests;
DROP POLICY IF EXISTS "Users can view own requests" ON payment_requests;

-- trial_starts: server-only via /api/account/trial.
DROP POLICY IF EXISTS "Anyone can read trial_starts" ON trial_starts;
DROP POLICY IF EXISTS "Anyone can write trial_starts" ON trial_starts;

-- user_presence: keep heartbeat INSERT/UPDATE only, no anon reads.
DROP POLICY IF EXISTS "Anyone can read presence" ON user_presence;

-- suggestions: keep "Anyone can submit suggestion" (INSERT) only.
DROP POLICY IF EXISTS "Anyone can read suggestions" ON suggestions;
DROP POLICY IF EXISTS "Anyone can update suggestion" ON suggestions;
DROP POLICY IF EXISTS "Anyone can delete suggestion" ON suggestions;

-- ai_usage: server-only.
DROP POLICY IF EXISTS "Anyone can write ai_usage" ON ai_usage;
DROP POLICY IF EXISTS "Anyone can update ai_usage" ON ai_usage;
DROP POLICY IF EXISTS "Anyone can read ai_usage" ON ai_usage;

-- helper functions: service_role only.
REVOKE ALL ON FUNCTION get_admin_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_admin_stats() TO service_role;

REVOKE ALL ON FUNCTION bump_ai_usage(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION bump_ai_usage(TEXT) TO service_role;

REVOKE ALL ON FUNCTION check_and_bump_ai_quota(TEXT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION check_and_bump_ai_quota(TEXT, INT) TO service_role;
