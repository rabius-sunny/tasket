import { cn } from '@/utils/random';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg';
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
      'inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'flex items-center gap-2 bg-gradient-to-tr from-blue-600 to-purple-500 text-white font-semibold shadow hover:from-blue-700 hover:to-purple-600',
      secondary:
        'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 focus:ring-secondary-500 border border-secondary-200',
      outline:
        'border border-medium bg-white text-primary hover:bg-gray-200/80 focus:ring-primary-500 hover:border-accent',
      ghost: 'text-secondary-700 hover:bg-gray-300',
      danger:
        'bg-error text-white hover:bg-error-600 focus:ring-error-500 shadow-custom-sm hover:shadow-custom-md',
      subtle:
        'bg-gray-200/80 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 shadow-custom-sm hover:shadow-custom-md'
    };

    const sizes = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2.5 py-1.5 text-sm',
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
