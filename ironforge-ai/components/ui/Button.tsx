'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ironforge-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ironforge-background disabled:pointer-events-none disabled:opacity-50';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-ironforge-primary text-ironforge-background hover:bg-ironforge-primary-dark active:bg-ironforge-primary/90 shadow-sm shadow-ironforge-primary/20',
      secondary:
        'bg-ironforge-card text-ironforge-text hover:bg-ironforge-card-hover active:bg-ironforge-card/90 border border-ironforge-border',
      ghost:
        'bg-transparent text-ironforge-text hover:bg-ironforge-card-hover hover:text-ironforge-text active:bg-ironforge-card',
      outline:
        'bg-transparent text-ironforge-text border border-ironforge-border hover:bg-ironforge-card-hover hover:border-ironforge-border active:bg-ironforge-card',
      danger:
        'bg-red-500/90 text-white hover:bg-red-500 active:bg-red-600 shadow-sm shadow-red-500/20 border border-red-500/30'
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-9 px-3 text-sm rounded-lg',
      md: 'h-11 px-5 text-sm rounded-xl',
      lg: 'h-14 px-8 text-base rounded-2xl'
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
