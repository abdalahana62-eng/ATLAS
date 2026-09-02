export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'legs'
  | 'core'
  | 'cardio';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Gender = 'male' | 'female' | 'other';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export type Goal =
  | 'lose_weight'
  | 'maintain'
  | 'gain_muscle'
  | 'strength'
  | 'endurance';

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Exercise {
  id: string;
  name_en: string;
  name_ar: string;
  targetMuscle_en: string;
  targetMuscle_ar: string;
  category: ExerciseCategory;
  equipment_en: string;
  equipment_ar: string;
  difficulty: Difficulty;
  formTips_en: string[];
  formTips_ar: string[];
  muscles_en: string[];
  muscles_ar: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes_en?: string;
  notes_ar?: string;
}

export interface WorkoutDay {
  id: string;
  name_en: string;
  name_ar: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  difficulty: Difficulty;
  daysPerWeek: number;
  days: WorkoutDay[];
}

export interface Meal {
  id: string;
  name_en: string;
  name_ar: string;
  category_en:
    | 'Breakfast'
    | 'Lunch'
    | 'Dinner'
    | 'Snack'
    | 'Pre-Workout'
    | 'Post-Workout';
  category_ar: 'فطور' | 'غداء' | 'عشاء' | 'وجبة خفيفة' | 'قبل التمرين' | 'بعد التمرين';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients_en: string[];
  ingredients_ar: string[];
  instructions_en: string[];
  instructions_ar: string[];
  tags_en: string[];
  tags_ar: string[];
}

export interface NutritionPlan {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  goal: Goal;
  dailyMacros: Macros;
  meals: Meal[];
}

export interface OnboardingStep {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  fields: string[];
  order: number;
}

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  targetWeightKg?: number;
  experienceLevel: Difficulty;
  injuries_en?: string[];
  injuries_ar?: string[];
  dietaryRestrictions_en?: string[];
  dietaryRestrictions_ar?: string[];
  dailyMacros?: Macros;
  workoutPlanId?: string;
  nutritionPlanId?: string;
  locale: 'en' | 'ar';
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content_en: string;
  content_ar: string;
  createdAt: Date;
  metadata?: {
    exerciseIds?: string[];
    mealIds?: string[];
    workoutPlanId?: string;
  };
}

export interface UserProgress {
  id: string;
  userId: string;
  date: Date;
  weightKg?: number;
  workoutCompleted?: boolean;
  caloriesConsumed?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatsGrams?: number;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutDayId: string;
  date: Date;
  durationMinutes: number;
  exercisesLogged: {
    exerciseId: string;
    setsCompleted: number;
    repsCompleted: string;
    weightUsedKg?: number;
    notes?: string;
  }[];
}
