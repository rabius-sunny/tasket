'use client';

import { useAuth } from '@/components/auth/auth-context';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useWorkspaces } from '@/lib/hooks';
import { Workspace } from '@/types';

export default function WorkspacesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { workspaces, isLoading, error, createWorkspace, mutate } =
    useWorkspaces(user?.id);

  const handleSelectWorkspace = (workspace: Workspace) => {
    // Navigate to boards page with workspace context
    window.location.href = `/boards?workspace=${workspace.id}`;
  };

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

  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading workspaces...</p>
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
      onSelectWorkspace={handleSelectWorkspace}
      onCreateWorkspace={handleCreateWorkspace}
    />
  );
}
