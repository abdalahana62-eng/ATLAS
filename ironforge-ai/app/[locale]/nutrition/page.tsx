'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Utensils,
  Flame,
  Drumstick,
  Wheat,
  Droplet,
  Plus,
  CheckCircle,
  Clock,
  ChefHat,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { COUNTRIES, CUISINES, getCuisine, type CountryCode } from '@/lib/data/cuisines';
import { MEAL_VARIANTS } from '@/lib/data/meal-variants';
import SubscriptionGate from '@/components/SubscriptionGate';
import AuthGate from '@/components/AuthGate';
import ChatMessageBody from '@/components/chat/ChatMessageBody';

interface Meal {
  id: string;
  name_en: string;
  name_ar: string;
  meal_type_en: string;
  meal_type_ar: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients_en: string[];
  ingredients_ar: string[];
  instructions_en: string[];
  instructions_ar: string[];
  time?: string;
  imageUrl?: string;
}

interface UserStats {
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activity: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'cutting' | 'bulking' | 'recomposition' | 'maintenance' | 'fitness';
  country: CountryCode;
}

interface Macros { calories: number; protein: number; carbs: number; fats: number; }

function calcTDEE(s: UserStats): number {
  const bmr = 10 * s.weight + 6.25 * s.height - 5 * s.age + (s.gender === 'male' ? 5 : -161);
  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, extra: 1.9 }[s.activity];
  return Math.round(bmr * mult);
}

function calcMacros(s: UserStats, tdee: number): Macros {
  let cal = tdee;
  if (s.goal === 'cutting') cal = tdee - Math.min(500, tdee * 0.20);
  else if (s.goal === 'bulking') cal = tdee + Math.min(500, tdee * 0.15);
  const protein = Math.round(Math.max(1.6 * s.weight, 0.30 * cal / 4));
  const fat = Math.round(0.8 * s.weight);
  const carbs = Math.round((cal - protein * 4 - fat * 9) / 4);
  return { calories: Math.round(cal), protein, carbs, fats: fat };
}

// 5 slots with pcts; if MEAL_VARIANTS has 7 options for this country+type, return variants
function buildSlots(macros: Macros, country: CountryCode) {
  const c = macros.calories; const p = macros.protein; const ca = macros.carbs; const f = macros.fats;
  const cuisine = getCuisine(country);
  const pcts = [0.25, 0.30, 0.25, 0.10, 0.10];
  return cuisine.slots.map((slot, i) => {
    const pct = pcts[i];
    const m = { cal: Math.round(c * pct), p: Math.round(p * pct), ca: Math.round(ca * pct), f: Math.round(f * pct) };
    const macrosForMeal: Macros = { calories: m.cal, protein: m.p, carbs: m.ca, fats: m.f };
    const variantsMap = MEAL_VARIANTS[country] as any;
    const typeKey = cuisine.builders[i].type_en === 'Breakfast' ? 'Breakfast' : cuisine.builders[i].type_en === 'Lunch' ? 'Lunch' : cuisine.builders[i].type_en === 'Dinner' ? 'Dinner' : 'Snack';
    const variants: any[] = variantsMap?.[typeKey] || [cuisine.builders[i]];
    const meals: Meal[] = variants.slice(0,7).map((b:any, idx:number)=>({
      id: `${i + 1}-${idx}`,
      name_en: b.label_en,
      name_ar: b.label_ar,
      meal_type_en: b.type_en,
      meal_type_ar: b.type_ar,
      calories: m.cal,
      protein: m.p,
      carbs: m.ca,
      fats: m.f,
      ingredients_en: b.ing_en(macrosForMeal),
      ingredients_ar: b.ing_ar(macrosForMeal),
      instructions_en: b.ins_en,
      instructions_ar: b.ins_ar,
      time: b.time,
      imageUrl: b.img,
    }));
    return { slot, pct, macrosForMeal: m, meals };
  });
}
function buildMeals(macros: Macros, country: CountryCode): Meal[] {
  return buildSlots(macros, country).map(s=>s.meals[0]);
}

const defaultStats: UserStats = {
  age: 25,
  gender: 'male',
  height: 178,
  weight: 78,
  activity: 'moderate',
  goal: 'maintenance',
  country: 'eg',
};

export default function NutritionPage() {
  const t = useTranslations('nutrition');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [showWizard, setShowWizard] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [loggedMeals, setLoggedMeals] = useState<Record<string, boolean>>({});
  const [chosen, setChosen] = useState<Record<number, number>>({}); // slotIdx -> variantIdx
  const [chatInput, setChatInput] = useState('');
  const [chatAns, setChatAns] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  // Load saved stats - supports both old key and new country field
  useEffect(() => {
    const raw = localStorage.getItem('atlas-stats') || localStorage.getItem('ironforge-stats');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (!parsed.country) parsed.country = locale === 'ar' ? 'eg' as CountryCode : 'us' as CountryCode;
        setStats(parsed);
        setShowWizard(false);
      } catch {}
    } else {
      // auto default country by locale
      setStats(s => ({ ...s, country: locale === 'ar' ? 'eg' as CountryCode : 'us' as CountryCode }));
    }
  }, [locale]);

  const tdee = calcTDEE(stats);
  const targetMacros = calcMacros(stats, tdee);
  const slots = buildSlots(targetMacros, stats.country);
  const meals = slots.map((s, idx) => s.meals[chosen[idx] ?? 0]);

  const [chatOptions, setChatOptions] = useState<string[]>([]);

  const parseOptions = (text: string): { clean: string; opts: string[] } => {
    const lines = text.split('\n');
    const opts = lines.filter(l => l.trim().startsWith('>> ')).map(l => l.trim().slice(3).trim()).slice(0, 3);
    const clean = lines.filter(l => !l.trim().startsWith('>> ')).join('\n').trim();
    return { clean, opts };
  };

  const handleChat = async (preset?: string) => {
    const msg = (preset ?? chatInput).trim();
    if (!msg) return;
    setChatLoading(true); setChatAns(null); setChatOptions([]);
    try {
      const res = await fetch('/api/nutrition/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: msg, stats, targetMacros, country: stats.country, logged: { calories: totalLoggedCalories, protein: totalLoggedP, carbs: totalLoggedC, fats: totalLoggedF } }) });
      const data = await res.json();
      const raw = data.answer || data.error || '—';
      const { clean, opts } = parseOptions(raw);
      setChatAns(clean);
      setChatOptions(opts);
    } catch { setChatAns(locale==='ar' ? 'حدث خطأ' : 'Error'); }
    setChatLoading(false);
  };

  const handleMealLog = (mealId: string) => {
    setLoggedMeals(prev => ({ ...prev, [mealId]: !prev[mealId] }));
  };

  const totalLoggedCalories = Object.keys(loggedMeals)
    .filter(id => loggedMeals[id])
    .reduce((sum, id) => sum + (meals.find(m => m.id === id)?.calories || 0), 0);
  const totalLoggedP = Object.keys(loggedMeals).filter(id => loggedMeals[id]).reduce((s, id) => s + (meals.find(m => m.id === id)?.protein || 0), 0);
  const totalLoggedC = Object.keys(loggedMeals).filter(id => loggedMeals[id]).reduce((s, id) => s + (meals.find(m => m.id === id)?.carbs || 0), 0);
  const totalLoggedF = Object.keys(loggedMeals).filter(id => loggedMeals[id]).reduce((s, id) => s + (meals.find(m => m.id === id)?.fats || 0), 0);

  // Persist today's totals so the dashboard shows REAL intake (reset automatically each day)
  useEffect(() => {
    try {
      localStorage.setItem('atlas-nutrition-log', JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        calories: totalLoggedCalories,
        protein: totalLoggedP,
        carbs: totalLoggedC,
        fats: totalLoggedF,
      }));
    } catch {}
  }, [totalLoggedCalories, totalLoggedP, totalLoggedC, totalLoggedF]);

  const savePlan = () => {
    localStorage.setItem('atlas-stats', JSON.stringify(stats));
    localStorage.setItem('ironforge-stats', JSON.stringify(stats)); // keep legacy for migration
    setShowWizard(false);
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'Breakfast': case 'إفطار': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Lunch':     case 'غداء':  return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'Dinner':    case 'عشاء':  return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'Pre-Workout': case 'قبل التمرين': return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'Post-Workout': case 'بعد التمرين': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Snack':    case 'وجبة خفيفة':  return 'bg-pink-500/15 text-pink-400 border-pink-500/30';
      default: return 'bg-ironforge-card text-ironforge-text border-ironforge-border';
    }
  };

  return (
    <div className="min-h-screen bg-ironforge-background p-6 md:p-8">
      <AuthGate />
      <SubscriptionGate />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ironforge-text mb-2">{t('title')}</h1>
            <p className="text-ironforge-text-muted">
              {stats.goal === 'cutting' ? (locale === 'ar' ? 'خطة تنشيف' : 'Cutting plan') :
               stats.goal === 'bulking'  ? (locale === 'ar' ? 'خطة تضخيم' : 'Bulking plan') :
               stats.goal === 'recomposition' ? (locale === 'ar' ? 'إعادة تكوين الجسم' : 'Body Recomp') :
               (locale === 'ar' ? 'خطة مخصصة' : 'Custom plan')}
              {' • '}
              {locale === 'ar' ? 'تم حسابها من بياناتك' : 'Calculated from your stats'}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-ironforge-primary/20 bg-ironforge-primary/10 px-3 py-1.5">
              <span className="text-base">{COUNTRIES.find(c=>c.code===stats.country)?.flag}</span>
              <span className="text-sm font-medium text-ironforge-text">{COUNTRIES.find(c=>c.code===stats.country) ? (locale==='ar'? COUNTRIES.find(c=>c.code===stats.country)!.name_ar : COUNTRIES.find(c=>c.code===stats.country)!.name_en) : stats.country}</span>
              <span className="text-xs text-ironforge-text-muted">• {locale==='ar'? COUNTRIES.find(c=>c.code===stats.country)?.cuisine_ar : COUNTRIES.find(c=>c.code===stats.country)?.cuisine_en}</span>
              <span className="text-xs text-ironforge-text-muted">• {locale==='ar'?'أكلات معروفة محسوبة بالجرام مع صور':'Known dishes • grams & images'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowWizard(true)} variant="outline" className="border-ironforge-border text-ironforge-text">
              <Sparkles className="w-4 h-4 ml-2" />
              {locale === 'ar' ? 'تعديل الخطة' : 'Edit Plan'}
            </Button>
          </div>
        </div>

        {/* Daily Goals Overview */}
        <Card className="p-6 border-ironforge-border bg-ironforge-card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-ironforge-primary/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-ironforge-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-ironforge-text">
                {locale === 'ar' ? 'الأهداف اليومية المحسوبة' : 'Calculated Daily Goals'}
              </h2>
              <p className="text-sm text-ironforge-text-muted">
                TDEE: {tdee} kcal • {locale === 'ar' ? 'المسجل' : 'Logged'}: {totalLoggedCalories} / {targetMacros.calories}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-ironforge-background">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ironforge-text-muted">{t('calories')}</span>
                <Flame className="w-4 h-4 text-ironforge-primary" />
              </div>
              <p className="text-2xl font-bold text-ironforge-text mb-2">{totalLoggedCalories} / {targetMacros.calories}</p>
              <Progress value={(totalLoggedCalories / targetMacros.calories) * 100} variant="primary" size="sm" />
            </div>
            <div className="p-4 rounded-lg bg-ironforge-background">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ironforge-text-muted">{t('protein')}</span>
                <Drumstick className="w-4 h-4 text-ironforge-primary" />
              </div>
              <p className="text-2xl font-bold text-ironforge-text mb-2">{totalLoggedP}g / {targetMacros.protein}g</p>
              <Progress value={(totalLoggedP / targetMacros.protein) * 100} variant="primary" size="sm" />
            </div>
            <div className="p-4 rounded-lg bg-ironforge-background">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ironforge-text-muted">{t('carbs')}</span>
                <Wheat className="w-4 h-4 text-ironforge-primary" />
              </div>
              <p className="text-2xl font-bold text-ironforge-text mb-2">{totalLoggedC}g / {targetMacros.carbs}g</p>
              <Progress value={(totalLoggedC / targetMacros.carbs) * 100} variant="primary" size="sm" />
            </div>
            <div className="p-4 rounded-lg bg-ironforge-background">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ironforge-text-muted">{t('fats')}</span>
                <Droplet className="w-4 h-4 text-ironforge-primary" />
              </div>
              <p className="text-2xl font-bold text-ironforge-text mb-2">{totalLoggedF}g / {targetMacros.fats}g</p>
              <Progress value={(totalLoggedF / targetMacros.fats) * 100} variant="primary" size="sm" />
            </div>
          </div>
        </Card>

        {/* Meals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-ironforge-text mb-4">
              {(() => { const c = COUNTRIES.find(x=>x.code===stats.country); return locale==='ar' ? `٥ وجبات ${c?.cuisine_ar || ''} محسوبة عليك ${c?.flag || ''} ${c?.name_ar || ''}` : `5 ${c?.cuisine_en || ''} Meals ${c?.flag || ''} ${c?.name_en || ''}` })()}
            </h2>
            <p className="text-xs text-ironforge-text-muted mb-3">{locale==='ar' ? 'وجبة واحدة لكل خانة — مش عاجباك؟ دوس تغيير الوجبة' : 'One meal per slot — tap change for another'}</p>
            <div className="space-y-6">
              {slots.map((slot, sIdx) => {
                const chosenMeal = slot.meals[chosen[sIdx] ?? 0];
                const changeMeal = () => {
                  setChosen(prev => {
                    const cur = prev[sIdx] ?? 0;
                    let nxt = Math.floor(Math.random() * slot.meals.length);
                    if (slot.meals.length > 1 && nxt === cur) nxt = (cur + 1) % slot.meals.length;
                    const updated = { ...prev, [sIdx]: nxt };
                    setSelectedMeal(slot.meals[nxt]);
                    return updated;
                  });
                };
                return (
                <div key={sIdx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={getMealTypeColor(slot.meals[0].meal_type_en)}>{locale==='ar' ? slot.meals[0].meal_type_ar : slot.meals[0].meal_type_en}</Badge>
                    <Button onClick={changeMeal} variant="outline" size="sm" className="border-ironforge-primary/40 text-ironforge-primary hover:bg-ironforge-primary/10">
                      🔀 {locale==='ar' ? 'تغيير الوجبة' : 'Change meal'}
                    </Button>
                  </div>
                  {/* chosen detail card */}
                  <Card onClick={() => setSelectedMeal(chosenMeal)} className="p-4 border-ironforge-border bg-ironforge-card hover:bg-ironforge-card-hover transition cursor-pointer">
                  <div className="flex items-start gap-4">
                    {chosenMeal.imageUrl && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                        <img src={chosenMeal.imageUrl} alt={chosenMeal.name_en} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-ironforge-text mb-1">{locale === 'ar' ? chosenMeal.name_ar : chosenMeal.name_en}</h3>
                          <Badge className={getMealTypeColor(chosenMeal.meal_type_en)}>{locale === 'ar' ? chosenMeal.meal_type_ar : chosenMeal.meal_type_en}</Badge>
                        </div>
                        {chosenMeal.time && (
                          <div className="flex items-center gap-1 text-sm text-ironforge-text-muted shrink-0">
                            <Clock className="w-3 h-3" />{chosenMeal.time}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        <div className="text-center p-2 rounded bg-ironforge-background">
                          <p className="text-sm font-bold text-ironforge-primary">{chosenMeal.calories}</p>
                          <p className="text-xs text-ironforge-text-muted">{locale === 'ar' ? 'سعرة' : 'kcal'}</p>
                        </div>
                        <div className="text-center p-2 rounded bg-ironforge-background">
                          <p className="text-sm font-bold text-ironforge-primary">{chosenMeal.protein}g</p>
                          <p className="text-xs text-ironforge-text-muted">{t('protein')}</p>
                        </div>
                        <div className="text-center p-2 rounded bg-ironforge-background">
                          <p className="text-sm font-bold text-ironforge-primary">{chosenMeal.carbs}g</p>
                          <p className="text-xs text-ironforge-text-muted">{t('carbs')}</p>
                        </div>
                        <div className="text-center p-2 rounded bg-ironforge-background">
                          <p className="text-sm font-bold text-ironforge-primary">{chosenMeal.fats}g</p>
                          <p className="text-xs text-ironforge-text-muted">{t('fats')}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => { e.stopPropagation(); handleMealLog(chosenMeal.id); }}
                      variant={loggedMeals[chosenMeal.id] ? 'primary' : 'outline'}
                      size="sm"
                      className="shrink-0"
                    >
                      {loggedMeals[chosenMeal.id] ? <CheckCircle className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                    </Button>
                  </div>
                </Card>
                </div>
              );})}
            </div>
            {/* Chat Option 2 */}
            <Card className="p-4 border-ironforge-border bg-ironforge-card mt-6">
              <h3 className="font-bold text-ironforge-text mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-ironforge-primary" />{locale==='ar' ? 'اسأل الشات: هاكل إيه النهاردة؟' : 'Ask Chat: What should I eat today?'}</h3>
              <p className="text-xs text-ironforge-text-muted mb-3">{locale==='ar' ? 'اكتب اللي عندك في التلاجة أو نفسك في إيه، والبوت يحسبلك الجرامات ويقولك تتجنب إيه حسب سعراتك' : 'Tell what you have at home, bot calculates grams & what to avoid'}</p>
              <div className="flex gap-2">
                <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') handleChat(); }} placeholder={locale==='ar' ? 'مثال: هاكل كشري' : 'e.g. I will eat koshari'} className="flex-1 bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-sm text-ironforge-text" />
                <Button onClick={() => handleChat()} disabled={chatLoading} className="bg-ironforge-primary text-black">{chatLoading ? '...' : locale==='ar'?'اسأل':'Ask'}</Button>
              </div>
              {chatAns && <div className="mt-3 p-4 rounded-lg bg-ironforge-background border border-ironforge-border leading-8"><ChatMessageBody content={chatAns} /></div>}
              {chatOptions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {chatOptions.map((o, i) => (
                    <button key={i} onClick={() => { setChatInput(o); handleChat(o); }} disabled={chatLoading}
                      className="rounded-full border border-ironforge-primary/50 bg-ironforge-primary/10 px-4 py-1.5 text-sm font-bold text-ironforge-primary hover:bg-ironforge-primary/20 transition">
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Meal Details */}
          {selectedMeal && (
            <div className="lg:col-span-1">
              <Card className="p-6 border-ironforge-border bg-ironforge-card sticky top-6">
                {selectedMeal.imageUrl && (
                  <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                    <img src={selectedMeal.imageUrl} alt={selectedMeal.name_en} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge className={getMealTypeColor(selectedMeal.meal_type_en)}>{locale === 'ar' ? selectedMeal.meal_type_ar : selectedMeal.meal_type_en}</Badge>
                  {selectedMeal.time && (
                    <div className="flex items-center gap-1 text-sm text-ironforge-text-muted">
                      <Clock className="w-3 h-3" />{selectedMeal.time}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-ironforge-text mb-4">{locale === 'ar' ? selectedMeal.name_ar : selectedMeal.name_en}</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center p-3 rounded-lg bg-ironforge-background">
                    <p className="text-lg font-bold text-ironforge-primary">{selectedMeal.calories}</p>
                    <p className="text-xs text-ironforge-text-muted">{locale === 'ar' ? 'سعرة' : 'kcal'}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-ironforge-background">
                    <p className="text-lg font-bold text-ironforge-primary">{selectedMeal.protein}g</p>
                    <p className="text-xs text-ironforge-text-muted">{t('protein')}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-ironforge-background">
                    <p className="text-lg font-bold text-ironforge-primary">{selectedMeal.carbs}g</p>
                    <p className="text-xs text-ironforge-text-muted">{t('carbs')}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-ironforge-background">
                    <p className="text-lg font-bold text-ironforge-primary">{selectedMeal.fats}g</p>
                    <p className="text-xs text-ironforge-text-muted">{t('fats')}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-ironforge-text mb-3 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-ironforge-primary" />{t('ingredients')}</h4>
                  <ul className="space-y-2">
                    {(locale === 'ar' ? selectedMeal.ingredients_ar : selectedMeal.ingredients_en).map((ing, i) => (
                      <li key={i} className="text-sm text-ironforge-text-muted flex items-start gap-2"><span className="text-ironforge-primary">•</span>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-ironforge-text mb-3 flex items-center gap-2"><ChefHat className="w-4 h-4 text-ironforge-primary" />{t('instructions')}</h4>
                  <ol className="space-y-2">
                    {(locale === 'ar' ? selectedMeal.instructions_ar : selectedMeal.instructions_en).map((ins, i) => (
                      <li key={i} className="text-sm text-ironforge-text-muted flex items-start gap-2"><span className="text-ironforge-primary font-semibold">{i + 1}.</span>{ins}</li>
                    ))}
                  </ol>
                </div>
                <Button
                  onClick={() => handleMealLog(selectedMeal.id)}
                  variant={loggedMeals[selectedMeal.id] ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {loggedMeals[selectedMeal.id] ? (<><CheckCircle className="w-4 h-4 ml-2" />{locale === 'ar' ? 'مسجل' : 'Logged'}</>) : (<><Utensils className="w-4 h-4 ml-2" />{t('trackMeal')}</>)}
                </Button>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* WIZARD MODAL */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-ironforge-card p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-ironforge-text">
                {locale === 'ar' ? '🎯 إعداد نظامك الغذائي' : '🎯 Set Up Your Meal Plan'}
              </h2>
              <button onClick={() => setShowWizard(false)} className="text-ironforge-text-muted hover:text-ironforge-text"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-ironforge-text-muted mb-6">
              {locale === 'ar' ? 'أدخل بياناتك وسنحسب لك 5 وجبات محسوبة بالماكروز تلقائياً (Mifflin-St Jeor + TDEE).' : 'Enter your stats and we will generate 5 calculated meals with exact macros (Mifflin-St Jeor + TDEE).'}
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-ironforge-text-muted mb-1 block">{locale === 'ar' ? 'العمر' : 'Age'}</label>
                  <input type="number" value={stats.age} onChange={(e) => setStats({...stats, age: +e.target.value || 0})} className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text" />
                </div>
                <div>
                  <label className="text-sm text-ironforge-text-muted mb-1 block">{locale === 'ar' ? 'الجنس' : 'Gender'}</label>
                  <select value={stats.gender} onChange={(e) => setStats({...stats, gender: e.target.value as any})} className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text">
                    <option value="male">{locale === 'ar' ? 'ذكر' : 'Male'}</option>
                    <option value="female">{locale === 'ar' ? 'أنثى' : 'Female'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-ironforge-text-muted mb-1 block">{locale === 'ar' ? 'الطول (سم)' : 'Height (cm)'}</label>
                  <input type="number" value={stats.height} onChange={(e) => setStats({...stats, height: +e.target.value || 0})} className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text" />
                </div>
                <div>
                  <label className="text-sm text-ironforge-text-muted mb-1 block">{locale === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}</label>
                  <input type="number" value={stats.weight} onChange={(e) => setStats({...stats, weight: +e.target.value || 0})} className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text" />
                </div>
                <div>
                  <label className="text-sm text-ironforge-text-muted mb-1 block">{locale === 'ar' ? 'مستوى النشاط' : 'Activity Level'}</label>
                  <select value={stats.activity} onChange={(e) => setStats({...stats, activity: e.target.value as any})} className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text">
                    <option value="sedentary">{locale === 'ar' ? 'خامل' : 'Sedentary'}</option>
                    <option value="light">{locale === 'ar' ? 'خفيف' : 'Light'}</option>
                    <option value="moderate">{locale === 'ar' ? 'متوسط' : 'Moderate'}</option>
                    <option value="very">{locale === 'ar' ? 'نشط' : 'Very Active'}</option>
                    <option value="extra">{locale === 'ar' ? 'نشط جداً' : 'Extra Active'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-ironforge-text-muted mb-1 block">{locale === 'ar' ? 'الهدف' : 'Goal'}</label>
                  <select value={stats.goal} onChange={(e) => setStats({...stats, goal: e.target.value as any})} className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text">
                    <option value="cutting">{locale === 'ar' ? 'تنشيف' : 'Cutting'}</option>
                    <option value="maintenance">{locale === 'ar' ? 'الحفاظ' : 'Maintenance'}</option>
                    <option value="recomposition">{locale === 'ar' ? 'إعادة تكوين' : 'Recomposition'}</option>
                    <option value="bulking">{locale === 'ar' ? 'تضخيم' : 'Bulking'}</option>
                    <option value="fitness">{locale === 'ar' ? 'لياقة' : 'Fitness'}</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-ironforge-text-muted mb-1 block">{locale === 'ar' ? '🌍 بلدك (نظامك الغذائي حسب مطبخ بلدك)' : '🌍 Your Country (meals from your cuisine)'}</label>
                  <select value={stats.country} onChange={(e) => setStats({...stats, country: e.target.value as CountryCode})} className="w-full bg-ironforge-background border border-ironforge-border rounded-lg px-3 py-2 text-ironforge-text">
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {locale === 'ar' ? c.name_ar : c.name_en} — {locale === 'ar' ? c.cuisine_ar : c.cuisine_en}</option>
                    ))}
                  </select>
                  <p className="text-xs text-ironforge-text-muted mt-1">{locale === 'ar' ? 'سيتم توليد 5 وجبات بأكلات معروفة في بلدك، محسوبة بالجرام والسعرات مع صورة لكل وجبة.' : '5 meals from your local cuisine, calculated in grams & calories with images.'}</p>
                </div>
              </div>

              {/* Live preview */}
              <div className="mt-4 p-4 rounded-xl bg-ironforge-background border border-ironforge-border">
                <p className="text-sm text-ironforge-text-muted mb-2">{locale === 'ar' ? 'النظام المحسوب' : 'Your Calculated Plan'}</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-2xl font-bold text-ironforge-primary">{targetMacros.calories}</p>
                    <p className="text-xs text-ironforge-text-muted">{locale === 'ar' ? 'سعرة' : 'kcal'}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ironforge-primary">{targetMacros.protein}g</p>
                    <p className="text-xs text-ironforge-text-muted">{t('protein')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ironforge-primary">{targetMacros.carbs}g</p>
                    <p className="text-xs text-ironforge-text-muted">{t('carbs')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ironforge-primary">{targetMacros.fats}g</p>
                    <p className="text-xs text-ironforge-text-muted">{t('fats')}</p>
                  </div>
                </div>
                <p className="text-xs text-ironforge-text-muted mt-2">
                  TDEE: {tdee} kcal • {locale === 'ar' ? 'مقسمة على 5 وجبات' : 'split into 5 meals'}
                </p>
              </div>

              <Button onClick={savePlan} className="w-full bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background">
                {locale === 'ar' ? 'توليد النظام' : 'Generate Plan'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
