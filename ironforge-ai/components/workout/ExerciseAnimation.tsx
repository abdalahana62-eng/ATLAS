'use client';

import * as React from 'react';
import { Play, Pause, RotateCcw, Eye, Repeat, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type AnimationType = 'benchPress' | 'inclinePress' | 'cableFly' | 'overheadPress' | 'tricepPushdown' | 'squat' | 'default';

export interface ExerciseAnimationProps {
  exerciseId?: string;
  exerciseNameEn?: string;
  exerciseNameAr?: string;
  targetMuscleEn?: string;
  targetMuscleAr?: string;
  type?: AnimationType;
  autoPlay?: boolean;
  className?: string;
  videoUrl?: string;
}

type ViewAngle = 'side' | 'front';

const GIF_MAP: Record<AnimationType, { side: string; front: string }> = {
  benchPress: {
    side: 'https://gymvisual.com/img/p/1/0/7/6/3/10763.gif',
    front: 'https://gymvisual.com/img/p/1/0/7/6/3/10763.gif',
  },
  inclinePress: {
    side: 'https://gymvisual.com/img/p/1/0/7/7/1/10771.gif',
    front: 'https://gymvisual.com/img/p/1/0/7/7/1/10771.gif',
  },
  cableFly: {
    side: 'https://gymvisual.com/img/p/1/0/8/0/0/10800.gif',
    front: 'https://gymvisual.com/img/p/1/0/8/0/0/10800.gif',
  },
  overheadPress: {
    side: 'https://gymvisual.com/img/p/1/0/7/9/1/10791.gif',
    front: 'https://gymvisual.com/img/p/1/0/7/9/1/10791.gif',
  },
  tricepPushdown: {
    side: 'https://gymvisual.com/img/p/1/0/8/2/6/10826.gif',
    front: 'https://gymvisual.com/img/p/1/0/8/2/6/10826.gif',
  },
  squat: {
    side: 'https://gymvisual.com/img/p/1/0/6/8/9/10689.gif',
    front: 'https://gymvisual.com/img/p/1/0/6/8/9/10689.gif',
  },
  default: {
    side: 'https://gymvisual.com/img/p/1/0/7/6/3/10763.gif',
    front: 'https://gymvisual.com/img/p/1/0/7/6/3/10763.gif',
  },
};

const MUSCLE_META: Record<AnimationType, { color: string; labelEn: string; labelAr: string; cueEn: string; cueAr: string }> = {
  benchPress: { color: '#ff6467', labelEn: 'Chest • Anterior Delt', labelAr: 'صدر • كتف أمامي', cueEn: 'Elbows 45° • Bar to mid-chest • Feet planted', cueAr: 'مرفق 45° • البار لمنتصف الصدر • أقدام ثابتة' },
  inclinePress: { color: '#ff6467', labelEn: 'Upper Chest • Front Delt', labelAr: 'صدر علوي • كتف أمامي', cueEn: 'Bench 30-45° • Dumbbells to chest line • Control eccentric', cueAr: 'بنش 30-45° • دمبلز لخط الصدر • تحكم في النزول' },
  cableFly: { color: '#ff6467', labelEn: 'Pectoralis Major', labelAr: 'العضلة الصدرية الكبرى', cueEn: 'Slight elbow bend • Squeeze at midline • No shoulder shrug', cueAr: 'انثناء خفيف للمرفق • اضغط في المنتصف • لا ترفع الكتف' },
  overheadPress: { color: '#4ecdc4', labelEn: 'Anterior Delt • Triceps', labelAr: 'كتف أمامي • تراي', cueEn: 'Core braced • Bar over mid-foot • Full lockout', cueAr: 'جذع مشدود • البار فوق منتصف القدم • قفل كامل' },
  tricepPushdown: { color: '#45b7d1', labelEn: 'Triceps (all 3 heads)', labelAr: 'ترايسيبس (3 رؤوس)', cueEn: 'Elbows pinned • Only forearm moves • Squeeze 1s', cueAr: 'مرفق ثابت • الساعد فقط يتحرك • اضغط ثانية' },
  squat: { color: '#f7d794', labelEn: 'Quads • Glutes', labelAr: 'أمامية • جلوتس', cueEn: 'Knees over toes • Hips back • Chest up', cueAr: 'ركبة فوق أصابع • حوض للخلف • صدر مرفوع' },
  default: { color: '#a3e635', labelEn: 'Target Muscle', labelAr: 'العضلة المستهدفة', cueEn: 'Controlled tempo 2-1-1', cueAr: 'إيقاع متحكم 2-1-1' },
};

function getAnimationType(nameEn: string = '', id?: string): AnimationType {
  const n = nameEn.toLowerCase();
  if (n.includes('bench press')) return 'benchPress';
  if (n.includes('incline') && n.includes('press')) return 'inclinePress';
  if (n.includes('cable') || n.includes('fly')) return 'cableFly';
  if (n.includes('overhead') || n.includes('shoulder press')) return 'overheadPress';
  if (n.includes('tricep') || n.includes('pushdown')) return 'tricepPushdown';
  if (n.includes('squat')) return 'squat';
  if (id === '1') return 'benchPress';
  if (id === '2') return 'inclinePress';
  if (id === '3') return 'cableFly';
  if (id === '4') return 'overheadPress';
  if (id === '5') return 'tricepPushdown';
  return 'default';
}

export function ExerciseAnimation({
  exerciseId,
  exerciseNameEn = '',
  exerciseNameAr,
  targetMuscleEn,
  type,
  autoPlay = true,
  className,
  videoUrl,
}: ExerciseAnimationProps) {
  const [isPlaying, setIsPlaying] = React.useState(autoPlay);
  const [view, setView] = React.useState<ViewAngle>('side');
  const [repCount, setRepCount] = React.useState(0);
  const [phase, setPhase] = React.useState<'eccentric' | 'concentric'>('eccentric');
  const [imgError, setImgError] = React.useState(false);
  const [speed, setSpeed] = React.useState<0.5 | 1 | 1.5>(1);

  const animationType = type || getAnimationType(exerciseNameEn, exerciseId);
  const meta = MUSCLE_META[animationType];
  const gifSrc = view === 'side' ? GIF_MAP[animationType].side : GIF_MAP[animationType].front;

  // rep + phase timer
  React.useEffect(() => {
    if (!isPlaying) return;
    const base = 1800 / speed;
    const half = base / 2;
    let p: NodeJS.Timeout;
    let r: NodeJS.Timeout;
    const tickPhase = () => {
      setPhase((prev) => (prev === 'eccentric' ? 'concentric' : 'eccentric'));
      p = setTimeout(tickPhase, half);
    };
    p = setTimeout(tickPhase, half);
    r = setInterval(() => setRepCount((c) => c + 1), base);
    return () => {
      clearTimeout(p);
      clearInterval(r);
    };
  }, [isPlaying, speed]);

  return (
    <div className={cn('relative w-full overflow-hidden rounded-2xl border border-ironforge-border bg-[#0a0e14]', className)}>
      <style>{`
        @keyframes phase-bar { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(163,230,53,0.0); } 50% { box-shadow: 0 0 20px 4px rgba(163,230,53,0.35); } }
      `}</style>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-2 p-3 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-ironforge-primary px-2.5 py-1 text-[10px] font-black tracking-widest text-black">HUMAN MOTION</span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur" style={{ background: `${meta.color}18`, borderColor: `${meta.color}40`, color: meta.color }}>
            <span className="h-2 w-2 rounded-full" style={{ background: meta.color }} />
            {meta.labelEn}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="hidden md:flex items-center rounded-full bg-black/40 backdrop-blur border border-white/10 p-1">
            <button onClick={() => setView('side')} className={cn('rounded-full px-3 py-1 text-xs font-medium transition', view === 'side' ? 'bg-white text-black' : 'text-white/70 hover:text-white')}>Side</button>
            <button onClick={() => setView('front')} className={cn('rounded-full px-3 py-1 text-xs font-medium transition', view === 'front' ? 'bg-white text-black' : 'text-white/70 hover:text-white')}>Front</button>
          </div>
          <button onClick={() => setIsPlaying((v) => !v)} className="flex h-9 w-9 items-center justify-center rounded-full bg-ironforge-primary text-black hover:bg-ironforge-primary-dark transition">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button onClick={() => setRepCount(0)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/15">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative bg-gradient-to-b from-[#0f1623] via-[#0a0e14] to-[#0a0e14]">
        <div className="flex h-[380px] md:h-[440px] items-center justify-center p-4 pt-12">
          {/* Human GIF */}
          <div className="relative h-full w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/5 bg-white">
            {videoUrl ? (
              <video
                key={videoUrl}
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="h-full w-full object-contain bg-black"
                onVolumeChange={(e) => { (e.target as HTMLVideoElement).muted = true; (e.target as HTMLVideoElement).volume = 0; }}
              />
            ) : !imgError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`${animationType}-${view}`}
                src={gifSrc}
                alt={exerciseNameEn || 'exercise'}
                onError={() => setImgError(true)}
                className={cn('h-full w-full object-contain bg-white', !isPlaying && 'opacity-60 grayscale-[0.2]')}
                loading="eager"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1a1f2e] to-[#0a0e14] p-6 text-center">
                <div className="mb-3 rounded-full bg-ironforge-primary/20 p-4">
                  <Repeat className="h-10 w-10 text-ironforge-primary animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <p className="text-sm font-bold text-white">Human motion loading…</p>
                <p className="mt-1 text-xs text-white/50">If GIF blocked, check your network • fallback SVG active</p>
                <div className="mt-4 h-2 w-32 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-ironforge-primary" />
                </div>
              </div>
            )}

            {/* Pause overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 grid place-items-center bg-black/40">
                <div className="rounded-full bg-white p-4 shadow-xl">
                  <Play className="h-8 w-8 text-black ml-1" />
                </div>
              </div>
            )}

            {/* Muscle highlight overlay – subtle glow corners */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: `inset 0 0 0 1px ${meta.color}30, inset 0 0 60px ${meta.color}12` }} />

            {/* Bar path guide (SVG overlay) */}
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full opacity-40">
              {animationType === 'benchPress' && <path d="M 30 35 L 70 35 L 70 62 L 30 62" stroke={meta.color} strokeWidth="0.6" strokeDasharray="2 2" fill="none" />}
              {animationType === 'squat' && <path d="M 50 30 L 50 70" stroke={meta.color} strokeWidth="0.6" strokeDasharray="2 2" fill="none" />}
              {animationType === 'overheadPress' && <path d="M 50 35 L 50 12" stroke={meta.color} strokeWidth="0.6" strokeDasharray="2 2" fill="none" />}
            </svg>

            {/* Mobile view toggle */}
            <div className="absolute bottom-2 left-2 flex md:hidden items-center rounded-full bg-black/60 backdrop-blur border border-white/10 p-1">
              <button onClick={() => setView('side')} className={cn('rounded-full px-2.5 py-1 text-[11px] font-medium', view === 'side' ? 'bg-white text-black' : 'text-white/70')}>Side</button>
              <button onClick={() => setView('front')} className={cn('rounded-full px-2.5 py-1 text-[11px] font-medium', view === 'front' ? 'bg-white text-black' : 'text-white/70')}>Front</button>
            </div>

            {/* Speed */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur border border-white/10 px-1 py-1">
              {([0.5, 1, 1.5] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={cn('rounded-full px-2 py-1 text-[11px] font-bold', speed === s ? 'bg-ironforge-primary text-black' : 'text-white/70')}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phase bar */}
        <div className="px-4 pb-3">
          <div className="overflow-hidden rounded-full bg-white/10 p-1">
            <div className="grid grid-cols-2 gap-1">
              <div className={cn('flex items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-bold transition-all', phase === 'eccentric' ? 'bg-white text-black' : 'text-white/50')}>
                <span className={cn('h-2 w-2 rounded-full', phase === 'eccentric' ? 'bg-red-500 animate-pulse' : 'bg-white/20')} />
                ⬇ Eccentric 2s
              </div>
              <div className={cn('flex items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-bold transition-all', phase === 'concentric' ? 'bg-ironforge-primary text-black' : 'text-white/50')}>
                <span className={cn('h-2 w-2 rounded-full', phase === 'concentric' ? 'bg-black animate-pulse' : 'bg-white/20')} />
                ⬆ Concentric 1s
              </div>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-black/40">
              <div
                key={`${phase}-${speed}`}
                className="h-full origin-left rounded-full"
                style={{
                  background: phase === 'eccentric' ? '#fff' : '#a3e635',
                  animation: `phase-bar ${900 / speed}ms linear forwards`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cues */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/5 bg-black/30 p-3">
        <div className="col-span-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ironforge-primary">
            <Zap className="h-3 w-3" /> Form Cue
          </div>
          <p className="mt-1 text-xs leading-relaxed text-ironforge-text">{meta.cueEn}</p>
          <p className="text-[11px] text-ironforge-text-muted">{meta.cueAr}</p>
        </div>
        <div className="flex flex-col items-end justify-center gap-1 rounded-xl border border-white/5 bg-white/[0.03] p-2 text-center">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/50">
            <Repeat className="h-3 w-3" /> Reps
          </div>
          <div className="text-2xl font-black text-ironforge-primary leading-none">{repCount}</div>
          <div className="flex items-center gap-1 text-[10px] text-white/50">
            <Eye className="h-3 w-3" /> {view === 'side' ? 'Side view' : 'Front view'}
          </div>
        </div>
      </div>

      {/* Footer meta */}
      <div className="flex items-center justify-between border-t border-white/5 bg-[#05070b] px-3 py-2">
        <span className="text-[10px] uppercase tracking-widest text-white/40">Tempo 2-1-1 • Full ROM</span>
        <span className="text-[10px] font-medium text-white/60 truncate ml-2">{exerciseNameEn || 'Exercise Demo'}</span>
      </div>
    </div>
  );
}
