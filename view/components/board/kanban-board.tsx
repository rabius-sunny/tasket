'use client';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Board, Task } from '@/types';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  ArrowLeft,
  BarChart3,
  CheckSquare,
  Clock,
  Filter,
  MessageCircle,
  Paperclip,
  Settings,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { CreateTaskModal, KanbanColumn } from '../task/task-components';

interface KanbanBoardProps {
  board: Board;
  onBack: () => void;
  onUpdateTask: (taskId: number, data: Partial<Task>) => Promise<void>;
  onCreateTask: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    labels?: string[];
    status: string;
  }) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
}

export const KanbanBoard = ({
  board,
  onBack,
  onCreateTask,
  onDeleteTask,
  onUpdateTask
}: KanbanBoardProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Setup sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
        delay: 100,
        tolerance: 5
      }
    })
  );

  const columns = [
    {
      title: 'To Do',
      status: 'todo',
      color: 'bg-gray-400'
    },
    {
      title: 'In Progress',
      status: 'in-progress',
      color: 'bg-blue-400'
    },
    {
      title: 'Review',
      status: 'review',
      color: 'bg-yellow-400'
    },
    {
      title: 'Done',
      status: 'completed',
      color: 'bg-green-400'
    }
  ];

  const getTasksByStatus = (status: string) => {
    return board.tasks?.filter((task) => task.status === status) || [];
  };

  const handleAddTask = (status: string) => {
    setSelectedStatus(status);
    setShowCreateModal(true);
  };

  const handleEditTask = (task: Task) => {
    // You could open an edit modal here
    console.log('Edit task:', task);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDeleteTask(taskId);
    }
  };

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    dueDate?: string;
    labels?: string[];
    status: string;
  }) => {
    await onCreateTask(data);
    setShowCreateModal(false);
    setSelectedStatus('');
  };

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = board.tasks?.find((t) => t.id.toString() === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Check if we're dropping over a column
    const isOverColumn = columns.some((col) => col.status === overId);

    if (isOverColumn) {
      const task = board.tasks?.find((t) => t.id.toString() === activeId);
      if (task && task.status !== overId) {
        // Update task status when moving to a different column
        onUpdateTask(task.id, { status: overId as string });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Handle dropping on a column
    const isOverColumn = columns.some((col) => col.status === overId);

    if (isOverColumn) {
      const task = board.tasks?.find((t) => t.id.toString() === activeId);
      if (task && task.status !== overId) {
        onUpdateTask(task.id, { status: overId as string });
      }
    }
  };

  // Calculate board statistics
  const totalTasks = board.tasks?.length || 0;
  const completedTasks =
    board.tasks?.filter((task) => task.status === 'completed').length || 0;
  const inProgressTasks =
    board.tasks?.filter((task) => task.status === 'in-progress').length || 0;
  const overdueTasks =
    board.tasks?.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== 'completed'
    ).length || 0;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={onBack}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                {board.title}
              </h1>
              <p className='text-gray-600'>{board.workspace?.name}</p>
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center space-x-2'
            >
              <Filter className='h-4 w-4' />
              <span>Filter</span>
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center space-x-2'
            >
              <Users className='h-4 w-4' />
              <span>Members</span>
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center space-x-2'
            >
              <Settings className='h-4 w-4' />
              <span>Settings</span>
            </Button>
          </div>
        </div>

        {/* Board Statistics */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>Total Tasks</p>
                <BarChart3 className='h-4 w-4 text-gray-400' />
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              <p className='text-2xl font-bold text-gray-900'>{totalTasks}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>In Progress</p>
                <Badge
                  variant='primary'
                  size='sm'
                >
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              <p className='text-2xl font-bold text-blue-600'>
                {inProgressTasks}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>Completed</p>
                <Badge
                  variant='success'
                  size='sm'
                >
                  Done
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              <p className='text-2xl font-bold text-green-600'>
                {completedTasks}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>Overdue</p>
                <Badge
                  variant='danger'
                  size='sm'
                >
                  Late
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='pt-0'>
              <p className='text-2xl font-bold text-red-600'>{overdueTasks}</p>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className='overflow-x-auto'>
          <div className='flex space-x-6 pb-4'>
            {columns.map((column) => (
              <KanbanColumn
                key={column.status}
                title={column.title}
                status={column.status}
                tasks={getTasksByStatus(column.status)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                color={column.color}
              />
            ))}
          </div>
        </div>

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedStatus('');
          }}
          onSubmit={handleCreateTask}
          status={selectedStatus}
        />

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask && (
            <Card className='shadow-2xl border-2 border-blue-400 cursor-grabbing group rotate-2 scale-110 animate-pulse bg-white'>
              <CardContent className='p-4'>
                <div className='space-y-3'>
                  {/* Labels */}
                  {activeTask.labels && activeTask.labels.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {activeTask.labels.map((label, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          size='sm'
                          className='animate-bounce'
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h4 className='font-medium text-gray-900 animate-pulse'>
                    {activeTask.title}
                  </h4>

                  {/* Description */}
                  {activeTask.description && (
                    <p className='text-sm text-gray-600 line-clamp-2 opacity-75'>
                      {activeTask.description}
                    </p>
                  )}

                  {/* Due Date */}
                  {activeTask.dueDate && (
                    <div className='flex items-center space-x-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 animate-pulse'>
                      <Clock className='h-3 w-3' />
                      <span>{formatDate(activeTask.dueDate)}</span>
                    </div>
                  )}

                  {/* Footer */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      {/* Attachments */}
                      {activeTask.attachments &&
                        activeTask.attachments.length > 0 && (
                          <div className='flex items-center space-x-1 text-gray-500'>
                            <Paperclip className='h-3 w-3' />
                            <span className='text-xs'>
                              {activeTask.attachments.length}
                            </span>
                          </div>
                        )}

                      {/* Comments */}
                      {activeTask._count?.comments &&
                        activeTask._count.comments > 0 && (
                          <div className='flex items-center space-x-1 text-gray-500'>
                            <MessageCircle className='h-3 w-3' />
                            <span className='text-xs'>
                              {activeTask._count.comments}
                            </span>
                          </div>
                        )}

                      {/* Checklists */}
                      {activeTask._count?.checklists &&
                        activeTask._count.checklists > 0 && (
                          <div className='flex items-center space-x-1 text-gray-500'>
                            <CheckSquare className='h-3 w-3' />
                            <span className='text-xs'>
                              {activeTask._count.checklists}
                            </span>
                          </div>
                        )}
                    </div>

                    <div className='flex items-center space-x-2'>
                      {/* Assigned user */}
                      {activeTask.user && (
                        <Avatar
                          fallback={activeTask.user.username}
                          alt={activeTask.user.username}
                          size='sm'
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
