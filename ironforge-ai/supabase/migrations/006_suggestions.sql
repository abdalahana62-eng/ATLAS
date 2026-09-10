-- User suggestions for admin dashboard
-- Run in Supabase Dashboard → SQL Editor
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status, created_at DESC);

ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit suggestion" ON suggestions;
CREATE POLICY "Anyone can submit suggestion"
  ON suggestions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read suggestions" ON suggestions;
CREATE POLICY "Anyone can read suggestions"
  ON suggestions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update suggestion" ON suggestions;
CREATE POLICY "Anyone can update suggestion"
  ON suggestions FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete suggestion" ON suggestions;
CREATE POLICY "Anyone can delete suggestion"
  ON suggestions FOR DELETE USING (true);
