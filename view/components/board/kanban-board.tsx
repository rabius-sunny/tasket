'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Board, Task } from '@/types';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckSquare,
  Filter,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';

import { CreateTaskModal, EditTaskModal } from '../task/task-components';
import { BoardContext, type BoardContextValue } from './board-context';
import DragDropBoard from './drag-drop-board';
import { DroppableColumn } from './droppable-column';
import { createRegistry } from './registry';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [boardData, setBoardData] = useState<Task[]>(board.tasks || []);
  const { back } = useRouter();

  const [registry] = useState(createRegistry);
  const instanceId = useMemo(() => Symbol('board-instance'), []);

  // Sync board data when board.tasks changes
  useEffect(() => {
    setBoardData(board.tasks || []);
  }, [board.tasks]);

  const stableBoardData = useRef(boardData);
  useEffect(() => {
    stableBoardData.current = boardData;
  }, [boardData]);

  // Drag and drop event handlers
  const getTasks = useCallback(() => {
    return stableBoardData.current;
  }, []);

  const reorderTask = useCallback(
    async (args: {
      status: string;
      startIndex: number;
      finishIndex: number;
    }) => {
      const { status, startIndex, finishIndex } = args;

      const currentTasks = stableBoardData.current
        .filter((task) => task.status === status)
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      const reorderedTasks = reorder({
        list: currentTasks,
        startIndex,
        finishIndex
      });

      const movedTask = reorderedTasks[finishIndex];

      if (!movedTask) {
        console.error('Moved task not found after reorder', {
          status,
          startIndex,
          finishIndex,
          currentTasks: currentTasks.map((t) => ({
            id: t.id,
            title: t.title,
            position: t.position
          }))
        });
        return;
      }

      try {
        console.log('Reorder task:', {
          taskId: movedTask.id,
          title: movedTask.title,
          status,
          fromIndex: startIndex,
          toIndex: finishIndex
        });

        // Update backend with the new position
        await onUpdateTask(movedTask.id, {
          position: finishIndex
        });

        // Update local state with reordered tasks
        const newBoardData = stableBoardData.current.map((task) => {
          const updatedTask = reorderedTasks.find((t) => t.id === task.id);
          if (updatedTask) {
            return {
              ...updatedTask,
              position: reorderedTasks.indexOf(updatedTask)
            };
          }
          return task;
        });

        setBoardData(newBoardData);

        console.log('Task reordered successfully');
      } catch (error) {
        console.error('Error reordering task:', error);
        // Revert local state on error
        setBoardData([...stableBoardData.current]);
      }
    },
    [onUpdateTask]
  );

  const moveTask = useCallback(
    async (args: {
      startStatus: string;
      finishStatus: string;
      taskIndexInStartColumn: number;
      taskIndexInFinishColumn?: number;
    }) => {
      const {
        startStatus,
        finishStatus,
        taskIndexInStartColumn,
        taskIndexInFinishColumn = 0
      } = args;

      const startTasks = stableBoardData.current
        .filter((task) => task.status === startStatus)
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      const taskToMove = startTasks[taskIndexInStartColumn];

      if (!taskToMove) {
        console.error('Task to move not found', {
          startStatus,
          taskIndexInStartColumn,
          startTasks: startTasks.map((t) => ({
            id: t.id,
            title: t.title,
            position: t.position
          }))
        });
        return;
      }

      try {
        console.log('Move task:', {
          taskId: taskToMove.id,
          title: taskToMove.title,
          fromStatus: startStatus,
          toStatus: finishStatus,
          fromIndex: taskIndexInStartColumn,
          toIndex: taskIndexInFinishColumn
        });

        // Update backend with the correct status and position
        await onUpdateTask(taskToMove.id, {
          status: finishStatus,
          position: taskIndexInFinishColumn
        });

        // Simple local state update - just update the moved task
        const newBoardData = stableBoardData.current.map((task) => {
          if (task.id === taskToMove.id) {
            return {
              ...task,
              status: finishStatus,
              position: taskIndexInFinishColumn
            };
          }
          return task;
        });

        setBoardData(newBoardData);

        console.log('Task moved successfully');
      } catch (error) {
        console.error('Error moving task:', error);
        // Revert local state on error
        setBoardData([...stableBoardData.current]);
      }
    },
    [onUpdateTask]
  );

  const registerTask = useCallback(
    (args: {
      taskId: string;
      entry: { element: HTMLElement; actionMenuTrigger: HTMLElement };
    }) => {
      return registry.registerTask(args);
    },
    [registry]
  );

  const registerColumn = useCallback(
    (args: { columnId: string; entry: { element: HTMLElement } }) => {
      return registry.registerColumn(args);
    },
    [registry]
  );

  const boardContextValue: BoardContextValue = useMemo(() => {
    return {
      getTasks,
      reorderTask,
      moveTask,
      registerTask,
      registerColumn,
      instanceId,
      onTaskUpdate: onUpdateTask
    };
  }, [
    getTasks,
    reorderTask,
    moveTask,
    registerTask,
    registerColumn,
    instanceId,
    onUpdateTask
  ]);

  // Monitor drag and drop events
  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },
        onDrop(args) {
          const { location, source } = args;

          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }

          const sourceTaskId = source.data.taskId as string;
          const sourceTask = stableBoardData.current.find(
            (task) => task.id.toString() === sourceTaskId
          );

          if (!sourceTask) return;

          if (source.data.type === 'task') {
            console.log(
              '🎯 Drop targets:',
              location.current.dropTargets.map((t) => ({
                type: t.data.type,
                taskId: t.data.taskId,
                columnId: t.data.columnId,
                closestEdge: extractClosestEdge(t.data)
              }))
            );

            const sourceColumnId = sourceTask.status;
            const sourceColumnTasks = stableBoardData.current
              .filter((task) => task.status === sourceColumnId)
              .sort((a, b) => (a.position || 0) - (b.position || 0));
            const sourceIndex = sourceColumnTasks.findIndex(
              (task) => task.id.toString() === sourceTaskId
            );

            // Case 1: Dropping on empty column or at end/beginning (1 drop target)
            if (location.current.dropTargets.length === 1) {
              const [destinationColumnTarget] = location.current.dropTargets;
              const destinationColumnId = destinationColumnTarget.data
                .columnId as string;
              const destinationColumnTasks = stableBoardData.current
                .filter((task) => task.status === destinationColumnId)
                .sort((a, b) => (a.position || 0) - (b.position || 0));

              // Reordering in same column - move to end
              if (sourceColumnId === destinationColumnId) {
                const finishIndex = getReorderDestinationIndex({
                  startIndex: sourceIndex,
                  indexOfTarget: sourceColumnTasks.length - 1,
                  closestEdgeOfTarget: null,
                  axis: 'vertical'
                });

                if (finishIndex !== sourceIndex) {
                  console.log('🔄 Reordering within column (to end):', {
                    sourceColumnId,
                    sourceIndex,
                    finishIndex
                  });

                  reorderTask({
                    status: sourceColumnId,
                    startIndex: sourceIndex,
                    finishIndex
                  });
                }
                return;
              }

              // Moving to a new column - add to end
              const finishIndex = destinationColumnTasks.length;

              console.log('🔄 Moving between columns (to end):', {
                sourceColumnId,
                destinationColumnId,
                sourceIndex,
                finishIndex
              });

              moveTask({
                startStatus: sourceColumnId,
                finishStatus: destinationColumnId,
                taskIndexInStartColumn: sourceIndex,
                taskIndexInFinishColumn: finishIndex
              });
              return;
            }

            // Case 2: Dropping relative to a task (2 drop targets - task + column)
            if (location.current.dropTargets.length === 2) {
              const [destinationTaskTarget, destinationColumnTarget] =
                location.current.dropTargets;
              const destinationColumnId = destinationColumnTarget.data
                .columnId as string;
              const destinationColumnTasks = stableBoardData.current
                .filter((task) => task.status === destinationColumnId)
                .sort((a, b) => (a.position || 0) - (b.position || 0));

              const targetTaskId = destinationTaskTarget.data.taskId as string;
              const indexOfTarget = destinationColumnTasks.findIndex(
                (task) => task.id.toString() === targetTaskId
              );
              const closestEdgeOfTarget = extractClosestEdge(
                destinationTaskTarget.data
              );

              // Reordering in same column
              if (sourceColumnId === destinationColumnId) {
                const finishIndex = getReorderDestinationIndex({
                  startIndex: sourceIndex,
                  indexOfTarget,
                  closestEdgeOfTarget,
                  axis: 'vertical'
                });

                if (finishIndex !== sourceIndex) {
                  console.log(
                    '🔄 Reordering within column (relative to task):',
                    {
                      sourceColumnId,
                      sourceIndex,
                      finishIndex,
                      indexOfTarget,
                      closestEdgeOfTarget
                    }
                  );

                  reorderTask({
                    status: sourceColumnId,
                    startIndex: sourceIndex,
                    finishIndex
                  });
                }
                return;
              }

              // Moving to a new column relative to a task
              const finishIndex =
                closestEdgeOfTarget === 'bottom'
                  ? indexOfTarget + 1
                  : indexOfTarget;

              console.log('🔄 Moving between columns (relative to task):', {
                sourceColumnId,
                destinationColumnId,
                sourceIndex,
                finishIndex,
                indexOfTarget,
                closestEdgeOfTarget
              });

              moveTask({
                startStatus: sourceColumnId,
                finishStatus: destinationColumnId,
                taskIndexInStartColumn: sourceIndex,
                taskIndexInFinishColumn: finishIndex
              });
            }

            // Flash the moved task after any successful move
            try {
              const entry = registry.getTask(sourceTaskId);
              if (entry) {
                triggerPostMoveFlash(entry.element);
              }
            } catch (error) {
              console.log('Could not flash moved task:', error);
            }
          }
        }
      })
    );
  }, [instanceId, registry, reorderTask, moveTask]);

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
    return boardData
      .filter((task) => task.status === status)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
  };

  const handleAddTask = (status: string) => {
    setSelectedStatus(status);
    setShowCreateModal(true);
  };

  const handleEditTask = (task: Task) => {
    setActiveTask(task);
    setShowEditModal(true);
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

  const handleUpdateTask = async (data: {
    title?: string;
    description?: string;
    labels?: string[];
    dueDate?: string;
    assignedTo?: number;
    status?: string;
    position?: number;
  }) => {
    if (activeTask) {
      await onUpdateTask(activeTask.id, data);
      setShowEditModal(false);
      setActiveTask(null);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDeleteTask(taskId);
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
                <p className='text-3xl font-bold text-gray-900'>{totalTasks}</p>
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
        <BoardContext.Provider value={boardContextValue}>
          <DragDropBoard>
            {columns.map((column) => (
              <DroppableColumn
                key={column.status}
                columnId={column.status}
                title={column.title}
                tasks={getTasksByStatus(column.status)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </DragDropBoard>
        </BoardContext.Provider>
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

      {/* Edit Task Modal */}
      {activeTask && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setActiveTask(null);
          }}
          onSubmit={handleUpdateTask}
          task={activeTask}
        />
      )}
    </div>
  );
};
