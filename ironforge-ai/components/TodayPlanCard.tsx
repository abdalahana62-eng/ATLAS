'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Dumbbell, Play, CalendarDays, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getActivePlan, todayIndex, todayLabel, type SystemData } from '@/lib/trainingPlan';

// "Today's workout" — follows the user's pinned system and rotates daily with the date
export default function TodayPlanCard() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [systems, setSystems] = useState<Record<string, SystemData> | null>(null);

  useEffect(() => {
    fetch('/workout-systems.json').then(r => r.json()).then(setSystems).catch(() => {});
  }, []);

  const plan = typeof window !== 'undefined' ? getActivePlan() : null;
  const sys = plan && systems ? systems[plan.system] : null;

  if (!sys || !plan) {
    return (
      <Card className="p-6 border-ironforge-border bg-ironforge-card text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-ironforge-primary/15 text-ironforge-primary">
          <Dumbbell className="h-6 w-6" />
        </div>
        <h3 className="font-bold text-ironforge-text">{isAr ? 'اختار نظام تمرينك' : 'Pick your program'}</h3>
        <p className="text-sm text-ironforge-text-muted mt-1 mb-4">
          {isAr ? 'يومين / 3 / 4 / 5 أو منزلي — وهنظهرلك تمرين كل يوم لوحده' : '2 / 3 / 4 / 5 days or home — we show each day automatically'}
        </p>
        <Link href={`/${locale}/workout`}>
          <Button className="bg-ironforge-primary text-black">{isAr ? 'اختيار النظام' : 'Choose program'}</Button>
        </Link>
      </Card>
    );
  }

  const idx = todayIndex(plan.startDate, sys.days.length);
  const day = sys.days[idx];

  return (
    <div className="rounded-[28px] border border-white/10 bg-[#0c1218] p-5 shadow-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="primary" className="bg-ironforge-primary/15 text-ironforge-primary border-ironforge-primary/30">
          <CalendarDays className="w-3 h-3" /> {todayLabel(locale)}
        </Badge>
        <Badge variant="outline" className="border-ironforge-border text-ironforge-text-muted">
          {isAr ? `اليوم ${idx + 1} من ${sys.days.length}` : `Day ${idx + 1}/${sys.days.length}`}
        </Badge>
      </div>

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ironforge-primary/15 text-ironforge-primary">
          <Zap className="h-5 w-5" />
        </div>
        <div className="flex-1 text-end">
          <p className="text-sm text-slate-400">{isAr ? 'خطة اليوم' : "Today's plan"}</p>
          <h3 className="mt-1 text-3xl font-black leading-snug text-white">{isAr ? day.name_ar : day.name_en}</h3>
          <p className="mt-1 text-xs text-slate-500">{isAr ? sys.name_ar : sys.name_en}</p>
        </div>
      </div>

      <div className="space-y-3">
        {day.exercises.slice(0, 4).map((ex, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <span className="rounded-full bg-ironforge-primary/15 px-2.5 py-1 text-xs font-bold text-ironforge-primary" dir="ltr">
              x 10&nbsp;&nbsp;3
            </span>
            <p className="text-[15px] font-bold text-white">{isAr ? ex.name_ar : ex.name_en}</p>
          </div>
        ))}
        {day.exercises.length > 4 && (
          <p className="text-center text-xs text-slate-500">+{day.exercises.length - 4} {isAr ? 'تمارين أخرى' : 'more exercises'}</p>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-ironforge-primary/25 bg-ironforge-primary/[0.07] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-ironforge-primary">82%</span>
          <span className="text-sm text-slate-300">{isAr ? 'نسبة الاستشفاء' : 'Recovery'}</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-ironforge-primary to-lime-300" />
        </div>
      </div>

      <Link href={`/${locale}/workout?system=${plan.system}&day=${idx}`}>
        <Button className="mt-4 w-full rounded-2xl bg-ironforge-primary py-3 font-black text-black hover:bg-ironforge-primary-dark">
          <Play className="h-4 w-4" /> {isAr ? 'ادخل تمرين النهاردة' : 'Start today'}
        </Button>
      </Link>
    </div>
  );
}
