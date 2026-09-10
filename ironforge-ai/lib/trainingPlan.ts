// Active training plan: which system the user follows + when they started.
// "Today" rotates through the system's days automatically.
export interface ActivePlan { system: string; startDate: string; } // startDate: YYYY-MM-DD
export interface SystemDay {
  name: string; name_en: string; name_ar: string;
  exercises: Array<{ name_en: string; name_ar: string; muscle_en: string; muscle_ar: string; videoUrl: string; file: string }>;
}
export interface SystemData { name_ar: string; name_en: string; days: SystemDay[]; }

const KEY = 'atlas-active-plan';

export function getActivePlan(): ActivePlan | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as ActivePlan : null;
  } catch { return null; }
}

// Pin a system as yours. Changing system restarts the rotation from today.
export function setActivePlan(system: string) {
  try {
    const prev = getActivePlan();
    const today = new Date().toISOString().slice(0, 10);
    if (prev?.system === system && prev?.startDate) return prev;
    const next = { system, startDate: today };
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch { return null; }
}

export function todayIndex(startDate: string, daysLength: number): number {
  if (!daysLength) return 0;
  const start = new Date(startDate + 'T00:00:00').getTime();
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const diff = Math.max(0, Math.floor((now.getTime() - start) / 86400000));
  return diff % daysLength;
}

export function todayLabel(locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date());
  } catch { return new Date().toISOString().slice(0, 10); }
}
