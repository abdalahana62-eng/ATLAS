'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { 
  Home, 
  House,
  LayoutDashboard,
  Dumbbell, 
  Utensils, 
  Calculator, 
  MessageSquare, 
  User, 
  Menu,
  X,
  ChevronRight,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isRTL = locale === 'ar';

  const navItems = [
    { 
      href: '/', 
      icon: House, 
      label: 'home',
      badge: null
    },
    { 
      href: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'dashboard',
      badge: null
    },
    { 
      href: '/workout', 
      icon: Dumbbell, 
      label: 'workout',
      badge: null
    },
    { 
      href: '/nutrition', 
      icon: Utensils, 
      label: 'nutrition',
      badge: null
    },
    { 
      href: '/calculator', 
      icon: Calculator, 
      label: 'calculator',
      badge: null
    },
    { 
      href: '/chat', 
      icon: MessageSquare, 
      label: 'chat',
      badge: null
    },
    { 
      href: '/profile', 
      icon: User, 
      label: 'profile',
      badge: null
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    if (href === '/dashboard') {
      return pathname === `/${locale}/dashboard`;
    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleChangeLanguage = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex w-64 shrink-0 bg-ironforge-card border-r border-ironforge-border flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-ironforge-border">
          <button onClick={() => handleNavigation('/')} className="flex items-center gap-3 w-full text-left hover:opacity-90 transition">
            <div className="w-10 h-10 rounded-xl bg-ironforge-primary/20 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-ironforge-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-[0.12em] text-ironforge-text">
                ATLAS
              </h1>
              <p className="text-xs text-ironforge-text-muted">AI Coach</p>
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      active
                        ? 'bg-ironforge-primary/10 text-ironforge-primary'
                        : 'text-ironforge-text-muted hover:bg-ironforge-card-hover hover:text-ironforge-text'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{t(item.label)}</span>
                    {item.badge && (
                      <Badge variant="primary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                    {active && (
                      <ChevronRight className={`w-4 h-4 ml-auto ${isRTL ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t border-ironforge-border space-y-3">
           <Link
            href={pathname}
            locale={locale === 'en' ? 'ar' : 'en'}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-ironforge-primary/30 bg-gradient-to-r from-ironforge-primary/12 via-ironforge-primary/8 to-transparent text-ironforge-text transition-all duration-200 hover:bg-ironforge-primary/10 hover:border-ironforge-primary/50 hover:shadow-lg hover:shadow-ironforge-primary/10"
            aria-label="Change language"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ironforge-primary/15 ring-1 ring-ironforge-primary/30">
              <Globe className="w-4 h-4 text-ironforge-primary" />
            </div>
            <div className="flex items-center justify-between w-full gap-2">
              <span className="font-semibold text-sm">
                {locale === 'ar' ? 'English' : 'العربية'}
              </span>
              <span className="inline-flex items-center justify-center min-w-[2.2rem] rounded-md bg-ironforge-primary/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ironforge-primary ring-1 ring-ironforge-primary/30">
                {locale === 'ar' ? 'EN' : 'AR'}
              </span>
            </div>
          </Link>
          
          <div className="p-3 rounded-lg bg-ironforge-background">
            <p className="text-xs text-ironforge-text-muted mb-1">
              {locale === 'ar' ? 'النسخة' : 'Version'}
            </p>
            <p className="text-sm font-semibold text-ironforge-text">
              1.0.0
            </p>
            <p className="text-[11px] text-ironforge-text-muted mt-2 pt-2 border-t border-ironforge-border">
              Owner: ABDALLAH SHENOO<br />
              <a href="mailto:abdalahana555@gmail.com" className="text-ironforge-primary hover:underline">abdalahana555@gmail.com</a>
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-ironforge-border bg-ironforge-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-around gap-1 px-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-all ${
                  active
                    ? 'text-ironforge-primary'
                    : 'text-ironforge-text-muted'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">{t(item.label)}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-ironforge-text-muted"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium leading-none">{locale === 'ar' ? 'المزيد' : 'More'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-80 bg-ironforge-card border-l border-ironforge-border`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-ironforge-border flex items-center justify-between">
              <button onClick={() => handleNavigation('/')} className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-ironforge-primary/20 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-ironforge-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-[0.12em] text-ironforge-text">
                    ATLAS
                  </h1>
                  <p className="text-xs text-ironforge-text-muted">AI Coach</p>
                </div>
              </button>
              
              <Button
                onClick={() => setIsMobileMenuOpen(false)}
                variant="ghost"
                size="sm"
                className="text-ironforge-text hover:bg-ironforge-card-hover"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <li key={item.href}>
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          active
                            ? 'bg-ironforge-primary/10 text-ironforge-primary'
                            : 'text-ironforge-text-muted hover:bg-ironforge-card-hover hover:text-ironforge-text'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="font-medium">{t(item.label)}</span>
                        {active && (
                          <ChevronRight className={`w-4 h-4 ml-auto ${isRTL ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-ironforge-border pt-4">
                <Link
                  href={pathname}
                  locale={locale === 'en' ? 'ar' : 'en'}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-ironforge-primary/30 bg-gradient-to-r from-ironforge-primary/12 via-ironforge-primary/8 to-transparent text-ironforge-text transition-all duration-200 hover:bg-ironforge-primary/10 hover:border-ironforge-primary/50 hover:shadow-lg hover:shadow-ironforge-primary/10"
                  aria-label="Change language"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ironforge-primary/15 ring-1 ring-ironforge-primary/30">
                    <Globe className="w-4 h-4 text-ironforge-primary" />
                  </div>
                  <span className="font-semibold text-sm">
                    {locale === 'ar' ? 'English' : 'العربية'}
                  </span>
                  <span className="ml-auto inline-flex items-center justify-center min-w-[2.2rem] rounded-md bg-ironforge-primary/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ironforge-primary ring-1 ring-ironforge-primary/30">
                    {locale === 'ar' ? 'EN' : 'AR'}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}