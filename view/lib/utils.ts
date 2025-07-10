import message from '@/components/ui/message';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRandomColor(): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function isOverdue(dueDate: string | Date): boolean {
  return new Date(dueDate) < new Date();
}

export function getDueDateStatus(dueDate: string | Date): {
  status: 'overdue' | 'due-soon' | 'due-later';
  color: string;
} {
  const due = new Date(dueDate);
  const now = new Date();
  const diffInHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 0) {
    return { status: 'overdue', color: 'text-red-600 bg-red-50' };
  } else if (diffInHours < 24) {
    return { status: 'due-soon', color: 'text-yellow-600 bg-yellow-50' };
  } else {
    return { status: 'due-later', color: 'text-green-600 bg-green-50' };
  }
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
