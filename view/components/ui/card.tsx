import { cn } from '@/utils/random';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700  rounded-lg  shadow-lg transition-all duration-200',
        className
      )}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }: CardProps) => {
  return (
    <div className={cn('px-6 py-4 border-b border-light', className)}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className }: CardProps) => {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
};

const CardFooter = ({ children, className }: CardProps) => {
  return (
    <div className={cn('px-6 py-4 border-t border-light', className)}>
      {children}
    </div>
  );
};

export { Card, CardContent, CardFooter, CardHeader };
