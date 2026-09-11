'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
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
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import SubscriptionGate from '@/components/SubscriptionGate';
import AuthGate from '@/components/AuthGate';
import TodayPlanCard from '@/components/TodayPlanCard';

// ---------- Small SVG building blocks (same visual identity) ----------

function Ring({
  value,
  size = 132,
  stroke = 12,
  label,
  sub,
}: {
  value: number; // 0-100
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
        <span className="text-xl font-extrabold text-ironforge-text">{label}</span>
        <span className="text-[11px] text-ironforge-text-muted">{sub}</span>
      </div>
    </div>
  );
}

function WeeklyBars({
  values,
  labels,
  todayIdx,
  isRTL,
}: {
  values: number[];
  labels: string[];
  todayIdx: number;
  isRTL: boolean;
}) {
  const max = Math.max(...values, 1);
  // In RTL show Saturday first (right side = start)
  const order = isRTL ? values.map((_, i) => i) : values.map((_, i) => i);
  return (
    <div className="flex items-end justify-between gap-2" dir={isRTL ? 'rtl' : 'ltr'}>
      {order.map((i) => {
        const v = values[i];
        const isRest = v === 0;
        const isToday = i === todayIdx;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            <span className={`text-[11px] font-bold tabular-nums ${isRest ? 'text-ironforge-text-muted/50' : 'text-ironforge-text'}`}>
              {isRest ? '—' : v}
            </span>
            <div className="flex h-28 w-full items-end rounded-lg bg-ironforge-background p-1">
              <div
                className={`w-full rounded-md transition-all ${
                  isRest
                    ? 'bg-ironforge-border/60'
                    : 'bg-gradient-to-t from-ironforge-primary-dark to-ironforge-primary'
                } ${isToday ? 'ring-2 ring-ironforge-primary ring-offset-2 ring-offset-ironforge-card' : ''}`}
                style={{
                  height: isRest ? '8%' : `${Math.max(18, (v / max) * 100)}%`,
                  boxShadow: !isRest ? '0 0 12px rgba(163,230,53,0.35)' : undefined,
                }}
              />
            </div>
            <span className={`text-[11px] ${isToday ? 'font-extrabold text-ironforge-primary' : 'text-ironforge-text-muted'}`}>
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
  const pad = 12;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(0.5, max - min);
  const coords = points.map((p, i) => {
    const x = pad + (i * (w - pad * 2)) / (points.length - 1);
    const y = h - pad - ((p - min) / span) * (h - pad * 2);
    return { x, y, p };
  });
  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
  const area = `${line} L${coords[coords.length - 1].x},${h} L${coords[0].x},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3e635" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={pad} x2={w - pad} y1={h * f} y2={h * f} stroke="#262626" strokeDasharray="4 4" />
      ))}
      <path d={area} fill="url(#wfill)" />
      <path d={line} fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
      {coords.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r={i === coords.length - 1 ? 6 : 3.5} fill={i === coords.length - 1 ? '#a3e635' : '#0a0a0a'} stroke="#a3e635" strokeWidth="2" />
          {(i === 0 || i === coords.length - 1) && (
            <text x={c.x} y={c.y - 12} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#a1a1aa">
              {c.p}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

// ---------- Page ----------

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  const ar = isRTL;

  const [mounted, setMounted] = useState(false);
  const [weight, setWeight] = useState(75);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('atlas-stats') || localStorage.getItem('ironforge-stats');
      if (raw) {
        const s = JSON.parse(raw);
        const w = Number(s.weight_kg ?? s.weight ?? s.currentWeight);
        if (w > 0) setWeight(w);
      }
    } catch {}
  }, []);

  // Mock analytics — in real app this comes from API
  const weeklyMinutes = [45, 0, 60, 0, 50, 30, 0];
  const dayLabels = ar
    ? ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
    : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const todayIdx = (new Date().getDay() + 1) % 7; // Sat-first index
  const totalMin = weeklyMinutes.reduce((a, b) => a + b, 0);

  const weightHistory = [78.5, 78.1, 77.8, 77.4, 77.2, 76.9, 76.4, weight < 76.4 ? weight : 76.2];
  const weightDelta = (weightHistory[weightHistory.length - 1] - weightHistory[0]).toFixed(1);

  const macros = {
    calories: { current: 1850, target: 2500 },
    protein: { current: 120, target: 180 },
    carbs: { current: 200, target: 280 },
    fats: { current: 55, target: 75 },
  };

  const kpis = [
    {
      label: ar ? 'الوزن الحالي' : 'Current Weight',
      value: `${weight} kg`,
      delta: `${weightDelta} kg`,
      deltaHint: ar ? 'آخر 8 أسابيع' : 'last 8 weeks',
      icon: Scale,
      TrendIcon: Number(weightDelta) <= 0 ? TrendingDown : TrendingUp,
      good: true,
    },
    {
      label: ar ? 'دقائق التمرين' : 'Training Minutes',
      value: `${totalMin}`,
      delta: '+23%',
      deltaHint: ar ? 'عن الأسبوع الماضي' : 'vs last week',
      icon: Dumbbell,
      TrendIcon: TrendingUp,
      good: true,
    },
    {
      label: ar ? 'تمارين الأسبوع' : 'Workouts This Week',
      value: '4/5',
      delta: '+1',
      deltaHint: ar ? 'عن الماضي' : 'vs last',
      icon: Zap,
      TrendIcon: TrendingUp,
      good: true,
    },
    {
      label: ar ? 'سلسلة الالتزام' : 'Current Streak',
      value: ar ? '3 أيام' : '3 days',
      delta: ar ? 'استمر!' : 'Keep it up!',
      deltaHint: '',
      icon: Flame,
      TrendIcon: Minus,
      good: true,
    },
  ];

  const hour = mounted ? new Date().getHours() : 12;
  const greeting = ar
    ? hour < 12
      ? 'صباح الخير يا بطل 💪'
      : hour < 18
        ? 'يومك قوي يا بطل 💪'
        : 'مساء القوة يا بطل 💪'
    : hour < 12
      ? 'Good morning, champ 💪'
      : hour < 18
        ? 'Strong day, champ 💪'
        : 'Good evening, champ 💪';

  const dateStr = mounted
    ? new Date().toLocaleDateString(ar ? 'ar-EG' : 'en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : '';

  return (
    <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
      <AuthGate />
      <SubscriptionGate />
      <div className="max-w-7xl mx-auto">
        {/* Header — greeting + streak */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-ironforge-text">{greeting}</h1>
              <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/30 tabular-nums">
                <Flame className="w-3 h-3" /> 3
              </Badge>
            </div>
            <p className="text-ironforge-text-muted text-sm">
              {dateStr} • {t('subtitle')}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push('/profile')}
            className="border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
          >
            <Settings className="w-4 h-4 ml-2" />
            {t('common.settings')}
          </Button>
        </div>

        {/* KPI stats with deltas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            const Trend = kpi.TrendIcon;
            return (
              <Card
                key={index}
                className="p-4 md:p-5 border-ironforge-border bg-ironforge-card hover:border-ironforge-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-ironforge-primary/15 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-ironforge-primary" />
                  </div>
                  <span className="text-xs text-ironforge-text-muted">{kpi.label}</span>
                </div>
                <p className="text-2xl md:text-3xl font-extrabold tabular-nums text-ironforge-text mb-1">
                  {kpi.value}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="inline-flex items-center gap-0.5 font-bold text-ironforge-primary">
                    <Trend className="w-3.5 h-3.5" />
                    {kpi.delta}
                  </span>
                  {kpi.deltaHint && <span className="text-ironforge-text-muted">{kpi.deltaHint}</span>}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 mb-6">
          {/* Weekly activity */}
          <Card className="p-5 md:p-6 border-ironforge-border bg-ironforge-card lg:col-span-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-lg font-extrabold text-ironforge-text">
                  {ar ? 'نشاط الأسبوع' : 'Weekly Activity'}
                </h2>
                <p className="text-xs text-ironforge-text-muted">
                  {ar ? `الإجمالي ${totalMin} دقيقة` : `Total ${totalMin} min`}
                </p>
              </div>
              <Badge variant="secondary" className="border border-ironforge-primary/40 bg-ironforge-primary/10 text-ironforge-primary tabular-nums">
                {ar ? '4 تمارين' : '4 workouts'}
              </Badge>
            </div>
            <div className="mt-4">
              <WeeklyBars values={weeklyMinutes} labels={dayLabels} todayIdx={todayIdx} isRTL={isRTL} />
            </div>
            <p className="mt-3 text-xs text-ironforge-text-muted">
              {ar
                ? 'الأخضر = يوم تمرين • الرمادي = راحة • المحدد = النهاردة'
                : 'Green = training day • Gray = rest • Outlined = today'}
            </p>
          </Card>

          {/* Weight trend */}
          <Card className="p-5 md:p-6 border-ironforge-border bg-ironforge-card lg:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-lg font-extrabold text-ironforge-text">
                  {ar ? 'اتجاه الوزن' : 'Weight Trend'}
                </h2>
                <p className="text-xs text-ironforge-text-muted">{ar ? 'آخر 8 أسابيع' : 'Last 8 weeks'}</p>
              </div>
              <Badge variant="secondary" className="border border-ironforge-primary/40 bg-ironforge-primary/10 text-ironforge-primary tabular-nums">
                {weightDelta} kg
              </Badge>
            </div>
            <div className="mt-4">
              <WeightLine points={weightHistory} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Macro rings */}
          <Card className="p-5 md:p-6 border-ironforge-border bg-ironforge-card lg:col-span-2">
            <h2 className="text-lg font-extrabold text-ironforge-text mb-1">{t('nutritionGoals')}</h2>
            <p className="text-xs text-ironforge-text-muted mb-5">
              {ar ? 'أهداف اليوم' : "Today's Goals"}
            </p>
            <div className="flex justify-center mb-5">
              <Ring
                value={(macros.calories.current / macros.calories.target) * 100}
                label={`${Math.round((macros.calories.current / macros.calories.target) * 100)}%`}
                sub={`${macros.calories.current} / ${macros.calories.target}`}
              />
            </div>
            <p className="text-center text-sm font-bold text-ironforge-text mb-5">{t('calories')}</p>
            <div className="space-y-3">
              {[
                { label: t('protein'), ...macros.protein, unit: 'g' },
                { label: t('nutrition.carbs'), ...macros.carbs, unit: 'g' },
                { label: ar ? 'الدهون' : 'Fats', ...macros.fats, unit: 'g' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-ironforge-text font-bold">{m.label}</span>
                    <span className="text-ironforge-text-muted tabular-nums">
                      {m.current}
                      {m.unit} / {m.target}
                      {m.unit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-ironforge-background overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-ironforge-primary-dark to-ironforge-primary"
                      style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/nutrition')}
              className="w-full mt-5 border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
            >
              {ar ? 'تسجيل وجبة' : 'Log Meal'}
              <ArrowRight className={`w-4 h-4 ml-2 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
          </Card>

          {/* Today's workout — follows pinned system */}
          <div className="lg:col-span-3">
            <TodayPlanCard />
          </div>
        </div>

        {/* AI Coach banner */}
        <Card className="mt-6 p-6 border-ironforge-primary/30 bg-gradient-to-l from-ironforge-primary/15 via-ironforge-card to-ironforge-card overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-ironforge-primary flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                <MessageSquare className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-ironforge-text">{t('aiCoach')}</h3>
                <p className="text-sm text-ironforge-text-muted">
                  {ar ? 'اسأل مدربك الذكي أي سؤال' : 'Ask your AI coach anything'}
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/chat')}
              className="bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background font-bold"
            >
              {t('messageCoach')}
              <ArrowRight className={`w-4 h-4 ml-2 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
