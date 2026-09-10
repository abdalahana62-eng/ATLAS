'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Dumbbell, Play, CalendarDays, ArrowRight } from 'lucide-react';
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
    <Card className="p-6 border-ironforge-primary/30 bg-ironforge-card">
      <div className="flex items-center justify-between mb-1">
        <Badge variant="primary" className="bg-ironforge-primary/15 text-ironforge-primary border-ironforge-primary/30">
          <CalendarDays className="w-3 h-3" /> {todayLabel(locale)}
        </Badge>
        <Badge variant="outline" className="border-ironforge-border text-ironforge-text-muted">
          {isAr ? `اليوم ${idx + 1} من ${sys.days.length}` : `Day ${idx + 1}/${sys.days.length}`}
        </Badge>
      </div>
      <p className="text-xs text-ironforge-text-muted mt-2">{isAr ? 'خطة اليوم' : "Today's plan"} • {isAr ? sys.name_ar : sys.name_en}</p>
      <h3 className="text-2xl font-black text-ironforge-text mt-1">{isAr ? day.name_ar : day.name_en}</h3>
      <div className="mt-3 space-y-2">
        {day.exercises.slice(0, 4).map((ex, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
            <span className="text-ironforge-text">{isAr ? ex.name_ar : ex.name_en}</span>
            <span className="text-xs text-ironforge-text-muted">{isAr ? ex.muscle_ar : ex.muscle_en}</span>
          </div>
        ))}
        {day.exercises.length > 4 && (
          <p className="text-xs text-ironforge-text-muted">+{day.exercises.length - 4} {isAr ? 'تمارين أخرى' : 'more'}</p>
        )}
      </div>
      <Link href={`/${locale}/workout?system=${plan.system}&day=${idx}`}>
        <Button className="w-full mt-4 bg-ironforge-primary hover:bg-ironforge-primary-dark text-black font-bold">
          <Play className="w-4 h-4" /> {isAr ? 'ادخل تمرين النهاردة' : 'Start today'} <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </Card>
  );
}
