import { createSignal } from 'solid-js';
import Layout from '~/components/ui/Layout';
import { KanbanBoard } from '~/components/ui/KanbanBoard';
import Button from '~/components/ui/Button';
import { Plus, Filter, Users, Settings } from 'lucide-solid';

interface BoardTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignee: { name: string };
  comments: number;
  attachments: number;
  completed: boolean;
}

interface BoardColumn {
  id: string;
  title: string;
  color: string;
  tasks: BoardTask[];
}

export default function BoardPage() {
  const [columns, setColumns] = createSignal<BoardColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      color: 'gray',
      tasks: [
        {
          id: 'task-1',
          title: 'Design new landing page',
          description:
            'Create a modern, responsive landing page for the new product launch',
          priority: 'high',
          dueDate: 'Jul 15',
          assignee: { name: 'John Doe' },
          comments: 3,
          attachments: 2,
          completed: false
        },
        {
          id: 'task-2',
          title: 'Fix authentication bug',
          description:
            'Users are experiencing issues with password reset functionality',
          priority: 'urgent',
          dueDate: 'Jul 10',
          assignee: { name: 'Sarah Wilson' },
          comments: 1,
          attachments: 0,
          completed: false
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'blue',
      tasks: [
        {
          id: 'task-3',
          title: 'Implement API endpoints',
          description: 'Create REST API endpoints for user management',
          priority: 'medium',
          dueDate: 'Jul 18',
          assignee: { name: 'Mike Johnson' },
          comments: 2,
          attachments: 1,
          completed: false
        }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      color: 'yellow',
      tasks: [
        {
          id: 'task-4',
          title: 'Update documentation',
          description: 'Add new API endpoints to developer documentation',
          priority: 'low',
          dueDate: 'Jul 12',
          assignee: { name: 'Emma Davis' },
          comments: 0,
          attachments: 3,
          completed: false
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: 'green',
      tasks: [
        {
          id: 'task-5',
          title: 'Set up CI/CD pipeline',
          description: 'Configure automated testing and deployment',
          priority: 'medium',
          dueDate: 'Jul 8',
          assignee: { name: 'Alex Smith' },
          comments: 5,
          attachments: 1,
          completed: true
        }
      ]
    }
  ]);

  const handleTaskMove = (
    taskId: string,
    fromColumn: string,
    toColumn: string
  ) => {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));

      // Find source and destination columns
      const sourceCol = newColumns.find((col) => col.id === fromColumn);
      const destCol = newColumns.find((col) => col.id === toColumn);

      if (!sourceCol || !destCol) return prev;

      // Find and remove task from source column
      const taskIndex = sourceCol.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return prev;

      const task = sourceCol.tasks[taskIndex];
      sourceCol.tasks.splice(taskIndex, 1);

      // Add task to destination column
      destCol.tasks.push(task);

      return newColumns;
    });
  };

  const handleTaskCreate = (columnId: string) => {
    console.log('Create task in column:', columnId);
    // Handle task creation
  };

  const handleTaskEdit = (taskId: string) => {
    console.log('Edit task:', taskId);
    // Handle task editing
  };

  return (
    <Layout>
      <div class='space-y-6'>
        {/* Header */}
        <div class='flex justify-between items-center'>
          <div>
            <h1 class='text-3xl font-bold text-gray-900'>Website Redesign</h1>
            <p class='text-gray-600 mt-1'>
              Marketing Team • 12 tasks • 4 members
            </p>
          </div>
          <div class='flex items-center space-x-3'>
            <Button
              variant='outline'
              size='md'
            >
              <Filter class='w-4 h-4 mr-2' />
              Filter
            </Button>
            <Button
              variant='outline'
              size='md'
            >
              <Users class='w-4 h-4 mr-2' />
              Members
            </Button>
            <Button
              variant='outline'
              size='md'
            >
              <Settings class='w-4 h-4 mr-2' />
              Settings
            </Button>
          </div>
        </div>

        {/* Board Stats */}
        <div class='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div class='bg-white rounded-lg border border-gray-200 p-4'>
            <div class='flex items-center justify-between'>
              <div>
                <p class='text-sm text-gray-600'>Total Tasks</p>
                <p class='text-2xl font-bold text-gray-900'>
                  {columns().reduce(
                    (total, col) => total + col.tasks.length,
                    0
                  )}
                </p>
              </div>
              <div class='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <Plus class='w-5 h-5 text-blue-600' />
              </div>
            </div>
          </div>

          <div class='bg-white rounded-lg border border-gray-200 p-4'>
            <div class='flex items-center justify-between'>
              <div>
                <p class='text-sm text-gray-600'>In Progress</p>
                <p class='text-2xl font-bold text-gray-900'>
                  {columns().find((col) => col.id === 'in-progress')?.tasks
                    .length || 0}
                </p>
              </div>
              <div class='w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center'>
                <Plus class='w-5 h-5 text-yellow-600' />
              </div>
            </div>
          </div>

          <div class='bg-white rounded-lg border border-gray-200 p-4'>
            <div class='flex items-center justify-between'>
              <div>
                <p class='text-sm text-gray-600'>Completed</p>
                <p class='text-2xl font-bold text-gray-900'>
                  {columns().find((col) => col.id === 'done')?.tasks.length ||
                    0}
                </p>
              </div>
              <div class='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                <Plus class='w-5 h-5 text-green-600' />
              </div>
            </div>
          </div>

          <div class='bg-white rounded-lg border border-gray-200 p-4'>
            <div class='flex items-center justify-between'>
              <div>
                <p class='text-sm text-gray-600'>Progress</p>
                <p class='text-2xl font-bold text-gray-900'>
                  {Math.round(
                    ((columns().find((col) => col.id === 'done')?.tasks
                      .length || 0) /
                      columns().reduce(
                        (total, col) => total + col.tasks.length,
                        0
                      )) *
                      100
                  )}
                  %
                </p>
              </div>
              <div class='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Plus class='w-5 h-5 text-purple-600' />
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div class='bg-gray-50 rounded-lg p-6'>
          <KanbanBoard
            columns={columns()}
            onTaskMove={handleTaskMove}
            onTaskCreate={handleTaskCreate}
            onTaskEdit={handleTaskEdit}
          />
        </div>
      </div>
    </Layout>
  );
}
