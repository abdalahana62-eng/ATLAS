-- Daily AI usage counter (powers the admin "AI messages today" card)
-- Run in Supabase Dashboard → SQL Editor
CREATE TABLE IF NOT EXISTS ai_usage (
  day DATE NOT NULL,
  endpoint TEXT NOT NULL,
  count INT NOT NULL DEFAULT 0,
  PRIMARY KEY (day, endpoint)
);

ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Open insert/update like user_presence (increments come from server API routes).
-- Reads stay gated: admin stats route is owner-gated via checkAdmin.
DROP POLICY IF EXISTS "Anyone can write ai_usage" ON ai_usage;
CREATE POLICY "Anyone can write ai_usage"
  ON ai_usage FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update ai_usage" ON ai_usage;
CREATE POLICY "Anyone can update ai_usage"
  ON ai_usage FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read ai_usage" ON ai_usage;
CREATE POLICY "Anyone can read ai_usage"
  ON ai_usage FOR SELECT USING (true);

-- Atomic daily increment (safe under concurrent chat requests)
CREATE OR REPLACE FUNCTION bump_ai_usage(p_endpoint TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO ai_usage (day, endpoint, count)
  VALUES (CURRENT_DATE, p_endpoint, 1)
  ON CONFLICT (day, endpoint)
  DO UPDATE SET count = ai_usage.count + 1;
END;
$$;

GRANT EXECUTE ON FUNCTION bump_ai_usage(TEXT) TO anon, authenticated;
