import { timingSafeEqual } from 'crypto';
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { OWNER_EMAIL } from '@/lib/subscription';
import { adminRateLimited } from '@/lib/security/rate-limit';

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) return false;
  try {
    return timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

// Triple lock: owner email header + password + owner Google session (server-verified).
// Fail-closed: any missing env or mismatch → false. Single generic log shape
// (no email-vs-password oracle) — details stay server-side only.
export async function checkAdmin(req: NextRequest): Promise<boolean> {
  try {
    const email = req.headers.get('x-admin-email')?.toLowerCase().trim() || '';
    const pass = req.headers.get('x-admin-password') || '';
    const owner = (process.env.ADMIN_EMAIL || OWNER_EMAIL).toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    if (!adminPassword) {
      console.error('[admin-auth] DENY (config)');
      return false;
    }
    if (!email || !safeEqual(email, owner)) {
      console.error('[admin-auth] DENY (credential)');
      return false;
    }
    if (!pass || !safeEqual(pass, adminPassword)) {
      console.error('[admin-auth] DENY (credential)');
      return false;
    }
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const sessEmail = data.user?.email?.toLowerCase().trim() || '';
    if (!sessEmail || !safeEqual(sessEmail, owner)) {
      console.error('[admin-auth] DENY (session)');
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// Call at the top of every /api/admin handler: rate-limit first, then auth.
// Returns a Response to send immediately, or null to continue.
export async function guardAdmin(req: NextRequest): Promise<Response | null> {
  const limited = adminRateLimited(req);
  if (limited) return limited;
  if (!(await checkAdmin(req))) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}
