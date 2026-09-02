'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { 
  Dumbbell, 
  Clock, 
  Target, 
  CheckCircle, 
  Play, 
  Pause, 
  SkipForward,
  Info,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { ExerciseAnimation } from '@/components/workout/ExerciseAnimation';

type ExerciseState = 'pending' | 'inProgress' | 'completed' | 'skipped';

interface WorkoutExercise {
  id: string;
  name_en: string;
  name_ar: string;
  targetMuscle_en: string;
  targetMuscle_ar: string;
  equipment_en: string;
  equipment_ar: string;
  sets: number;
  reps: string;
  restSeconds: number;
  formTips_en: string[];
  formTips_ar: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'mp4' | 'webm';
}

export default function WorkoutPage() {
  const t = useTranslations('workout');
  const pathname = usePathname();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Mock workout data - in real app this would come from API
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseStates, setExerciseStates] = useState<Record<string, ExerciseState>>({});
  const [showFormTips, setShowFormTips] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [videoList, setVideoList] = useState<Array<{id:string;name_en:string;name_ar:string;muscle_en:string;muscle_ar:string;videoUrl:string}>>([]);
  const [systems, setSystems] = useState<Record<string, { name_ar: string; name_en: string; days: Array<{name: string; name_en: string; name_ar: string; exercises: Array<{name_en: string; name_ar: string; muscle_en: string; muscle_ar: string; videoUrl: string; file: string}>}> }>>({});
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showFiveDaysChoice, setShowFiveDaysChoice] = useState(false);

  useEffect(() => {
    fetch('/videos/videos.json')
      .then(r => r.json())
      .then(data => setVideoList(data))
      .catch(err => console.error('Failed to load videos', err));
  }, []);

  useEffect(() => {
    fetch('/workout-systems.json')
      .then(r => r.json())
      .then(data => setSystems(data))
      .catch(err => console.error('Failed to load systems', err));
  }, []);

  const selectedSystemData = selectedSystem ? systems[selectedSystem] : null;
  const selectedDayData = selectedSystemData && selectedDay !== null ? selectedSystemData.days[selectedDay] : null;

  const reorderedExercises = selectedDayData ? [...selectedDayData.exercises.slice(2), ...selectedDayData.exercises.slice(0, 2)] : [];
  const workoutPlan: WorkoutExercise[] = selectedDayData
    ? reorderedExercises.map((ex, i) => ({
        id: `${selectedSystem}-${selectedDay}-${i}`,
        name_en: ex.name_en,
        name_ar: ex.name_ar,
        targetMuscle_en: ex.muscle_en,
        targetMuscle_ar: ex.muscle_ar,
        equipment_en: 'Bodyweight',
        equipment_ar: 'بدون معدات',
        sets: 3,
        reps: '10-12',
        restSeconds: 120,
        formTips_en: ['Maintain proper form', 'Control the movement'],
        formTips_ar: ['حافظ على الشكل الصحيح', 'تحكم في الحركة'],
        difficulty: 'beginner',
        imageUrl: '',
        videoUrl: ex.videoUrl,
        videoType: 'mp4',
      }))
    : videoList.length > 0
    ? videoList.slice(0, 5).map((v, i) => ({
        id: v.id || String(i + 1),
        name_en: (v as any).name_en || (v as any).name,
        name_ar: (v as any).name_ar || (v as any).name,
        targetMuscle_en: (v as any).muscle_en || (v as any).muscle,
        targetMuscle_ar: (v as any).muscle_ar || (v as any).muscle,
        equipment_en: 'Bodyweight',
        equipment_ar: 'بدون معدات',
        sets: 3,
        reps: '10-12',
        restSeconds: 120,
        formTips_en: ['Maintain proper form', 'Control the movement'],
        formTips_ar: ['حافظ على الشكل الصحيح', 'تحكم في الحركة'],
        difficulty: 'beginner',
        imageUrl: '',
        videoUrl: v.videoUrl,
        videoType: 'mp4',
      }))
    : [
        {
          id: '1',
          name_en: 'Barbell Bench Press',
          name_ar: 'ضغط البنش بالقضيب',
          targetMuscle_en: 'Chest',
          targetMuscle_ar: 'الصدر',
          equipment_en: 'Barbell',
          equipment_ar: 'قضيب',
          sets: 4,
          reps: '8-12',
          restSeconds: 90,
          formTips_en: [
            'Keep feet flat on the floor',
            'Lower bar to mid-chest',
            'Keep elbows at 45-degree angle',
            'Press up to full arm extension'
          ],
          formTips_ar: [
            'أبقِ قدميك مسطحتين على الأرض',
            'أنزل القضيب إلى منتصف الصدر',
            'حافظ على المرفقين بزاوية 45 درجة',
            'اضغط لأعلى حتى تمديد الذراع بالكامل'
          ],
          difficulty: 'intermediate',
          imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/4Y2CIHVnA9k',
          videoType: 'youtube'
        },
        {
          id: '2',
          name_en: 'Incline Dumbbell Press',
          name_ar: 'ضرب الدمبلز المائل',
          targetMuscle_en: 'Upper Chest',
          targetMuscle_ar: 'الصدر العلوي',
          equipment_en: 'Dumbbells',
          equipment_ar: 'دمبلز',
          sets: 3,
          reps: '10-12',
          restSeconds: 60,
          formTips_en: [
            'Set bench to 30-45 degree angle',
            'Lower dumbbells to shoulder level',
            'Control the negative portion',
            'Squeeze chest at the top'
          ],
          formTips_ar: [
            'اضبط البنش بزاوية 30-45 درجة',
            'أنزل الدمبلز إلى مستوى الكتف',
            'تحكم في الجزء السلبي',
            'اضغط على الصدر في الأعلى'
          ],
          difficulty: 'intermediate',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8',
          videoType: 'youtube'
        },
        {
          id: '3',
          name_en: 'Cable Flyes',
          name_ar: 'تقاطع الكابلات',
          targetMuscle_en: 'Chest',
          targetMuscle_ar: 'الصدر',
          equipment_en: 'Cable Machine',
          equipment_ar: 'آلة الكابلات',
          sets: 3,
          reps: '12-15',
          restSeconds: 45,
          formTips_en: [
            'Keep slight bend in elbows',
            'Bring hands together in front',
            'Focus on chest contraction',
            'Control the return movement'
          ],
          formTips_ar: [
            'احتفظ بانحناء طفيف في المرفقين',
            'اجمع اليدين في الأمام',
            'ركز على انقباض الصدر',
            'تحكم في حركة العودة'
          ],
          difficulty: 'beginner',
          imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/f8FqVIp-XpA',
          videoType: 'youtube'
        },
        {
          id: '4',
          name_en: 'Overhead Press',
          name_ar: 'الضغط فوق الرأس',
          targetMuscle_en: 'Shoulders',
          targetMuscle_ar: 'الكتف',
          equipment_en: 'Barbell',
          equipment_ar: 'قضيب',
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          formTips_en: [
            'Start with bar at shoulder height',
            'Press directly overhead',
            'Keep core tight throughout',
            'Lower under control'
          ],
          formTips_ar: [
            'ابدأ بالقضيب على ارتفاع الكتف',
            'اضغط مباشرة فوق الرأس',
            'حافظ على جوهرك مشدوداً طوال الوقت',
            'أنزل تحت السيطرة'
          ],
          difficulty: 'intermediate',
          imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDo',
          videoType: 'youtube'
        },
        {
          id: '5',
          name_en: 'Tricep Pushdowns',
          name_ar: 'تمرين الضغط للأسفل للعضلة ثلاثية',
          targetMuscle_en: 'Triceps',
          targetMuscle_ar: 'العضلة ثلاثية الرأس',
          equipment_en: 'Cable Machine',
          equipment_ar: 'آلة الكابلات',
          sets: 3,
          reps: '12-15',
          restSeconds: 45,
          formTips_en: [
            'Keep elbows pinned to sides',
            'Push down until arms are fully extended',
            'Squeeze triceps at bottom',
            'Control the return'
          ],
          formTips_ar: [
            'أبقِ المرفقين مثبتين على الجانبين',
            'ادفع للأسفل حتى تمديد الذراعين بالكامل',
            'اضغط على العضلة ثلاثية في الأسفل',
            'تحكم في العودة'
          ],
          difficulty: 'beginner',
          imageUrl: 'https://images.unsplash.com/photo-1598971639058-211a74a96aea?w=400&h=300&fit=crop',
          videoUrl: 'https://www.youtube.com/embed/anrDZ5NKYbA',
          videoType: 'youtube'
        }
      ];

  const currentExercise = workoutPlan[currentExerciseIndex];
  const currentExerciseState = exerciseStates[currentExercise.id] || 'pending';
  const completedExercises = Object.values(exerciseStates).filter(state => state === 'completed').length;
  const totalExercises = workoutPlan.length;
  const workoutProgress = (completedExercises / totalExercises) * 100;

  const handleExerciseComplete = () => {
    setExerciseStates(prev => ({
      ...prev,
      [currentExercise.id]: 'completed'
    }));
    
    if (currentExerciseIndex < workoutPlan.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handleExerciseSkip = () => {
    setExerciseStates(prev => ({
      ...prev,
      [currentExercise.id]: 'skipped'
    }));
    
    if (currentExerciseIndex < workoutPlan.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'intermediate':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'advanced':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      default:
        return 'bg-ironforge-card text-ironforge-text border-ironforge-border';
    }
  };

  if (!selectedSystem && !showFiveDaysChoice) {
    return (
      <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-ironforge-text mb-2">
              {locale === 'ar' ? 'كم يوم تتمرن في الأسبوع؟' : 'How many days per week will you train?'}
            </h1>
            <p className="text-ironforge-text-muted">
              {locale === 'ar' ? 'اختر النظام المناسب لك' : 'Choose the system that fits you'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: '2days', label_ar: 'يومين في الأسبوع', label_en: '2 Days / Week' },
              { key: '3days', label_ar: '3 أيام في الأسبوع', label_en: '3 Days / Week' },
              { key: '4days', label_ar: '4 أيام في الأسبوع', label_en: '4 Days / Week' },
              { key: '5days', label_ar: '5 أيام في الأسبوع', label_en: '5 Days / Week' },
              { key: 'home', label_ar: 'التمرين في المنزل (4 أيام)', label_en: 'Home Workout (4 Days)' },
            ].map((opt) => {
              const sys = systems[opt.key];
              const count = sys ? sys.days.length : 0;
              return (
                <Card key={opt.key} onClick={() => { if (opt.key === '5days') setShowFiveDaysChoice(true); else setSelectedSystem(opt.key); }} className="p-6 border-ironforge-border bg-ironforge-card hover:border-ironforge-primary cursor-pointer transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-ironforge-primary/20 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-ironforge-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ironforge-text">{locale === 'ar' ? opt.label_ar : opt.label_en}</h3>
                      <p className="text-sm text-ironforge-text-muted">{count} {locale === 'ar' ? 'أيام' : 'days'} {sys ? `• ${sys.days.reduce((a,d)=>a+d.exercises.length,0)} ${locale === 'ar' ? 'تمرين' : 'exercises'}` : ''}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (showFiveDaysChoice) {
    return (
      <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" onClick={() => setShowFiveDaysChoice(false)} className="border-ironforge-border text-ironforge-text">
              {locale === 'ar' ? 'رجوع' : 'Back'}
            </Button>
            <h1 className="text-2xl font-bold text-ironforge-text">{locale === 'ar' ? 'هل تريد تمرين العضلة مرة أو مرتين في الأسبوع؟' : 'Train each muscle once or twice per week?'}</h1>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Card onClick={() => { setSelectedSystem('5days'); setShowFiveDaysChoice(false); }} className="p-6 border-ironforge-border bg-ironforge-card hover:border-ironforge-primary cursor-pointer transition">
              <h3 className="font-bold text-ironforge-text text-lg">{locale === 'ar' ? 'مرة واحدة في الأسبوع' : 'Once per week'}</h3>
              <p className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'كل عضلة مرة واحدة — 5 أيام (كما أنشأتها)' : 'Each muscle once — 5 days as you created'}</p>
              <p className="text-xs text-ironforge-text-muted mt-2">{systems['5days'] ? `${systems['5days'].days.length} أيام • ${systems['5days'].days.reduce((a,d)=>a+d.exercises.length,0)} تمارين` : ''}</p>
            </Card>
            <Card onClick={() => { setSelectedSystem('5days_double'); setShowFiveDaysChoice(false); }} className="p-6 border-ironforge-border bg-ironforge-card hover:border-ironforge-primary cursor-pointer transition">
              <h3 className="font-bold text-ironforge-text text-lg">{locale === 'ar' ? 'مرتين في الأسبوع (عضلتين في اليوم)' : 'Twice per week (2 muscles / day)'}</h3>
              <p className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'كل عضلة مرتين — عضلتين في اليوم (الفولدر الداخلي)' : 'Each muscle twice — 2 muscles per day (inner folder)'}</p>
              <p className="text-xs text-ironforge-text-muted mt-2">{systems['5days_double'] ? `${systems['5days_double'].days.length} أيام • ${systems['5days_double'].days.reduce((a,d)=>a+d.exercises.length,0)} تمارين` : ''}</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (selectedDay === null) {
    const sys = systems[selectedSystem!];
    if (!sys) return null;
    return (
      <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" onClick={() => {
              if (selectedSystem === '5days' || selectedSystem === '5days_double') {
                setSelectedSystem(null);
                setShowFiveDaysChoice(true);
              } else {
                setSelectedSystem(null);
              }
            }} className="border-ironforge-border text-ironforge-text">
              {locale === 'ar' ? 'رجوع' : 'Back'}
            </Button>
            <h1 className="text-2xl font-bold text-ironforge-text">{locale === 'ar' ? sys.name_ar : sys.name_en} — {sys.days.length} {locale === 'ar' ? 'أيام' : 'days'}</h1>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sys.days.map((day, idx) => (
              <Card key={idx} onClick={() => { setSelectedDay(idx); setCurrentExerciseIndex(0); setExerciseStates({}); }} className="p-6 border-ironforge-border bg-ironforge-card hover:border-ironforge-primary cursor-pointer transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-ironforge-text text-lg">{locale === 'ar' ? day.name_ar : day.name_en}</h3>
                    <p className="text-sm text-ironforge-text-muted">{day.exercises.length} {locale === 'ar' ? 'تمارين' : 'exercises'}</p>
                  </div>
                  <Badge variant="outline" className="border-ironforge-primary text-ironforge-primary">{locale === 'ar' ? 'ابدأ' : 'Start'}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {day.exercises.slice(0,4).map((ex, i) => (
                    <div key={i} className="rounded overflow-hidden bg-black">
                      <video src={ex.videoUrl} muted loop playsInline preload="metadata" disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" className="w-full h-20 object-cover" onVolumeChange={(e) => { (e.target as HTMLVideoElement).muted = true; }} />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isWorkoutActive) {
    const sys = systems[selectedSystem!];
    const day = sys.days[selectedDay!];
    return (
      <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" onClick={() => setSelectedDay(null)} className="border-ironforge-border text-ironforge-text">
              {locale === 'ar' ? 'رجوع' : 'Back'}
            </Button>
            <h1 className="text-2xl font-bold text-ironforge-text">{locale === 'ar' ? day.name_ar : day.name_en}</h1>
          </div>
          <Card className="p-8 border-ironforge-border bg-ironforge-card mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-ironforge-primary/20 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-ironforge-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ironforge-text">{locale === 'ar' ? day.name_ar : day.name_en}</h2>
                <p className="text-ironforge-text-muted">{day.exercises.length} {locale === 'ar' ? 'تمارين' : 'exercises'} • {locale === 'ar' ? 'خطة كما أنشأتها' : 'As you created'}</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {workoutPlan.map((exercise, index) => (
                <div key={exercise.id} className="flex items-center justify-between p-4 rounded-lg bg-ironforge-background border border-ironforge-border">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-ironforge-primary/20 flex items-center justify-center text-ironforge-primary font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-ironforge-text">{locale === 'ar' ? exercise.name_ar : exercise.name_en}</p>
                      <p className="text-sm text-ironforge-text-muted">{exercise.sets} × {exercise.reps}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <video src={exercise.videoUrl} muted loop playsInline preload="metadata" disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" className="w-16 h-12 rounded object-cover bg-black" onVolumeChange={(e) => { (e.target as HTMLVideoElement).muted = true; }} />
                    <Badge variant="outline" className="border-ironforge-border text-ironforge-text-muted">
                      {locale === 'ar' ? exercise.targetMuscle_ar : exercise.targetMuscle_en}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={startWorkout} className="w-full bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background">
              <Play className="w-5 h-5 ml-2" />
              {t('start')}
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-ironforge-text mb-1">
              {t('title')}
            </h1>
            <p className="text-ironforge-text-muted text-sm">
              {locale === 'ar' ? 'التمرين' : 'Exercise'} {currentExerciseIndex + 1} / {totalExercises}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="primary" className="bg-ironforge-primary/15 text-ironforge-primary border-ironforge-primary/30">
              <Clock className="w-3 h-3 ml-1" />
              {formatTime(workoutTimer)}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={workoutProgress} variant="primary" size="md" showLabel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exercise Image and Info */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-ironforge-border bg-ironforge-card">
              <ExerciseAnimation
                key={currentExercise.id}
                exerciseId={currentExercise.id}
                exerciseNameEn={currentExercise.name_en}
                exerciseNameAr={currentExercise.name_ar}
                targetMuscleEn={currentExercise.targetMuscle_en}
                targetMuscleAr={currentExercise.targetMuscle_ar}
                videoUrl={currentExercise.videoUrl}
              />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-ironforge-text mb-2">
                      {locale === 'ar' ? currentExercise.name_ar : currentExercise.name_en}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-ironforge-text-muted">
                      <Target className="w-4 h-4" />
                      {locale === 'ar' ? currentExercise.targetMuscle_ar : currentExercise.targetMuscle_en}
                    </div>
                  </div>
                  <Badge variant="outline" className="border-ironforge-border text-ironforge-text-muted">
                    {locale === 'ar' ? currentExercise.equipment_ar : currentExercise.equipment_en}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-ironforge-background">
                    <p className="text-xl font-bold text-ironforge-primary">{currentExercise.sets}</p>
                    <p className="text-xs text-ironforge-text-muted">{t('sets')}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-ironforge-background">
                    <p className="text-xl font-bold text-ironforge-primary">{currentExercise.reps}</p>
                    <p className="text-xs text-ironforge-text-muted">{t('reps')}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-ironforge-background">
                    <p className="text-xl font-bold text-ironforge-primary">{currentExercise.restSeconds}s</p>
                    <p className="text-xs text-ironforge-text-muted">{t('rest')}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Form Tips */}
            <Card className="p-6 border-ironforge-border bg-ironforge-card">
              <button
                onClick={() => setShowFormTips(!showFormTips)}
                className="flex items-center justify-between w-full mb-4"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-ironforge-primary" />
                  <h3 className="font-semibold text-ironforge-text">
                    {t('formTips')}
                  </h3>
                </div>
                <Badge variant="outline" className="border-ironforge-border text-ironforge-text-muted">
                  {locale === 'ar' ? currentExercise.formTips_ar.length : currentExercise.formTips_en.length} {locale === 'ar' ? 'نصائح' : 'tips'}
                </Badge>
              </button>

              {showFormTips && (
                <ul className="space-y-2">
                  {(locale === 'ar' ? currentExercise.formTips_ar : currentExercise.formTips_en).map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-ironforge-text-muted">
                      <CheckCircle className="w-4 h-4 text-ironforge-primary shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Exercise List and Controls */}
          <div className="space-y-6">
            <Card className="p-6 border-ironforge-border bg-ironforge-card">
              <h3 className="font-semibold text-ironforge-text mb-4">
                {locale === 'ar' ? 'قائمة التمارين' : 'Exercise List'}
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {workoutPlan.map((exercise, index) => {
                  const state = exerciseStates[exercise.id] || 'pending';
                  const isActive = index === currentExerciseIndex;
                  
                  return (
                    <div
                      key={exercise.id}
                      onClick={() => setCurrentExerciseIndex(index)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isActive 
                          ? 'border-ironforge-primary bg-ironforge-primary/10' 
                          : state === 'completed'
                          ? 'border-emerald-500/30 bg-emerald-500/10'
                          : state === 'skipped'
                          ? 'border-red-500/30 bg-red-500/10'
                          : 'border-ironforge-border bg-ironforge-background hover:border-ironforge-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            isActive 
                              ? 'bg-ironforge-primary text-ironforge-background'
                              : state === 'completed'
                              ? 'bg-emerald-500 text-white'
                              : state === 'skipped'
                              ? 'bg-red-500 text-white'
                              : 'bg-ironforge-card text-ironforge-text-muted'
                          }`}>
                            {state === 'completed' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : state === 'skipped' ? (
                              <SkipForward className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-ironforge-text text-sm">
                              {locale === 'ar' ? exercise.name_ar : exercise.name_en}
                            </p>
                            <p className="text-xs text-ironforge-text-muted">
                              {exercise.sets} × {exercise.reps}
                            </p>
                          </div>
                        </div>
                        {isActive && (
                          <Badge variant="primary" className="bg-ironforge-primary/15 text-ironforge-primary border-ironforge-primary/30">
                            {locale === 'ar' ? 'الحالي' : 'Current'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Navigation Controls */}
            <div className="flex gap-3">
              {currentExerciseIndex > 0 && (
                <Button
                  onClick={handlePreviousExercise}
                  variant="outline"
                  className="flex-1 border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
                >
                  {locale === 'ar' ? 'السابق' : 'Previous'}
                </Button>
              )}
              
              <Button
                onClick={handleExerciseSkip}
                variant="outline"
                className="flex-1 border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
              >
                <SkipForward className="w-4 h-4 ml-2" />
                {t('skip')}
              </Button>
              
              <Button
                onClick={handleExerciseComplete}
                className="flex-1 bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background"
              >
                <CheckCircle className="w-4 h-4 ml-2" />
                {currentExerciseIndex === workoutPlan.length - 1 ? t('finish') : locale === 'ar' ? 'إكمال' : 'Complete'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}