'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessageSquare,
  Dumbbell,
  Apple,
  User,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';

export interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

interface SidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  userAvatar?: string;
  userName?: string;
  userEmail?: string;
}

const defaultNavItems: SidebarItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />
  },
  {
    href: '/dashboard/chat',
    label: 'AI Coach Chat',
    icon: <MessageSquare className="h-5 w-5" />,
    badge: 'AI',
    badgeVariant: 'primary'
  },
  {
    href: '/dashboard/workouts',
    label: 'Workouts',
    icon: <Dumbbell className="h-5 w-5" />
  },
  {
    href: '/dashboard/nutrition',
    label: 'Nutrition',
    icon: <Apple className="h-5 w-5" />
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: <User className="h-5 w-5" />
  }
];

const secondaryNavItems: SidebarItem[] = [
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />
  }
];

const Sidebar: React.FC<SidebarProps> = ({
  collapsed: controlledCollapsed,
  onCollapsedChange,
  userAvatar,
  userName = 'Alex Johnson',
  userEmail = 'alex@ironforge.ai'
}) => {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed! : internalCollapsed;

  const toggleCollapsed = React.useCallback(() => {
    const newCollapsed = !collapsed;
    if (!isControlled) {
      setInternalCollapsed(newCollapsed);
    }
    onCollapsedChange?.(newCollapsed);
  }, [collapsed, isControlled, onCollapsedChange]);

  const renderNavItem = (item: SidebarItem, index: number) => {
    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

    return (
      <Link
        key={`${item.href}-${index}`}
        href={item.href}
        className={cn(
          'group relative flex items-center gap-3 rounded-xl transition-all duration-200',
          collapsed ? 'h-11 w-11 justify-center px-0' : 'h-11 px-3.5',
          isActive
            ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20 shadow-sm shadow-lime-400/5'
            : 'text-gray-400 hover:text-gray-100 hover:bg-neutral-800/70 border border-transparent hover:border-neutral-700/60'
        )}
      >
        <span
          className={cn(
            'shrink-0 transition-transform duration-200',
            isActive ? 'scale-110' : 'group-hover:scale-105'
          )}
        >
          {item.icon}
        </span>

        {!collapsed && (
          <>
            <span className="flex-1 text-sm font-medium truncate">
              {item.label}
            </span>
            {item.badge && (
              <Badge
                variant={item.badgeVariant || 'primary'}
                size="sm"
                className="shrink-0"
              >
                {item.badgeVariant === 'primary' && (
                  <Sparkles className="h-3 w-3" />
                )}
                {item.badge}
              </Badge>
            )}
          </>
        )}

        {isActive && collapsed && (
          <span className="absolute -left-[17px] top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-lime-400" />
        )}

        {collapsed && (
          <div className="pointer-events-none absolute left-full ms-3 z-50 hidden items-center gap-2 whitespace-nowrap rounded-xl border border-neutral-700/60 bg-neutral-900 px-3 py-2 text-sm font-medium text-gray-100 shadow-xl shadow-black/30 group-hover:flex animate-fade-in">
            {item.label}
            {item.badge && (
              <Badge variant={item.badgeVariant || 'primary'} size="sm">
                {item.badge}
              </Badge>
            )}
            <div className="absolute end-full h-2 w-2 rotate-45 -me-1 border-s border-b border-neutral-700/60 bg-neutral-900" />
          </div>
        )}
      </Link>
    );
  };

  return (
    <>
      <aside
        className={cn(
          'fixed left-4 top-24 bottom-4 z-30 flex flex-col rounded-3xl border border-neutral-800 bg-[#121212] backdrop-blur-sm transition-all duration-300 ease-out animate-slide-up',
          collapsed ? 'w-[72px]' : 'w-72'
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-800/60">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-lime-500 shadow-sm shadow-lime-400/20">
                <Dumbbell className="h-4 w-4 text-black" />
              </div>
              <span className="text-sm font-bold text-gray-100 tracking-tight">
                Dashboard
              </span>
            </div>
          )}

          <button
            onClick={toggleCollapsed}
            className={cn(
              'flex h-9 items-center justify-center rounded-xl border border-neutral-700/50 bg-neutral-800/50 text-gray-400 transition-all duration-200 hover:bg-neutral-800 hover:text-gray-100 hover:border-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/40',
              collapsed ? 'w-9 mx-auto' : 'w-9 px-0'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!collapsed && (
            <div className="px-2 pb-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Main Menu
              </p>
            </div>
          )}

          <nav className="space-y-1">
            {defaultNavItems.map((item, index) => renderNavItem(item, index))}
          </nav>

          <div className="py-4">
            <Separator />
          </div>

          {!collapsed && (
            <div className="px-2 pb-2 pt-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                System
              </p>
            </div>
          )}

          <nav className="space-y-1">
            {secondaryNavItems.map((item, index) => renderNavItem(item, index))}
          </nav>
        </div>

        <div className="border-t border-neutral-800/60 p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-2xl p-2 transition-all duration-200 hover:bg-neutral-800/60 cursor-pointer group',
              collapsed && 'justify-center p-2'
            )}
          >
            <Avatar
              src={userAvatar}
              alt={userName}
              size="sm"
              ring
            />

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-100 truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userEmail}
                </p>
              </div>
            )}

            {!collapsed && (
              <button
                className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 transition-all duration-200 hover:bg-neutral-700/60 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      <div
        className={cn(
          'transition-all duration-300 ease-out shrink-0',
          collapsed ? 'ms-[88px]' : 'ms-[304px]'
        )}
        aria-hidden="true"
      />
    </>
  );
};

export { Sidebar };
