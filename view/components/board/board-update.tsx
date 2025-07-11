import { Board } from '@/types';
import { Layers, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';

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
