'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { Dumbbell, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'en';
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
