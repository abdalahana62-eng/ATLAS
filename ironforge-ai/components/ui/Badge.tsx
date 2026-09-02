'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, ...props }, ref) => {
    const variants: Record<BadgeVariant, string> = {
      default: 'bg-ironforge-card text-ironforge-text border border-ironforge-border',
      primary: 'bg-ironforge-primary/15 text-ironforge-primary border border-ironforge-primary/30',
      secondary: 'bg-ironforge-card-hover text-ironforge-text-muted border border-ironforge-border',
      success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      danger: 'bg-red-500/15 text-red-400 border border-red-500/30',
      outline: 'bg-transparent text-ironforge-text-muted border border-ironforge-border'
    };

    const sizes: Record<BadgeSize, string> = {
      sm: 'h-5 px-2 text-[10px] rounded-md gap-1',
      md: 'h-6 px-2.5 text-xs rounded-lg gap-1.5',
      lg: 'h-7 px-3 text-sm rounded-xl gap-2'
    };

    const dotColors: Record<BadgeVariant, string> = {
      default: 'bg-gray-400',
      primary: 'bg-lime-400',
      secondary: 'bg-gray-500',
      success: 'bg-emerald-400',
      warning: 'bg-amber-400',
      danger: 'bg-red-400',
      outline: 'bg-gray-500'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />
        )}
        {props.children}
      </div>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
