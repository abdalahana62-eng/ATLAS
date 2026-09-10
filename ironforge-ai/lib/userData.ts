import { createClient } from '@/lib/supabase/client';

export interface LogSet { weight: number; reps: number; }
export interface WorkoutLog { id?: string; log_date: string; exercise: string; muscle?: string; sets: LogSet[]; }
export interface Measurement { id?: string; log_date: string; weight_kg?: number; chest_cm?: number; arm_cm?: number; waist_cm?: number; photo?: string; }

const LS_LOGS = 'atlas-workout-logs';
const LS_MEAS = 'atlas-measurements';

function lsGet<T>(k: string): T[] {
  try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; }
}
function lsSet(k: string, v: any) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
}

async function userId(): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  } catch { return null; }
}

// ---- Workout logs ----
export async function getLogs(): Promise<WorkoutLog[]> {
  const local = lsGet<WorkoutLog>(LS_LOGS);
  try {
    const uid = await userId();
    if (!uid) return local;
    const supabase = createClient();
    const { data } = await supabase.from('workout_logs').select('*').eq('user_id', uid).order('log_date', { ascending: false }).limit(200);
    if (data) { lsSet(LS_LOGS, data); return data as WorkoutLog[]; }
  } catch {}
  return local;
}

export async function saveLogSet(exercise: string, muscle: string, set: LogSet): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const logs = lsGet<WorkoutLog>(LS_LOGS);
  let entry = logs.find(l => l.log_date === today && l.exercise === exercise);
  if (!entry) { entry = { log_date: today, exercise, muscle, sets: [] }; logs.unshift(entry); }
  entry.sets.push(set);
  lsSet(LS_LOGS, logs);
  try {
    const uid = await userId();
    if (!uid) return;
    const supabase = createClient();
    const { data: existing } = await supabase.from('workout_logs').select('id,sets').eq('user_id', uid).eq('log_date', today).eq('exercise', exercise).maybeSingle();
    if (existing) {
      await supabase.from('workout_logs').update({ sets: [...((existing as any).sets || []), set] }).eq('id', (existing as any).id);
    } else {
      await supabase.from('workout_logs').insert({ user_id: uid, log_date: today, exercise, muscle, sets: [set] });
    }
  } catch {}
}

export function personalRecord(logs: WorkoutLog[], exercise: string): number {
  let max = 0;
  for (const l of logs) {
    if (l.exercise !== exercise) continue;
    for (const s of l.sets || []) if (s.weight > max) max = s.weight;
  }
  return max;
}

// ---- Measurements ----
export async function getMeasurements(): Promise<Measurement[]> {
  const local = lsGet<Measurement>(LS_MEAS);
  try {
    const uid = await userId();
    if (!uid) return local;
    const supabase = createClient();
    const { data } = await supabase.from('measurements').select('*').eq('user_id', uid).order('log_date', { ascending: false }).limit(100);
    if (data) { lsSet(LS_MEAS, data); return data as Measurement[]; }
  } catch {}
  return local;
}

export async function saveMeasurement(m: Measurement): Promise<void> {
  const logs = lsGet<Measurement>(LS_MEAS);
  logs.unshift({ ...m, log_date: m.log_date || new Date().toISOString().slice(0, 10) });
  lsSet(LS_MEAS, logs);
  try {
    const uid = await userId();
    if (!uid) return;
    const supabase = createClient();
    await supabase.from('measurements').insert({ user_id: uid, ...logs[0] });
  } catch {}
}

export async function deleteMeasurement(id: string | undefined, log_date: string): Promise<void> {
  lsSet(LS_MEAS, lsGet<Measurement>(LS_MEAS).filter(m => !(m.id === id && m.log_date === log_date)));
  try {
    const uid = await userId();
    if (!uid || !id) return;
    const supabase = createClient();
    await supabase.from('measurements').delete().eq('id', id).eq('user_id', uid);
  } catch {}
}
