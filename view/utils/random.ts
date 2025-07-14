import message from '@/components/ui/message';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export async function handleAction<T>(
  action: () => Promise<T>,
  field?: string
): Promise<T | undefined> {
  try {
    return await action();
  } catch (error) {
    console.error('error on action ' + (field || ''), error);
    message.error('Something went wrong, try again later');
    return undefined;
  }
}
