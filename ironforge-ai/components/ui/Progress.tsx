'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type ProgressVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = 'primary',
      size = 'md',
      showLabel = false,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants: Record<ProgressVariant, string> = {
      default: 'bg-ironforge-text-muted',
      primary: 'bg-gradient-to-r from-ironforge-primary to-ironforge-primary-dark',
      success: 'bg-gradient-to-r from-emerald-400 to-emerald-300',
      warning: 'bg-gradient-to-r from-amber-400 to-amber-300',
      danger: 'bg-gradient-to-r from-red-500 to-red-400'
    };

    const sizes: Record<ProgressSize, string> = {
      sm: 'h-1.5 rounded-full',
      md: 'h-2.5 rounded-full',
      lg: 'h-4 rounded-xl'
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between mb-2">
            {label && <span className="text-sm font-medium text-ironforge-text-muted">{label}</span>}
            {showLabel && (
              <span className="text-sm font-semibold text-ironforge-text">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          className={cn(
            'w-full overflow-hidden bg-ironforge-card border border-ironforge-border',
            sizes[size]
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn(
              'h-full transition-all duration-500 ease-out',
              variants[variant],
              sizes[size]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
