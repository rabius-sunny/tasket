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
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertCircle,
  CheckSquare,
  Clock,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const dueDateStatus = task.dueDate ? getDueDateStatus(task.dueDate) : null;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id.toString(),
      data: {
        type: 'task',
        task
      }
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: 'transform 0.2s ease'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        isDragging ? 'invisible' : ''
      } transition-all duration-200 ease-in-out`}
      {...attributes}
      {...listeners}
    >
      <Card className='mb-3 hover:shadow-lg transition-all duration-200 cursor-grab hover:cursor-grabbing group hover:scale-105 hover:rotate-1'>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div className='flex flex-wrap gap-1'>
                {task.labels.map((label, index) => (
                  <Badge
                    key={index}
                    variant='secondary'
                    size='sm'
                    className='transition-all duration-200 hover:scale-110'
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h4 className='font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200'>
              {task.title}
            </h4>

            {/* Description */}
            {task.description && (
              <p className='text-sm text-gray-600 line-clamp-2'>
                {task.description}
              </p>
            )}

            {/* Due Date */}
            {task.dueDate && dueDateStatus && (
              <div
                className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-all duration-200 ${dueDateStatus.color}`}
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
                {/* Attachments */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className='flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors duration-200'>
                    <Paperclip className='h-3 w-3' />
                    <span className='text-xs'>{task.attachments.length}</span>
                  </div>
                )}

                {/* Comments */}
                {task._count?.comments && task._count.comments > 0 && (
                  <div className='flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors duration-200'>
                    <MessageCircle className='h-3 w-3' />
                    <span className='text-xs'>{task._count.comments}</span>
                  </div>
                )}

                {/* Checklists */}
                {task._count?.checklists && task._count.checklists > 0 && (
                  <div className='flex items-center space-x-1 text-gray-500 hover:text-purple-600 transition-colors duration-200'>
                    <CheckSquare className='h-3 w-3' />
                    <span className='text-xs'>{task._count.checklists}</span>
                  </div>
                )}
              </div>

              <div className='flex items-center space-x-2'>
                {/* Assigned user */}
                {task.user && (
                  <Avatar
                    fallback={task.user.username}
                    alt={task.user.username}
                    size='sm'
                    className='transition-all duration-200 hover:scale-110'
                  />
                )}

                {/* Actions */}
                <div className='relative'>
                  <Button
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
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [labels, setLabels] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        status
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setLabels('');
      setAssignedTo('');
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
      title='Create New Task'
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

        <Input
          label='Labels (Optional)'
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          placeholder='Comma-separated labels (e.g., backend, auth, high-priority)'
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
            Create Task
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
  color: string;
}

export const KanbanColumn = ({
  title,
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  color
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-4 min-h-[500px] w-80 transition-all duration-300 ease-in-out ${
        isOver
          ? 'bg-blue-50 border-2 border-blue-300 shadow-lg transform scale-105'
          : 'hover:shadow-md'
      }`}
    >
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-2'>
          <div
            className={`w-3 h-3 rounded-full ${color} transition-all duration-200 ${
              isOver ? 'animate-pulse scale-125' : ''
            }`}
          />
          <h3 className='font-semibold text-gray-900'>{title}</h3>
          <Badge
            variant='secondary'
            size='sm'
            className='transition-all duration-200 hover:scale-110'
          >
            {tasks.length}
          </Badge>
        </div>

        <Button
          variant='ghost'
          size='sm'
          onClick={() => onAddTask(status)}
          className='p-1 hover:bg-blue-100 transition-all duration-200 hover:scale-110'
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      <div className='space-y-3'>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {/* Drop zone indicator */}
        {isOver && tasks.length === 0 && (
          <div className='border-2 border-dashed border-blue-300 rounded-lg p-8 text-center text-blue-600 animate-pulse'>
            <Plus className='h-8 w-8 mx-auto mb-2' />
            <p className='text-sm font-medium'>Drop task here</p>
          </div>
        )}
      </div>
    </div>
  );
};
