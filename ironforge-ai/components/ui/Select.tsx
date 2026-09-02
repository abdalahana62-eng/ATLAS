'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <select
            className={cn(
              'flex h-11 w-full appearance-none rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 pr-10 text-sm text-gray-100 transition-all duration-200',
              'focus-visible:outline-none focus-visible:border-lime-400/50 focus-visible:ring-2 focus-visible:ring-lime-400/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500/60 focus-visible:border-red-500 focus-visible:ring-red-500/30',
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-neutral-900 text-gray-100"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
