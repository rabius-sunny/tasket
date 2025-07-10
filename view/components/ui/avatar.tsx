import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar = ({
  src,
  alt,
  fallback,
  size = 'md',
  className
}: AvatarProps) => {
  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  };

  const initials =
    fallback ||
    (alt
      ? alt
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
      : '');

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 font-medium ring-2 ring-white bg-gray-300',
        sizes[size],
        className
      )}
    >
      {src ? (
        <div className='h-full w-full rounded-full overflow-hidden'>
          <div
            className='h-full w-full rounded-full bg-cover bg-center'
            style={{ backgroundImage: `url(${src})` }}
          />
        </div>
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  className?: string;
}

const AvatarGroup = ({ children, max = 3, className }: AvatarGroupProps) => {
  const childrenArray = Array.isArray(children) ? children : [children];
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleChildren}
      {remainingCount > 0 && (
        <div className='relative inline-flex items-center justify-center h-8 w-8 rounded-full bg-secondary-100 text-secondary-600 text-xs font-medium border-2 border-white'>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export { Avatar, AvatarGroup };
