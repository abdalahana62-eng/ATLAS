import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import { PLANS } from '@/lib/subscription';
import { getSessionEmail } from '@/lib/api/guard';
import { apiRateLimited } from '@/lib/security/rate-limit';
import { isEmail, isSafeImageDataUrl, isText } from '@/lib/security/validate';

export const runtime = 'nodejs';

const PLAN_PRICE: Record<string, number> = Object.fromEntries(
  PLANS.map((p) => [p.id, p.price])
);

// GET /api/subscriptions?email=x → { plan, expiresAt } or 404.
// Strict: the queried email must match the logged-in session (anti-harvest).
export async function GET(req: NextRequest) {
  const email = new URL(req.url).searchParams.get('email')?.toLowerCase().trim();
  if (!email) return Response.json({ error: 'Missing email' }, { status: 400 });
  const sessionEmail = await getSessionEmail();
  if (!sessionEmail || sessionEmail !== email) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan,expires_at,status')
      .eq('email', email)
      .maybeSingle();
    if (error || !data) return Response.json({ error: 'Not found' }, { status: 404 });
    if (data.status !== 'active' || new Date(data.expires_at).getTime() < Date.now()) {
      return Response.json({ error: 'Expired' }, { status: 404 });
    }
    return Response.json({ plan: data.plan, expiresAt: data.expires_at });
  } catch (e: any) {
    console.error('[subscriptions] GET failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}

// POST /api/subscriptions → create payment request { email, phone, plan, amount, method, screenshot }.
// Security: session email must match + amount must EXACTLY equal the plan price
// (stops "yearly for 1 EGP" forgery; admin still eyeballs the screenshot).
export async function POST(req: NextRequest) {
  const limited = apiRateLimited(req, 'subscriptions', 10);
  if (limited) return limited;
  try {
    const body = await req.json();
    const email = String(body.email || '').toLowerCase().trim();
    const phone = String(body.phone || '').trim();
    const plan = String(body.plan || '');
    const amount = Number(body.amount || 0);
    const method = String(body.method || '');
    const screenshot = String(body.screenshot || '');
    if (!isEmail(email) || !isText(phone, 5, 32) || !['monthly', 'quarterly', 'yearly'].includes(plan) || !amount || !['instapay', 'vodafone'].includes(method)) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }
    // Egyptian phone: 8-15 digits, optional leading +.
    if (!/^\+?\d{8,15}$/.test(phone.replace(/[\s-]/g, ''))) {
      return Response.json({ error: 'Invalid phone' }, { status: 400 });
    }
    const sessionEmail = await getSessionEmail();
    if (!sessionEmail || sessionEmail !== email) {
      return Response.json({ error: 'Sign in with this email first' }, { status: 403 });
    }
    if (PLAN_PRICE[plan] !== amount) {
      return Response.json({ error: 'Amount does not match plan price' }, { status: 400 });
    }
    if (screenshot.length > 2_500_000 || !isSafeImageDataUrl(screenshot)) {
      return Response.json({ error: 'Screenshot too large' }, { status: 400 });
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from('payment_requests')
      .insert({ email, phone, plan, amount, method, screenshot, status: 'pending' })
      .select('id')
      .single();
    if (error) {
      console.error('[subscriptions] insert failed:', error.message);
      // Fallback to service if anon RLS blocks (covers both key setups)
      try {
        const svc = createServiceClient();
        const r2 = await svc.from('payment_requests').insert({ email, phone, plan, amount, method, screenshot, status: 'pending' }).select('id').single();
        if (!r2.error && r2.data) return Response.json({ id: r2.data.id, status: 'pending' });
        console.error('[subscriptions] service fallback failed:', r2.error?.message);
      } catch {}
      return Response.json({ error: 'Could not save request' }, { status: 500 });
    }
    return Response.json({ id: data.id, status: 'pending' });
  } catch (e: any) {
    console.error('[subscriptions] POST failed:', e?.message || e);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
