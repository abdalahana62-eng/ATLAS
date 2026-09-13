import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'atlas_admin';
const MAX_AGE_SEC = 30 * 60; // 30 min

function getSecret(): string {
  const a = process.env.ADMIN_PASSWORD || '';
  const b = process.env.ADMIN_EMAIL || '';
  // Combine so rotating either invalidates old cookies.
  return `atlas:${a}:${b}`;
}

function b64urlEncode(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64url');
}
function b64urlDecode(s: string): string {
  return Buffer.from(s, 'base64url').toString('utf8');
}

// token = base64url(email|expiry).base64url(sig)
export function createAdminSessionToken(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = `${email.toLowerCase().trim()}|${exp}`;
  const sig = createHmac('sha256', getSecret()).update(payload).digest('base64url');
  return `${b64urlEncode(payload)}.${sig}`;
}

export function verifyAdminSessionToken(token: string): { email: string } | null {
  try {
    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return null;
    const payload = b64urlDecode(b64);
    const [email, expStr] = payload.split('|');
    const exp = Number(expStr);
    if (!email || !Number.isFinite(exp)) return null;
    if (exp < Math.floor(Date.now() / 1000)) return null;
    const expected = createHmac('sha256', getSecret()).update(payload).digest('base64url');
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
    const owner = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    if (!owner || email.toLowerCase().trim() !== owner) return null;
    return { email: email.toLowerCase().trim() };
  } catch {
    return null;
  }
}

export function adminCookieName(): string {
  return COOKIE_NAME;
}
export function adminMaxAge(): number {
  return MAX_AGE_SEC;
}
