'use client';

import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Workspace } from '@/types';
import { Activity, Calendar, Plus, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WorkspaceCardProps {
  workspace: Workspace;
  onSelect: (workspace: Workspace) => void;
}

export const WorkspaceCard = ({ workspace, onSelect }: WorkspaceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradient = 'from-cyan-400 via-blue-500 to-indigo-600';

  return (
    <div
      className='group cursor-pointer transform transition-all duration-300 hover:scale-105'
      onClick={() => onSelect(workspace)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className='relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white group-hover:bg-gray-50'>
        {/* Gradient header */}
        <div className={`h-20 bg-gradient-to-r ${gradient} relative`}>
          {/* <div className='absolute inset-0 bg-black/10'></div>
          <div className='absolute top-3 right-3'>
            <Button
              variant='ghost'
              size='sm'
              className='p-1 text-white/80 hover:text-white hover:bg-white/20 transition-colors'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </div> */}

          {/* Floating workspace initial */}
          <div className='absolute -bottom-4 left-6'>
            <div className='w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-xl font-bold text-gray-700 group-hover:scale-110 transition-transform duration-300'>
              {workspace.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <CardContent className='pt-8 pb-6 px-6'>
          <div className='space-y-4'>
            {/* Workspace name and badge */}
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors'>
                  {workspace.name}
                </h3>
                <Badge
                  variant='secondary'
                  size='sm'
                  className='bg-green-100 text-green-700 border-green-200'
                >
                  <Activity className='h-3 w-3 mr-1' />
                  Active
                </Badge>
              </div>
            </div>

            {/* Stats grid */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-blue-50 rounded-lg p-3 border border-blue-100 group-hover:bg-blue-100 transition-colors'>
                <div className='flex items-center space-x-2'>
                  <div className='p-1 bg-blue-500 rounded-md'>
                    <Users className='h-3 w-3 text-white' />
                  </div>
                  <div>
                    <div className='text-xs text-blue-600 font-medium'>
                      Members
                    </div>
                    <div className='text-lg font-bold text-blue-700'>
                      {workspace.members?.length || 0}
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-purple-50 rounded-lg p-3 border border-purple-100 group-hover:bg-purple-100 transition-colors'>
                <div className='flex items-center space-x-2'>
                  <div className='p-1 bg-purple-500 rounded-md'>
                    <Calendar className='h-3 w-3 text-white' />
                  </div>
                  <div>
                    <div className='text-xs text-purple-600 font-medium'>
                      Boards
                    </div>
                    <div className='text-lg font-bold text-purple-700'>
                      {workspace._count?.boards || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team members */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <span className='text-sm font-medium text-gray-600'>Team</span>
                <AvatarGroup
                  max={4}
                  className='hover:scale-105 transition-transform duration-200'
                >
                  {workspace.members?.map((member) => (
                    <Avatar
                      key={member.id}
                      fallback={member.username.charAt(0).toUpperCase()}
                      alt={member.username}
                      size='sm'
                      className='border-2 border-white shadow-sm'
                    />
                  ))}
                </AvatarGroup>
              </div>

              {/* Quick action button */}
              <Button
                variant='ghost'
                size='sm'
                className={`p-2 rounded-full transition-all duration-300 ${
                  isHovered
                    ? 'bg-blue-500 text-white shadow-lg scale-110'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(workspace);
                }}
              >
                <Zap className='h-4 w-4' />
              </Button>
            </div>

            {/* Progress indicator */}
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <span className='text-xs font-medium text-gray-600'>
                  Activity
                </span>
                <span className='text-xs text-gray-500'>85%</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-1.5'>
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Hover overlay effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>
      </Card>
    </div>
  );
};

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
}

export const CreateWorkspaceModal = ({
  isOpen,
  onClose,
  onSubmit
}: CreateWorkspaceModalProps) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({ name });
      setName('');
      onClose();
    } catch (error) {
      console.error('Error creating workspace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='✨ Create New Workspace'
      size='lg'
    >
      <div className='text-center mb-6'>
        <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4'>
          <Plus className='h-8 w-8 text-white' />
        </div>
        <p className='text-gray-600'>
          Create a new workspace to organize your projects and collaborate with
          your team
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='space-y-6'
      >
        <div className='space-y-4'>
          <Input
            label='Workspace Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g., Marketing Team, Product Development'
            required
            className='text-lg'
          />
        </div>

        <div className='flex justify-end space-x-3 pt-6 border-t border-gray-100'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            size='lg'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            isLoading={isLoading}
            size='lg'
            className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8'
          >
            {isLoading ? 'Creating...' : 'Create Workspace'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface EditWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
  workspace: Workspace;
}

export const EditWorkspaceModal = ({
  isOpen,
  onClose,
  onSubmit,
  workspace
}: EditWorkspaceModalProps) => {
  const [name, setName] = useState(workspace.name);
  const [isLoading, setIsLoading] = useState(false);

  // Update form field when workspace changes
  useEffect(() => {
    setName(workspace.name);
  }, [workspace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({ name });
      onClose();
    } catch (error) {
      console.error('Error updating workspace:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Edit Workspace'
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <Input
          label='Workspace Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter workspace name'
          required
        />

        <div className='flex justify-end space-x-3 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            isLoading={isLoading}
          >
            Update Workspace
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface WorkspaceListProps {
  workspaces: Workspace[];
  onSelectWorkspace: (workspace: Workspace) => void;
  onCreateWorkspace: (data: { name: string }) => void;
}

export const WorkspaceList = ({
  workspaces,
  onSelectWorkspace,
  onCreateWorkspace
}: WorkspaceListProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Hero Header */}
      <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='text-center'>
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
              Your <span className='text-yellow-300'>Workspaces</span>
            </h1>
            <p className='text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto'>
              Organize your projects, collaborate with your team, and bring your
              ideas to life
            </p>
            <Button
              onClick={() => setShowCreateModal(true)}
              size='lg'
              className='bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
            >
              <Plus className='h-5 w-5 mr-2' />
              Create New Workspace
            </Button>
          </div>
        </div>

        {/* Floating elements */}
        <div className='absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse'></div>
        <div className='absolute bottom-20 right-10 w-16 h-16 bg-yellow-300/20 rounded-full animate-bounce'></div>
        <div className='absolute top-40 right-20 w-12 h-12 bg-pink-300/20 rounded-full animate-ping'></div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {workspaces.length === 0 ? (
          <div className='text-center py-20'>
            <div className='mx-auto max-w-md'>
              <div className='mx-auto h-24 w-24 text-gray-400 mb-6'>
                <Users className='h-24 w-24' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                No workspaces yet
              </h3>
              <p className='text-lg text-gray-600 mb-8'>
                Get started by creating your first workspace and invite your
                team.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                size='lg'
                className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'
              >
                <Plus className='h-5 w-5 mr-2' />
                Create Your First Workspace
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Stats bar */}
            <div className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-blue-600 mb-1'>
                    {workspaces.length}
                  </div>
                  <div className='text-gray-600 font-medium'>
                    Active Workspaces
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-purple-600 mb-1'>
                    {workspaces.reduce(
                      (total, ws) => total + (ws._count?.boards || 0),
                      0
                    )}
                  </div>
                  <div className='text-gray-600 font-medium'>Total Boards</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-green-600 mb-1'>
                    {workspaces.reduce(
                      (total, ws) => total + (ws.members?.length || 0),
                      0
                    )}
                  </div>
                  <div className='text-gray-600 font-medium'>Team Members</div>
                </div>
              </div>
            </div>

            {/* Workspaces grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {workspaces.map((workspace, index) => (
                <div
                  key={workspace.id}
                  className='animate-in fade-in slide-in-from-bottom-4 duration-500'
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <WorkspaceCard
                    workspace={workspace}
                    onSelect={onSelectWorkspace}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateWorkspaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onCreateWorkspace}
      />
    </div>
  );
};
