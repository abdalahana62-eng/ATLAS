'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Activity, 
  Flame,
  CheckCircle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

export default function CalorieCalculatorPage() {
  const t = useTranslations('nutrition');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: ''
  });

  const [calculatedResults, setCalculatedResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const activityLevels = [
    { 
      id: 'sedentary', 
      label_en: 'Sedentary', 
      label_ar: 'خامل',
      desc_en: 'Little or no exercise',
      desc_ar: 'قليل أو لا تمرين',
      multiplier: 1.2
    },
    { 
      id: 'light', 
      label_en: 'Lightly Active', 
      label_ar: 'نشيط قليلاً',
      desc_en: 'Light exercise 1-3 days/week',
      desc_ar: 'تمرين خفيف 1-3 أيام/أسبوع',
      multiplier: 1.375
    },
    { 
      id: 'moderate', 
      label_en: 'Moderately Active', 
      label_ar: 'نشيط بشكل معتدل',
      desc_en: 'Moderate exercise 3-5 days/week',
      desc_ar: 'تمرين متوسط 3-5 أيام/أسبوع',
      multiplier: 1.55
    },
    { 
      id: 'active', 
      label_en: 'Very Active', 
      label_ar: 'نشيط جداً',
      desc_en: 'Hard exercise 6-7 days/week',
      desc_ar: 'تمرين شاق 6-7 أيام/أسبوع',
      multiplier: 1.725
    },
    { 
      id: 'extra', 
      label_en: 'Extra Active', 
      label_ar: 'نشيط بشكل استثنائي',
      desc_en: 'Very hard exercise & physical job',
      desc_ar: 'تمرين شاق جداً وعمل بدني',
      multiplier: 1.9
    }
  ];

  const goals = [
    { 
      id: 'lose_weight', 
      label_en: 'Lose Weight', 
      label_ar: 'خسارة الوزن',
      desc_en: 'Caloric deficit for fat loss',
      desc_ar: 'عجز سعري لخسارة الدهون',
      adjustment: -500
    },
    { 
      id: 'maintain', 
      label_en: 'Maintain Weight', 
      label_ar: 'الحفاظ على الوزن',
      desc_en: 'Maintain current weight',
      desc_ar: 'الحفاظ على الوزن الحالي',
      adjustment: 0
    },
    { 
      id: 'gain_muscle', 
      label_en: 'Gain Muscle', 
      label_ar: 'زيادة العضلات',
      desc_en: 'Caloric surplus for muscle gain',
      desc_ar: 'فائض سعري لزيادة العضلات',
      adjustment: +300
    }
  ];

  const calculateCalories = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const age = parseInt(formData.age);
    const height = parseInt(formData.height);
    const weight = parseInt(formData.weight);
    const gender = formData.gender;
    const activity = activityLevels.find(a => a.id === formData.activityLevel);
    const goal = goals.find(g => g.id === formData.goal);

    if (!age || !height || !weight || !gender || !activity || !goal) {
      setLoading(false);
      return;
    }

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = Math.round(bmr * activity.multiplier);
    const dailyCalories = Math.round(tdee + goal.adjustment);
    
    // Macro split (protein 30%, carbs 40%, fats 30%)
    const proteinGrams = Math.round((dailyCalories * 0.30) / 4);
    const carbsGrams = Math.round((dailyCalories * 0.40) / 4);
    const fatsGrams = Math.round((dailyCalories * 0.30) / 9);

    // BMI calculation
    const heightInMeters = height / 100;
    const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));

    let bmiCategory = '';
    if (bmi < 18.5) {
      bmiCategory = locale === 'ar' ? 'نحيف' : 'Underweight';
    } else if (bmi < 25) {
      bmiCategory = locale === 'ar' ? 'طبيعي' : 'Normal';
    } else if (bmi < 30) {
      bmiCategory = locale === 'ar' ? 'زيادة وزن' : 'Overweight';
    } else {
      bmiCategory = locale === 'ar' ? 'سمنة' : 'Obese';
    }

    setCalculatedResults({
      bmi,
      bmiCategory,
      bmr: Math.round(bmr),
      tdee,
      dailyCalories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fats: fatsGrams,
      adjustment: goal.adjustment
    });

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-ironforge-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-ironforge-primary/20 flex items-center justify-center">
              <Calculator className="w-8 h-8 text-ironforge-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-ironforge-text mb-2">
            {locale === 'ar' ? 'حاسبة السعرات والماكروز' : 'Calorie & Macro Calculator'}
          </h1>
          <p className="text-ironforge-text-muted">
            {locale === 'ar' ? 'احسب احتياجاتك اليومية من السعرات والماكروز بدقة' : 'Calculate your daily calorie and macro needs accurately'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Form */}
          <Card className="p-6 border-ironforge-border bg-ironforge-card">
            <h2 className="text-xl font-semibold text-ironforge-text mb-6">
              {locale === 'ar' ? 'معلوماتك' : 'Your Information'}
            </h2>

            <div className="space-y-6">
              {/* Personal Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ironforge-text mb-2">
                    {locale === 'ar' ? 'العمر' : 'Age'}
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder={locale === 'ar' ? 'سنة' : 'years'}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ironforge-text mb-2">
                    {locale === 'ar' ? 'الجنس' : 'Gender'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleInputChange('gender', 'male')}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        formData.gender === 'male'
                          ? 'border-ironforge-primary bg-ironforge-primary/10'
                          : 'border-ironforge-border bg-ironforge-card hover:border-ironforge-border'
                      }`}
                    >
                      {locale === 'ar' ? 'ذكر' : 'Male'}
                    </button>
                    <button
                      onClick={() => handleInputChange('gender', 'female')}
                      className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                        formData.gender === 'female'
                          ? 'border-ironforge-primary bg-ironforge-primary/10'
                          : 'border-ironforge-border bg-ironforge-card hover:border-ironforge-border'
                      }`}
                    >
                      {locale === 'ar' ? 'أنثى' : 'Female'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ironforge-text mb-2">
                    {locale === 'ar' ? 'الطول (سم)' : 'Height (cm)'}
                  </label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder={locale === 'ar' ? 'سم' : 'cm'}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ironforge-text mb-2">
                    {locale === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}
                  </label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder={locale === 'ar' ? 'كجم' : 'kg'}
                    className={isRTL ? 'text-right' : 'text-left'}
                  />
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-ironforge-text mb-3">
                  {locale === 'ar' ? 'مستوى النشاط' : 'Activity Level'}
                </label>
                <div className="space-y-2">
                  {activityLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => handleInputChange('activityLevel', level.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-right ${
                        formData.activityLevel === level.id
                          ? 'border-ironforge-primary bg-ironforge-primary/10'
                          : 'border-ironforge-border bg-ironforge-card hover:border-ironforge-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-ironforge-text block">
                            {locale === 'ar' ? level.label_ar : level.label_en}
                          </span>
                          <span className="text-sm text-ironforge-text-muted">
                            {locale === 'ar' ? level.desc_ar : level.desc_en}
                          </span>
                        </div>
                        {formData.activityLevel === level.id && (
                          <CheckCircle className="w-5 h-5 text-ironforge-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-medium text-ironforge-text mb-3">
                  {locale === 'ar' ? 'هدفك' : 'Your Goal'}
                </label>
                <div className="space-y-2">
                  {goals.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => handleInputChange('goal', goal.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-right ${
                        formData.goal === goal.id
                          ? 'border-ironforge-primary bg-ironforge-primary/10'
                          : 'border-ironforge-border bg-ironforge-card hover:border-ironforge-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-ironforge-text block">
                            {locale === 'ar' ? goal.label_ar : goal.label_en}
                          </span>
                          <span className="text-sm text-ironforge-text-muted">
                            {locale === 'ar' ? goal.desc_ar : goal.desc_en}
                          </span>
                        </div>
                        {formData.goal === goal.id && (
                          <CheckCircle className="w-5 h-5 text-ironforge-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={calculateCalories}
                disabled={loading || !formData.age || !formData.gender || !formData.height || !formData.weight || !formData.activityLevel || !formData.goal}
                className="w-full bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-ironforge-background border-t-transparent rounded-full animate-spin ml-2" />
                    {locale === 'ar' ? 'جاري الحساب...' : 'Calculating...'}
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 ml-2" />
                    {locale === 'ar' ? 'احسب احتياجاتي' : 'Calculate My Needs'}
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results */}
          {calculatedResults && (
            <div className="space-y-6">
              {/* Main Results Card */}
              <Card className="p-6 border-ironforge-border bg-ironforge-card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-ironforge-primary/20 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-ironforge-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-ironforge-text">
                      {locale === 'ar' ? 'نتائجك' : 'Your Results'}
                    </h2>
                    <p className="text-sm text-ironforge-text-muted">
                      {locale === 'ar' ? 'مبنية على معادلة Mifflin-St Jeor' : 'Based on Mifflin-St Jeor equation'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-ironforge-background">
                    <p className="text-3xl font-bold text-ironforge-primary mb-1">
                      {calculatedResults.dailyCalories}
                    </p>
                    <p className="text-sm text-ironforge-text-muted">
                      {locale === 'ar' ? 'سعرة حرارية/يوم' : 'calories/day'}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-ironforge-background">
                    <p className="text-3xl font-bold text-ironforge-primary mb-1">
                      {calculatedResults.bmi}
                    </p>
                    <p className="text-sm text-ironforge-text-muted">
                      BMI - {calculatedResults.bmiCategory}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-ironforge-background">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-ironforge-primary" />
                      <span className="text-sm text-ironforge-text">
                        {locale === 'ar' ? 'معدل الأيض الأساسي (BMR)' : 'Basal Metabolic Rate (BMR)'}
                      </span>
                    </div>
                    <span className="font-semibold text-ironforge-text">
                      {calculatedResults.bmr} {locale === 'ar' ? 'سعرة' : 'kcal'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-ironforge-background">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-ironforge-primary" />
                      <span className="text-sm text-ironforge-text">
                        {locale === 'ar' ? 'معدل الحرق اليومي (TDEE)' : 'Total Daily Energy Expenditure (TDEE)'}
                      </span>
                    </div>
                    <span className="font-semibold text-ironforge-text">
                      {calculatedResults.tdee} {locale === 'ar' ? 'سعرة' : 'kcal'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-ironforge-background">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-ironforge-primary" />
                      <span className="text-sm text-ironforge-text">
                        {locale === 'ar' ? 'التعديل حسب الهدف' : 'Goal Adjustment'}
                      </span>
                    </div>
                    <Badge variant={calculatedResults.adjustment > 0 ? 'success' : calculatedResults.adjustment < 0 ? 'warning' : 'default'}>
                      {calculatedResults.adjustment > 0 ? '+' : ''}{calculatedResults.adjustment} {locale === 'ar' ? 'سعرة' : 'kcal'}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Macro Breakdown */}
              <Card className="p-6 border-ironforge-border bg-ironforge-card">
                <h3 className="font-semibold text-ironforge-text mb-4">
                  {locale === 'ar' ? 'توزيع الماكروز' : 'Macro Breakdown'}
                </h3>

                <div className="space-y-4">
                  {/* Protein */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ironforge-text">{t('protein')}</span>
                      <span className="text-ironforge-text-muted">
                        {calculatedResults.protein}g / {calculatedResults.protein}g
                      </span>
                    </div>
                    <Progress value={100} variant="primary" size="md" />
                    <p className="text-xs text-ironforge-text-muted mt-1">
                      {locale === 'ar' ? '30% من السعرات' : '30% of calories'}
                    </p>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ironforge-text">{t('carbs')}</span>
                      <span className="text-ironforge-text-muted">
                        {calculatedResults.carbs}g / {calculatedResults.carbs}g
                      </span>
                    </div>
                    <Progress value={100} variant="primary" size="md" />
                    <p className="text-xs text-ironforge-text-muted mt-1">
                      {locale === 'ar' ? '40% من السعرات' : '40% of calories'}
                    </p>
                  </div>

                  {/* Fats */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ironforge-text">{t('fats')}</span>
                      <span className="text-ironforge-text-muted">
                        {calculatedResults.fats}g / {calculatedResults.fats}g
                      </span>
                    </div>
                    <Progress value={100} variant="primary" size="md" />
                    <p className="text-xs text-ironforge-text-muted mt-1">
                      {locale === 'ar' ? '30% من السعرات' : '30% of calories'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg bg-ironforge-primary/10 border border-ironforge-primary/30">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-ironforge-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-ironforge-text">
                      {locale === 'ar' 
                        ? 'هذه التوصيات مبنية على المعادلات العلمية القياسية. استشر أخصائي تغذية للحصول على خطة مخصصة.' 
                        : 'These recommendations are based on standard scientific equations. Consult a nutritionist for a personalized plan.'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}