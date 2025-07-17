'use client';

import { KanbanBoard } from '@/components/board/kanban-board';
import PageLoader from '@/components/ui/page-loader';
import { useTasks } from '@/helper/tasks';
import { useAsync } from '@/lib/hooks';
import { Board, Task } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TasksContent() {
  const searchParams = useSearchParams();
  const boardId = searchParams.get('board');

  const {
    data: selectedBoard,
    error: boardError,
    isLoading: boardLoading,
    mutate: mutateBoardData
  } = useAsync<Board>(boardId ? `/boards/${boardId}` : null);

  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    mutate: mutateTasks
  } = useTasks(boardId ? parseInt(boardId) : undefined);

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    dueDate?: string;
    labels?: string[];
    status: string;
  }) => {
    if (!boardId) return;

    try {
      await createTask({
        ...data,
        boardId: parseInt(boardId)
      });
      mutateTasks(); // Revalidate tasks
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      mutateTasks(); // Revalidate tasks
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateTask = async (taskId: number, data: Partial<Task>) => {
    try {
      await updateTask(taskId, data);
      mutateTasks(); // Revalidate tasks
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (boardLoading || tasksLoading) {
    return (
      <PageLoader
        title='Board'
        subTitle='Tasks'
      />
    );
  }

  if (boardError || tasksError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-8'>
          <div className='w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6'>
            <svg
              className='w-10 h-10 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            Oops! Something went wrong
          </h2>
          <p className='text-gray-600 mb-6'>
            We couldn&apos;t load your board or tasks. This might be a temporary
            issue.
          </p>
          <button
            onClick={() => {
              mutateBoardData();
              mutateTasks();
            }}
            className='bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='animate-fade-in-up'>
      <KanbanBoard
        board={{ ...selectedBoard, tasks: tasks || [] }}
        onUpdateTask={handleUpdateTask}
        onCreateTask={handleCreateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center'>
          <div className='text-center'>
            <div className='relative mb-8'>
              <div className='w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto'></div>
              <div
                className='absolute inset-0 w-20 h-20 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin mx-auto'
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '2s'
                }}
              ></div>
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>
              Initializing Board
            </h3>
            <p className='text-gray-600'>Setting up your workspace...</p>
            <div className='mt-6 flex justify-center space-x-2'>
              <div className='w-3 h-3 bg-indigo-400 rounded-full animate-bounce'></div>
              <div
                className='w-3 h-3 bg-purple-400 rounded-full animate-bounce'
                style={{ animationDelay: '0.1s' }}
              ></div>
              <div
                className='w-3 h-3 bg-pink-400 rounded-full animate-bounce'
                style={{ animationDelay: '0.2s' }}
              ></div>
            </div>
          </div>
        </div>
      }
    >
      <TasksContent />
    </Suspense>
  );
}
