'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { saveAccount, refreshSubFromServer, syncTrialFromServer } from '@/lib/subscription';
import { Loader2 } from 'lucide-react';

// Blocks the page until a real (Google) session exists.
// No session → redirect to login. Session → start trial clock + sync subscription.
export default function AuthGate() {
  const router = useRouter();
  const locale = useLocale();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const email = data.session?.user?.email?.toLowerCase().trim();
        if (!email) {
          router.replace('/auth/login');
          return;
        }
        saveAccount(email); // starts 3-day trial on first login (local clock)
        await syncTrialFromServer(email); // converge to server clock (website ↔ app)
        refreshSubFromServer(email);
        setOk(true);
      } catch {
        router.replace('/auth/login');
      }
    };
    run();
  }, [router]);

  if (ok) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ironforge-background">
      <Loader2 className="w-8 h-8 animate-spin text-ironforge-primary" />
    </div>
  );
}
