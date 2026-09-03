'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Dumbbell, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const locale = useLocale();
  const localeKey = locale === 'ar' ? 'ar' : 'en';
  const isRTL = locale === 'ar';
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const content = {
    en: {
      title: 'Create Account',
      subtitle: 'Start your fitness journey with IronForge AI',
      nameLabel: 'Full Name',
      namePlaceholder: 'John Doe',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      submitButton: 'Create Account',
      loading: 'Creating account...',
      hasAccount: 'Already have an account?',
      signIn: 'Sign in',
      passwordMismatch: 'Passwords do not match',
      passwordShort: 'Password must be at least 6 characters'
    },
    ar: {
      title: 'إنشاء حساب',
      subtitle: 'ابدأ رحلتك في اللياقة البدنية مع IronForge AI',
      nameLabel: 'الاسم الكامل',
      namePlaceholder: 'أحمد محمد',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: '٦ أحرف على الأقل',
      confirmPasswordLabel: 'تأكيد كلمة المرور',
      confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
      submitButton: 'إنشاء حساب',
      loading: 'جاري إنشاء الحساب...',
      hasAccount: 'لديك حساب بالفعل؟',
      signIn: 'تسجيل الدخول',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      passwordShort: 'يجب أن تكون كلمة المرور ٦ أحرف على الأقل'
    }
  }[localeKey] ?? {
    title: 'Create Account',
    subtitle: 'Start your fitness journey with IronForge AI',
    nameLabel: 'Full Name',
    namePlaceholder: 'John Doe',
    emailLabel: 'Email',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'At least 6 characters',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    submitButton: 'Create Account',
    loading: 'Creating account...',
    hasAccount: 'Already have an account?',
    signIn: 'Sign in',
    passwordMismatch: 'Passwords do not match',
    passwordShort: 'Password must be at least 6 characters'
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(content.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(content.passwordShort);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: email.split('@')[0]
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

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

  async function handleGoogleSignIn() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        },
      },
    });
    if (error) setError(error.message);
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
                {content.nameLabel}
              </label>
              <div className="relative">
                <User className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-ironforge-text-muted`} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={content.namePlaceholder}
                  className={`w-full bg-ironforge-background border border-ironforge-border rounded-lg py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-ironforge-text placeholder-ironforge-text-muted focus:outline-none focus:border-ironforge-primary focus:ring-1 focus:ring-ironforge-primary transition-all`}
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-ironforge-text mb-2">
                {content.confirmPasswordLabel}
              </label>
              <div className="relative">
                <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-ironforge-text-muted`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={content.confirmPasswordPlaceholder}
                  className={`w-full bg-ironforge-background border border-ironforge-border rounded-lg py-3 ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'} text-ironforge-text placeholder-ironforge-text-muted focus:outline-none focus:border-ironforge-primary focus:ring-1 focus:ring-ironforge-primary transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-ironforge-text-muted hover:text-ironforge-text transition-colors`}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-ironforge-border" />
            <span className="text-sm text-ironforge-text-muted">{locale === 'ar' ? 'أو' : 'or'}</span>
            <div className="flex-1 h-px bg-ironforge-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg border border-gray-200 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {locale === 'ar' ? 'المتابعة بجوجل' : 'Continue with Google'}
          </button>

          <div className="mt-8 text-center">
            <p className="text-ironforge-text-muted">
              {content.hasAccount}{' '}
              <Link
                href="/auth/login"
                className="text-ironforge-primary hover:text-ironforge-primary-dark font-medium transition-colors"
              >
                {content.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
