'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

// Google OAuth callback: /<locale>/auth/callback?code=...&next=/<locale>/onboarding
// Client-side code exchange (works on Vercel AND inside the Capacitor APK build,
// where server routes can't be statically exported).
function CallbackInner() {
  const params = useSearchParams();
  const locale = useLocale();

  useEffect(() => {
    const run = async () => {
      const loginUrl = `/${locale}/auth/login`;
      const code = params.get('code');
      const next = params.get('next') ?? `/${locale}/onboarding`;
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
            window.location.href = next;
            return;
          }
          const msg = error.message || '';
          // Stale link (PKCE verifier gone) but session may exist → proceed.
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
  }, [params, locale]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ironforge-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-ironforge-primary mx-auto mb-3" />
        <p className="text-sm text-ironforge-text-muted">جاري تسجيل الدخول… • Signing you in…</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
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
