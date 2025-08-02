import { cn } from '@/utils/random';

type TProps = {
  className?: string;
};

export default function Skeleton({ className }: TProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        'h-5 w-full',
        className
      )}
    />
  );
}
