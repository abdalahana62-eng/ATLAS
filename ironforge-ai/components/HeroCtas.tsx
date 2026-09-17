'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

// أزرار الهيرو — client component عشان LiquidButton لا يدعم asChild
// (جواه 4 عناصر: ظل + backdrop + محتوى + فلتر، و Slot يقبل عنصر واحد فقط).
// التنقل بزر عادي عبر router بدل Link داخل Slot.
export default function HeroCtas({
  nextLabel,
  continueLabel,
}: {
  nextLabel: string;
  continueLabel: string;
}) {
  const router = useRouter();

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <LiquidButton
        size="lg"
        onClick={() => router.push('/onboarding')}
        className="w-full rounded-2xl px-7 text-base font-bold text-white sm:w-auto"
      >
        <span className="inline-flex items-center gap-2">
          {nextLabel}
          <ArrowRight className="h-4 w-4" />
        </span>
      </LiquidButton>

      <LiquidButton
        size="lg"
        variant="secondary"
        onClick={() => router.push('/auth/signup')}
        className="w-full rounded-2xl px-7 text-base font-bold text-white sm:w-auto"
      >
        {continueLabel}
      </LiquidButton>
    </div>
  );
}
