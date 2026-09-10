-- User data persistence: workout logs + body measurements (with photo)
-- Run in Supabase Dashboard → SQL Editor
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  exercise TEXT NOT NULL,
  muscle TEXT,
  sets JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg FLOAT,
  chest_cm FLOAT,
  arm_cm FLOAT,
  waist_cm FLOAT,
  photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_logs_user ON workout_logs(user_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_measurements_user ON measurements(user_id, log_date DESC);

ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own workout logs" ON workout_logs;
CREATE POLICY "Users manage own workout logs" ON workout_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own measurements" ON measurements;
CREATE POLICY "Users manage own measurements" ON measurements
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
