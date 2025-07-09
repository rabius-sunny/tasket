import { JSX, For, createSignal, Show } from 'solid-js';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  User,
  Flag,
  MessageSquare,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { Card } from './Card';
import Button from './Button';
import { Dropdown, DropdownItem, DropdownDivider } from './Dropdown';
import Badge from './Badge';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  comments: number;
  attachments: number;
  completed?: boolean;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
}

interface KanbanBoardProps {
  columns: Column[];
  onTaskMove?: (taskId: string, fromColumn: string, toColumn: string) => void;
  onTaskCreate?: (columnId: string) => void;
  onTaskEdit?: (taskId: string) => void;
}

export function KanbanBoard(props: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = createSignal<string | null>(null);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = draggedTask();
    if (taskId && props.onTaskMove) {
      // Find the source column
      const sourceColumn = props.columns.find((col) =>
        col.tasks.some((task) => task.id === taskId)
      );
      if (sourceColumn && sourceColumn.id !== columnId) {
        props.onTaskMove(taskId, sourceColumn.id, columnId);
      }
    }
    setDraggedTask(null);
  };

  return (
    <div class='flex gap-6 overflow-x-auto pb-6'>
      <For each={props.columns}>
        {(column) => (
          <div
            class='flex-shrink-0 w-80'
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <Card
              padding={false}
              class='h-full'
            >
              {/* Column Header */}
              <div class='p-4 border-b border-gray-200'>
                <div class='flex items-center justify-between'>
                  <div class='flex items-center space-x-2'>
                    <div
                      class={`w-3 h-3 rounded-full bg-${
                        column.color || 'gray'
                      }-500`}
                    />
                    <h3 class='font-semibold text-gray-900'>{column.title}</h3>
                    <Badge
                      variant='default'
                      size='sm'
                    >
                      {column.tasks.length}
                    </Badge>
                  </div>
                  <Dropdown
                    trigger={
                      <button class='p-1 text-gray-400 hover:text-gray-600 rounded'>
                        <MoreHorizontal class='w-4 h-4' />
                      </button>
                    }
                    align='right'
                  >
                    <DropdownItem>Edit Column</DropdownItem>
                    <DropdownItem>Clear All Tasks</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem>Delete Column</DropdownItem>
                  </Dropdown>
                </div>
              </div>

              {/* Tasks */}
              <div class='p-4 space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto'>
                <For each={column.tasks}>
                  {(task) => (
                    <div
                      class='bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-shadow'
                      draggable={true}
                      onDragStart={() => handleDragStart(task.id)}
                      onClick={() => props.onTaskEdit?.(task.id)}
                    >
                      {/* Task Header */}
                      <div class='flex items-start justify-between mb-3'>
                        <h4 class='font-medium text-gray-900 text-sm leading-5 flex-1'>
                          {task.title}
                        </h4>
                        <div class='flex items-center space-x-2 ml-2'>
                          <Flag
                            class={`w-3 h-3 text-${getPriorityColor(
                              task.priority
                            )}-500`}
                          />
                          <Show when={task.completed}>
                            <CheckCircle2 class='w-3 h-3 text-green-500' />
                          </Show>
                        </div>
                      </div>

                      {/* Task Description */}
                      <Show when={task.description}>
                        <p class='text-xs text-gray-600 mb-3 line-clamp-2'>
                          {task.description}
                        </p>
                      </Show>

                      {/* Task Meta */}
                      <div class='flex items-center justify-between text-xs text-gray-500'>
                        <div class='flex items-center space-x-3'>
                          <Show when={task.dueDate}>
                            <div class='flex items-center space-x-1'>
                              <Calendar class='w-3 h-3' />
                              <span>{task.dueDate}</span>
                            </div>
                          </Show>

                          <Show when={task.comments > 0}>
                            <div class='flex items-center space-x-1'>
                              <MessageSquare class='w-3 h-3' />
                              <span>{task.comments}</span>
                            </div>
                          </Show>

                          <Show when={task.attachments > 0}>
                            <div class='flex items-center space-x-1'>
                              <Paperclip class='w-3 h-3' />
                              <span>{task.attachments}</span>
                            </div>
                          </Show>
                        </div>

                        {/* Assignee */}
                        <Show when={task.assignee}>
                          <div class='flex items-center space-x-1'>
                            <div class='w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center'>
                              <Show
                                when={task.assignee?.avatar}
                                fallback={
                                  <User class='w-3 h-3 text-gray-600' />
                                }
                              >
                                <img
                                  src={task.assignee?.avatar}
                                  alt={task.assignee?.name}
                                  class='w-5 h-5 rounded-full'
                                />
                              </Show>
                            </div>
                          </div>
                        </Show>
                      </div>
                    </div>
                  )}
                </For>

                {/* Add Task Button */}
                <Button
                  variant='ghost'
                  size='sm'
                  class='w-full justify-start text-gray-500 border-2 border-dashed border-gray-300 hover:border-gray-400'
                  onClick={() => props.onTaskCreate?.(column.id)}
                >
                  <Plus class='w-4 h-4 mr-2' />
                  Add a task
                </Button>
              </div>
            </Card>
          </div>
        )}
      </For>

      {/* Add Column Button */}
      <div class='flex-shrink-0 w-80'>
        <Button
          variant='ghost'
          class='w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500'
        >
          <Plus class='w-6 h-6 mr-2' />
          Add another list
        </Button>
      </div>
    </div>
  );
}
