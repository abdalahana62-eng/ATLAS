'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getMeasurements, saveMeasurement, deleteMeasurement, type Measurement } from '@/lib/userData';

// Body progress: weight + measurements — saved to account, never lost
export default function ProgressTracker() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [list, setList] = useState<Measurement[]>([]);
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [arm, setArm] = useState('');
  const [waist, setWaist] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = async () => setList(await getMeasurements());
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    if (!weight && !chest && !arm && !waist) return;
    setSaving(true);
    await saveMeasurement({
      log_date: new Date().toISOString().slice(0, 10),
      weight_kg: weight ? parseFloat(weight) : undefined,
      chest_cm: chest ? parseFloat(chest) : undefined,
      arm_cm: arm ? parseFloat(arm) : undefined,
      waist_cm: waist ? parseFloat(waist) : undefined,
    });
    setWeight(''); setChest(''); setArm(''); setWaist('');
    await refresh();
    setSaving(false);
  };

  const del = async (m: Measurement) => {
    if (!confirm(isAr ? 'حذف التسجيل؟' : 'Delete entry?')) return;
    await deleteMeasurement(m.id, m.log_date);
    refresh();
  };

  const weights = list.filter(m => m.weight_kg).map(m => m.weight_kg as number);
  const trend = weights.length >= 2 ? weights[0] - weights[weights.length - 1] : 0;

  return (
    <Card className="border-ironforge-border bg-ironforge-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-ironforge-text">📊 {isAr ? 'تقدم الجسم' : 'Body Progress'}</h3>
        {weights.length >= 2 && (
          <span className={`flex items-center gap-1 text-sm font-bold ${trend < 0 ? 'text-emerald-400' : trend > 0 ? 'text-amber-400' : 'text-ironforge-text-muted'}`}>
            {trend < 0 ? <TrendingDown className="w-4 h-4" /> : trend > 0 ? <TrendingUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}kg
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <input value={weight} onChange={e => setWeight(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder={isAr ? 'الوزن (كجم)' : 'Weight (kg)'}
          className="bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text" />
        <input value={chest} onChange={e => setChest(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder={isAr ? 'الصدر (سم)' : 'Chest (cm)'}
          className="bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text" />
        <input value={arm} onChange={e => setArm(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder={isAr ? 'الذراع (سم)' : 'Arm (cm)'}
          className="bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text" />
        <input value={waist} onChange={e => setWaist(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" placeholder={isAr ? 'الوسط (سم)' : 'Waist (cm)'}
          className="bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text" />
      </div>

      <Button onClick={save} disabled={saving} className="bg-ironforge-primary text-black w-full mb-4">
        <Plus className="w-4 h-4" /> {isAr ? 'حفظ القياس' : 'Save'}
      </Button>

      <div className="space-y-2 max-h-72 overflow-y-auto">
        {list.map((m, i) => (
          <div key={(m.id || '') + m.log_date + i} className="flex items-center gap-3 rounded-xl border border-ironforge-border bg-ironforge-background p-3">
            <div className="flex-1 text-sm">
              <p className="font-bold text-ironforge-text">{m.log_date}</p>
              <p className="text-ironforge-text-muted text-xs">
                {[m.weight_kg ? `${m.weight_kg}kg` : '', m.chest_cm ? `${isAr ? 'صدر' : 'C'} ${m.chest_cm}` : '', m.arm_cm ? `${isAr ? 'ذراع' : 'A'} ${m.arm_cm}` : '', m.waist_cm ? `${isAr ? 'وسط' : 'W'} ${m.waist_cm}` : ''].filter(Boolean).join(' • ')}
              </p>
            </div>
            <button onClick={() => del(m)} className="text-red-400/70 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {list.length === 0 && <p className="text-center text-sm text-ironforge-text-muted">{isAr ? 'سجّل أول قياس ليك — كل حاجة بتتحفظ في حسابك' : 'Log your first check-in — everything stays in your account'}</p>}
      </div>
    </Card>
  );
}
