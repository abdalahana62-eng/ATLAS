'use client';

import { useState, Suspense, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Dumbbell, Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const rawError = searchParams.get('error');
  const [error, setError] = useState<string | null>(
    rawError && /pkce|code verifier|already used|expired/i.test(rawError)
      ? 'انتهت صلاحية رابط الدخول ده (رابط قديم)، دوس الدخول بحساب جوجل مرة واحدة جديدة'
      : rawError
  );
  // نسخ الـ APK القديمة اتبنت من غير مفاتيح Supabase → زرار جوجل بيودي
  // على رابط وهمي (example.supabase.co) ويدي "لا يمكن الوصول للموقع".
  const missingBackend = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  const isCapacitorApp = () => {
    try {
      const w = window as any;
      return !!(w.Capacitor?.isNativePlatform?.() || w.Capacitor?.isNative);
    } catch {
      return false;
    }
  };

  // Already logged in → go straight to dashboard (never show signup again)
  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          const { saveAccount } = await import('@/lib/subscription');
          saveAccount(data.session.user.email.toLowerCase().trim());
          window.location.href = `/${locale}/dashboard`;
        }
      } catch {}
    };
    run();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      // Inside the APK the OAuth flow must run in the system browser and
      // return via deep link — otherwise the session ends up in the external
      // browser and the app itself stays logged out.
      if (isCapacitorApp()) {
        await signInWithGoogleInApp();
        return;
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/${locale}/auth/callback?next=/${locale}/onboarding`,
        },
      });
      if (error) setError(error.message);
    } catch {
      setError(isAr ? 'حدث خطأ' : 'Something went wrong');
      setLoading(false);
    }
  };

  const signInWithGoogleInApp = async () => {
    try {
      const [{ Browser }, { App }] = await Promise.all([
        import('@capacitor/browser'),
        import('@capacitor/app'),
      ]);
      let finished = false;
      const cleanup = async (sub: { remove: () => void }) => {
        try { sub.remove(); } catch {}
        try { await Browser.close(); } catch {}
      };
      const fail = async (sub: { remove: () => void }, msg: string) => {
        if (finished) return;
        finished = true;
        await cleanup(sub);
        setError(msg);
        setLoading(false);
      };
      const sub = await App.addListener('appUrlOpen', async ({ url }: { url: string }) => {
        if (finished) return;
        try {
          const u = new URL(url);
          const code = u.searchParams.get('code');
          const oauthError = u.searchParams.get('error');
          if (oauthError) {
            await fail(sub, u.searchParams.get('error_description') || oauthError);
            return;
          }
          if (!code) {
            await fail(sub, isAr ? 'رجعنا للتطبيق من غير كود دخول، حاول تاني' : 'No auth code returned, try again');
            return;
          }
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            const raw = error.message || '';
            const msg = /pkce|code verifier|already used|expired/i.test(raw)
              ? 'انتهت صلاحية محاولة الدخول، دوس الدخول بحساب جوجل مرة واحدة جديدة'
              : raw;
            await fail(sub, msg);
            return;
          }
          finished = true;
          await cleanup(sub);
          try {
            const { data } = await supabase.auth.getSession();
            const em = data.session?.user?.email?.toLowerCase().trim();
            if (em) {
              const { saveAccount, syncTrialFromServer, refreshSubFromServer } = await import('@/lib/subscription');
              saveAccount(em);
              syncTrialFromServer(em).catch(() => {});
              refreshSubFromServer(em);
            }
          } catch {}
          window.location.href = `/${locale}/onboarding`;
        } catch (e: any) {
          await fail(sub, e?.message || (isAr ? 'حدث خطأ' : 'Something went wrong'));
        }
      });
      // User closed the browser without finishing → reset the button
      await Browser.addListener('browserFinished', () => {
        setTimeout(() => {
          if (!finished) {
            finished = true;
            try { sub.remove(); } catch {}
            setLoading(false);
          }
        }, 1500);
      });
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'com.atlas.ai://auth/callback',
          skipBrowserRedirect: true,
        },
      });
      if (error || !data?.url) {
        await fail(sub, error?.message || (isAr ? 'حدث خطأ' : 'Something went wrong'));
        return;
      }
      await Browser.open({ url: data.url });
    } catch (e: any) {
      setError(e?.message || (isAr ? 'حدث خطأ' : 'Something went wrong'));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ironforge-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-ironforge-primary/20 flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-ironforge-primary" />
            </div>
            <span className="text-2xl font-bold text-ironforge-text">
              ATLAS
            </span>
          </div>
        </div>

        <div className="cn-ironforge-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-ironforge-text mb-2">
              {isAr ? 'تسجيل الدخول' : 'Sign in'}
            </h1>
            <p className="text-ironforge-text-muted">
              {isAr ? 'ادخل بحساب جوجل عشان تبدأ تجربتك المجانية (3 أيام)' : 'Sign in with Google to start your free trial (3 days)'}
            </p>
          </div>

          {missingBackend && (
            <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm leading-6">
              {isAr
                ? 'نسخة التطبيق دي قديمة ومش متوصلة بالسيرفر. حمّل أحدث إصدار من الموقع (atlasfit.pro) وسجّل من هناك.'
                : 'This app version is outdated and not connected. Download the latest version from atlasfit.pro.'}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            {isAr ? 'الدخول بحساب جوجل' : 'Continue with Google'}
          </button>

          <p className="mt-6 text-center text-xs text-ironforge-text-muted leading-6">
            {isAr
              ? 'بالدخول أنت توافق على شروط الاستخدام. حساب جوجل = بريد حقيقي وموثّق، وتبدأ تجربتك المجانية فوراً.'
              : 'By signing in you agree to the terms. Google = verified real email, trial starts immediately.'}
          </p>
        </div>
      </div>
    </div>
  );
}
