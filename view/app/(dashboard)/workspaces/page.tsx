'use client';

import { useAuth } from '@/components/auth/auth-context';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useWorkspaces } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

export default function WorkspacesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { workspaces, isLoading, error, createWorkspace, mutate } =
    useWorkspaces(user?.id);
  const { push } = useRouter();

  const handleCreateWorkspace = async (data: { name: string }) => {
    try {
      await createWorkspace({ ...data, memberIds: [user?.id] });
      mutate(); // Revalidate the workspaces data
    } catch (error) {
      console.error('Error creating workspace:', error);
      // You could show a toast notification here
    }
  };

  // Show loading if auth is loading
  if (authLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='relative'>
            <div className='w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6'></div>
            <div
              className='absolute inset-0 w-16 h-16 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin mx-auto'
              style={{
                animationDirection: 'reverse',
                animationDuration: '1.5s'
              }}
            ></div>
          </div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            Loading Your Workspaces
          </h3>
          <p className='text-gray-600'>
            Preparing your workspaces and organizing everything...
          </p>
          <div className='mt-4 flex justify-center space-x-1'>
            <div className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce'></div>
            <div
              className='w-2 h-2 bg-purple-400 rounded-full animate-bounce'
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className='w-2 h-2 bg-pink-400 rounded-full animate-bounce'
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Failed to load workspaces
          </h2>
          <p className='text-gray-600 mb-4'>
            There was an error loading your workspaces
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
    <WorkspaceList
      workspaces={workspaces || []}
      onSelectWorkspace={(workspace) =>
        push(`/boards?workspace=${workspace.id}`)
      }
      onCreateWorkspace={handleCreateWorkspace}
    />
  );
}
