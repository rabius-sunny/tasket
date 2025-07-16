'use client';

import { cn } from '@/utils/random';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className='w-full'>
        {label && (
          <label
            htmlFor={inputId}
            className='block text-sm font-medium text-primary mb-1'
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full px-3 py-2 border border-light rounded-md shadow-custom-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-accent',
            'disabled:bg-secondary-50 disabled:text-secondary-500',
            'transition-all duration-200',
            error && 'border-error focus:border-error focus:ring-error-500',
            className
          )}
          {...props}
        />
        {error && <p className='mt-1 text-sm text-error'>{error}</p>}
        {helperText && !error && (
          <p className='mt-1 text-sm text-secondary'>{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
