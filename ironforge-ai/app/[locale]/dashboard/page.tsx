'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Calendar, 
  Flame, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  ArrowRight,
  MoreVertical,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  // Mock data - in real app this would come from API
  const todayWorkout = {
    name: locale === 'ar' ? 'يوم الدفع - صدر، كتف، ثلاثية' : 'Push Day - Chest, Shoulders, Triceps',
    duration: 45,
    exercises: 6,
    completed: false
  };

  const nutritionGoals = {
    calories: { current: 1850, target: 2500 },
    protein: { current: 120, target: 180 },
    carbs: { current: 200, target: 280 },
    water: { current: 6, target: 8 }
  };

  const weeklyProgress = {
    workoutsCompleted: 4,
    totalWorkouts: 5,
    streak: 3
  };

  const quickStats = [
    {
      label: locale === 'ar' ? 'الوزن الحالي' : 'Current Weight',
      value: '75 kg',
      change: '+0.5 kg',
      icon: Target,
      trend: 'up'
    },
    {
      label: locale === 'ar' ? 'تمارين هذا الأسبوع' : 'Workouts This Week',
      value: `${weeklyProgress.workoutsCompleted}/${weeklyProgress.totalWorkouts}`,
      change: locale === 'ar' ? 'أحسن من الأسبوع الماضي' : 'Better than last week',
      icon: Dumbbell,
      trend: 'up'
    },
    {
      label: locale === 'ar' ? 'سلسلة الالتزام' : 'Current Streak',
      value: `${weeklyProgress.streak} ${locale === 'ar' ? 'أيام' : 'days'}`,
      change: locale === 'ar' ? 'استمر!' : 'Keep it up!',
      icon: Flame,
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-ironforge-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ironforge-text mb-2">
              {t('title')}
            </h1>
            <p className="text-ironforge-text-muted">
              {t('subtitle')}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/profile')}
              className="border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
            >
              <Settings className="w-4 h-4 ml-2" />
              {t('common.settings')}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 border-ironforge-border bg-ironforge-card hover:bg-ironforge-card-hover transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-ironforge-primary/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-ironforge-primary" />
                      </div>
                      <span className="text-sm text-ironforge-text-muted">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-ironforge-text mb-1">{stat.value}</p>
                    <p className="text-sm text-ironforge-primary">{stat.change}</p>
                  </div>
                  {stat.trend === 'up' && (
                    <TrendingUp className="w-5 h-5 text-ironforge-primary" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Workout */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-ironforge-border bg-ironforge-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-ironforge-primary/20 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-ironforge-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-ironforge-text">
                      {t('todayWorkout')}
                    </h2>
                    <p className="text-sm text-ironforge-text-muted">
                      {todayWorkout.name}
                    </p>
                  </div>
                </div>
                <Badge variant={todayWorkout.completed ? 'success' : 'secondary'}>
                  {todayWorkout.completed ? (
                    <>
                      <CheckCircle className="w-3 h-3 ml-1" />
                      {t('workout.completed')}
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 ml-1" />
                      {locale === 'ar' ? 'معلق' : 'Pending'}
                    </>
                  )}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-ironforge-background">
                  <p className="text-2xl font-bold text-ironforge-text">{todayWorkout.duration}</p>
                  <p className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'دقيقة' : 'min'}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-ironforge-background">
                  <p className="text-2xl font-bold text-ironforge-text">{todayWorkout.exercises}</p>
                  <p className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'تمرين' : 'exercises'}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-ironforge-background">
                  <p className="text-2xl font-bold text-ironforge-text">
                    {weeklyProgress.workoutsCompleted}/{weeklyProgress.totalWorkouts}
                  </p>
                  <p className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'أسبوعي' : 'weekly'}</p>
                </div>
              </div>

              <Button 
                className="w-full bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background"
                disabled={todayWorkout.completed}
                onClick={() => router.push('/workout')}
              >
                {todayWorkout.completed ? (
                  <>
                    <CheckCircle className="w-4 h-4 ml-2" />
                    {locale === 'ar' ? 'مكتمل' : 'Completed'}
                  </>
                ) : (
                  <>
                    {t('startWorkout')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Nutrition Goals */}
          <div>
            <Card className="p-6 border-ironforge-border bg-ironforge-card h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-ironforge-primary/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-ironforge-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-ironforge-text">
                    {t('nutritionGoals')}
                  </h2>
                  <p className="text-sm text-ironforge-text-muted">
                    {locale === 'ar' ? 'أهداف اليوم' : "Today's Goals"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Calories */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ironforge-text">{t('calories')}</span>
                    <span className="text-ironforge-text-muted">
                      {nutritionGoals.calories.current} / {nutritionGoals.calories.target}
                    </span>
                  </div>
                  <Progress 
                    value={(nutritionGoals.calories.current / nutritionGoals.calories.target) * 100} 
                    variant="primary"
                    size="md"
                  />
                </div>

                {/* Protein */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ironforge-text">{t('protein')}</span>
                    <span className="text-ironforge-text-muted">
                      {nutritionGoals.protein.current}g / {nutritionGoals.protein.target}g
                    </span>
                  </div>
                  <Progress 
                    value={(nutritionGoals.protein.current / nutritionGoals.protein.target) * 100} 
                    variant="primary"
                    size="md"
                  />
                </div>

                {/* Carbs */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ironforge-text">{t('nutrition.carbs')}</span>
                    <span className="text-ironforge-text-muted">
                      {nutritionGoals.carbs.current}g / {nutritionGoals.carbs.target}g
                    </span>
                  </div>
                  <Progress 
                    value={(nutritionGoals.carbs.current / nutritionGoals.carbs.target) * 100} 
                    variant="primary"
                    size="md"
                  />
                </div>

                {/* Water */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ironforge-text">{t('nutrition.water')}</span>
                    <span className="text-ironforge-text-muted">
                      {nutritionGoals.water.current} / {nutritionGoals.water.target} {locale === 'ar' ? 'أكواب' : 'cups'}
                    </span>
                  </div>
                  <Progress 
                    value={(nutritionGoals.water.current / nutritionGoals.water.target) * 100} 
                    variant="primary"
                    size="md"
                  />
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-6 border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
              >
                {locale === 'ar' ? 'تسجيل وجبة' : 'Log Meal'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>

        {/* AI Coach Section */}
        <Card className="mt-6 p-6 border-ironforge-border bg-ironforge-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-ironforge-primary/20 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-ironforge-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ironforge-text">
                  {t('aiCoach')}
                </h3>
                <p className="text-sm text-ironforge-text-muted">
                  {locale === 'ar' ? 'اسأل مدربك الذكي أي سؤال' : 'Ask your AI coach anything'}
                </p>
              </div>
            </div>
            <Button className="bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background">
              {t('messageCoach')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}