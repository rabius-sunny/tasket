'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import invariant from 'tiny-invariant';

import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { Plus } from 'lucide-react';
import { useBoardContext } from './board-context';
import { ColumnContext, type ColumnContextProps } from './column-context';
import { DraggableTaskCard } from './draggable-task-card';

type State = { type: 'idle' } | { type: 'is-task-over' };

const idle: State = { type: 'idle' };
const isTaskOver: State = { type: 'is-task-over' };

interface DroppableColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

export const DroppableColumn = memo(function DroppableColumn({
  columnId,
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask
}: DroppableColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const columnInnerRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>(idle);

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
  const columnStyles = {
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

  const currentStyle =
    columnStyles[columnId as keyof typeof columnStyles] || columnStyles.todo;

  return (
    <ColumnContext.Provider value={contextValue}>
      <div
        data-testid={`column-${columnId}`}
        ref={columnRef}
        className={`flex flex-col w-80 rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${currentStyle.gradient} ${currentStyle.borderColor}`}
        style={{
          minHeight: '600px',
          maxHeight: '80vh'
        }}
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
          ref={columnInnerRef}
          className={`flex-1 p-3 transition-all duration-200 ${
            state.type === 'is-task-over'
              ? `bg-gradient-to-br ${currentStyle.hoverGradient} ring-2 ring-blue-300`
              : ''
          }`}
        >
          <div
            ref={scrollableRef}
            className='h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'
            style={{ minHeight: '500px' }}
          >
            <div className='space-y-3 min-h-full'>
              {tasks.map((task) => (
                <DraggableTaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
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
    </ColumnContext.Provider>
  );
});
