import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-700 focus:ring-primary-500 shadow-custom-sm hover:shadow-custom-md',
      secondary:
        'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 focus:ring-secondary-500 border border-secondary-200',
      outline:
        'border border-medium bg-white text-primary hover:bg-primary-50 focus:ring-primary-500 hover:border-accent',
      ghost:
        'text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500 hover:text-primary',
      danger:
        'bg-error text-white hover:bg-error-600 focus:ring-error-500 shadow-custom-sm hover:shadow-custom-md'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2' />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
