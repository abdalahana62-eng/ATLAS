'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { hasAccess, trialDaysLeft, subDaysLeft, getAccount, refreshSubFromServer } from '@/lib/subscription';

// Shows paywall overlay when trial expired and no active subscription
export default function SubscriptionGate() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [locked, setLocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [trial, setTrial] = useState(0);

  useEffect(() => {
    const run = async () => {
      const acc = getAccount();
      if (acc?.email) await refreshSubFromServer(acc.email);
      setTrial(trialDaysLeft());
      setLocked(!hasAccess());
      setChecked(true);
    };
    run();
  }, []);

  if (!checked || !locked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="w-full max-w-md rounded-2xl border border-ironforge-primary/40 bg-ironforge-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ironforge-primary/15">
          <Lock className="h-7 w-7 text-ironforge-primary" />
        </div>
        <h2 className="text-2xl font-black text-ironforge-text mb-2">
          {isAr ? 'انتهت فترتك التجريبية' : 'Trial expired'}
        </h2>
        <p className="text-sm text-ironforge-text-muted leading-7 mb-6">
          {isAr
            ? 'خلصت الـ 3 أيام المجانية. اشترك من 299 ج.م/شهر بالانستاباي أو فودافون كاش وكمّل كل مميزات ATLAS.'
            : 'Your 3 free days are over. Subscribe from 299 EGP/mo via Instapay or Vodafone Cash.'}
        </p>
        <Link href={`/${locale}/pricing`}>
          <Button className="w-full bg-ironforge-primary text-black font-bold">
            <Crown className="w-5 h-5" /> {isAr ? 'اشترك الآن' : 'Subscribe now'}
          </Button>
        </Link>
        {trial === 0 && subDaysLeft() === 0 && (
          <p className="mt-3 text-xs text-ironforge-text-muted">{isAr ? 'التجربة: 0 يوم متبقي' : 'Trial: 0 days left'}</p>
        )}
      </div>
    </div>
  );
}
