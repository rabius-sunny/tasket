import { formatDate } from '@/lib/utils';
import { Task } from '@/types';
import {
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  CreditCard,
  FileText,
  MoreHorizontal,
  Paperclip,
  Plus,
  Tag,
  User as UserIcon,
  X
} from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dropdown, DropdownItem } from '../ui/dropdown';
import { Modal } from '../ui/modal';
import { TransparentInput, TransparentTextarea } from '../ui/transparent-input';
import TaskComments from './task-comments';

type TProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function TaskDetails({ task, isOpen, onClose }: TProps) {
  if (!task) return null;

  // Calculate checklist progress
  const totalChecklistItems =
    task.checklists?.reduce(
      (acc, checklist) => acc + checklist.items.length,
      0
    ) || 0;
  const completedChecklistItems =
    task.checklists?.reduce(
      (acc, checklist) =>
        acc + checklist.items.filter((item) => item.completed).length,
      0
    ) || 0;
  const checklistProgress =
    totalChecklistItems > 0
      ? Math.round((completedChecklistItems / totalChecklistItems) * 100)
      : 0;

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
        <div className='p-2 bg-gray-50 flex items-center justify-between'>
          <Dropdown
            className='w-32'
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
            <DropdownItem>Todo</DropdownItem>
            <DropdownItem>In Progress</DropdownItem>
            <DropdownItem>Review</DropdownItem>
            <DropdownItem>Done</DropdownItem>
          </Dropdown>
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
      <div className='grid grid-cols-5 w-full pt-0! h-[80vh] bg-gray-50'>
        <div className='col-span-3 p-4 md:p-6 pt-0! overflow-y-auto'>
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
          <div className='mb-6'>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200 text-xs'
              >
                <UserIcon className='size-4 mr-2' />
                Members
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200 text-xs'
              >
                <Tag className='size-4 mr-2' />
                Labels
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200 text-xs'
              >
                <CheckSquare className='size-4 mr-2' />
                Checklist
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200 text-xs'
              >
                <Calendar className='size-4 mr-2' />
                Dates
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200 text-xs'
              >
                <Paperclip className='size-4 mr-2' />
                Attachment
              </Button>
            </div>
          </div>

          {/* Members */}
          {task.user && task.user.length > 0 && (
            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-600 mb-3'>
                Members
              </h4>
              <div className='flex flex-wrap gap-2'>
                {task.user.map((user) => (
                  <Avatar
                    key={user.id}
                    fallback={user.username[0]}
                    alt={user.username}
                    size='md'
                    className='cursor-pointer hover:opacity-80 transition-opacity'
                  />
                ))}
                <Button
                  variant='outline'
                  size='sm'
                  className='size-8 rounded-full p-0 border-dashed'
                >
                  <Plus className='size-4' />
                </Button>
              </div>
            </div>
          )}

          {/* Labels */}
          {task.labels && task.labels.length > 0 ? (
            <div className='flex flex-wrap gap-2 mb-6'>
              {task.labels.map((label, idx) => (
                <Badge
                  key={idx}
                  className='bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                >
                  {label}
                </Badge>
              ))}
            </div>
          ) : null}

          {/* Due Date */}
          {task.dueDate && (
            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-600 mb-3'>
                Due Date
              </h4>
              <div className='flex items-center gap-2'>
                <Badge
                  className={
                    new Date(task.dueDate) < new Date()
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-green-100 text-green-700 border-green-200'
                  }
                >
                  <Calendar className='h-3 w-3 mr-1' />
                  {formatDate(task.dueDate)}
                </Badge>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-6 px-2'
                >
                  {new Date(task.dueDate) < new Date() ? 'Overdue' : 'Complete'}
                </Button>
              </div>
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
          {task.checklists && task.checklists.length > 0 && (
            <div className='mb-6'>
              <div className='flex items-center gap-2 mb-3'>
                <CheckSquare className='h-5 w-5 text-gray-600' />
                <h3 className='font-semibold text-gray-800'>Checklist</h3>
                {totalChecklistItems > 0 && (
                  <span className='text-sm text-gray-500'>
                    {completedChecklistItems}/{totalChecklistItems}
                  </span>
                )}
              </div>
              <div className='ml-7 space-y-4'>
                {/* Progress Bar */}
                {totalChecklistItems > 0 && (
                  <div className='flex items-center gap-3'>
                    <span className='text-sm text-gray-600 w-10'>
                      {checklistProgress}%
                    </span>
                    <div className='flex-1 bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-green-500 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${checklistProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Checklist Items */}
                {task.checklists.map((checklist) => (
                  <div
                    key={checklist.id}
                    className='space-y-2'
                  >
                    <h4 className='font-medium text-gray-700'>
                      {checklist.title}
                    </h4>
                    <div className='space-y-2'>
                      {checklist.items.map((item) => (
                        <div
                          key={item.id}
                          className='flex items-center gap-3 p-2 hover:bg-gray-50 rounded group'
                        >
                          <button className='flex-shrink-0'>
                            {item.completed ? (
                              <div className='w-4 h-4 bg-green-500 rounded flex items-center justify-center'>
                                <Check className='h-3 w-3 text-white' />
                              </div>
                            ) : (
                              <div className='w-4 h-4 border-2 border-gray-300 rounded hover:border-gray-400' />
                            )}
                          </button>
                          <span
                            className={`flex-1 text-sm ${
                              item.completed
                                ? 'line-through text-gray-500'
                                : 'text-gray-700'
                            }`}
                          >
                            {item.title}
                          </span>
                          {item.dueDate && (
                            <Badge
                              variant='secondary'
                              className='text-xs'
                            >
                              {formatDate(item.dueDate)}
                            </Badge>
                          )}
                          {item.assignedUser && (
                            <Avatar
                              fallback={item.assignedUser.username[0]}
                              alt={item.assignedUser.username}
                              size='sm'
                            />
                          )}
                          <Button
                            variant='ghost'
                            size='sm'
                            className='opacity-0 group-hover:opacity-100 h-6 w-6 p-0'
                          >
                            <MoreHorizontal className='h-3 w-3' />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-gray-600 hover:text-gray-800'
                    >
                      <Plus className='size-4 mr-1' />
                      Add an item
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments section */}
        <TaskComments task={task} />
      </div>
    </Modal>
  );
}
