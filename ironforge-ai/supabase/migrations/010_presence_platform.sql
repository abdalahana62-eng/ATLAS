-- Track which platform each heartbeat comes from (web vs installed app)
-- Run in Supabase Dashboard → SQL Editor
ALTER TABLE user_presence ADD COLUMN IF NOT EXISTS platform TEXT NOT NULL DEFAULT 'web';
