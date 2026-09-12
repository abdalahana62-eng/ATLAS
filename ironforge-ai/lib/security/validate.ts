// Lightweight input validation (no new deps). Use in every public POST/PATCH.

// Generic helpers
export function isEmail(v: unknown, maxLen = 254): v is string {
  if (typeof v !== 'string') return false;
  const s = v.trim();
  if (!s || s.length > maxLen) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

export function isText(v: unknown, min: number, max: number): v is string {
  return typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
}

export function isUuid(v: unknown): v is string {
  return (
    typeof v === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v.trim())
  );
}

// Only allow safe image data-URLs for screenshots. Rejects SVG (XSS vector:
// <svg onload=...>) and anything that is not jpeg/png/webp.
export function isSafeImageDataUrl(v: unknown, maxLen = 2_500_000): boolean {
  if (typeof v !== 'string' || !v) return true; // optional field
  if (v.length > maxLen) return false;
  return /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\s]+$/.test(v);
}

// Chat messages: cap count + length + roles (DoS / billing protection).
export function validateChatMessages(messages: unknown): { ok: true; value: { role: 'user' | 'assistant'; content: string }[] } | { ok: false; error: string } {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
    return { ok: false, error: 'Messages must be 1-30 items' };
  }
  const out: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const m of messages) {
    if (!m || typeof m !== 'object') return { ok: false, error: 'Bad message shape' };
    const role = (m as any).role;
    const content = (m as any).content;
    if (role !== 'user' && role !== 'assistant') return { ok: false, error: 'Bad message role' };
    if (typeof content !== 'string' || !content.trim() || content.length > 4000) {
      return { ok: false, error: 'Each message must be 1-4000 chars' };
    }
    out.push({ role, content: content.slice(0, 4000) });
  }
  return { ok: true, value: out };
}

// Safe redirect target for auth callbacks: internal path only, no //, no javascript:.
export function safeNextPath(raw: unknown, fallback: string): string {
  if (typeof raw !== 'string' || !raw) return fallback;
  // Must be like /ar/... or /en/... or /... — never protocol-relative or external.
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\')) return fallback;
  if (/^\/(?!.*:)[a-z]{2}(\/|$)/.test(raw)) return raw; // /ar..., /en...
  if (/^\/[a-z0-9/_?=&%.#-]*$/i.test(raw)) return raw;
  return fallback;
}

// Safe href for AI-rendered markdown links: only http(s) or site-internal paths.
export function isSafeHref(href: string): boolean {
  const h = href.trim();
  if (/^(https?:\/\/|\/[^/])/i.test(h)) {
    // Block javascript:, data:, vbscript:, file:, blob:
    if (/^\s*(javascript|data|vbscript|file|blob):/i.test(h)) return false;
    return true;
  }
  return false;
}
