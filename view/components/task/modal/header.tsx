import { Button } from '@/components/ui/button';
import { Dropdown, DropdownItem } from '@/components/ui/dropdown';
import Skeleton from '@/components/ui/skeleton';
import { Task } from '@/types';
import { formatDate } from '@/utils/date';
import { ChevronDown, X } from 'lucide-react';

type TProps = {
  task: Task;
  loading: boolean;
  onClose: (e: React.MouseEvent) => void;
};

export default function TaskModalHeader({ task, loading, onClose }: TProps) {
  const isLoading = loading || !task.createdAt || !task.updatedAt;
  return (
    <div className='p-2 relative flex items-center justify-between min-w-[900px] bg-gray-50 border-b border-gray-300'>
      <div className='flex items-center gap-4'>
        <Dropdown
          trigger={
            <Button
              variant='outline'
              size='sm'
              className='capitalize gap-2'
            >
              {task.status.replace('-', ' ')} <ChevronDown className='size-4' />
            </Button>
          }
        >
          <div className='w-32'>
            <DropdownItem>Todo</DropdownItem>
            <DropdownItem>In Progress</DropdownItem>
            <DropdownItem>Review</DropdownItem>
            <DropdownItem>Done</DropdownItem>
          </div>
        </Dropdown>
        {isLoading ? (
          <div className='flex items-center gap-2'>
            <Skeleton className='w-40' />
            <span className='font-bold text-base'>|</span>
            <Skeleton className='w-40' />
          </div>
        ) : (
          <div className='flex items-center gap-2 text-xs font-medium'>
            <p className=''>
              Created -{' '}
              <span className='font-mono'>{formatDate(task.createdAt)}</span>
            </p>
            <span className='font-bold text-base'>|</span>
            <p className=''>
              Last update -{' '}
              <span className='font-mono'>{formatDate(task.updatedAt)}</span>
            </p>
          </div>
        )}
      </div>
      <Button
        onClick={onClose}
        variant='ghost'
        size='sm'
        className='absolute top-2 right-2 h-8 w-8 p-0 hover:bg-gray-200'
      >
        <X className='size-4' />
      </Button>
    </div>
  );
}
