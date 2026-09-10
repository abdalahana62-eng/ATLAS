-- Allow status updates on payment requests (approve/reject from owner-gated API)
-- Run in Supabase Dashboard → SQL Editor
DROP POLICY IF EXISTS "Anyone can update payment request" ON payment_requests;
CREATE POLICY "Anyone can update payment request"
  ON payment_requests FOR UPDATE USING (true) WITH CHECK (true);
