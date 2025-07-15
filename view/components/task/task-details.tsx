'use client';

import { useAsync } from '@/lib/hooks';
import { Task } from '@/types';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/random';
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  Plus,
  X
} from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dropdown, DropdownItem } from '../ui/dropdown';
import { Modal } from '../ui/modal';
import { TransparentInput, TransparentTextarea } from '../ui/transparent-input';
import CardButton from './card-buttons';
import TaskCheckLists from './task-checklists';
import TaskComments from './task-comments';

type TProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function TaskDetails({ task, isOpen, onClose }: TProps) {
  const { data: taskData, isLoading: loading } = useAsync<Task>(
    () => task && '/tasks/' + task.id
  );

  if (!task) return null;
  if (loading || !taskData) return <div>Loading...</div>;

  const updateTitle = (e: React.FocusEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim();
    if (newTitle && newTitle !== task.title.trim()) {
      // Call API to update task title
      console.log('Updating task title:', newTitle);
    }
  };
  const updateDescription = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value.trim();
    if (newDescription && newDescription !== task?.description?.trim()) {
      // Call API to update task description
      console.log('Updating task description:', newDescription);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
      header={
        <div className='p-2 relative flex items-center justify-between min-w-[900px] bg-gray-50 border-b border-gray-300'>
          <div className='flex items-center gap-4'>
            <Dropdown
              trigger={
                <Button
                  variant='outline'
                  size='sm'
                  className='capitalize gap-2'
                >
                  {task.status.replace('-', ' ')}{' '}
                  <ChevronDown className='size-4' />
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
            <div className='flex items-center gap-2 text-xs font-medium'>
              <p className=''>
                Created -{' '}
                <span className='font-mono'>
                  {formatDate(taskData.createdAt)}
                </span>
              </p>
              <span className='font-bold text-base'>|</span>
              <p className=''>
                Last update -{' '}
                <span className='font-mono'>
                  {formatDate(taskData.updatedAt)}
                </span>
              </p>
            </div>
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
      }
    >
      <div className='grid grid-cols-5 pt-0! h-[80vh] min-w-[900px] overflow-x-auto bg-gray-50'>
        <div className='col-span-3 px-4 md:p-6 pt-0! pb-20! overflow-auto'>
          {/* Card Icon and Title */}
          <div className='flex items-center gap-2'>
            <CreditCard className='size-6 text-gray-600' />
            <div className='w-full'>
              <TransparentInput
                defaultValue={task.title}
                placeholder='Click to add title'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateTitle(
                      e as unknown as React.FocusEvent<HTMLInputElement>
                    );
                    e.currentTarget.blur();
                  }
                }}
                onBlur={updateTitle}
                className='text-xl font-semibold mb-2 w-full'
              />
            </div>
          </div>

          {/* Add to card buttons - horizontally aligned */}
          <CardButton task={{ ...taskData, dueDate: task.dueDate }} />

          {/* labels */}
          <div className='flex items-center gap-2 mb-6 flex-wrap'>
            {taskData.labels && taskData.labels.length > 0
              ? taskData.labels.map((label, idx) => (
                  <Badge
                    size='sm'
                    key={idx}
                    className='odd:bg-indigo-500 even:bg-emerald-500 text-white text-xs pt-1 uppercase border-0'
                  >
                    {label}
                  </Badge>
                ))
              : null}
          </div>

          {/* Members */}
          {task.user && task.user.length > 0 && (
            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-600 mb-3'>
                Members
              </h4>
              <div className='flex items-center flex-wrap gap-2'>
                {task.user.map((user, idx) => (
                  <Avatar
                    key={idx}
                    fallback={user.username[0]}
                    alt={user.username}
                    size='sm'
                    className='cursor-pointer hover:opacity-80 transition-opacity'
                  />
                ))}
                <Dropdown
                  trigger={
                    <Button
                      variant='outline'
                      title='Add member'
                      size='sm'
                      className='size-7 bg-emerald-400 rounded-full p-0 border-dashed'
                    >
                      <Plus className='size-4' />
                    </Button>
                  }
                >
                  <div className='w-40'>
                    <DropdownItem>Add Member 1</DropdownItem>
                    <DropdownItem>Add Member 2</DropdownItem>
                    <DropdownItem>Add Member 3</DropdownItem>
                  </div>
                </Dropdown>
              </div>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className='mb-6'>
              <Badge
                className={cn(
                  new Date(task.dueDate) < new Date()
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : 'bg-green-100 text-green-700 border-green-200',
                  'flex items-center gap-2 w-fit'
                )}
              >
                {new Date(task.dueDate) < new Date() ? (
                  <AlertTriangle className='size-4' />
                ) : (
                  <Calendar className='size-4' />
                )}
                <span className='font-mono pt-1'>
                  {' '}
                  {formatDate(task.dueDate)}
                </span>
              </Badge>
            </div>
          )}

          {/* Description */}
          <TransparentTextarea
            className='mx-3 pl-4 h-20 border! border-gray-200! dark:border-gray-500!'
            placeholder='Click to add description'
            onBlur={updateDescription}
            label={
              <div className='flex items-center gap-2 mb-1'>
                <FileText className='size-5 text-gray-600' />
                <h3 className='font-semibold text-gray-800'>Description</h3>
              </div>
            }
            defaultValue={task.description}
          />

          {/* Checklists */}
          <TaskCheckLists items={taskData.checklists} />
        </div>

        {/* Comments section */}
        <TaskComments task={taskData} />
      </div>
    </Modal>
  );
}
