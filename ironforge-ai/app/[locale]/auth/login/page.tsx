'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Dumbbell, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const localeKey = locale === 'ar' ? 'ar' : 'en';
  const isRTL = locale === 'ar';
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const content = {
    en: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue your fitness journey',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      submitButton: 'Sign In',
      loading: 'Signing in...',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      or: 'or continue with',
      forgotPassword: 'Forgot password?'
    },
    ar: {
      title: 'مرحباً بعودتك',
      subtitle: 'سجل الدخول لمتابعة رحلتك في اللياقة البدنية',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: '••••••••',
      submitButton: 'تسجيل الدخول',
      loading: 'جاري تسجيل الدخول...',
      noAccount: 'ليس لديك حساب؟',
      signUp: 'إنشاء حساب',
      or: 'أو تابع بـ',
      forgotPassword: 'نسيت كلمة المرور؟'
    }
  }[localeKey] ?? {
    title: 'Welcome Back',
    subtitle: 'Sign in to continue your fitness journey',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    submitButton: 'Sign In',
    loading: 'Signing in...',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    or: 'or continue with',
    forgotPassword: 'Forgot password?'
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
      } else {
        router.refresh();
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ironforge-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-ironforge-primary/20 flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-ironforge-primary" />
            </div>
            <span className="text-2xl font-bold text-ironforge-text">
              Iron<span className="text-ironforge-primary">Forge</span>
            </span>
          </div>
        </div>

        <div className="cn-ironforge-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-ironforge-text mb-2">
              {content.title}
            </h1>
            <p className="text-ironforge-text-muted">{content.subtitle}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ironforge-text mb-2">
                {content.emailLabel}
              </label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-ironforge-text-muted`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={content.emailPlaceholder}
                  className={`w-full bg-ironforge-background border border-ironforge-border rounded-lg py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-ironforge-text placeholder-ironforge-text-muted focus:outline-none focus:border-ironforge-primary focus:ring-1 focus:ring-ironforge-primary transition-all`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ironforge-text mb-2">
                {content.passwordLabel}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-ironforge-text-muted`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={content.passwordPlaceholder}
                  className={`w-full bg-ironforge-background border border-ironforge-border rounded-lg py-3 ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} text-ironforge-text placeholder-ironforge-text-muted focus:outline-none focus:border-ironforge-primary focus:ring-1 focus:ring-ironforge-primary transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-ironforge-text-muted hover:text-ironforge-text transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/reset-password"
                className="text-sm text-ironforge-primary hover:text-ironforge-primary-dark transition-colors"
              >
                {content.forgotPassword}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ironforge-primary hover:bg-ironforge-primary-dark text-ironforge-background font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {content.loading}
                </>
              ) : (
                content.submitButton
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-ironforge-text-muted">
              {content.noAccount}{' '}
              <Link
                href="/auth/signup"
                className="text-ironforge-primary hover:text-ironforge-primary-dark font-medium transition-colors"
              >
                {content.signUp}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
