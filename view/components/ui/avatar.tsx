'use client';

import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function getRandomColor(seed: string = '') {
  // Simple seeded hash to get consistent color for same user
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 80%)`;
  return color;
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

  // Memoize color so it doesn't change on every render
  const fallbackColor = useMemo(
    () => getRandomColor(alt || fallback || ''),
    [alt, fallback]
  );

  return (
    <div
      className={cn(
        'flex uppercase items-center justify-center rounded-full bg-secondary-100 text-secondary-600 font-medium ring-2 ring-white bg-gray-300',
        sizes[size],
        className
      )}
      style={!src ? { backgroundColor: fallbackColor } : undefined}
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
  avatars: AvatarProps[] | undefined;
  className?: string;
}

const AvatarGroup = ({ avatars, className }: AvatarGroupProps) => {
  return (
    <div className={cn('flex -space-x-1.5', className)}>
      {avatars?.map((props, idx) => (
        <Avatar
          key={idx}
          {...props}
        />
      ))}
    </div>
  );
};

export { Avatar, AvatarGroup };
