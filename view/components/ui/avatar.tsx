'use client';

import { cn, getRandomColor } from '@/utils/random';
import { useMemo } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  home?: boolean;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  group?: boolean;
}

const Avatar = ({
  src,
  alt,
  fallback,
  size = 'md',
  home,
  className,
  group
}: AvatarProps) => {
  const sizes = {
    sm: 'size-7 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  };

  const initials = fallback || alt || 'R';

  // Memoize color so it doesn't change on every render
  const fallbackColor = useMemo(
    () => getRandomColor(alt || fallback || ''),
    [alt, fallback]
  );

  return (
    <div
      className={cn(
        'flex uppercase items-center justify-center rounded-full bg-secondary-100 text-secondary-600 font-medium bg-gray-300',
        group && 'ring-2 ring-white',
        sizes[size],
        className
      )}
      style={!src && !home ? { backgroundColor: fallbackColor } : undefined}
    >
      {src ? (
        <div className='h-full w-full rounded-full overflow-hidden'>
          <div
            className='h-full w-full rounded-full bg-cover bg-center'
            style={{ backgroundImage: `url(${src})` }}
          />
        </div>
      ) : (
        <span>{initials.slice(0, 1).toUpperCase()}</span>
      )}
    </div>
  );
};

interface AvatarGroupProps {
  avatars: AvatarProps[] | undefined;
  className?: string;
}

const AvatarGroup = ({ avatars, className }: AvatarGroupProps) => {
  return (
    <div className={cn('flex -space-x-1.5', className)}>
      {avatars?.map((props, idx) => (
        <Avatar
          group
          {...props}
          key={idx}
        />
      ))}
    </div>
  );
};

export { Avatar, AvatarGroup };
