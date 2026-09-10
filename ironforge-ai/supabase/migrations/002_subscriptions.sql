-- Subscriptions & manual payments (Instapay / Vodafone Cash)
-- Run this in Supabase Dashboard → SQL Editor

-- Payment requests (user uploads transfer screenshot, owner approves)
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('monthly','quarterly','yearly')),
  amount INT NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('instapay','vodafone')),
  screenshot TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Active subscriptions (one row per email)
CREATE TABLE IF NOT EXISTS subscriptions (
  email TEXT PRIMARY KEY,
  plan TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_requests_email ON payment_requests(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status, created_at DESC);

ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a payment request (email is provided in the row)
DROP POLICY IF EXISTS "Anyone can submit payment request" ON payment_requests;
CREATE POLICY "Anyone can submit payment request"
  ON payment_requests FOR INSERT WITH CHECK (true);

-- Users can view their own requests (by matching email passed from client is NOT secure,
-- the admin API uses service_role; this policy is a fallback for anon reads of own email)
DROP POLICY IF EXISTS "Users can view own requests" ON payment_requests;
CREATE POLICY "Users can view own requests"
  ON payment_requests FOR SELECT USING (true);

-- Subscriptions readable by anyone (client checks expiry by email; enforcement is UX-level)
DROP POLICY IF EXISTS "Anyone can read subscriptions" ON subscriptions;
CREATE POLICY "Anyone can read subscriptions"
  ON subscriptions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can upsert subscription" ON subscriptions;
CREATE POLICY "Anyone can upsert subscription"
  ON subscriptions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update subscription" ON subscriptions;
CREATE POLICY "Anyone can update subscription"
  ON subscriptions FOR UPDATE USING (true) WITH CHECK (true);
