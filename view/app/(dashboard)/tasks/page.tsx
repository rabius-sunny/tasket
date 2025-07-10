'use client';

import { KanbanBoard } from '@/components/board/kanban-board';
import { useBoard, useTasks } from '@/lib/hooks';
import { Task } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Create a separate component for the tasks content that uses useSearchParams
function TasksContent() {
  const searchParams = useSearchParams();
  const boardId = searchParams.get('board');

  const {
    board: selectedBoard,
    isLoading: boardLoading,
    error: boardError,
    mutate: mutateBoardData
  } = useBoard(boardId ? parseInt(boardId) : null);

  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    mutate: mutateTasks
  } = useTasks(boardId ? parseInt(boardId) : undefined);

  const handleBack = () => {
    // Navigate back to boards page
    window.history.back();
  };

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
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (boardError || tasksError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Failed to load board
          </h2>
          <p className='text-gray-600 mb-4'>
            There was an error loading the board or tasks
          </p>
          <button
            onClick={() => {
              mutateBoardData();
              mutateTasks();
            }}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {selectedBoard && (
        <KanbanBoard
          board={{ ...selectedBoard, tasks: tasks || [] }}
          onBack={handleBack}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading tasks...</p>
          </div>
        </div>
      }
    >
      <TasksContent />
    </Suspense>
  );
}
