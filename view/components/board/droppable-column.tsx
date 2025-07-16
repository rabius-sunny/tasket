'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import invariant from 'tiny-invariant';

import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { useBoardContext } from './kanban/board-context';
import {
  ColumnContext,
  columnStyles,
  type ColumnContextProps
} from './kanban/column-context';
import { DraggableTaskCard } from './kanban/draggable-task-card';

type State = { type: 'idle' } | { type: 'is-task-over' };

const idle: State = { type: 'idle' };
const isTaskOver: State = { type: 'is-task-over' };

interface DroppableColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onInlineAddTask: (data: { status: string; title: string }) => Promise<void>;
  onDeleteTask: (taskId: number) => void;
}

export const DroppableColumn = memo(function DroppableColumn({
  columnId,
  title,
  tasks,
  onAddTask,
  onDeleteTask,
  onInlineAddTask
}: DroppableColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const columnInnerRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>(idle);
  const [isAdding, setIsAdding] = useState(false);

  const { instanceId, registerColumn } = useBoardContext();

  useEffect(() => {
    invariant(columnRef.current);
    invariant(columnInnerRef.current);
    invariant(scrollableRef.current);

    return combine(
      registerColumn({
        columnId,
        entry: {
          element: columnRef.current
        }
      }),
      dropTargetForElements({
        element: columnInnerRef.current,
        getData: () => ({ columnId, type: 'column' }),
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === 'task'
          );
        },
        getIsSticky: () => true,
        onDragEnter: () => setState(isTaskOver),
        onDragLeave: () => setState(idle),
        onDragStart: () => setState(isTaskOver),
        onDrop: () => setState(idle)
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === 'task'
      })
    );
  }, [columnId, registerColumn, instanceId]);

  const stableTasks = useRef(tasks);
  useEffect(() => {
    stableTasks.current = tasks;
  }, [tasks]);

  const getTaskIndex = useCallback((taskId: string) => {
    return stableTasks.current.findIndex(
      (task) => task.id.toString() === taskId
    );
  }, []);

  const getNumTasks = useCallback(() => {
    return stableTasks.current.length;
  }, []);

  const contextValue: ColumnContextProps = useMemo(() => {
    return { columnId, getTaskIndex, getNumTasks };
  }, [columnId, getTaskIndex, getNumTasks]);

  // Column gradient mappings

  const currentStyle =
    columnStyles[columnId as keyof typeof columnStyles] || columnStyles.todo;

  return (
    <ColumnContext.Provider value={contextValue}>
      <div
        data-testid={`column-${columnId}`}
        ref={columnRef}
        className={`flex flex-col text-sm min-w-96 rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${currentStyle.gradient} ${currentStyle.borderColor} h-auto max-h-[85vh]`}
      >
        {/* Column Header */}
        <div
          className={`bg-gradient-to-r ${currentStyle.headerGradient} rounded-t-xl p-4 shadow-md`}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <h3 className='text-lg font-bold text-white'>{title}</h3>
              <span className='bg-white/20 text-white text-sm font-medium px-2 py-1 rounded-full'>
                {tasks.length}
              </span>
            </div>
            <Button
              onClick={() => onAddTask(columnId)}
              variant='ghost'
              size='sm'
              className='text-white hover:bg-white/20 transition-all duration-200 hover:scale-110'
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Tasks Container */}
        <div
          style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }}
          className='overflow-y-auto p-3 h-full'
        >
          <div
            ref={columnInnerRef}
            className={`flex-1 h-full transition-all duration-200 ${
              state.type === 'is-task-over'
                ? `bg-gradient-to-br ${currentStyle.hoverGradient} ring-2 ring-blue-300`
                : ''
            }`}
          >
            <div
              ref={scrollableRef}
              className='h-full'
            >
              <div className='space-y-3 min-h-full'>
                {tasks.map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDeleteTask}
                  />
                ))}

                {/* Empty state */}
                {tasks.length === 0 && (
                  <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
                    <div className='text-6xl mb-4'>📝</div>
                    <p className='text-lg font-medium mb-2'>No tasks yet</p>
                    <p className='text-sm text-center mb-4'>
                      Drag tasks here or click the + button to add one
                    </p>
                    <Button
                      onClick={() => onAddTask(columnId)}
                      variant='outline'
                      size='sm'
                      className='hover:scale-105 transition-transform duration-200'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add Task
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='p-1'>
          {!isAdding ? (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsAdding(true)}
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Task
            </Button>
          ) : (
            <Input
              autoFocus
              className='border border-blue-500 placeholder:font-medium'
              placeholder='Write title and hit enter.'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (e.currentTarget.value.trim()) {
                    onInlineAddTask({
                      status: columnId,
                      title: e.currentTarget.value
                    });
                  }
                  setIsAdding(false);
                } else if (e.key === 'Escape') {
                  setIsAdding(false);
                }
              }}
              onBlur={() => setIsAdding(false)}
            />
          )}
        </div>
      </div>
    </ColumnContext.Provider>
  );
});
