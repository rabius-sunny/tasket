'use client';

import { useAuth } from '@/components/auth/auth-context';
import message from '@/components/ui/message';
import PageLoader from '@/components/ui/page-loader';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { useWorkspaces } from '@/helper/workspace';
import { useRouter } from 'next/navigation';

export default function WorkspacesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { workspaces, isLoading, error, createWorkspace, mutate } =
    useWorkspaces();
  const { push } = useRouter();

  const handleCreateWorkspace = async (data: { name: string }) => {
    try {
      await createWorkspace({ ...data, memberIds: [user?.id] });
      mutate(); // Revalidate the workspaces data
      message.success('Workspace created successfully!');
    } catch (error) {
      console.error('Error creating workspace:', error);
      message.error('Failed to create workspace. Please try again later.');
    }
  };

  if (authLoading || isLoading) {
    return (
      <PageLoader
        title='Workspace'
        subTitle='Workspaces'
      />
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
    <div className='animate-fade-in-up'>
      <WorkspaceList
        workspaces={workspaces || []}
        onSelectWorkspace={(workspace) =>
          push(`/dashboard/boards?workspace=${workspace.id}`)
        }
        onCreateWorkspace={handleCreateWorkspace}
      />
    </div>
  );
}
