'use client';
import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

export type ColumnContextProps = {
  columnId: string;
  getTaskIndex: (taskId: string) => number;
  getNumTasks: () => number;
};

export const ColumnContext = createContext<ColumnContextProps | null>(null);

export function useColumnContext(): ColumnContextProps {
  const value = useContext(ColumnContext);
  invariant(value, 'cannot find ColumnContext provider');
  return value;
}

export const columnStyles = {
  todo: {
    gradient: 'from-gray-100 to-gray-200',
    headerGradient: 'from-gray-500 to-gray-600',
    hoverGradient: 'from-gray-200 to-gray-300',
    borderColor: 'border-gray-300'
  },
  'in-progress': {
    gradient: 'from-blue-100 to-blue-200',
    headerGradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'from-blue-200 to-blue-300',
    borderColor: 'border-blue-300'
  },
  review: {
    gradient: 'from-yellow-100 to-yellow-200',
    headerGradient: 'from-yellow-500 to-yellow-600',
    hoverGradient: 'from-yellow-200 to-yellow-300',
    borderColor: 'border-yellow-300'
  },
  completed: {
    gradient: 'from-green-100 to-green-200',
    headerGradient: 'from-green-500 to-green-600',
    hoverGradient: 'from-green-200 to-green-300',
    borderColor: 'border-green-300'
  }
};
