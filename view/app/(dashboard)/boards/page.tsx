'use client';

import { BoardList } from '@/components/board/board-list';
import { useBoards } from '@/lib/hooks';
import { Board } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Create a separate component for the boards content that uses useSearchParams
function BoardsContent() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspace');

  const { boards, isLoading, error, createBoard, mutate } = useBoards(
    workspaceId ? parseInt(workspaceId) : undefined
  );

  const handleSelectBoard = (board: Board) => {
    // Navigate to tasks page with board context
    window.location.href = `/tasks?board=${board.id}`;
  };

  const handleCreateBoard = async (data: {
    title: string;
    workspaceId: number;
  }) => {
    try {
      await createBoard(data);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading boards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Failed to load boards
          </h2>
          <p className='text-gray-600 mb-4'>
            There was an error loading your boards
          </p>
          <button
            onClick={() => mutate()}
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <BoardList
      boards={boards || []}
      onSelectBoard={handleSelectBoard}
      onCreateBoard={handleCreateBoard}
      workspaceId={parseInt(workspaceId || '1')}
      workspaceName={`Workspace ${workspaceId || '1'}`}
    />
  );
}

export default function BoardsPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading boards...</p>
          </div>
        </div>
      }
    >
      <BoardsContent />
    </Suspense>
  );
}
