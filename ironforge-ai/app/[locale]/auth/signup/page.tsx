'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { Loader2 } from 'lucide-react';

// Signup is Google-only → redirect to login (same Google button)
export default function SignupPage() {
  const router = useRouter();
  const locale = useLocale();
  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);
  return (
    <div className="min-h-screen bg-ironforge-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-ironforge-primary" />
    </div>
  );
}
