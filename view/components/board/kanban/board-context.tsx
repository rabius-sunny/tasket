'use client';
import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

import { Task } from '@/types';
import type { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';

export type BoardContextValue = {
  getTasks: () => Task[];

  reorderTask: (args: {
    status: string;
    startIndex: number;
    finishIndex: number;
  }) => void;

  moveTask: (args: {
    startStatus: string;
    finishStatus: string;
    taskIndexInStartColumn: number;
    taskIndexInFinishColumn?: number;
  }) => void;

  registerTask: (args: {
    taskId: string;
    entry: {
      element: HTMLElement;
      actionMenuTrigger: HTMLElement;
    };
  }) => CleanupFn;

  registerColumn: (args: {
    columnId: string;
    entry: {
      element: HTMLElement;
    };
  }) => CleanupFn;

  instanceId: symbol;

  onTaskUpdate: (taskId: number, data: Partial<Task>) => Promise<void>;
};

export const BoardContext = createContext<BoardContextValue | null>(null);

export function useBoardContext(): BoardContextValue {
  const value = useContext(BoardContext);
  invariant(value, 'cannot find BoardContext provider');
  return value;
}
