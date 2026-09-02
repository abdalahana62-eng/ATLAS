'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dumbbell,
  Menu,
  X,
  Globe,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export interface NavItem {
  href: string;
  label: string;
}

interface NavbarProps {
  navItems?: NavItem[];
  isAuthenticated?: boolean;
  userAvatar?: string;
  userName?: string;
}

const defaultNavItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/workouts', label: 'Workouts' },
  { href: '/nutrition', label: 'Nutrition' },
  { href: '/chat', label: 'AI Coach' },
  { href: '/pricing', label: 'Pricing' }
];

const Navbar: React.FC<NavbarProps> = ({
  navItems = defaultNavItems,
  isAuthenticated = false,
  userAvatar,
  userName
}) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [locale, setLocale] = React.useState<'en' | 'ar'>('en');
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLocale = () => {
    setLocale((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-4 left-4 right-4 z-40 mx-auto max-w-7xl transition-all duration-300 animate-slide-down',
          scrolled
            ? 'bg-neutral-900/95 backdrop-blur-xl border-neutral-700/60 shadow-xl shadow-black/20'
            : 'bg-neutral-900/80 backdrop-blur-lg border-neutral-800',
          'border rounded-2xl'
        )}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-10">
              <Link
                href="/"
                className="flex items-center gap-3 group shrink-0"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400 to-lime-500 shadow-lg shadow-lime-400/20 transition-transform duration-200 group-hover:scale-105">
                  <Dumbbell className="h-5 w-5 text-black" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-bold text-gray-100 tracking-tight">
                    Ironforge
                  </span>
                  <span className="text-[10px] font-medium text-lime-400 tracking-widest uppercase">
                    AI Coach
                  </span>
                </div>
              </Link>

              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                        isActive
                          ? 'text-gray-100 bg-neutral-800/70'
                          : 'text-gray-400 hover:text-gray-100 hover:bg-neutral-800/40'
                      )}
                    >
                      {item.label}
                      {item.href === '/chat' && (
                        <Badge
                          variant="primary"
                          size="sm"
                          className="absolute -top-1 -right-1"
                          dot
                        >
                          <Sparkles className="h-3 w-3" />
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleLocale}
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-neutral-700/70 bg-neutral-800/50 text-gray-300 text-xs font-medium transition-all duration-200 hover:bg-neutral-800 hover:border-neutral-600 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/40"
              >
                <Globe className="h-3.5 w-3.5 text-lime-400" />
                <span className="uppercase font-semibold tracking-wide">{locale}</span>
              </button>

              <div className="hidden sm:flex items-center gap-2">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3 pl-2">
                    <Avatar
                      src={userAvatar}
                      alt={userName || 'User'}
                      size="sm"
                      ring
                    />
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                    <Button variant="primary" size="sm">
                      Get Started
                    </Button>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-neutral-700/70 bg-neutral-800/50 text-gray-300 transition-all duration-200 hover:bg-neutral-800 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/40"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-800 animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'text-gray-100 bg-neutral-800/70'
                        : 'text-gray-400 hover:text-gray-100 hover:bg-neutral-800/40'
                    )}
                  >
                    {item.label}
                    {item.href === '/chat' && (
                      <Badge variant="primary" size="sm" dot>
                        NEW
                      </Badge>
                    )}
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-neutral-800 space-y-3">
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-xl border border-neutral-700/70 bg-neutral-800/50 text-gray-300 text-sm font-medium transition-all duration-200 hover:bg-neutral-800"
                >
                  <Globe className="h-4 w-4 text-lime-400" />
                  <span>Language: </span>
                  <span className="uppercase font-semibold">{locale}</span>
                </button>

                {isAuthenticated ? (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar src={userAvatar} alt={userName || 'User'} size="md" ring />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-100">
                        {userName || 'User'}
                      </span>
                      <span className="text-xs text-gray-500">Account</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-1">
                    <Button variant="outline" size="md" className="w-full">
                      Sign In
                    </Button>
                    <Button variant="primary" size="md" className="w-full">
                      Get Started Free
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-20" />
    </>
  );
};

export { Navbar };
