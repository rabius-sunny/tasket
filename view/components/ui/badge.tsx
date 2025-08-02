import { cn } from '@/utils/random';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  onClick?: () => void;
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  style,
  onClick
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-secondary-100 text-secondary-800 border border-secondary-200',
    primary: 'bg-primary-100 text-primary-800 border border-primary-200',
    secondary:
      'bg-secondary-100 text-secondary-800 border border-secondary-200',
    success: 'bg-success-100 text-success-800 border border-success-200',
    warning: 'bg-warning-100 text-warning-800 border border-warning-200',
    danger: 'bg-error-100 text-error-800 border border-error-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span
      onClick={onClick}
      style={style}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {children}
    </span>
  );
};

export { Badge };
