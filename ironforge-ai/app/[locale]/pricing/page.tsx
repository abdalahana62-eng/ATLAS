'use client';

import { useLocale } from 'next-intl';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function PricingPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const plans = [
    {
      name: isAr ? 'مجاني' : 'Free',
      price: '0',
      currency: '$',
      period: isAr ? '/ للأبد' : '/ forever',
      icon: Star,
      color: 'border-ironforge-border',
      btn: isAr ? 'ابدأ مجاناً' : 'Start Free',
      features: isAr ? ['3 تمارين في الأسبوع', 'وجبات محسوبة (5)', 'تتبع بسيط'] : ['3 workouts/week', '5 calculated meals', 'Basic tracking'],
      popular: false,
    },
    {
      name: isAr ? 'Starter' : 'Starter',
      price: '19',
      currency: '$',
      period: isAr ? '/ مرة واحدة' : '/ one-time',
      icon: Zap,
      color: 'border-ironforge-border',
      btn: isAr ? 'اشتري الآن' : 'Buy Now',
      features: isAr ? ['كل أنظمة التمرين (2/3/4/5/منزل)', 'فيديوهات 720p كاملة', 'تتبع التقدم', 'تحديثات مجانية'] : ['All workout systems (2/3/4/5/home)', 'Full 720p videos', 'Progress tracking', 'Free updates'],
      popular: false,
    },
    {
      name: isAr ? 'Pro Lifetime' : 'Pro Lifetime',
      price: '39',
      currency: '$',
      period: isAr ? '/ مدى الحياة' : '/ lifetime',
      icon: Crown,
      color: 'border-ironforge-primary/50 bg-ironforge-primary/5',
      btn: isAr ? 'املكه للأبد ⭐' : 'Own Forever ⭐',
      features: isAr ? ['كل مميزات Starter', '14 مطبخ عالمي', 'AI Coach غير محدود', 'APK أوفلاين', 'تحديثات مدى الحياة + VIP'] : ['Everything in Starter', '14 global cuisines', 'Unlimited AI Coach', 'Offline APK', 'Lifetime updates + VIP'],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-ironforge-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="primary" className="mb-4">ATLAS Pricing</Badge>
          <h1 className="text-4xl font-black text-ironforge-text mb-3">
            {isAr ? 'اختر خطتك' : 'Choose your plan'}
          </h1>
          <p className="text-ironforge-text-muted max-w-2xl mx-auto">
            {isAr ? 'ادفع مرة واحدة واملكه للأبد — منتج رقمي عالمي، تحديث فوري لكل العملاء عبر Vercel' : 'Pay once, own forever — global digital product, instant updates for all customers via Vercel'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card key={plan.name} className={`p-6 relative ${plan.color} ${plan.popular ? 'scale-[1.03] shadow-xl shadow-ironforge-primary/10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" className="bg-ironforge-primary text-black">⭐ {isAr ? 'الأكثر طلباً' : 'Most Popular'}</Badge>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-ironforge-primary/15 flex items-center justify-center text-ironforge-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-ironforge-text">{plan.name}</h3>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-ironforge-text">{plan.price}</span>
                  <span className="text-ironforge-text-muted"> {plan.currency}</span>
                  <span className="text-sm text-ironforge-text-muted">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ironforge-text">
                      <Check className="w-4 h-4 text-ironforge-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === (isAr ? 'مجاني' : 'Free') ? '/onboarding' : '/auth/signup'}>
                  <Button className={`w-full ${plan.popular ? 'bg-ironforge-primary hover:bg-ironforge-primary-dark text-black' : ''}`} variant={plan.popular ? 'primary' : 'outline'}>
                    {plan.btn} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 p-6 rounded-2xl border border-ironforge-border bg-ironforge-card text-center">
          <h3 className="font-bold text-ironforge-text mb-2">{isAr ? 'كيف تتحكم بعد البيع؟' : 'How you control after sale?'}</h3>
          <p className="text-sm text-ironforge-text-muted leading-6">
            {isAr
              ? '1. العميل يدفع $19/$39 على Gumroad/Payhip (مرة واحدة) → ياخد رابط APK + حساب → 2. أنت تتحكم من Supabase Dashboard → 3. أي تحديث تعمله git push → Vercel ينشره تلقائياً بدون APK جديد'
              : '1. Customer pays $19/$39 once via Gumroad/Payhip → gets APK link + account → 2. You control via Supabase Dashboard → 3. Any git push auto-deploys via Vercel, no new APK needed'}
          </p>
        </div>
      </div>
    </div>
  );
}
