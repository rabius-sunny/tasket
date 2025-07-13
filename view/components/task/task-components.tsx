'use client';

import { AvatarGroup } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { formatDate, getDueDateStatus } from '@/lib/utils';
import { Task } from '@/types';
import {
  AlertCircle,
  CheckSquare,
  Clock,
  MessageCircle,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { forwardRef, useEffect, useState } from 'react';
import TaskDetails from './task-details';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  actionMenuTriggerRef?: React.Ref<HTMLButtonElement>;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  function TaskCard({ task, onEdit, onDelete, actionMenuTriggerRef }, ref) {
    const [showActions, setShowActions] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;

    return (
      <div
        ref={ref}
        className='transition-all duration-200 ease-in-out'
        onClick={() => setIsOpen(true)}
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
                      onClick={() => onEdit(task)}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200'
                    >
                      Edit Task
                    </button>
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
                    avatars={task?.user?.concat(task?.user).map((user) => ({
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
        <TaskDetails
          task={task}
          isOpen={isOpen}
          setIsOpen={() => setIsOpen(false)}
        />
      </div>
    );
  }
);

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    labels?: string[];
    dueDate?: string;
    assignedTo?: number;
    status: string;
  }) => void;
  status: string;
}

export const CreateTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  status
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        title,
        status
      });

      // Reset form
      setTitle('');
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='✨ Create New Task'
      size='xl'
    >
      <div className='text-center mb-8'>
        <div className='w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
          <Plus className='h-10 w-10 text-white' />
        </div>
        <h3 className='text-xl font-bold text-gray-900 mb-2'>Add a New Task</h3>
        <p className='text-gray-600'>
          Create a task for the{' '}
          <span className='font-semibold text-blue-600'>
            {status.replace('-', ' ')}
          </span>{' '}
          column
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className='space-y-6'
      >
        <div className='space-y-4'>
          <Input
            label='Task Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g., Design user interface, Fix login bug'
            required
            className='text-lg'
          />
        </div>

        <div className='flex justify-end space-x-4 pt-8 border-t border-gray-100'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            size='lg'
            className='px-8'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            isLoading={isLoading}
            size='lg'
            className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 hover:shadow-lg transition-all duration-300 hover:scale-105'
          >
            {isLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title?: string;
    description?: string;
    labels?: string[];
    dueDate?: string;
    assignedTo?: number;
    status?: string;
    position?: number;
  }) => void;
  task: Task;
}

export const EditTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task
}: EditTaskModalProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [labels, setLabels] = useState(task.labels?.join(', ') || '');
  const [assignedTo, setAssignedTo] = useState(
    task.assignedTo?.toString() || ''
  );
  const [status, setStatus] = useState(task.status);
  const [isLoading, setIsLoading] = useState(false);

  // Update form fields when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    // Convert ISO date to datetime-local format for input
    setDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
    );
    setLabels(task.labels?.join(', ') || '');
    setAssignedTo(task.assignedTo?.toString() || '');
    setStatus(task.status);
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit({
        title,
        description: description || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        labels: labels ? labels.split(',').map((l) => l.trim()) : undefined,
        assignedTo: assignedTo ? parseInt(assignedTo) : undefined,
        status,
        position: task.position
      });

      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Edit Task'
      size='lg'
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <Input
          label='Task Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter task title'
          required
        />

        <Textarea
          label='Description (Optional)'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Describe your task...'
          rows={3}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='Due Date (Optional)'
            type='datetime-local'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Input
            label='Assigned To (User ID - Optional)'
            type='number'
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder='Enter user ID'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='Labels (Optional)'
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder='Comma-separated labels (e.g., backend, auth, high-priority)'
          />

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className='w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='todo'>To Do</option>
              <option value='in-progress'>In Progress</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
        </div>

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
            Update Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
