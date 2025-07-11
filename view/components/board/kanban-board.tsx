'use client';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Calendar,
  CheckSquare,
  Clock,
  Filter,
  MessageCircle,
  Paperclip,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreateTaskModal, KanbanColumn } from '../task/task-components';

interface KanbanBoardProps {
  board: Board;
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
  onCreateTask,
  onDeleteTask,
  onUpdateTask
}: KanbanBoardProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { back } = useRouter();

  // Setup sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
        delay: 100,
        tolerance: 5
      }
    })
  );

  const columns = [
    {
      title: 'To Do 📝',
      status: 'todo',
      color: 'bg-gray-400'
    },
    {
      title: 'In Progress 🚧',
      status: 'in-progress',
      color: 'bg-blue-400'
    },
    {
      title: 'Review 🔍',
      status: 'review',
      color: 'bg-yellow-400'
    },
    {
      title: 'Done ✅',
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
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
        {/* Fancy Header */}
        <div className='relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-10'>
          <div className='absolute inset-0 bg-black/20'></div>

          {/* Floating background elements */}
          <div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
            <div className='absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse'></div>
            <div className='absolute top-20 right-20 w-16 h-16 bg-yellow-300/20 rounded-full animate-bounce'></div>
            <div className='absolute bottom-10 left-1/4 w-12 h-12 bg-pink-300/20 rounded-full animate-ping'></div>
            <div className='absolute top-1/3 right-1/3 w-8 h-8 bg-blue-300/30 rounded-full animate-pulse'></div>
          </div>

          <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-0 items-center justify-between'>
              <div className='flex flex-col lg:flex-row gap-4 lg:gap-0 items-center space-x-6'>
                <Button
                  variant='ghost'
                  onClick={() => back()}
                  className='text-white hover:bg-white/20 transition-all duration-300 hover:scale-105'
                >
                  <ArrowLeft className='h-5 w-5 mr-2' />
                  Back to Boards
                </Button>

                <div className='flex items-center space-x-4'>
                  {/* Board Avatar */}
                  <div className='size-8 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30'>
                    <Target className='h-8 w-8 text-white' />
                  </div>

                  <div>
                    <h1 className='text-3xl md:text-4xl font-bold text-white mb-1 flex items-center'>
                      {board.title}
                      <Sparkles className='h-6 w-6 ml-2 text-yellow-300 animate-pulse' />
                    </h1>
                    <div className='flex items-center space-x-2'>
                      <Link
                        href={`/boards?workspace=${board.workspace?.id}`}
                        className='text-blue-100 text-lg underline'
                      >
                        {board.workspace?.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-3'>
                <Button
                  variant='ghost'
                  size='lg'
                  className='text-white border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105'
                >
                  <Filter className='h-5 w-5 mr-2' />
                  Filter
                </Button>
                <Button
                  variant='ghost'
                  size='lg'
                  className='text-white border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105'
                >
                  <Users className='h-5 w-5 mr-2' />
                  Team
                </Button>
                <Button
                  variant='ghost'
                  size='lg'
                  className='text-white border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105'
                >
                  <Settings className='h-5 w-5 mr-2' />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Dashboard */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8'>
            <Card className='group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 bg-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-300'>
                    <BarChart3 className='h-6 w-6 text-white' />
                  </div>
                  <TrendingUp className='h-5 w-5 text-green-500' />
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600 mb-1'>
                    Total Tasks
                  </p>
                  <p className='text-3xl font-bold text-gray-900'>
                    {totalTasks}
                  </p>
                  <p className='text-xs text-green-600 font-medium'>
                    +12% this week
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-purple-50'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 bg-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300'>
                    <Zap className='h-6 w-6 text-white' />
                  </div>
                  <Badge
                    variant='primary'
                    size='sm'
                    className='animate-pulse'
                  >
                    Active
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600 mb-1'>
                    In Progress
                  </p>
                  <p className='text-3xl font-bold text-purple-600'>
                    {inProgressTasks}
                  </p>
                  <p className='text-xs text-purple-600 font-medium'>
                    Currently working
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-green-50'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform duration-300'>
                    <CheckSquare className='h-6 w-6 text-white' />
                  </div>
                  <Badge
                    variant='success'
                    size='sm'
                  >
                    ✓ Done
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600 mb-1'>
                    Completed
                  </p>
                  <p className='text-3xl font-bold text-green-600'>
                    {completedTasks}
                  </p>
                  <p className='text-xs text-green-600 font-medium'>
                    {totalTasks > 0
                      ? Math.round((completedTasks / totalTasks) * 100)
                      : 0}
                    % complete
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-red-50'>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-3 bg-red-500 rounded-xl group-hover:scale-110 transition-transform duration-300'>
                    <Calendar className='h-6 w-6 text-white' />
                  </div>
                  <Badge
                    variant='danger'
                    size='sm'
                    className={overdueTasks > 0 ? 'animate-pulse' : ''}
                  >
                    ⚠ Late
                  </Badge>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600 mb-1'>
                    Overdue
                  </p>
                  <p className='text-3xl font-bold text-red-600'>
                    {overdueTasks}
                  </p>
                  <p className='text-xs text-red-600 font-medium'>
                    Need attention
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Kanban Board */}
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-2xl font-bold text-gray-900 flex items-center'>
                <Target className='h-6 w-6 mr-2 text-indigo-600' />
                Task Board
              </h2>
              <div className='flex items-center space-x-2'>
                <div className='flex items-center space-x-1 text-sm text-gray-600'>
                  <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                  Live Updates
                </div>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <div
                className='flex space-x-6 pb-4'
                style={{ minWidth: 'max-content' }}
              >
                {columns.map((column, index) => (
                  <div
                    key={column.status}
                    className='animate-fade-in-up'
                    style={{ animationDelay: `${index * 300}ms` }}
                  >
                    <KanbanColumn
                      title={column.title}
                      status={column.status}
                      tasks={getTasksByStatus(column.status)}
                      onAddTask={handleAddTask}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  </div>
                ))}
              </div>
            </div>
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

        {/* Enhanced Drag Overlay */}
        <DragOverlay>
          {activeTask && (
            <Card className='shadow-2xl border-2 border-indigo-400 cursor-grabbing group rotate-2 scale-110 animate-pulse bg-white'>
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
