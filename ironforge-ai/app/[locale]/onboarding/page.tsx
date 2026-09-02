'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Dumbbell, Target, TrendingUp, Activity, Shield, Zap, ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

type OnboardingStep = 'welcome' | 'goals' | 'experience' | 'bodyStats' | 'injuriesEquipment' | 'summary';

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const genderT = useTranslations('gender');
  const equipmentT = useTranslations('equipment');
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [loading, setLoading] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  
  // Form data
  const [goals, setGoals] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [injuries, setInjuries] = useState<string>('');
  const [equipment, setEquipment] = useState<string[]>([]);

  const totalSteps = 5;
  const stepOrder: OnboardingStep[] = ['welcome', 'goals', 'experience', 'bodyStats', 'injuriesEquipment', 'summary'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const goalOptions = [
    { id: 'muscle_gain', icon: Target, key: 'muscleGain' },
    { id: 'fat_loss', icon: TrendingUp, key: 'fatLoss' },
    { id: 'strength', icon: Zap, key: 'strength' },
    { id: 'general_fitness', icon: Activity, key: 'generalFitness' },
    { id: 'endurance', icon: Activity, key: 'endurance' }
  ];

  const experienceOptions = [
    { id: 'beginner', key: 'beginner', descKey: 'beginnerDesc' },
    { id: 'intermediate', key: 'intermediate', descKey: 'intermediateDesc' },
    { id: 'advanced', key: 'advanced', descKey: 'advancedDesc' }
  ];

  const equipmentOptions = [
    { id: 'full_gym', key: 'fullGym' },
    { id: 'barbell', key: 'barbell' },
    { id: 'dumbbells', key: 'dumbbells' },
    { id: 'pull_up_bar', key: 'pullUpBar' },
    { id: 'bench', key: 'bench' },
    { id: 'cable_machine', key: 'cableMachine' },
    { id: 'kettlebells', key: 'kettlebells' },
    { id: 'resistance_bands', key: 'resistanceBands' },
    { id: 'none', key: 'none' }
  ];

  const getEquipmentLabel = (value: string) => {
    const mapping: Record<string, string> = {
      full_gym: 'fullGym',
      pull_up_bar: 'pullUpBar',
      resistance_bands: 'resistanceBands',
      cable_machine: 'cableMachine',
    };

    return equipmentT(mapping[value] || value);
  };

  const handleGoalToggle = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleEquipmentToggle = (equipId: string) => {
    setEquipment(prev => 
      prev.includes(equipId) 
        ? prev.filter(e => e !== equipId)
        : [...prev, equipId]
    );
  };

  const handleNext = async () => {
    setAiThinking(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAiThinking(false);
    
    if (currentStep === 'summary') {
      setLoading(true);
      // Here you would submit the data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/dashboard');
    } else {
      const nextStep = stepOrder[stepOrder.indexOf(currentStep) + 1];
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = stepOrder[stepOrder.indexOf(currentStep) - 1];
    if (prevStep) {
      setCurrentStep(prevStep);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'goals':
        return goals.length > 0;
      case 'experience':
        return experience !== '';
      case 'bodyStats':
        return age && height && weight && gender;
      case 'injuriesEquipment':
        return equipment.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center space-y-6 animate-scale-in">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-ironforge-primary/20 flex items-center justify-center mb-6">
              <Dumbbell className="w-10 h-10 text-ironforge-primary" />
            </div>
            
            <h1 className="text-3xl font-bold text-ironforge-text">
              {t('welcome.title')}
            </h1>
            
            <p className="text-ironforge-text-muted text-lg">
              {t('welcome.subtitle')}
            </p>
            
            <p className="text-ironforge-text text-base max-w-md mx-auto">
              {t('welcome.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              <Card className="p-4 border-ironforge-border bg-ironforge-card hover:bg-ironforge-card-hover transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-lg bg-ironforge-primary/20 flex items-center justify-center mb-3">
                    <Target className="w-5 h-5 text-ironforge-primary" />
                  </div>
                  <h3 className="font-semibold text-ironforge-text text-sm">
                    {t('welcome.features.ai')}
                  </h3>
                </div>
              </Card>
              
              <Card className="p-4 border-ironforge-border bg-ironforge-card hover:bg-ironforge-card-hover transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-lg bg-ironforge-primary/20 flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 text-ironforge-primary" />
                  </div>
                  <h3 className="font-semibold text-ironforge-text text-sm">
                    {t('welcome.features.custom')}
                  </h3>
                </div>
              </Card>
              
              <Card className="p-4 border-ironforge-border bg-ironforge-card hover:bg-ironforge-card-hover transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-lg bg-ironforge-primary/20 flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-ironforge-primary" />
                  </div>
                  <h3 className="font-semibold text-ironforge-text text-sm">
                    {t('welcome.features.track')}
                  </h3>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6 animate-scale-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ironforge-text mb-2">
                {t('goalsStep.title')}
              </h2>
              <p className="text-ironforge-text-muted">
                {t('goalsStep.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalOptions.map(option => {
                const Icon = option.icon;
                const isSelected = goals.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleGoalToggle(option.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      isSelected 
                        ? 'border-ironforge-primary bg-ironforge-primary/10' 
                        : 'border-ironforge-border bg-ironforge-card hover:border-ironforge-border hover:bg-ironforge-card-hover'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-ironforge-primary' : 'bg-ironforge-primary/20'
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-ironforge-background' : 'text-ironforge-primary'}`} />
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="font-semibold text-ironforge-text block">
                        {t(`goals.${option.key}`)}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-ironforge-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {aiThinking && (
              <div className="text-center text-ironforge-text-muted animate-pulse">
                {t('goalsStep.aiHint')}
              </div>
            )}
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6 animate-scale-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ironforge-text mb-2">
                {t('experienceStep.title')}
              </h2>
              <p className="text-ironforge-text-muted">
                {t('experienceStep.subtitle')}
              </p>
            </div>
            
            <div className="space-y-3">
              {experienceOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setExperience(option.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${isRTL ? 'text-right' : 'text-left'} ${
                    experience === option.id
                      ? 'border-ironforge-primary bg-ironforge-primary/10'
                      : 'border-ironforge-border bg-ironforge-card hover:border-ironforge-border hover:bg-ironforge-card-hover'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-ironforge-text block">
                        {t(`experience.${option.key}`)}
                      </span>
                      <span className="text-sm text-ironforge-text-muted">
                        {t(`experience.${option.descKey}`)}
                      </span>
                    </div>
                    {experience === option.id && (
                      <Check className="w-5 h-5 text-ironforge-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {aiThinking && (
              <div className="text-center text-ironforge-text-muted animate-pulse">
                {t('experienceStep.aiHint')}
              </div>
            )}
          </div>
        );

      case 'bodyStats':
        return (
          <div className="space-y-6 animate-scale-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ironforge-text mb-2">
                {t('bodyStatsStep.title')}
              </h2>
              <p className="text-ironforge-text-muted">
                {t('bodyStatsStep.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ironforge-text mb-2">
                  {t('bodyStatsStep.age')}
                </label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={t('bodyStatsStep.ageUnit')}
                  min={t('bodyStatsStep.ageMin')}
                  max={t('bodyStatsStep.ageMax')}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ironforge-text mb-2">
                  {t('bodyStatsStep.height')}
                </label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={t('bodyStatsStep.heightUnit')}
                  min={t('bodyStatsStep.heightMin')}
                  max={t('bodyStatsStep.heightMax')}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ironforge-text mb-2">
                  {t('bodyStatsStep.weight')}
                </label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={t('bodyStatsStep.weightUnit')}
                  min={t('bodyStatsStep.weightMin')}
                  max={t('bodyStatsStep.weightMax')}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ironforge-text mb-2">
                  {t('bodyStatsStep.gender')}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGender('male')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      gender === 'male'
                        ? 'border-ironforge-primary bg-ironforge-primary/10'
                        : 'border-ironforge-border bg-ironforge-card hover:border-ironforge-border'
                    }`}
                  >
                    {genderT('male')}
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      gender === 'female'
                        ? 'border-ironforge-primary bg-ironforge-primary/10'
                        : 'border-ironforge-border bg-ironforge-card hover:border-ironforge-border'
                    }`}
                  >
                    {genderT('female')}
                  </button>
                </div>
              </div>
            </div>
            
            {aiThinking && (
              <div className="text-center text-ironforge-text-muted animate-pulse">
                {t('bodyStatsStep.aiHint')}
              </div>
            )}
          </div>
        );

      case 'injuriesEquipment':
        return (
          <div className="space-y-6 animate-scale-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-ironforge-text mb-2">
                {t('injuriesStep.title')}
              </h2>
              <p className="text-ironforge-text-muted">
                {t('injuriesStep.subtitle')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ironforge-text mb-2">
                {t('injuriesStep.injuries')}
              </label>
              <textarea
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                placeholder={t('injuriesStep.injuriesPlaceholder')}
                rows={3}
                className={`w-full bg-ironforge-background border border-ironforge-border rounded-lg py-3 px-4 text-ironforge-text placeholder-ironforge-text-muted focus:outline-none focus:border-ironforge-primary focus:ring-1 focus:ring-ironforge-primary transition-all resize-none ${isRTL ? 'text-right' : 'text-left'}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ironforge-text mb-2">
                {t('injuriesStep.equipment')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {equipmentOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleEquipmentToggle(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${
                      equipment.includes(option.id)
                        ? 'border-ironforge-primary bg-ironforge-primary/10'
                        : 'border-ironforge-border bg-ironforge-card hover:border-ironforge-border'
                    }`}
                  >
                    {equipmentT(option.key)}
                  </button>
                ))}
              </div>
            </div>
            
            {aiThinking && (
              <div className="text-center text-ironforge-text-muted animate-pulse">
                {t('injuriesStep.aiHint')}
              </div>
            )}
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-ironforge-primary/20 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-ironforge-primary" />
              </div>
              <h2 className="text-2xl font-bold text-ironforge-text mb-2">
                {t('summaryStep.title')}
              </h2>
              <p className="text-ironforge-text-muted">
                {t('summaryStep.subtitle')}
              </p>
            </div>
            
            <Card className="p-6 border-ironforge-border bg-ironforge-card">
              <h3 className="font-semibold text-ironforge-text mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-ironforge-primary" />
                {t('summaryStep.coachTitle')}
              </h3>
              <p className="text-ironforge-text text-sm leading-relaxed">
                {t('summaryStep.coachWelcome', { 
                  name: 'User', 
                  goals: goals.map(g => t(`goals.${g}`)).join(', ') 
                })}
              </p>
            </Card>
            
            <Card className="p-6 border-ironforge-border bg-ironforge-card">
              <h3 className="font-semibold text-ironforge-text mb-4">
                {t('summaryStep.infoTitle')}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ironforge-text-muted">{t('summaryStep.goalsLabel')}</span>
                  <span className={`text-ironforge-text ${isRTL ? 'text-right' : 'text-left'}`}>{goals.map(g => t(`goals.${g}`)).join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ironforge-text-muted">{t('summaryStep.experienceLabel')}</span>
                  <span className={`text-ironforge-text ${isRTL ? 'text-right' : 'text-left'}`}>{t(`experience.${experience}`)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ironforge-text-muted">{t('summaryStep.ageLabel')}</span>
                  <span className={`text-ironforge-text ${isRTL ? 'text-right' : 'text-left'}`}>{age} {t('bodyStatsStep.ageUnit')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ironforge-text-muted">{t('summaryStep.heightLabel')}</span>
                  <span className={`text-ironforge-text ${isRTL ? 'text-right' : 'text-left'}`}>{height} {t('bodyStatsStep.heightUnit')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ironforge-text-muted">{t('summaryStep.weightLabel')}</span>
                  <span className={`text-ironforge-text ${isRTL ? 'text-right' : 'text-left'}`}>{weight} {t('bodyStatsStep.weightUnit')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ironforge-text-muted">{t('summaryStep.genderLabel')}</span>
                  <span className={`text-ironforge-text ${isRTL ? 'text-right' : 'text-left'}`}>{gender ? genderT(gender) : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ironforge-text-muted">{t('summaryStep.equipmentLabel')}</span>
                  <span className={`text-ironforge-text ${isRTL ? 'text-right' : 'text-left'}`}>
                    {equipment.length ? equipment.map((item) => getEquipmentLabel(item)).join(', ') : '-'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ironforge-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        {currentStep !== 'welcome' && currentStep !== 'summary' && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-ironforge-text-muted mb-2">
              <span>{t('progress', { current: currentStepIndex, total: totalSteps })}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Card className="p-8 border-ironforge-border bg-ironforge-card">
          {renderStep()}
          
          {/* Navigation Buttons */}
          {currentStep !== 'welcome' && (
            <div className="flex gap-4 mt-8">
              {currentStep !== 'summary' && (
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1 border-ironforge-border text-ironforge-text hover:bg-ironforge-card-hover"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 ml-2" />}
                  {t('common.back')}
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="flex-1 bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    {t('summaryStep.submitting')}
                  </>
                ) : currentStep === 'summary' ? (
                  <>
                    {t('summaryStep.submit')}
                    {isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                  </>
                ) : (
                  <>
                    {t('common.next')}
                    {isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                  </>
                )}
              </Button>
            </div>
          )}
          
          {/* Start Button for Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="mt-8">
              <Button
                onClick={handleNext}
                className="w-full bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background"
              >
                {t('welcome.cta')}
                {isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}