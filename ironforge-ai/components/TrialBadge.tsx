'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Crown, Clock } from 'lucide-react';
import { trialDaysLeft, subDaysLeft, getAccount, refreshSubFromServer, syncTrialFromServer } from '@/lib/subscription';

// Shows current plan: trial countdown or active subscription
export default function TrialBadge() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [label, setLabel] = useState<string | null>(null);
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const run = async () => {
      const acc = getAccount();
      if (!acc) return;
      await syncTrialFromServer(acc.email);
      await refreshSubFromServer(acc.email);
      const sub = subDaysLeft();
      if (sub > 0) {
        setLabel(isAr ? `مشترك • متبقي ${sub} يوم` : `Pro • ${sub}d left`);
        setUrgent(sub <= 3);
        return;
      }
      const t = trialDaysLeft();
      setLabel(isAr ? `تجربة مجانية • متبقي ${t} ${t === 1 ? 'يوم' : 'أيام'}` : `Free trial • ${t}d left`);
      setUrgent(t <= 1);
    };
    run();
  }, []);

  if (!label) return null;
  return (
    <Link href={`/${locale}/pricing`}>
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition hover:opacity-80 ${urgent ? 'bg-red-500/15 text-red-400 border-red-500/40' : 'bg-ironforge-primary/15 text-ironforge-primary border-ironforge-primary/30'}`}>
        {urgent ? <Clock className="h-3 w-3" /> : <Crown className="h-3 w-3" />}
        {label}
      </span>
    </Link>
  );
}
