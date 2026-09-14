'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Plus, Trophy, History, Save, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getLogs, saveLogSet, personalRecord, type WorkoutLog } from '@/lib/userData';

// Log weight × reps per exercise — saved to account (Supabase + offline)
// ميزة النجمة: لما تتفوق على نفسك (وزن أكبر من PR) يظهر لك نجمة وتهنئة ⭐
export default function WeightLogger({ exercise, muscle }: { exercise: string; muscle: string }) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [pr, setPr] = useState(0);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [newPR, setNewPR] = useState<number | null>(null);

  const refresh = async () => {
    const all = await getLogs();
    setLogs(all.filter(l => l.exercise === exercise).slice(0, 5));
    setPr(personalRecord(all, exercise));
  };

  useEffect(() => { refresh(); setWeight(''); setReps(''); setNewPR(null); }, [exercise]);

  const wNum = parseFloat(weight);
  const rNum = parseInt(reps);
  const canSave = !!wNum && wNum > 0 && wNum < 500 && !!rNum && rNum > 0 && rNum < 100 && !saving;
  const willBePR = canSave && wNum > pr;

  const add = async () => {
    if (!canSave) return;
    setSaving(true);
    const isPR = wNum > pr;
    await saveLogSet(exercise, muscle, { weight: wNum, reps: rNum });
    setWeight(''); setReps('');
    await refresh();
    setSaving(false);
    setJustSaved(true);
    if (isPR) {
      setNewPR(wNum);
      // هزاز خفيف لو الجهاز يدعم
      try { navigator.vibrate?.(80); } catch {}
      setTimeout(() => setNewPR(null), 4000);
    }
    setTimeout(() => setJustSaved(false), 2000);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSave) add();
  };

  const today = logs.find(l => l.log_date === new Date().toISOString().slice(0, 10));

  return (
    <Card className="p-5 border-ironforge-border bg-ironforge-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-ironforge-text flex items-center gap-2">
          🏋️ {isAr ? 'سجل وزنك' : 'Log your lift'}
        </h3>
        {pr > 0 && (
          <Badge variant="primary" className={`border ${newPR ? 'bg-amber-500 text-black border-amber-500 animate-pulse' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
            <Trophy className="w-3 h-3" /> PR: {pr}kg {newPR && '⭐'}
          </Badge>
        )}
      </div>

      {/* نجمة التفوق */}
      {newPR !== null && (
        <div className="mb-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 p-3 flex items-center gap-3 animate-in slide-in-from-top-1">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0 animate-bounce">
            <Star className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <p className="font-black text-amber-400 text-sm">{isAr ? 'رقم قياسي جديد! 🌟' : 'New PR! 🌟'}</p>
            <p className="text-xs text-ironforge-text">
              {isAr ? `تفوقت على نفسك! ${newPR} كجم هو وزنك الأعلى في` : `${newPR}kg — your heaviest for`} <span className="font-bold">{exercise}</span>
            </p>
          </div>
        </div>
      )}

      {justSaved && !newPR && (
        <div className="mb-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 flex items-center gap-2 text-emerald-400 text-sm">
          <Check className="w-4 h-4" /> {isAr ? 'تم حفظ الوزن ✓' : 'Weight saved ✓'}
        </div>
      )}

      <div className="flex gap-2">
        <input value={weight} onChange={e => setWeight(e.target.value.replace(/[^0-9.]/g, ''))} onKeyDown={onKeyDown} inputMode="decimal"
          placeholder={isAr ? 'الوزن (كجم)' : 'Weight (kg)'}
          className={`flex-1 bg-ironforge-background border rounded-lg px-3 py-3 text-ironforge-text text-center font-bold text-lg focus:ring-2 focus:ring-ironforge-primary/30 outline-none ${willBePR ? 'border-amber-500/50 bg-amber-500/5' : 'border-ironforge-border'}`} />
        <span className="self-center text-ironforge-text-muted font-bold">×</span>
        <input value={reps} onChange={e => setReps(e.target.value.replace(/\D/g, ''))} onKeyDown={onKeyDown} inputMode="numeric"
          placeholder={isAr ? 'العدات' : 'Reps'}
          className="flex-1 bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-3 text-ironforge-text text-center font-bold text-lg focus:ring-2 focus:ring-ironforge-primary/30 outline-none" />
      </div>

      {willBePR && (
        <p className="text-xs text-amber-400 mt-2 flex items-center gap-1 justify-center">
          <Star className="w-3 h-3 fill-amber-400" /> {isAr ? `هتتفوق على رقمك القياسي (${pr}kg) ⭐` : `Will beat your PR (${pr}kg) ⭐`}
        </p>
      )}

      <Button onClick={add} disabled={!canSave} className={`w-full mt-3 py-6 text-base font-black rounded-xl transition-all ${canSave ? 'bg-ironforge-primary text-black hover:bg-ironforge-primary-dark shadow-lg shadow-ironforge-primary/20' : 'bg-ironforge-card text-ironforge-text-muted border border-ironforge-border'}`}>
        {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (
          <span className="flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> {isAr ? 'حفظ الوزن' : 'Save Weight'} {willBePR && '⭐'}
          </span>
        )}
      </Button>

      <p className="text-[11px] text-ironforge-text-muted text-center mt-2">{isAr ? 'اضغط Enter للحفظ بسرعة' : 'Press Enter to save quickly'}</p>

      {today && today.sets.length > 0 && (
        <div className="mt-4 space-y-1.5 rounded-xl bg-ironforge-background border border-ironforge-border p-3">
          <p className="text-xs font-bold text-ironforge-text-muted flex items-center gap-1"><History className="w-3 h-3" />{isAr ? 'سجل النهاردة' : 'Today'}</p>
          {today.sets.map((s, i) => {
            const isPRSet = s.weight >= pr && pr > 0;
            return (
              <p key={i} className={`text-sm flex items-center justify-between rounded-lg px-2 py-1 ${isPRSet ? 'bg-amber-500/10 border border-amber-500/20' : ''}`}>
                <span className="text-ironforge-text">#{i + 1}: <span className="font-black text-ironforge-primary">{s.weight}kg × {s.reps}</span></span>
                {isPRSet && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
              </p>
            );
          })}
        </div>
      )}
      {logs.filter(l => l.log_date !== new Date().toISOString().slice(0, 10)).slice(0, 3).map(l => (
        <p key={l.log_date + l.exercise} className="text-xs text-ironforge-text-muted mt-2 flex items-center gap-1">
          <History className="w-3 h-3" /> {l.log_date}: {l.sets.map(s => `${s.weight}×${s.reps}`).join('، ')}
        </p>
      ))}
    </Card>
  );
}
