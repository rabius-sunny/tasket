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
