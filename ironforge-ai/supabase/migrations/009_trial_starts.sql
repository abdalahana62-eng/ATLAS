-- Server-side trial anchor: one row per email, first device wins.
-- Makes the 3-day free trial follow the user across website ↔ app.
-- Run in Supabase Dashboard → SQL Editor
CREATE TABLE IF NOT EXISTS trial_starts (
  email TEXT PRIMARY KEY,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE trial_starts ENABLE ROW LEVEL SECURITY;

-- Open insert/select (same posture as user_presence).
-- NOTE: deliberately NO update/delete policy → trial start can never be extended.
DROP POLICY IF EXISTS "Anyone can read trial_starts" ON trial_starts;
CREATE POLICY "Anyone can read trial_starts"
  ON trial_starts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can write trial_starts" ON trial_starts;
CREATE POLICY "Anyone can write trial_starts"
  ON trial_starts FOR INSERT WITH CHECK (true);
