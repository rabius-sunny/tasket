import { For, createSignal, Show } from 'solid-js';
import {
  Filter,
  Plus,
  Search,
  Calendar,
  User,
  Flag,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Clock,
  MessageSquare,
  Paperclip
} from 'lucide-react';
import Layout from '~/components/ui/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import Badge from '~/components/ui/Badge';
import Input from '~/components/ui/Input';
import {
  Dropdown,
  DropdownItem,
  DropdownDivider
} from '~/components/ui/Dropdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  project: string;
  comments: number;
  attachments: number;
  createdAt: string;
}

export default function TasksPage() {
  const [tasks] = createSignal<Task[]>([
    {
      id: '1',
      title: 'Design new landing page',
      description:
        'Create a modern, responsive landing page for the new product launch',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2025-07-15',
      assignee: { name: 'John Doe' },
      project: 'Marketing Website',
      comments: 3,
      attachments: 2,
      createdAt: '2025-07-05'
    },
    {
      id: '2',
      title: 'Fix login authentication bug',
      description:
        'Users are experiencing issues with password reset functionality',
      status: 'todo',
      priority: 'urgent',
      dueDate: '2025-07-10',
      assignee: { name: 'Sarah Wilson' },
      project: 'Backend API',
      comments: 1,
      attachments: 0,
      createdAt: '2025-07-08'
    },
    {
      id: '3',
      title: 'Update documentation',
      description: 'Add new API endpoints to developer documentation',
      status: 'completed',
      priority: 'medium',
      dueDate: '2025-07-12',
      assignee: { name: 'Mike Johnson' },
      project: 'Documentation',
      comments: 2,
      attachments: 1,
      createdAt: '2025-07-03'
    },
    {
      id: '4',
      title: 'Implement dark mode',
      description: 'Add dark mode support across the entire application',
      status: 'todo',
      priority: 'low',
      dueDate: '2025-07-20',
      assignee: { name: 'Emma Davis' },
      project: 'Frontend',
      comments: 0,
      attachments: 0,
      createdAt: '2025-07-07'
    }
  ]);

  const [searchTerm, setSearchTerm] = createSignal('');
  const [selectedTab, setSelectedTab] = createSignal('all');

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'todo':
        return 'default';
      default:
        return 'default';
    }
  };

  const filteredTasks = () => {
    let filtered = tasks();

    if (searchTerm()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm().toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm().toLowerCase())
      );
    }

    if (selectedTab() !== 'all') {
      filtered = filtered.filter((task) => task.status === selectedTab());
    }

    return filtered;
  };

  const getTaskCounts = () => {
    const allTasks = tasks();
    return {
      all: allTasks.length,
      todo: allTasks.filter((t) => t.status === 'todo').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      completed: allTasks.filter((t) => t.status === 'completed').length
    };
  };

  const toggleTaskStatus = (taskId: string) => {
    console.log('Toggle task status:', taskId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div class='space-y-6'>
        {/* Header */}
        <div class='flex justify-between items-center'>
          <div>
            <h1 class='text-3xl font-bold text-gray-900'>My Tasks</h1>
            <p class='text-gray-600 mt-1'>
              Manage and track your assigned tasks.
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
              variant='primary'
              size='md'
            >
              <Plus class='w-4 h-4 mr-2' />
              New Task
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent class='p-6'>
            <div class='flex items-center space-x-4'>
              <div class='relative flex-1'>
                <Search class='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  type='text'
                  placeholder='Search tasks...'
                  class='pl-10'
                  value={searchTerm()}
                  onInput={(e) => setSearchTerm(e.currentTarget.value)}
                />
              </div>
              <Button
                variant='outline'
                size='md'
              >
                <Calendar class='w-4 h-4 mr-2' />
                Due Date
              </Button>
              <Button
                variant='outline'
                size='md'
              >
                <User class='w-4 h-4 mr-2' />
                Assignee
              </Button>
              <Button
                variant='outline'
                size='md'
              >
                <Flag class='w-4 h-4 mr-2' />
                Priority
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task Tabs */}
        <Tabs
          defaultValue='all'
          onValueChange={setSelectedTab}
        >
          <TabsList class='grid w-full grid-cols-4'>
            <TabsTrigger value='all'>All ({getTaskCounts().all})</TabsTrigger>
            <TabsTrigger value='todo'>
              To Do ({getTaskCounts().todo})
            </TabsTrigger>
            <TabsTrigger value='in-progress'>
              In Progress ({getTaskCounts().inProgress})
            </TabsTrigger>
            <TabsTrigger value='completed'>
              Completed ({getTaskCounts().completed})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value='all'
            class='mt-6'
          >
            <TasksList
              tasks={filteredTasks()}
              onToggleStatus={toggleTaskStatus}
            />
          </TabsContent>
          <TabsContent
            value='todo'
            class='mt-6'
          >
            <TasksList
              tasks={filteredTasks()}
              onToggleStatus={toggleTaskStatus}
            />
          </TabsContent>
          <TabsContent
            value='in-progress'
            class='mt-6'
          >
            <TasksList
              tasks={filteredTasks()}
              onToggleStatus={toggleTaskStatus}
            />
          </TabsContent>
          <TabsContent
            value='completed'
            class='mt-6'
          >
            <TasksList
              tasks={filteredTasks()}
              onToggleStatus={toggleTaskStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

interface TasksListProps {
  tasks: Task[];
  onToggleStatus: (taskId: string) => void;
}

function TasksList(props: TasksListProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'todo':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div class='space-y-4'>
      <For each={props.tasks}>
        {(task) => (
          <Card class='hover:shadow-md transition-shadow'>
            <CardContent class='p-6'>
              <div class='flex items-start justify-between'>
                <div class='flex items-start space-x-4 flex-1'>
                  <button
                    onClick={() => props.onToggleStatus(task.id)}
                    class='mt-1 text-gray-400 hover:text-blue-500 transition-colors'
                  >
                    <Show
                      when={task.status === 'completed'}
                      fallback={<Circle class='w-5 h-5' />}
                    >
                      <CheckCircle2 class='w-5 h-5 text-green-500' />
                    </Show>
                  </button>

                  <div class='flex-1 min-w-0'>
                    <div class='flex items-center space-x-3 mb-2'>
                      <h3
                        class={`font-semibold text-gray-900 ${
                          task.status === 'completed'
                            ? 'line-through text-gray-500'
                            : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      <Badge
                        variant={getPriorityColor(task.priority)}
                        size='sm'
                      >
                        {task.priority}
                      </Badge>
                      <Badge
                        variant={getStatusColor(task.status)}
                        size='sm'
                      >
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>

                    <p class='text-gray-600 text-sm mb-3'>{task.description}</p>

                    <div class='flex items-center space-x-6 text-sm text-gray-500'>
                      <div class='flex items-center space-x-1'>
                        <Calendar class='w-4 h-4' />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                      <div class='flex items-center space-x-1'>
                        <User class='w-4 h-4' />
                        <span>{task.assignee.name}</span>
                      </div>
                      <div class='flex items-center space-x-1'>
                        <span class='text-gray-400'>•</span>
                        <span>{task.project}</span>
                      </div>
                      <Show when={task.comments > 0}>
                        <div class='flex items-center space-x-1'>
                          <MessageSquare class='w-4 h-4' />
                          <span>{task.comments}</span>
                        </div>
                      </Show>
                      <Show when={task.attachments > 0}>
                        <div class='flex items-center space-x-1'>
                          <Paperclip class='w-4 h-4' />
                          <span>{task.attachments}</span>
                        </div>
                      </Show>
                    </div>
                  </div>
                </div>

                <Dropdown
                  trigger={
                    <button class='p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100'>
                      <MoreHorizontal class='w-5 h-5' />
                    </button>
                  }
                  align='right'
                >
                  <DropdownItem>Edit Task</DropdownItem>
                  <DropdownItem>Duplicate</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Delete</DropdownItem>
                </Dropdown>
              </div>
            </CardContent>
          </Card>
        )}
      </For>

      <Show when={props.tasks.length === 0}>
        <div class='text-center py-12'>
          <div class='w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4'>
            <CheckCircle2 class='w-8 h-8 text-gray-400' />
          </div>
          <h3 class='text-lg font-medium text-gray-900 mb-2'>No tasks found</h3>
          <p class='text-gray-500'>Try adjusting your search or filters</p>
        </div>
      </Show>
    </div>
  );
}
