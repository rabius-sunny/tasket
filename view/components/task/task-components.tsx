'use client';

import { AvatarGroup } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '@/types';
import { formatDate, getDueDateStatus } from '@/utils/date';
import {
  AlertCircle,
  CheckSquare,
  Clock,
  MessageCircle,
  MoreHorizontal
} from 'lucide-react';
import { forwardRef, useState } from 'react';
import TaskDetails from './task-details';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: number) => void;
  actionMenuTriggerRef?: React.Ref<HTMLButtonElement>;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  function TaskCard({ task, onDelete, actionMenuTriggerRef }, ref) {
    const [showActions, setShowActions] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [open, setOpen] = useState(false);
    const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;

    const handleCloseModal = (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        setSelectedTask(null);
      }
    };

    return (
      <div
        ref={ref}
        className='transition-all duration-200 ease-in-out'
        onClick={() => {
          setSelectedTask(task);
          setOpen(true);
        }}
      >
        <Card className='mb-3 hover:shadow-lg transition-all duration-200 cursor-grab hover:cursor-grabbing group hover:ring-1 hover:ring-indigo-500'>
          <CardContent className='p-2 py-1'>
            {/* Actions */}
            <div className='relative flex justify-end'>
              <Button
                ref={actionMenuTriggerRef}
                variant='ghost'
                size='sm'
                className='p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>

              {showActions && (
                <div className='absolute right-0 top-5 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-0 duration-200'>
                  <div className='py-1'>
                    <button
                      onClick={() => onDelete(task.id)}
                      className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200'
                    >
                      Delete Task
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className='space-y-1.5 -mt-4'>
              {/* Title */}
              <h4 className='font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2'>
                {task.title}
              </h4>
              {/* Due Date */}
              {task.dueDate && dueDateStatus && (
                <div
                  className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-all duration-200 ${dueDateStatus.color} w-fit`}
                >
                  {dueDateStatus.status === 'overdue' ? (
                    <AlertCircle className='h-3 w-3 animate-pulse' />
                  ) : (
                    <Clock className='h-3 w-3' />
                  )}
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}

              {/* Footer */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  {/* Comments */}
                  <div className='flex items-center space-x-1 text-green-600 transition-colors duration-200'>
                    <MessageCircle className='size-4' />
                    <span className='text-xs'>{task._count?.comments}</span>
                  </div>

                  {/* Checklists */}
                  <div className='flex items-center space-x-1 text-purple-600 transition-colors duration-200'>
                    <CheckSquare className='size-4' />
                    <span className='text-xs'>{task._count?.checklists}</span>
                  </div>
                </div>

                <div className=''>
                  {/* Assigned user */}

                  <AvatarGroup
                    avatars={task?.assignee?.map((user) => ({
                      alt: user.username,
                      fallback: user.username.slice(0, 1),
                      size: 'sm'
                    }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            open={open}
            setOpen={handleCloseModal}
          />
        )}
      </div>
    );
  }
);
