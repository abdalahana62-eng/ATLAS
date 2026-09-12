import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { OWNER_EMAIL } from '@/lib/subscription';

// Fail-closed: no default password. Set a strong ADMIN_PASSWORD in Vercel env.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

// Triple lock: owner email header + password + owner Google session (server-verified)
export async function checkAdmin(req: NextRequest): Promise<boolean> {
  try {
    const email = req.headers.get('x-admin-email')?.toLowerCase().trim();
    const pass = req.headers.get('x-admin-password') || '';
    const owner = (process.env.ADMIN_EMAIL || OWNER_EMAIL).toLowerCase();
    if (!ADMIN_PASSWORD) {
      console.error('[admin-auth] DENY: ADMIN_PASSWORD env missing');
      return false;
    }
    if (!email || email !== owner) {
      console.error('[admin-auth] DENY: email mismatch');
      return false;
    }
    if (!pass || pass !== ADMIN_PASSWORD) {
      console.error('[admin-auth] DENY: password mismatch');
      return false;
    }
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const sessEmail = data.user?.email?.toLowerCase().trim();
    if (!sessEmail || sessEmail !== owner) {
      console.error('[admin-auth] DENY: no owner Google session');
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
