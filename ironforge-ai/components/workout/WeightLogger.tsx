'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Plus, Trophy, History } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getLogs, saveLogSet, personalRecord, type WorkoutLog } from '@/lib/userData';

// Log weight × reps per exercise — saved to account (Supabase + offline)
export default function WeightLogger({ exercise, muscle }: { exercise: string; muscle: string }) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [pr, setPr] = useState(0);

  const refresh = async () => {
    const all = await getLogs();
    setLogs(all.filter(l => l.exercise === exercise).slice(0, 5));
    setPr(personalRecord(all, exercise));
  };

  useEffect(() => { refresh(); setWeight(''); setReps(''); }, [exercise]);

  const add = async () => {
    const w = parseFloat(weight), r = parseInt(reps);
    if (!w || !r) return;
    await saveLogSet(exercise, muscle, { weight: w, reps: r });
    setWeight(''); setReps('');
    refresh();
  };

  const today = logs.find(l => l.log_date === new Date().toISOString().slice(0, 10));

  return (
    <Card className="p-5 border-ironforge-border bg-ironforge-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-ironforge-text flex items-center gap-2">
          🏋️ {isAr ? 'سجل وزنك' : 'Log your lift'}
        </h3>
        {pr > 0 && (
          <Badge variant="primary" className="bg-amber-500/15 text-amber-400 border-amber-500/30">
            <Trophy className="w-3 h-3" /> PR: {pr}kg
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        <input value={weight} onChange={e => setWeight(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal"
          placeholder={isAr ? 'الوزن (كجم)' : 'Weight (kg)'}
          className="flex-1 bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text" />
        <input value={reps} onChange={e => setReps(e.target.value.replace(/\D/g, ''))} inputMode="numeric"
          placeholder={isAr ? 'العدات' : 'Reps'}
          className="flex-1 bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text" />
        <Button onClick={add} className="bg-ironforge-primary text-black shrink-0"><Plus className="w-4 h-4" /></Button>
      </div>
      {today && today.sets.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-xs text-ironforge-text-muted flex items-center gap-1"><History className="w-3 h-3" />{isAr ? 'النهاردة' : 'Today'}</p>
          {today.sets.map((s, i) => (
            <p key={i} className="text-sm text-ironforge-text">#{i + 1}: <span className="font-bold text-ironforge-primary">{s.weight}kg × {s.reps}</span></p>
          ))}
        </div>
      )}
      {logs.filter(l => l.log_date !== new Date().toISOString().slice(0, 10)).slice(0, 3).map(l => (
        <p key={l.log_date + l.exercise} className="text-xs text-ironforge-text-muted mt-1">
          {l.log_date}: {l.sets.map(s => `${s.weight}×${s.reps}`).join('، ')}
        </p>
      ))}
    </Card>
  );
}
