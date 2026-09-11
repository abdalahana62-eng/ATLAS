'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

// Safety net: if Supabase falls back to the Site URL with ?code=... (e.g.
// redirect-URL mismatch or a cached old login page), complete the login here
// instead of stranding the user on the homepage.
function CatcherInner() {
  const params = useSearchParams();
  const locale = useLocale();

  useEffect(() => {
    const code = params.get('code');
    if (!code) return;
    const run = async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          const { saveAccount } = await import('@/lib/subscription');
          const { data } = await supabase.auth.getSession();
          const email = data.session?.user?.email?.toLowerCase().trim();
          if (email) {
            saveAccount(email);
            const { syncTrialFromServer, refreshSubFromServer } = await import('@/lib/subscription');
            await syncTrialFromServer(email);
            refreshSubFromServer(email);
          }
          window.location.replace(`/${locale}/onboarding`);
        }
      } catch {}
    };
    run();
  }, [params, locale]);

  return null;
}

export default function AuthCodeCatcher() {
  return (
    <Suspense>
      <CatcherInner />
    </Suspense>
  );
}
