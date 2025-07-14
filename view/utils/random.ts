'use client';

import message from '@/components/ui/message';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomColor(seed: string = '') {
  // generate 5 digit random char if no seed provided
  if (!seed) {
    seed = Math.random().toString(36).substring(2, 7);
  }
  // Simple seeded hash to get consistent color for same user
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 80%)`;
  return color;
}

export function getRandomTwBgClass(char: string): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500'
  ];
  // Use char code to get a deterministic color index
  const index = Math.abs(char.charCodeAt(0)) % colors.length;
  return colors[index];
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
