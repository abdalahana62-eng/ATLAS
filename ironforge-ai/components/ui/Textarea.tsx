'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            'flex min-h-[100px] w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 transition-all duration-200 resize-y',
            'focus-visible:outline-none focus-visible:border-lime-400/50 focus-visible:ring-2 focus-visible:ring-lime-400/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500/60 focus-visible:border-red-500 focus-visible:ring-red-500/30',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
