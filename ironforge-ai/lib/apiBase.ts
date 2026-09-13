// Central API addressing: on the website use relative /api/* (same origin).
// Inside the Capacitor APK (static export, no local server) route every call
// to the cloud backend instead, with atlasfit.pro as automatic fallback.

export function isCapacitorApp(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const w = window as any;
    return !!(
      w.Capacitor?.isNativePlatform?.() ||
      w.Capacitor?.isNative ||
      window.location.protocol === 'capacitor:' ||
      document.URL.includes('capacitor') ||
      navigator.userAgent.includes('Capacitor')
    );
  } catch {
    return false;
  }
}

export function apiBase(): string {
  if (typeof window === 'undefined' || !isCapacitorApp()) return '';
  const host = process.env.NEXT_PUBLIC_VERCEL_URL || 'atlasfit.pro';
  return `https://${host}`.replace(/\/+$/, '');
}

/** Prefix an /api/* path with the cloud base when running inside the app. */
export function api(path: string): string {
  const base = apiBase();
  return base ? `${base}${path}` : path;
}

// Lazily attach Supabase JWT so the server can auth APK requests
// (Capacitor cookies are per-origin localhost, never reach atlasfit.pro).
async function authHeaders(): Promise<Record<string, string>> {
  try {
    if (typeof window === 'undefined') return {};
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) return { Authorization: `Bearer ${token}` };
  } catch {}
  return {};
}

/**
 * fetch() that survives a dead primary backend: if the configured Vercel host
 * is unreachable from the app, retry once against atlasfit.pro.
 * (HTTP error statuses are returned as-is — only network failures retry.)
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const primary = api(path);
  const extra = await authHeaders();
  const withAuth: RequestInit = {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.headers as Record<string, string> | undefined),
      ...extra,
    },
  };
  // Don't send empty Authorization if we had no session — keeps public routes clean
  if (!withAuth.headers || !('Authorization' in withAuth.headers) || !(withAuth.headers as any).Authorization) {
    const h = { ...(withAuth.headers as any) };
    delete h.Authorization;
    withAuth.headers = h;
  }
  try {
    return await fetch(primary, withAuth);
  } catch (e) {
    if (
      primary.startsWith('http') &&
      !primary.startsWith('https://atlasfit.pro')
    ) {
      return fetch(`https://atlasfit.pro${path}`, withAuth);
    }
    throw e;
  }
}
