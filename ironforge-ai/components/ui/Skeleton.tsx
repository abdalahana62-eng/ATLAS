'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rounded', width, height, ...props }, ref) => {
    const baseStyles = 'animate-pulse bg-neutral-800 relative overflow-hidden';

    const variants = {
      text: 'h-4 rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-none',
      rounded: 'rounded-xl'
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          className
        )}
        style={{
          ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
          ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height })
        }}
        {...props}
      >
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-700/30 to-transparent" />
      </div>
    );
  }
);
Skeleton.displayName = 'Skeleton';

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, lines = 4, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-2xl border border-neutral-800 bg-[#171717] p-6', className)}
      {...props}
    >
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" className="w-2/3" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            className={cn(i === lines - 1 && 'w-4/5')}
          />
        ))}
      </div>
    </div>
  )
);
SkeletonCard.displayName = 'SkeletonCard';

export { Skeleton, SkeletonCard };
