import { WorkoutPlan } from '@/lib/types';

export const workoutTemplates: WorkoutPlan[] = [
  {
    id: 'ppl-6-day',
    name_en: 'Push/Pull/Legs (PPL) - 6 Day',
    name_ar: 'دفع/سحب/ساقين (PPL) - 6 أيام',
    description_en:
      'A high-volume 6-day split with two push, two pull, and two leg days per week. Ideal for intermediate to advanced lifters looking to maximize muscle growth.',
    description_ar:
      'تقسيم عالي الحجم لمدة 6 أيام مع يومين دفع، يومين سحب، ويومين ساقين في الأسبوع. مثالي لمرتفي التمرين من المستوى المتوسط إلى المتقدم الذين يسعون لزيادة نمو العضلات.',
    difficulty: 'advanced',
    daysPerWeek: 6,
    days: [
      {
        id: 'ppl-push-1',
        name_en: 'Push Day 1 (Chest Focus)',
        name_ar: 'يوم الدفع 1 (تركيز الصدر)',
        exercises: [
          { exerciseId: 'barbell-bench-press', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'incline-bench-press', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'dumbbell-bench-press', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'overhead-press', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'lateral-raise', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'tricep-pushdown', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'overhead-tricep-extension', sets: 3, reps: '10-12', restSeconds: 75 }
        ]
      },
      {
        id: 'ppl-pull-1',
        name_en: 'Pull Day 1 (Back Focus)',
        name_ar: 'يوم السحب 1 (تركيز الظهر)',
        exercises: [
          { exerciseId: 'deadlift', sets: 4, reps: '4-6', restSeconds: 180 },
          { exerciseId: 'pull-ups', sets: 4, reps: '6-10', restSeconds: 120 },
          { exerciseId: 'bent-over-barbell-row', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'lat-pulldown', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'face-pulls', sets: 4, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'barbell-bicep-curl', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'hammer-curl', sets: 3, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        id: 'ppl-legs-1',
        name_en: 'Leg Day 1 (Quads Focus)',
        name_ar: 'يوم الساقين 1 (تركيز الرباعية)',
        exercises: [
          { exerciseId: 'back-squat', sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseId: 'front-squat', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'leg-press', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'leg-extension', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'calf-raise', sets: 5, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'plank', sets: 3, reps: '60 sec', restSeconds: 60 }
        ]
      },
      {
        id: 'ppl-push-2',
        name_en: 'Push Day 2 (Shoulder Focus)',
        name_ar: 'يوم الدفع 2 (تركيز الكتفين)',
        exercises: [
          { exerciseId: 'dumbbell-shoulder-press', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'chest-dips', sets: 4, reps: '8-12', restSeconds: 90 },
          { exerciseId: 'cable-crossover', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'arnold-press', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'front-raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'rear-delt-fly', sets: 4, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'skull-crushers', sets: 4, reps: '10-12', restSeconds: 75 }
        ]
      },
      {
        id: 'ppl-pull-2',
        name_en: 'Pull Day 2 (Thickness Focus)',
        name_ar: 'يوم السحب 2 (تركيز السماكة)',
        exercises: [
          { exerciseId: 't-bar-row', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'seated-cable-row', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'bent-over-dumbbell-row', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'single-arm-cable-row', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'shrugs', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'preacher-curl', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'concentration-curl', sets: 3, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        id: 'ppl-legs-2',
        name_en: 'Leg Day 2 (Posterior Focus)',
        name_ar: 'يوم الساقين 2 (تركيز الخلفي)',
        exercises: [
          { exerciseId: 'romanian-deadlift', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'hip-thrust', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'bulgarian-split-squat', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'leg-curl', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'walking-lunges', sets: 3, reps: '12-15/leg', restSeconds: 90 },
          { exerciseId: 'seated-calf-raise', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },
  {
    id: 'upper-lower-4-day',
    name_en: 'Upper/Lower - 4 Day',
    name_ar: 'علوي/سفلي - 4 أيام',
    description_en:
      'A balanced 4-day split alternating between upper and lower body. Great for intermediates with good recovery, provides frequency and volume for steady gains.',
    description_ar:
      'تقسيم متوازن لمدة 4 أيام بالتناوب بين الجزء العلوي والسفلي من الجسم. رائع للمتوسطين مع تعافي جيد، يوفر التكرار والحجم لمكاسب ثابتة.',
    difficulty: 'intermediate',
    daysPerWeek: 4,
    days: [
      {
        id: 'ul-upper-1',
        name_en: 'Upper Day 1 (Push Focus)',
        name_ar: 'يوم العلوي 1 (تركيز الدفع)',
        exercises: [
          { exerciseId: 'barbell-bench-press', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'overhead-press', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'bent-over-barbell-row', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'pull-ups', sets: 3, reps: '6-10', restSeconds: 90 },
          { exerciseId: 'lateral-raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'tricep-pushdown', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'barbell-bicep-curl', sets: 3, reps: '10-12', restSeconds: 60 }
        ]
      },
      {
        id: 'ul-lower-1',
        name_en: 'Lower Day 1 (Quads Focus)',
        name_ar: 'يوم السفلي 1 (تركيز الرباعية)',
        exercises: [
          { exerciseId: 'back-squat', sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseId: 'romanian-deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'leg-press', sets: 3, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'leg-curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'leg-extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'calf-raise', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        id: 'ul-upper-2',
        name_en: 'Upper Day 2 (Pull Focus)',
        name_ar: 'يوم العلوي 2 (تركيز السحب)',
        exercises: [
          { exerciseId: 'lat-pulldown', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'seated-cable-row', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'dumbbell-bench-press', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'arnold-press', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'face-pulls', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'skull-crushers', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'hammer-curl', sets: 3, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        id: 'ul-lower-2',
        name_en: 'Lower Day 2 (Posterior Focus)',
        name_ar: 'يوم السفلي 2 (تركيز الخلفي)',
        exercises: [
          { exerciseId: 'deadlift', sets: 4, reps: '4-6', restSeconds: 180 },
          { exerciseId: 'front-squat', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'hip-thrust', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'walking-lunges', sets: 3, reps: '10/leg', restSeconds: 90 },
          { exerciseId: 'glute-bridge', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'seated-calf-raise', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },
  {
    id: 'bro-split-5-day',
    name_en: 'Bro-Split - 5 Day',
    name_ar: 'تقسيم الإخوة - 5 أيام',
    description_en:
      'Classic bodybuilding split with one muscle group per day. Each muscle gets one dedicated session weekly with high volume. Great for focusing on weak points.',
    description_ar:
      'تقسيم كمال الأجسام الكلاسيكي مع مجموعة عضلية واحدة في اليوم. كل عضلة تحصل على جلسة مخصصة واحدة أسبوعياً بحجم عالي. رائع للتركيز على النقاط الضعيفة.',
    difficulty: 'intermediate',
    daysPerWeek: 5,
    days: [
      {
        id: 'bro-chest',
        name_en: 'Chest Day',
        name_ar: 'يوم الصدر',
        exercises: [
          { exerciseId: 'barbell-bench-press', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'incline-bench-press', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'decline-bench-press', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'dumbbell-fly', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'cable-crossover', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'dips-triceps', sets: 3, reps: '10-12', restSeconds: 75 }
        ]
      },
      {
        id: 'bro-back',
        name_en: 'Back Day',
        name_ar: 'يوم الظهر',
        exercises: [
          { exerciseId: 'deadlift', sets: 4, reps: '4-6', restSeconds: 180 },
          { exerciseId: 'pull-ups', sets: 4, reps: '6-10', restSeconds: 120 },
          { exerciseId: 'bent-over-barbell-row', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseId: 't-bar-row', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'seated-cable-row', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'lat-pulldown', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'shrugs', sets: 3, reps: '12-15', restSeconds: 60 }
        ]
      },
      {
        id: 'bro-legs',
        name_en: 'Leg Day',
        name_ar: 'يوم الساقين',
        exercises: [
          { exerciseId: 'back-squat', sets: 4, reps: '6-8', restSeconds: 180 },
          { exerciseId: 'romanian-deadlift', sets: 4, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'leg-press', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'walking-lunges', sets: 3, reps: '12/leg', restSeconds: 90 },
          { exerciseId: 'leg-extension', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'leg-curl', sets: 4, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'calf-raise', sets: 5, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        id: 'bro-shoulders',
        name_en: 'Shoulder Day',
        name_ar: 'يوم الكتفين',
        exercises: [
          { exerciseId: 'overhead-press', sets: 4, reps: '6-8', restSeconds: 120 },
          { exerciseId: 'arnold-press', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'lateral-raise', sets: 5, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'front-raise', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'rear-delt-fly', sets: 4, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'upright-row', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'face-pulls', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      },
      {
        id: 'bro-arms',
        name_en: 'Arm Day',
        name_ar: 'يوم الذراعين',
        exercises: [
          { exerciseId: 'barbell-bicep-curl', sets: 4, reps: '10-12', restSeconds: 90 },
          { exerciseId: 'preacher-curl', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'hammer-curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'concentration-curl', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'skull-crushers', sets: 4, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'close-grip-bench-press', sets: 4, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'overhead-tricep-extension', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'wrist-curl', sets: 3, reps: '15-20', restSeconds: 60 },
          { exerciseId: 'reverse-wrist-curl', sets: 3, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  },
  {
    id: 'fullbody-3-day',
    name_en: 'Full Body - 3 Day',
    name_ar: 'الجسم كله - 3 أيام',
    description_en:
      'Beginner-friendly 3-day full body split. Trains all muscle groups 3x per week with compound lifts. Perfect for building a solid foundation.',
    description_ar:
      'تقسيم الجسم كله لمدة 3 أيام مناسب للمبتدئين. يدرب جميع مجموعات العضلات 3 مرات في الأسبوع مع التمارين المركبة. مثالي لبناء أساس متين.',
    difficulty: 'beginner',
    daysPerWeek: 3,
    days: [
      {
        id: 'fb-day-1',
        name_en: 'Full Body Day 1',
        name_ar: 'يوم الجسم كله 1',
        exercises: [
          { exerciseId: 'back-squat', sets: 3, reps: '8-10', restSeconds: 150 },
          { exerciseId: 'barbell-bench-press', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'bent-over-barbell-row', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'overhead-press', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'pull-ups', sets: 3, reps: 'AMRAP', restSeconds: 90 },
          { exerciseId: 'plank', sets: 3, reps: '45 sec', restSeconds: 60 }
        ]
      },
      {
        id: 'fb-day-2',
        name_en: 'Full Body Day 2',
        name_ar: 'يوم الجسم كله 2',
        exercises: [
          { exerciseId: 'deadlift', sets: 3, reps: '5-6', restSeconds: 180 },
          { exerciseId: 'dumbbell-shoulder-press', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'push-ups', sets: 3, reps: '12-15', restSeconds: 60 },
          { exerciseId: 'walking-lunges', sets: 3, reps: '10/leg', restSeconds: 90 },
          { exerciseId: 'lat-pulldown', sets: 3, reps: '10-12', restSeconds: 75 },
          { exerciseId: 'crunches', sets: 3, reps: '20-25', restSeconds: 60 }
        ]
      },
      {
        id: 'fb-day-3',
        name_en: 'Full Body Day 3',
        name_ar: 'يوم الجسم كله 3',
        exercises: [
          { exerciseId: 'front-squat', sets: 3, reps: '8-10', restSeconds: 150 },
          { exerciseId: 'dumbbell-bench-press', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 't-bar-row', sets: 3, reps: '8-10', restSeconds: 90 },
          { exerciseId: 'romanian-deadlift', sets: 3, reps: '8-10', restSeconds: 120 },
          { exerciseId: 'dips-triceps', sets: 3, reps: '8-12', restSeconds: 75 },
          { exerciseId: 'calf-raise', sets: 4, reps: '15-20', restSeconds: 60 }
        ]
      }
    ]
  }
];

export const getWorkoutPlanById = (id: string): WorkoutPlan | undefined => {
  return workoutTemplates.find((p) => p.id === id);
};

export const getWorkoutPlansByDifficulty = (
  difficulty: WorkoutPlan['difficulty']
): WorkoutPlan[] => {
  return workoutTemplates.filter((p) => p.difficulty === difficulty);
};

export const getWorkoutPlansByDaysPerWeek = (days: number): WorkoutPlan[] => {
  return workoutTemplates.filter((p) => p.daysPerWeek === days);
};
