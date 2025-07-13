'use client';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  actionMenuTriggerRef?: React.Ref<HTMLButtonElement>;
}

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  function TaskCard({ task, onEdit, onDelete, actionMenuTriggerRef }, ref) {
    const [showActions, setShowActions] = useState(false);
    const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;

    return (
      <div
        ref={ref}
        className='transition-all duration-200 ease-in-out'
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
                  {task._count?.comments && task._count.comments > 0 && (
                    <div className='flex items-center space-x-1 text-green-600 transition-colors duration-200'>
                      <MessageCircle className='size-4' />
                      <span className='text-xs'>{task._count.comments}</span>
                    </div>
                  )}

                  {/* Checklists */}
                  {task._count?.checklists && task._count.checklists > 0 && (
                    <div className='flex items-center space-x-1 text-purple-600 transition-colors duration-200'>
                      <CheckSquare className='size-4' />
                      <span className='text-xs'>{task._count.checklists}</span>
                    </div>
                  )}
                </div>

                <div className='flex items-center space-x-2'>
                  {/* Assigned user */}
                  {task.user && (
                    <Avatar
                      fallback={task.user.username.slice(0, 1)}
                      alt='U'
                      size='sm'
                      className='transition-all duration-200 hover:scale-110'
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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

interface KanbanColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

export const KanbanColumn = ({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask
}: KanbanColumnProps) => {
  // Column gradient mappings
  const columnStyles = {
    todo: {
      gradient: 'from-gray-100 to-gray-200',
      headerGradient: 'from-gray-500 to-gray-600',
      hoverGradient: 'from-gray-200 to-gray-300',
      borderColor: 'border-gray-300'
    },
    'in-progress': {
      gradient: 'from-blue-100 to-blue-200',
      headerGradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-200 to-blue-300',
      borderColor: 'border-blue-300'
    },
    review: {
      gradient: 'from-yellow-100 to-yellow-200',
      headerGradient: 'from-yellow-500 to-yellow-600',
      hoverGradient: 'from-yellow-200 to-yellow-300',
      borderColor: 'border-yellow-300'
    },
    completed: {
      gradient: 'from-green-100 to-green-200',
      headerGradient: 'from-green-500 to-green-600',
      hoverGradient: 'from-green-200 to-green-300',
      borderColor: 'border-green-300'
    }
  };

  const styleConfig =
    columnStyles[status as keyof typeof columnStyles] || columnStyles.todo;

  return (
    <div
      className={`
        bg-gradient-to-b ${styleConfig.gradient} 
        rounded-2xl p-6 min-h-[600px] w-80 
        transition-all duration-300 ease-in-out
        border-2 ${styleConfig.borderColor}
        shadow-lg hover:shadow-xl
      `}
    >
      {/* Column Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-3'>
          <div
            className={`w-4 h-4 rounded-full bg-gradient-to-r ${styleConfig.headerGradient} shadow-md`}
          />
          <h3 className='font-bold text-lg text-gray-800'>{title}</h3>
          <Badge
            variant='secondary'
            size='sm'
            className={`
              bg-white/70 backdrop-blur text-gray-700 border-white/50
              transition-all duration-200 hover:scale-110 hover:bg-white/90
            `}
          >
            {tasks.length}
          </Badge>
        </div>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => onAddTask(status)}
          className={`
            p-2 rounded-xl bg-white/50 hover:bg-white/80 backdrop-blur
            transition-all duration-200 hover:scale-110 hover:rotate-12
            shadow-md hover:shadow-lg
          `}
        >
          <Plus className='h-5 w-5 text-gray-700' />
        </Button>
      </div>

      {/* Tasks Container */}
      <div className='space-y-4'>
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className='animate-in fade-in slide-in-from-top-2 duration-300'
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TaskCard
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </div>
        ))}

        {/* Enhanced Drop Zone */}

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className='text-center py-12 opacity-50'>
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${styleConfig.headerGradient} flex items-center justify-center mx-auto mb-4 opacity-20`}
            >
              <Plus className='h-8 w-8 text-white' />
            </div>
            <p className='text-sm text-gray-600'>No tasks yet</p>
            <p className='text-xs text-gray-500 mt-1'>Add your first task</p>
          </div>
        )}
      </div>

      {/* Column Footer Stats */}
      <div className='mt-6 pt-4 border-t border-white/30'>
        <div className='flex items-center justify-between text-xs text-gray-600'>
          <span>Tasks: {tasks.length}</span>
          {tasks.length > 0 && (
            <span className='flex items-center'>
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${styleConfig.headerGradient} mr-1 animate-pulse`}
              ></div>
              Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
