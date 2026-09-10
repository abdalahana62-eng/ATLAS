-- Online presence heartbeat (reliable alternative to Realtime)
-- Run in Supabase Dashboard → SQL Editor
CREATE TABLE IF NOT EXISTS user_presence (
  email TEXT PRIMARY KEY,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read presence" ON user_presence;
CREATE POLICY "Anyone can read presence"
  ON user_presence FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can write presence" ON user_presence;
CREATE POLICY "Anyone can write presence"
  ON user_presence FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update presence" ON user_presence;
CREATE POLICY "Anyone can update presence"
  ON user_presence FOR UPDATE USING (true) WITH CHECK (true);
