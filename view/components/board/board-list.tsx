'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Board } from '@/types';
import {
  CheckCircle,
  Clock,
  Layers,
  ListTodo,
  MoreHorizontal,
  Plus,
  Sparkles,
  Star,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface BoardCardProps {
  board: Board;
  onSelect: (board: Board) => void;
}

export const BoardCard = ({ board, onSelect }: BoardCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const taskCount = board._count?.tasks || 0;

  // Generate a beautiful gradient based on the board title
  const gradients = [
    'from-violet-600 via-purple-600 to-blue-600',
    'from-pink-500 via-red-500 to-yellow-500',
    'from-green-400 via-blue-500 to-purple-600',
    'from-orange-400 via-pink-400 to-red-500',
    'from-blue-400 via-purple-500 to-pink-500',
    'from-indigo-400 via-cyan-400 to-blue-500'
  ];

  const gradientIndex = board.id % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div
      className='group cursor-pointer transform transition-all duration-300 hover:scale-105'
      onClick={() => onSelect(board)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className='relative overflow-hidden h-full bg-white hover:shadow-2xl transition-all duration-300 border-0 hover:shadow-purple-100/50'>
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Content overlay */}
        <div className='relative z-10 p-6 h-full flex flex-col'>
          {/* Header */}
          <div className='flex items-start justify-between mb-6'>
            <div className='flex-1'>
              <h3 className='text-xl font-bold text-white mb-2 leading-tight'>
                {board.title}
              </h3>
              <p className='text-white/80 text-sm'>
                {board.workspace?.name || 'Workspace'}
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200'
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle favorite/star action
                }}
              >
                <Star
                  className={`h-4 w-4 ${isHovered ? 'fill-current' : ''}`}
                />
              </Button>

              <Button
                variant='ghost'
                size='sm'
                className='text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200'
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle more options
                }}
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className='space-y-4 flex-1'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center'>
                <ListTodo className='h-5 w-5 text-white mx-auto mb-1' />
                <div className='text-xl font-bold text-white'>{taskCount}</div>
                <div className='text-xs text-white/80'>Tasks</div>
              </div>

              <div className='bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center'>
                <Users className='h-5 w-5 text-white mx-auto mb-1' />
                <div className='text-xl font-bold text-white'>
                  {board.workspace ? '3' : '1'}
                </div>
                <div className='text-xs text-white/80'>Members</div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className='bg-white/20 backdrop-blur-sm rounded-lg p-3'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm text-white/90 font-medium'>
                  Progress
                </span>
                <span className='text-sm text-white/90'>
                  {taskCount > 0
                    ? Math.round(((taskCount * 0.6) / taskCount) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className='w-full bg-white/20 rounded-full h-2'>
                <div
                  className='bg-white/90 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${
                      taskCount > 0
                        ? Math.round(((taskCount * 0.6) / taskCount) * 100)
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-between pt-4 mt-auto'>
            <div className='flex items-center gap-1'>
              <Clock className='h-4 w-4 text-white/80' />
              <span className='text-sm text-white/80'>
                Updated {Math.floor(Math.random() * 5) + 1}h ago
              </span>
            </div>

            <Badge
              variant='secondary'
              className='bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors duration-200'
            >
              <Sparkles className='h-3 w-3 mr-1' />
              Active
            </Badge>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 transition-transform duration-300 group-hover:scale-110' />
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 transition-transform duration-300 group-hover:scale-110' />
      </Card>
    </div>
  );
};

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; workspaceId: number }) => void;
  workspaceId: number;
}

export const CreateBoardModal = ({
  isOpen,
  onClose,
  onSubmit,
  workspaceId
}: CreateBoardModalProps) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({ title, workspaceId });
      setTitle('');
      onClose();
    } catch (error) {
      console.error('Error creating board:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Create New Board'
    >
      <div className='space-y-6'>
        {/* Header with icon */}
        <div className='text-center'>
          <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center'>
            <Layers className='h-8 w-8 text-white' />
          </div>
          <h3 className='text-xl font-bold text-gray-900 mb-2'>
            Create New Board
          </h3>
          <p className='text-gray-600'>
            Organize your tasks and collaborate with your team
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='space-y-6'
        >
          <div className='space-y-2'>
            <Input
              label='Board Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., Sprint Planning, Marketing Campaign'
              required
              className='text-lg'
            />
            <p className='text-sm text-gray-500'>
              Choose a descriptive name for your board
            </p>
          </div>

          <div className='flex flex-col gap-3'>
            <Button
              type='submit'
              isLoading={isLoading}
              className='w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
            >
              {isLoading ? (
                <div className='flex items-center justify-center gap-2'>
                  Creating Board...
                </div>
              ) : (
                <div className='flex items-center justify-center gap-2'>
                  <Plus className='h-5 w-5' />
                  Create Board
                </div>
              )}
            </Button>

            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='w-full border-2 border-gray-200 hover:border-gray-300 py-3 rounded-lg transition-all duration-200'
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string }) => void;
  board: Board;
}

export const EditBoardModal = ({
  isOpen,
  onClose,
  onSubmit,
  board
}: EditBoardModalProps) => {
  const [title, setTitle] = useState(board.title);
  const [isLoading, setIsLoading] = useState(false);

  // Update form field when board changes
  useEffect(() => {
    setTitle(board.title);
  }, [board]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({ title });
      onClose();
    } catch (error) {
      console.error('Error updating board:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Edit Board'
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <Input
          label='Board Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter board title'
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
            Update Board
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface BoardListProps {
  boards: Board[];
  onSelectBoard: (board: Board) => void;
  onCreateBoard: (data: { title: string; workspaceId: number }) => void;
  workspaceId: number;
  workspaceName: string;
}

export const BoardList = ({
  boards,
  onSelectBoard,
  onCreateBoard,
  workspaceId,
  workspaceName
}: BoardListProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* Hero Header */}
      <div className='relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative max-w-7xl mx-auto px-6 py-16'>
          <div className='flex items-center justify-between'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center'>
                  <Layers className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h1 className='text-4xl font-bold tracking-tight'>
                    {workspaceName}
                  </h1>
                  <p className='text-xl text-white/90 mt-1'>
                    Boards & Projects
                  </p>
                </div>
              </div>

              <p className='text-lg text-white/80 max-w-2xl'>
                Organize your work, track progress, and collaborate seamlessly
                with your team using powerful project boards.
              </p>

              <div className='flex items-center gap-6 text-white/90'>
                <div className='flex items-center gap-2'>
                  <ListTodo className='h-5 w-5' />
                  <span className='font-medium'>{boards.length} Boards</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Users className='h-5 w-5' />
                  <span className='font-medium'>Team Workspace</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className='bg-white text-violet-600 hover:bg-white/90 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
            >
              <Plus className='h-5 w-5 mr-2' />
              Create Board
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48' />
        <div className='absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-36 -translate-x-36' />
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        {boards.length === 0 ? (
          <div className='text-center py-20'>
            <div className='max-w-md mx-auto'>
              <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center'>
                <ListTodo className='h-12 w-12 text-violet-600' />
              </div>

              <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                No boards yet
              </h3>
              <p className='text-lg text-gray-600 mb-8 leading-relaxed'>
                Create your first board to start organizing tasks and
                collaborating with your team.
              </p>

              <Button
                onClick={() => setShowCreateModal(true)}
                className='bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
              >
                <Plus className='h-5 w-5 mr-2' />
                Create Your First Board
              </Button>
            </div>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Quick Stats */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Layers className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {boards.length}
                    </div>
                    <div className='text-sm text-gray-600'>Total Boards</div>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                    <CheckCircle className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {boards.reduce(
                        (acc, board) => acc + (board._count?.tasks || 0),
                        0
                      )}
                    </div>
                    <div className='text-sm text-gray-600'>Total Tasks</div>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                    <Clock className='h-5 w-5 text-purple-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>
                      {
                        boards.filter((board) => (board._count?.tasks || 0) > 0)
                          .length
                      }
                    </div>
                    <div className='text-sm text-gray-600'>Active Boards</div>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                    <Sparkles className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <div className='text-2xl font-bold text-gray-900'>98%</div>
                    <div className='text-sm text-gray-600'>Productivity</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Boards Grid */}
            <div>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                Your Boards
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {boards.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    onSelect={onSelectBoard}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={onCreateBoard}
        workspaceId={workspaceId}
      />
    </div>
  );
};
