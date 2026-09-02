'use client';

import * as React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: AvatarSize;
  ring?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ring = false, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const sizes: Record<AvatarSize, string> = {
      xs: 'h-7 w-7 rounded-lg',
      sm: 'h-9 w-9 rounded-xl',
      md: 'h-11 w-11 rounded-2xl',
      lg: 'h-14 w-14 rounded-2xl',
      xl: 'h-20 w-20 rounded-3xl',
      '2xl': 'h-28 w-28 rounded-3xl'
    };

    const iconSizes: Record<AvatarSize, string> = {
      xs: 'h-3.5 w-3.5',
      sm: 'h-4.5 w-4.5',
      md: 'h-5 w-5',
      lg: 'h-7 w-7',
      xl: 'h-10 w-10',
      '2xl': 'h-14 w-14'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0',
          ring && 'ring-2 ring-lime-400/50 ring-offset-2 ring-offset-[#0a0a0a]',
          sizes[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || ''}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-gray-400 bg-gradient-to-br from-neutral-800 to-neutral-900">
            {fallback || <User className={iconSizes[size]} />}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  overlap?: 'sm' | 'md' | 'lg';
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max = 5, overlap = 'md', ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
    const hiddenCount = max ? Math.max(0, childrenArray.length - max) : 0;

    const overlapStyles: Record<string, string> = {
      sm: '-space-x-2',
      md: '-space-x-3',
      lg: '-space-x-5'
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center', overlapStyles[overlap], className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div key={index} className="relative [&>div]:ring-2 [&>div]:ring-[#171717]">
            {child}
          </div>
        ))}
        {hiddenCount > 0 && (
          <div className="relative inline-flex items-center justify-center h-11 w-11 rounded-2xl bg-neutral-800 border border-neutral-700 ring-2 ring-[#171717] text-sm font-medium text-gray-300">
            +{hiddenCount}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
