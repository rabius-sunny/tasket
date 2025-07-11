'use client';

import BoardList from '@/components/board/board-list';
import PageLoader from '@/components/ui/page-loader';
import { useBoards } from '@/helper/boards';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Create a separate component for the boards content that uses useSearchParams
function BoardsContent() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspace');
  const { push } = useRouter();

  const { boards, isLoading, error, createBoard, mutate } = useBoards(
    workspaceId ? parseInt(workspaceId) : undefined
  );

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
      <PageLoader
        title='Workspace'
        subTitle='Boards'
      />
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
    <div className='animate-fade-in-up'>
      <BoardList
        boards={boards || []}
        onSelectBoard={(board) => push(`/tasks?board=${board.id}`)}
        onCreateBoard={handleCreateBoard}
        workspaceId={parseInt(workspaceId || '1')}
        workspaceName={`Workspace ${workspaceId || '1'}`}
      />
    </div>
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
