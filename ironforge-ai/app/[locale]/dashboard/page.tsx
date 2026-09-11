'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  Dumbbell,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Settings,
  MessageSquare,
  ArrowRight,
  Scale,
  Layers,
  UtensilsCrossed,
  ChevronLeft,
  Trophy,
  Medal,
  Flag,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import SubscriptionGate from '@/components/SubscriptionGate';
import AuthGate from '@/components/AuthGate';
import TodayPlanCard from '@/components/TodayPlanCard';
import { getLogs, getMeasurements, type WorkoutLog, type Measurement } from '@/lib/userData';

// ---------- Real-data helpers ----------

interface Stats {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity: string;
  goal: string;
}

interface NutriLog {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function localKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function todayKey() {
  return localKey(new Date());
}

// Saturday-first week (Egypt), offset in weeks (0 = this week)
function weekKeys(offset = 0): string[] {
  const now = new Date();
  const dowSatFirst = (now.getDay() + 1) % 7;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - dowSatFirst - offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return localKey(d);
  });
}

function calcTargets(s: Stats) {
  const mult: Record<string, number> =
    { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, extra: 1.9 };
  const bmr = 10 * s.weight + 6.25 * s.height - 5 * s.age + (s.gender === 'male' ? 5 : -161);
  const tdee = Math.round(bmr * (mult[s.activity] ?? 1.55));
  let cal = tdee;
  if (s.goal === 'cutting') cal = tdee - Math.min(500, tdee * 0.2);
  else if (s.goal === 'bulking') cal = tdee + Math.min(500, tdee * 0.15);
  const protein = Math.round(Math.max(1.6 * s.weight, (0.3 * cal) / 4));
  const fats = Math.round(0.8 * s.weight);
  const carbs = Math.round((cal - protein * 4 - fats * 9) / 4);
  return { calories: Math.round(cal), protein, carbs, fats };
}

// Consecutive training days ending today (or yesterday if today is rest)
function calcStreak(dates: Set<string>): number {
  const cursor = new Date();
  if (!dates.has(localKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(localKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// ---------- SVG blocks (same visual identity: black + lime) ----------

function Ring({
  value,
  size = 132,
  stroke = 12,
  label,
  sub,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label: string;
  sub: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#262626" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#a3e635"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ filter: 'drop-shadow(0 0 6px rgba(163,230,53,0.55))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold tabular-nums text-ironforge-text">{label}</span>
        <span className="text-[11px] tabular-nums text-ironforge-text-muted">{sub}</span>
      </div>
    </div>
  );
}

function WeeklyBars({
  values,
  labels,
  todayIdx,
}: {
  values: number[];
  labels: string[];
  todayIdx: number;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end justify-between gap-1.5 sm:gap-2">
      {values.map((v, i) => {
        const isRest = v === 0;
        const isToday = i === todayIdx;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className={`text-[11px] font-bold tabular-nums ${
                isRest ? 'text-ironforge-text-muted/50' : 'text-ironforge-text'
              }`}
            >
              {isRest ? '—' : v}
            </span>
            <div className="flex h-24 w-full items-end rounded-lg bg-ironforge-background p-1 sm:h-28">
              <div
                className={`w-full rounded-md transition-all ${
                  isRest
                    ? 'bg-ironforge-border/60'
                    : 'bg-gradient-to-t from-ironforge-primary-dark to-ironforge-primary'
                } ${
                  isToday
                    ? 'ring-2 ring-ironforge-primary ring-offset-2 ring-offset-ironforge-card'
                    : ''
                }`}
                style={{
                  height: isRest ? '8%' : `${Math.max(18, (v / max) * 100)}%`,
                  boxShadow: !isRest ? '0 0 12px rgba(163,230,53,0.35)' : undefined,
                }}
              />
            </div>
            <span
              className={`text-[11px] ${
                isToday ? 'font-extrabold text-ironforge-primary' : 'text-ironforge-text-muted'
              }`}
            >
              {labels[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function WeightLine({ points }: { points: number[] }) {
  const w = 560;
  const h = 150;
  const padV = 14;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(0.5, max - min);
  const coords = points.map((p, i) => ({
    x: padV + (i * (w - padV * 2)) / (points.length - 1),
    y: h - padV - ((p - min) / span) * (h - padV * 2),
    p,
  }));
  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
  const area = `${line} L${coords[coords.length - 1].x},${h} L${coords[0].x},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padV} x2={w - padV} y1={h * f} y2={h * f} stroke="#262626" strokeDasharray="4 4" />
      ))}
      <path d={area} fill="url(#wfill)" />
      <path d={line} fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
      {coords.map((c, i) => (
        <g key={i}>
          <circle
            cx={c.x}
            cy={c.y}
            r={i === coords.length - 1 ? 6 : 3.5}
            fill={i === coords.length - 1 ? '#a3e635' : '#0a0a0a'}
            stroke="#a3e635"
            strokeWidth="2"
          />
          {(i === 0 || i === coords.length - 1) && (
            <text x={c.x} y={c.y - 12} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#a1a1aa">
              {c.p}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4 animate-pulse">
        <div className="h-16 rounded-2xl bg-ironforge-card" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-ironforge-card" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-ironforge-card" />
      </div>
    </div>
  );
}

// ---------- Page ----------

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale !== 'en';
  const ar = isRTL;

  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [meas, setMeas] = useState<Measurement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [nutri, setNutri] = useState<NutriLog | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [l, m] = await Promise.all([getLogs(), getMeasurements()]);
        setLogs(Array.isArray(l) ? l : []);
        setMeas(Array.isArray(m) ? m : []);
      } catch {}
      try {
        const raw = localStorage.getItem('atlas-stats') || localStorage.getItem('ironforge-stats');
        if (raw) setStats(JSON.parse(raw));
      } catch {}
      try {
        const n = JSON.parse(localStorage.getItem('atlas-nutrition-log') || 'null');
        if (n && n.date === todayKey()) setNutri(n);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const data = useMemo(() => {
    const thisWeek = weekKeys(0);
    const lastWeek = weekKeys(1);
    const inWeek = (keys: string[]) => {
      const set = new Set(keys);
      return logs.filter((l) => set.has(l.log_date));
    };
    const tw = inWeek(thisWeek);
    const lw = inWeek(lastWeek);

    const daysThis = new Set(tw.map((l) => l.log_date)).size;
    const daysLast = new Set(lw.map((l) => l.log_date)).size;
    const setsThis = tw.reduce((s, l) => s + (l.sets?.length || 0), 0);
    const setsLast = lw.reduce((s, l) => s + (l.sets?.length || 0), 0);
    const setsPerDay = thisWeek.map(
      (k) => tw.filter((l) => l.log_date === k).reduce((s, l) => s + (l.sets?.length || 0), 0)
    );
    const streak = calcStreak(new Set(logs.map((l) => l.log_date)));
    const totalDays = new Set(logs.map((l) => l.log_date)).size;

    const weights = meas
      .filter((m) => Number(m.weight_kg) > 0)
      .slice()
      .sort((a, b) => a.log_date.localeCompare(b.log_date))
      .slice(-8)
      .map((m) => Number(m.weight_kg));
    const currentWeight = weights.length
      ? weights[weights.length - 1]
      : stats
        ? Number(stats.weight) || 0
        : 0;
    const weightDelta =
      weights.length >= 2 ? weights[weights.length - 1] - weights[0] : 0;

    return {
      daysThis, daysLast, setsThis, setsLast, setsPerDay, streak, totalDays,
      weights, currentWeight, weightDelta,
      hasLogs: logs.length > 0,
      hasWeights: weights.length >= 2,
    };
  }, [logs, meas, stats]);

  if (loading) return <Skeleton />;

  const hour = new Date().getHours();
  const greeting = ar
    ? hour < 12
      ? 'صباح الخير يا بطل'
      : hour < 18
        ? 'يومك قوي يا بطل'
        : 'مساء القوة يا بطل'
    : hour < 12
      ? 'Good morning, champ'
      : hour < 18
        ? 'Strong day, champ'
        : 'Good evening, champ';

  // Gamification level from REAL all-time training days (skill: avoid static design)
  const level = useMemo(() => {
    const d = data.totalDays;
    if (d >= 80) return { name: ar ? 'أسطورة' : 'Legend', Icon: Trophy, next: null as number | null, progress: 100 };
    if (d >= 40) return { name: ar ? 'وحش' : 'Beast', Icon: Trophy, next: 80, progress: Math.round((d / 80) * 100) };
    if (d >= 20) return { name: ar ? 'ملتزم' : 'Committed', Icon: Medal, next: 40, progress: Math.round((d / 40) * 100) };
    if (d >= 8) return { name: ar ? 'منتظم' : 'Regular', Icon: Medal, next: 20, progress: Math.round((d / 20) * 100) };
    if (d >= 1) return { name: ar ? 'ناشئ' : 'Rookie', Icon: Medal, next: 8, progress: Math.round((d / 8) * 100) };
    return { name: ar ? 'البداية' : 'Start', Icon: Flag, next: 1, progress: 0 };
  }, [data.totalDays, ar]);

  const dateStr = new Date().toLocaleDateString(ar ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const dayLabels = ar
    ? ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
    : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const todayIdx = (new Date().getDay() + 1) % 7;

  const targets = stats ? calcTargets(stats) : null;
  const kcalPct = targets ? Math.min(100, ((nutri?.calories || 0) / targets.calories) * 100) : 0;

  const deltaChip = (cur: number, prev: number, suffix = '') => {
    const diff = cur - prev;
    if (diff > 0)
      return (
        <span className="inline-flex items-center gap-0.5 font-bold text-ironforge-primary">
          <TrendingUp className="w-3.5 h-3.5" />+{diff}
          {suffix}
        </span>
      );
    if (diff < 0)
      return (
        <span className="inline-flex items-center gap-0.5 font-bold text-orange-400">
          <TrendingDown className="w-3.5 h-3.5" />
          {diff}
          {suffix}
        </span>
      );
    return (
      <span className="inline-flex items-center gap-0.5 font-bold text-ironforge-text-muted">
        <Minus className="w-3.5 h-3.5" />0{suffix}
      </span>
    );
  };

  const kpis = [
    {
      label: ar ? 'وزن الجسم' : 'Body Weight',
      value: data.currentWeight ? `${data.currentWeight}` : '—',
      unit: data.currentWeight ? (ar ? 'كجم' : 'kg') : '',
      sub: data.hasWeights ? (
        deltaChip(Math.round(data.weightDelta * 10) / 10, 0, ar ? ' كجم' : ' kg')
      ) : (
        <span className="text-ironforge-text-muted">{ar ? 'سجّل وزنك' : 'Log your weight'}</span>
      ),
      subHint: data.hasWeights ? (ar ? 'من أول الميزان' : 'since first log') : '',
      icon: Scale,
      href: '/profile',
    },
    {
      label: ar ? 'تمارين الأسبوع' : 'Workouts This Week',
      value: `${data.daysThis}`,
      unit: ar ? 'أيام' : 'days',
      sub: deltaChip(data.daysThis, data.daysLast),
      subHint: ar ? 'عن الأسبوع الماضي' : 'vs last week',
      icon: Dumbbell,
      href: '/workout',
    },
    {
      label: ar ? 'مجموعات الأسبوع' : 'Sets This Week',
      value: `${data.setsThis}`,
      unit: ar ? 'مجموعة' : 'sets',
      sub: deltaChip(data.setsThis, data.setsLast),
      subHint: ar ? 'عن الأسبوع الماضي' : 'vs last week',
      icon: Layers,
      href: '/workout',
    },
    {
      label: ar ? 'سلسلة الالتزام' : 'Training Streak',
      value: `${data.streak}`,
      unit: ar ? 'أيام' : 'days',
      sub: (
        <span className="font-bold text-ironforge-primary">
          {data.streak > 0 ? (ar ? 'استمر!' : 'Keep it up!') : ar ? 'ابدأ النهاردة' : 'Start today'}
        </span>
      ),
      subHint: '',
      icon: Flame,
      href: '/workout',
    },
  ];

  const Arrow = isRTL ? ChevronLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
      <AuthGate />
      <SubscriptionGate />
      <div className="max-w-7xl mx-auto pb-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-ironforge-text truncate">
                {greeting}
              </h1>
              {data.streak > 0 && (
                <Badge className="shrink-0 bg-orange-500/15 text-orange-400 border-orange-500/30 tabular-nums">
                  <Flame className="w-3 h-3" /> {data.streak}
                </Badge>
              )}
            </div>
            <p className="text-ironforge-text-muted text-xs sm:text-sm">
              {dateStr} • {t('subtitle')}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/profile')}
            className="shrink-0 border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
          >
            <Settings className="w-4 h-4 ml-2" />
            {t('common.settings')}
          </Button>
        </div>

        {/* Level banner — real gamification (skill: avoid static design) */}
        <div className="mb-4 sm:mb-6 rounded-2xl border border-ironforge-primary/25 bg-gradient-to-l from-ironforge-primary/15 via-ironforge-card to-ironforge-card p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ironforge-primary shadow-[0_0_18px_rgba(163,230,53,0.35)]">
              <level.Icon className="h-5 w-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm sm:text-base font-extrabold text-ironforge-text">
                  {ar ? 'مستواك' : 'Your level'}: {level.name}
                </p>
                <p className="text-[11px] sm:text-xs text-ironforge-text-muted tabular-nums shrink-0">
                  {ar ? `${data.totalDays} أيام تمرين` : `${data.totalDays} training days`}
                </p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-ironforge-background overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ironforge-primary-dark to-ironforge-primary transition-all duration-300"
                  style={{ width: `${level.progress}%` }}
                />
              </div>
              {level.next && (
                <p className="mt-1.5 text-[11px] text-ironforge-text-muted">
                  {ar
                    ? `فاضل ${level.next - data.totalDays} أيام للمستوى الجاي`
                    : `${level.next - data.totalDays} days to next level`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* KPI grid — real numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <button
                key={i}
                onClick={() => router.push(kpi.href)}
                className="text-start cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-ironforge-primary"
              >
                <Card className="p-3.5 sm:p-5 border-ironforge-border bg-ironforge-card hover:border-ironforge-primary/40 active:scale-[0.98] transition-colors duration-200 h-full">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-ironforge-primary/15 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ironforge-primary" />
                    </div>
                    <span className="text-[11px] sm:text-xs text-ironforge-text-muted leading-tight">
                      {kpi.label}
                    </span>
                  </div>
                  <p className="text-xl sm:text-3xl font-extrabold tabular-nums text-ironforge-text">
                    {kpi.value}{' '}
                    <span className="text-xs sm:text-sm font-bold text-ironforge-text-muted">
                      {kpi.unit}
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs mt-1">
                    {kpi.sub}
                    {kpi.subHint && (
                      <span className="text-ironforge-text-muted truncate">{kpi.subHint}</span>
                    )}
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Weekly activity — real sets per day */}
        <Card className="p-4 sm:p-6 border-ironforge-border bg-ironforge-card mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-ironforge-text">
                {ar ? 'نشاط الأسبوع' : 'Weekly Activity'}
              </h2>
              <p className="text-[11px] sm:text-xs text-ironforge-text-muted tabular-nums">
                {ar
                  ? `${data.setsThis} مجموعة • ${data.daysThis} أيام تمرين`
                  : `${data.setsThis} sets • ${data.daysThis} training days`}
              </p>
            </div>
            <button
              onClick={() => router.push('/workout')}
              className="flex min-h-[44px] items-center gap-1 text-xs font-bold text-ironforge-primary cursor-pointer"
            >
              {ar ? 'التمارين' : 'Workouts'}
              <Arrow className="w-3.5 h-3.5" />
            </button>
          </div>
          {data.hasLogs ? (
            <>
              <div className="mt-3" dir={isRTL ? 'rtl' : 'ltr'}>
                <WeeklyBars values={data.setsPerDay} labels={dayLabels} todayIdx={todayIdx} />
              </div>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ironforge-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-ironforge-primary" />
                  {ar ? 'يوم تمرين (الرقم = المجموعات)' : 'Training day (number = sets)'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-ironforge-border" />
                  {ar ? 'راحة' : 'Rest'}
                </span>
              </p>
            </>
          ) : (
            <div className="mt-3 rounded-xl bg-ironforge-background p-5 text-center">
              <Dumbbell className="w-8 h-8 text-ironforge-primary mx-auto mb-2" />
              <p className="font-bold text-ironforge-text text-sm">
                {ar ? 'لسه مسجلتش أي تمرين' : 'No workouts logged yet'}
              </p>
              <p className="text-xs text-ironforge-text-muted mt-1 mb-3">
                {ar ? 'سجّل مجموعاتك في صفحة التمرين وهتظهر هنا' : 'Log your sets and they will appear here'}
              </p>
              <Button
                size="sm"
                onClick={() => router.push('/workout')}
                className="bg-ironforge-primary text-black font-bold"
              >
                {ar ? 'روح للتمرين' : 'Go to workout'}
              </Button>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Weight — real measurements */}
          <Card className="p-4 sm:p-6 border-ironforge-border bg-ironforge-card lg:col-span-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-ironforge-text">
                  {ar ? 'اتجاه الوزن' : 'Weight Trend'}
                </h2>
                <p className="text-[11px] sm:text-xs text-ironforge-text-muted tabular-nums">
                  {data.hasWeights
                    ? ar
                      ? `الحالي ${data.currentWeight} كجم`
                      : `Current ${data.currentWeight} kg`
                    : ar
                      ? 'من سجل الميزان بتاعك'
                      : 'From your scale log'}
                </p>
              </div>
              {data.hasWeights && (
                <Badge
                  variant="secondary"
                  className="border border-ironforge-primary/40 bg-ironforge-primary/10 text-ironforge-primary tabular-nums"
                >
                  {data.weightDelta <= 0 ? '' : '+'}
                  {Math.round(data.weightDelta * 10) / 10} {ar ? 'كجم' : 'kg'}
                </Badge>
              )}
            </div>
            {data.hasWeights ? (
              <div className="mt-3">
                <WeightLine points={data.weights} />
              </div>
            ) : (
              <div className="mt-3 rounded-xl bg-ironforge-background p-5 text-center">
                <Scale className="w-8 h-8 text-ironforge-primary mx-auto mb-2" />
                <p className="font-bold text-ironforge-text text-sm">
                  {ar ? 'اوزِن نفسك وسجّل أول قراءة' : 'Weigh in and log your first reading'}
                </p>
                <p className="text-xs text-ironforge-text-muted mt-1 mb-3">
                  {ar ? 'كل ما تسجّل وزنك هنرسملك منحنى التقدم هنا' : 'Every weigh-in draws your progress curve here'}
                </p>
                <Button
                  size="sm"
                  onClick={() => router.push('/profile')}
                  className="bg-ironforge-primary text-black font-bold"
                >
                  {ar ? 'سجّل وزنك' : 'Log weight'}
                </Button>
              </div>
            )}
          </Card>

          {/* Nutrition today — real logged intake vs real targets */}
          <Card className="p-4 sm:p-6 border-ironforge-border bg-ironforge-card lg:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base sm:text-lg font-extrabold text-ironforge-text">
                {t('nutritionGoals')}
              </h2>
              <button
                onClick={() => router.push('/nutrition')}
                className="flex min-h-[44px] items-center gap-1 text-xs font-bold text-ironforge-primary cursor-pointer"
              >
                {ar ? 'التغذية' : 'Nutrition'}
                <Arrow className="w-3.5 h-3.5" />
              </button>
            </div>
            {!targets ? (
              <div className="mt-3 rounded-xl bg-ironforge-background p-5 text-center">
                <UtensilsCrossed className="w-8 h-8 text-ironforge-primary mx-auto mb-2" />
                <p className="font-bold text-ironforge-text text-sm">
                  {ar ? 'كمّل بياناتك عشان نحسب هدفك' : 'Complete your stats to get targets'}
                </p>
                <Button
                  size="sm"
                  onClick={() => router.push('/nutrition')}
                  className="mt-3 bg-ironforge-primary text-black font-bold"
                >
                  {ar ? 'احسب هدفي' : 'Calculate'}
                </Button>
              </div>
            ) : (
              <>
                <p className="text-[11px] sm:text-xs text-ironforge-text-muted mb-4">
                  {ar ? 'أكل النهاردة من المسجّل' : "Today's logged food"}
                </p>
                <div className="flex justify-center mb-4">
                  <Ring
                    value={kcalPct}
                    label={`${Math.round(kcalPct)}%`}
                    sub={`${nutri?.calories || 0} / ${targets.calories}`}
                  />
                </div>
                <p className="text-center text-sm font-bold text-ironforge-text mb-4">
                  {t('calories')}
                </p>
                <div className="space-y-3">
                  {[
                    { label: t('protein'), cur: nutri?.protein || 0, tgt: targets.protein },
                    { label: t('nutrition.carbs'), cur: nutri?.carbs || 0, tgt: targets.carbs },
                    { label: ar ? 'الدهون' : 'Fats', cur: nutri?.fats || 0, tgt: targets.fats },
                  ].map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-ironforge-text font-bold">{m.label}</span>
                        <span className="text-ironforge-text-muted tabular-nums">
                          {m.cur}g / {m.tgt}g
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-ironforge-background overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-ironforge-primary-dark to-ironforge-primary"
                          style={{ width: `${Math.min(100, (m.cur / Math.max(1, m.tgt)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/nutrition')}
                  className="w-full mt-4 border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
                >
                  {ar ? 'سجّل وجبة' : 'Log Meal'}
                </Button>
              </>
            )}
          </Card>
        </div>

        {/* Today's workout */}
        <div className="mt-4 sm:mt-6">
          <TodayPlanCard />
        </div>

        {/* AI Coach banner */}
        <Card className="mt-4 sm:mt-6 p-5 sm:p-6 border-ironforge-primary/30 bg-gradient-to-l from-ironforge-primary/15 via-ironforge-card to-ironforge-card overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-ironforge-primary flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.4)] shrink-0">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-ironforge-text">
                  {t('aiCoach')}
                </h3>
                <p className="text-xs sm:text-sm text-ironforge-text-muted">
                  {ar ? 'اسأل مدربك الذكي أي سؤال' : 'Ask your AI coach anything'}
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/chat')}
              className="w-full sm:w-auto bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background font-bold"
            >
              {t('messageCoach')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
