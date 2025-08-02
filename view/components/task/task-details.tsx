'use client';

import { useTasks } from '@/helper/tasks';
import { useAsync } from '@/lib/hooks';
import { Task } from '@/types';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/random';
import { AlertTriangle, Calendar, CreditCard, FileText, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import { TransparentInput, TransparentTextarea } from '../ui/transparent-input';
import CardButton from './card-buttons';
import TaskModalMembers from './members';
import TaskModalHeader from './modal/header';
import TaskModalLabels from './modal/labels';
import TaskCheckLists from './task-checklists';
import TaskComments from './task-comments';

type TProps = {
  task: Task;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function TaskDetails({ task, open, setOpen }: TProps) {
  const {
    data: taskData,
    isLoading: loading,
    mutate
  } = useAsync<Task>(
    () => task && `/tasks?id=${task.id}&boardId=${task.boardId}`
  );
  const { updateTask } = useTasks();
  if (loading || !taskData) return <div>Loading...</div>;

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleClose();
  };

  const updateTitle = (e: React.FocusEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim();
    if (newTitle && newTitle !== task.title.trim()) {
      updateTask({
        id: task.id,
        title: newTitle
      });
      mutate();
    }
  };

  const updateDescription = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value.trim();
    if (newDescription && newDescription !== task?.description?.trim()) {
      updateTask({
        id: task.id,
        description: newDescription
      });
      mutate();
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      size='xl'
      header={
        <TaskModalHeader
          task={{ ...task, ...taskData }}
          loading={loading}
          onClose={handleCloseButtonClick}
        />
      }
    >
      <div className='grid grid-cols-5 pt-0! h-[80vh] min-w-[900px] overflow-x-auto bg-gray-50'>
        <Button
          onClick={handleCloseButtonClick}
          variant='ghost'
          size='sm'
          className='fixed lg:hidden top-2 sm:top-4 rounded-full animate-pulse bg-red-500 text-white right-2 sm:right-6 md:right-8 size-8 p-0 hover:bg-gray-200 hover:text-black'
        >
          <X className='size-5' />
        </Button>
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

          {/* card buttons - horizontally aligned */}
          <CardButton task={{ ...taskData, dueDate: task.dueDate }} />

          {/* labels */}
          <TaskModalLabels labels={taskData.labels} />

          {/* Members */}
          <TaskModalMembers assignee={task.assignee || []} />

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
            defaultValue={taskData.description}
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
