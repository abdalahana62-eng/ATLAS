// Subscription system: 3-day trial + monthly plans (Instapay / Vodafone Cash)
export const PAY_NUMBER = '01040771597';
export const TRIAL_DAYS = 3;
export const OWNER_EMAIL = 'abdalahana555@gmail.com';

export interface Plan {
  id: 'monthly' | 'quarterly' | 'yearly';
  price: number;
  days: number;
  name_ar: string;
  name_en: string;
}

export const PLANS: Plan[] = [
  { id: 'monthly', price: 299, days: 30, name_ar: 'شهري', name_en: 'Monthly' },
  { id: 'quarterly', price: 599, days: 90, name_ar: '3 شهور', name_en: 'Quarterly' },
  { id: 'yearly', price: 2000, days: 365, name_ar: 'سنوي', name_en: 'Yearly' },
];

export function getPlan(id: string): Plan {
  return PLANS.find(p => p.id === id) ?? PLANS[0];
}

interface Account { email: string; createdAt: string; }
interface Sub { plan: string; expiresAt: string; }

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch { return null; }
}

export function getAccount(): Account | null {
  return typeof window === 'undefined' ? null : read<Account>('atlas-account');
}

export function saveAccount(email: string) {
  try {
    const prev = read<Account>('atlas-account');
    if (prev?.email === email) return; // keep original trial start
    localStorage.setItem('atlas-account', JSON.stringify({ email, createdAt: new Date().toISOString() }));
  } catch {}
}

export function getSub(): Sub | null {
  return typeof window === 'undefined' ? null : read<Sub>('atlas-sub');
}

export function saveSub(plan: string, expiresAt: string) {
  try { localStorage.setItem('atlas-sub', JSON.stringify({ plan, expiresAt })); } catch {}
}

export function trialDaysLeft(): number {
  const acc = getAccount();
  if (!acc) return TRIAL_DAYS;
  const diff = Date.now() - new Date(acc.createdAt).getTime();
  const left = TRIAL_DAYS - Math.floor(diff / 86400000);
  return Math.max(0, left);
}

export function subDaysLeft(): number {
  const sub = getSub();
  if (!sub) return 0;
  const diff = new Date(sub.expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function hasAccess(): boolean {
  if (typeof window === 'undefined') return true;
  return trialDaysLeft() > 0 || subDaysLeft() > 0;
}

export async function refreshSubFromServer(email: string): Promise<boolean> {
  try {
    const r = await fetch(`/api/subscriptions?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
    if (!r.ok) return false;
    const d = await r.json();
    if (d?.expiresAt && new Date(d.expiresAt).getTime() > Date.now()) {
      saveSub(d.plan, d.expiresAt);
      return true;
    }
    return false;
  } catch { return false; }
}
