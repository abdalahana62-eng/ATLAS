'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

// Fallback OAuth callback: /auth/callback?code=...&next=/ar/onboarding
// Supabase Dashboard may still redirect here (old Site URL / Redirect URL,
// cached login pages). Client-side exchange so it works on Vercel AND
// in the Capacitor static export (no server route needed).
function CallbackInner() {
  const params = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const rawNext = params.get('next') ?? '/ar/onboarding';
      // Prevent open-redirect: only allow internal paths
      const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/ar/onboarding';
      const locale = next.startsWith('/en') ? 'en' : 'ar';
      const loginUrl = `/${locale}/auth/login`;
      const code = params.get('code');
      const oauthError = params.get('error');
      if (oauthError) {
        window.location.href = `${loginUrl}?error=${encodeURIComponent(params.get('error_description') || oauthError)}`;
        return;
      }
      if (code) {
        try {
          const supabase = createClient();
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            try {
              const { data } = await supabase.auth.getSession();
              const email = data.session?.user?.email?.toLowerCase().trim();
              if (email) {
                const { saveAccount, syncTrialFromServer, refreshSubFromServer } = await import('@/lib/subscription');
                saveAccount(email);
                syncTrialFromServer(email).catch(() => {});
                refreshSubFromServer(email);
              }
            } catch {}
            window.location.href = next;
            return;
          }
          const msg = error.message || '';
          // Stale/old login link (PKCE verifier gone): the session may still
          // exist (user already logged in) → go to next instead of error.
          // Otherwise show a friendly retry message instead of raw tech text.
          try {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
              window.location.href = next;
              return;
            }
          } catch {}
          const friendly = /pkce|code verifier|already used|expired/i.test(msg)
            ? 'انتهت صلاحية رابط الدخول ده (رابط قديم)، دوس الدخول بحساب جوجل مرة واحدة جديدة'
            : msg;
          window.location.href = `${loginUrl}?error=${encodeURIComponent(friendly)}`;
        } catch (e: any) {
          window.location.href = `${loginUrl}?error=${encodeURIComponent(e?.message || 'auth failed')}`;
        }
        return;
      }
      window.location.href = loginUrl;
    };
    run();
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ironforge-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-ironforge-primary mx-auto mb-3" />
        <p className="text-sm text-ironforge-text-muted">جاري تسجيل الدخول… • Signing you in…</p>
      </div>
    </div>
  );
}

export default function TopLevelAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-ironforge-background">
          <Loader2 className="w-8 h-8 animate-spin text-ironforge-primary" />
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
