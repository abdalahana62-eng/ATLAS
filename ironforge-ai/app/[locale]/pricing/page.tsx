'use client';

import { useLocale } from 'next-intl';
import { Check, Crown, Zap, Star, ArrowRight, Smartphone, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { PLANS, TRIAL_DAYS } from '@/lib/subscription';

export default function PricingPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const icons = [Star, Zap, Crown];
  const descs = isAr
    ? ['كل التطبيق لمدة شهر', 'كل التطبيق لمدة 3 شهور — وفّر 298ج', 'كل التطبيق لمدة سنة — وفّر 1588ج']
    : ['Full app for 1 month', 'Full app for 3 months', 'Full app for 1 year'];

  return (
    <div className="min-h-screen bg-ironforge-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Badge variant="primary" className="mb-4">ATLAS Pricing</Badge>
          <h1 className="text-4xl font-black text-ironforge-text mb-3">
            {isAr ? 'اختر خطتك' : 'Choose your plan'}
          </h1>
          <p className="text-ironforge-text-muted max-w-2xl mx-auto">
            {isAr
              ? `جرّب كل حاجة مجاناً لمدة ${TRIAL_DAYS} أيام من التسجيل — وبعدها اشترك بالجنيه via انستاباي أو فودافون كاش`
              : `Try everything free for ${TRIAL_DAYS} days after signup — then subscribe via Instapay or Vodafone Cash`}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-ironforge-primary/30 bg-ironforge-primary/10 px-4 py-2 text-sm text-ironforge-primary">
            <Smartphone className="w-4 h-4" />
            {isAr ? 'الدفع: انستاباي / فودافون كاش على 01040771597' : 'Pay: Instapay / Vodafone Cash to 01040771597'}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => {
            const Icon = icons[i];
            const popular = plan.id === 'quarterly';
            return (
              <Card key={plan.id} className={`p-6 relative ${popular ? 'border-ironforge-primary/50 bg-ironforge-primary/5 scale-[1.03] shadow-xl shadow-ironforge-primary/10' : 'border-ironforge-border'}`}>
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" className="bg-ironforge-primary text-black">⭐ {isAr ? 'الأكثر طلباً' : 'Most Popular'}</Badge>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-ironforge-primary/15 flex items-center justify-center text-ironforge-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-ironforge-text">{isAr ? plan.name_ar : plan.name_en}</h3>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-ironforge-text">{plan.price}</span>
                  <span className="text-ironforge-text-muted"> ج.م</span>
                  <span className="text-sm text-ironforge-text-muted">{isAr ? ` / ${plan.days} يوم` : ` / ${plan.days} days`}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    descs[i],
                    isAr ? 'كل أنظمة التمرين + 50 فيديو' : 'All workout systems + 50 videos',
                    isAr ? 'خطة تغذية + 7 اختيارات لكل وجبة' : 'Nutrition plan + 7 choices per meal',
                    isAr ? 'AI Coach غير محدود' : 'Unlimited AI Coach',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ironforge-text">
                      <Check className="w-4 h-4 text-ironforge-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/subscribe?plan=${plan.id}`}>
                  <Button className={`w-full ${popular ? 'bg-ironforge-primary hover:bg-ironforge-primary-dark text-black' : ''}`} variant={popular ? 'primary' : 'outline'}>
                    {isAr ? 'اشترك الآن' : 'Subscribe Now'} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 p-6 rounded-2xl border border-ironforge-border bg-ironforge-card text-center">
          <h3 className="font-bold text-ironforge-text mb-2 flex items-center justify-center gap-2">
            <BadgeCheck className="w-5 h-5 text-ironforge-primary" />
            {isAr ? 'إزاي تشترك؟' : 'How to subscribe?'}
          </h3>
          <p className="text-sm text-ironforge-text-muted leading-7">
            {isAr
              ? '1. اختر الباقة → 2. حوّل المبلغ انستاباي أو فودافون كاش على 01040771597 → 3. ارفع سكرين شوت التحويل ورقم موبايلك → 4. بنفعّلك الاشتراك في أقل من 24 ساعة'
              : '1. Pick a plan → 2. Transfer via Instapay or Vodafone Cash to 01040771597 → 3. Upload the transfer screenshot + your phone → 4. We activate within 24h'}
          </p>
        </div>
      </div>
    </div>
  );
}
