import { For, createSignal } from 'solid-js';
import {
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Plus,
  BarChart3,
  Calendar,
  Activity
} from 'lucide-solid';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/Card';
import Button from '~/components/ui/Button';
import Badge from '~/components/ui/Badge';
import { KanbanBoard } from '~/components/ui/KanbanBoard';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeProjects: number;
  teamMembers: number;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

interface QuickTask {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  status: 'todo' | 'in-progress' | 'completed';
}

export default function Dashboard() {
  const [stats] = createSignal<DashboardStats>({
    totalTasks: 145,
    completedTasks: 89,
    activeProjects: 12,
    teamMembers: 8
  });

  const [recentActivity] = createSignal<RecentActivity[]>([
    {
      id: '1',
      user: 'John Doe',
      action: 'completed',
      target: 'Website Redesign Task',
      time: '2 hours ago'
    },
    {
      id: '2',
      user: 'Sarah Wilson',
      action: 'created',
      target: 'New Marketing Campaign',
      time: '4 hours ago'
    },
    {
      id: '3',
      user: 'Mike Johnson',
      action: 'commented on',
      target: 'Backend API Integration',
      time: '6 hours ago'
    },
    {
      id: '4',
      user: 'Emma Davis',
      action: 'assigned',
      target: 'Mobile App Testing',
      time: '1 day ago'
    }
  ]);

  const [quickTasks] = createSignal<QuickTask[]>([
    {
      id: '1',
      title: 'Review PR #234',
      priority: 'high',
      dueDate: 'Today',
      status: 'todo'
    },
    {
      id: '2',
      title: 'Update documentation',
      priority: 'medium',
      dueDate: 'Tomorrow',
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Team standup meeting',
      priority: 'low',
      dueDate: 'Today',
      status: 'todo'
    },
    {
      id: '4',
      title: 'Deploy to staging',
      priority: 'urgent',
      dueDate: 'Today',
      status: 'todo'
    }
  ]);

  const getPriorityColor = (priority: QuickTask['priority']) => {
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

  const completionRate = () =>
    Math.round((stats().completedTasks / stats().totalTasks) * 100);

  return (
    <div class='space-y-8'>
      {/* Header */}
      <div class='flex justify-between items-center'>
        <div>
          <h1 class='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p class='text-gray-600 mt-1'>
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <div class='flex items-center space-x-3'>
          <Button
            variant='outline'
            size='md'
          >
            <BarChart3 class='w-4 h-4 mr-2' />
            Reports
          </Button>
          <Button
            variant='primary'
            size='md'
          >
            <Plus class='w-4 h-4 mr-2' />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardContent class='flex items-center'>
            <div class='p-3 bg-blue-100 rounded-lg'>
              <CheckCircle class='w-6 h-6 text-blue-600' />
            </div>
            <div class='ml-4'>
              <p class='text-sm font-medium text-gray-600'>Total Tasks</p>
              <p class='text-2xl font-bold text-gray-900'>
                {stats().totalTasks}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class='flex items-center'>
            <div class='p-3 bg-green-100 rounded-lg'>
              <TrendingUp class='w-6 h-6 text-green-600' />
            </div>
            <div class='ml-4'>
              <p class='text-sm font-medium text-gray-600'>Completion Rate</p>
              <p class='text-2xl font-bold text-gray-900'>
                {completionRate()}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class='flex items-center'>
            <div class='p-3 bg-purple-100 rounded-lg'>
              <Activity class='w-6 h-6 text-purple-600' />
            </div>
            <div class='ml-4'>
              <p class='text-sm font-medium text-gray-600'>Active Projects</p>
              <p class='text-2xl font-bold text-gray-900'>
                {stats().activeProjects}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class='flex items-center'>
            <div class='p-3 bg-orange-100 rounded-lg'>
              <Users class='w-6 h-6 text-orange-600' />
            </div>
            <div class='ml-4'>
              <p class='text-sm font-medium text-gray-600'>Team Members</p>
              <p class='text-2xl font-bold text-gray-900'>
                {stats().teamMembers}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div class='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Quick Tasks */}
        <div class='lg:col-span-2'>
          <Card>
            <CardHeader>
              <div class='flex items-center justify-between'>
                <CardTitle>Quick Tasks</CardTitle>
                <Button
                  variant='ghost'
                  size='sm'
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div class='space-y-4'>
                <For each={quickTasks()}>
                  {(task) => (
                    <div class='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'>
                      <div class='flex items-center space-x-3'>
                        <div class='w-2 h-2 bg-blue-500 rounded-full' />
                        <div>
                          <h4 class='font-medium text-gray-900'>
                            {task.title}
                          </h4>
                          <div class='flex items-center space-x-2 mt-1'>
                            <Badge
                              variant={getPriorityColor(task.priority)}
                              size='sm'
                            >
                              {task.priority}
                            </Badge>
                            <span class='text-sm text-gray-500 flex items-center'>
                              <Calendar class='w-3 h-3 mr-1' />
                              {task.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                      >
                        <CheckCircle class='w-4 h-4' />
                      </Button>
                    </div>
                  )}
                </For>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div class='space-y-4'>
                <For each={recentActivity()}>
                  {(activity) => (
                    <div class='flex items-start space-x-3'>
                      <div class='w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0'>
                        <Activity class='w-4 h-4 text-gray-600' />
                      </div>
                      <div class='flex-1 min-w-0'>
                        <p class='text-sm text-gray-900'>
                          <span class='font-medium'>{activity.user}</span>{' '}
                          <span class='text-gray-600'>{activity.action}</span>{' '}
                          <span class='font-medium'>{activity.target}</span>
                        </p>
                        <p class='text-xs text-gray-500 mt-1 flex items-center'>
                          <Clock class='w-3 h-3 mr-1' />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div class='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div class='text-center'>
              <div class='relative inline-flex items-center justify-center w-20 h-20'>
                <svg
                  class='w-20 h-20 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    class='text-gray-200'
                    stroke='currentColor'
                    stroke-width='3'
                    fill='none'
                    d='M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831'
                  />
                  <path
                    class='text-blue-500'
                    stroke='currentColor'
                    stroke-width='3'
                    stroke-dasharray='75, 100'
                    stroke-linecap='round'
                    fill='none'
                    d='M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831'
                  />
                </svg>
                <span class='absolute text-lg font-bold text-gray-900'>
                  75%
                </span>
              </div>
              <p class='text-sm font-medium text-gray-900 mt-2'>
                Website Redesign
              </p>
              <p class='text-xs text-gray-500'>Due in 5 days</p>
            </div>

            <div class='text-center'>
              <div class='relative inline-flex items-center justify-center w-20 h-20'>
                <svg
                  class='w-20 h-20 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    class='text-gray-200'
                    stroke='currentColor'
                    stroke-width='3'
                    fill='none'
                    d='M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831'
                  />
                  <path
                    class='text-green-500'
                    stroke='currentColor'
                    stroke-width='3'
                    stroke-dasharray='45, 100'
                    stroke-linecap='round'
                    fill='none'
                    d='M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831'
                  />
                </svg>
                <span class='absolute text-lg font-bold text-gray-900'>
                  45%
                </span>
              </div>
              <p class='text-sm font-medium text-gray-900 mt-2'>Mobile App</p>
              <p class='text-xs text-gray-500'>Due in 12 days</p>
            </div>

            <div class='text-center'>
              <div class='relative inline-flex items-center justify-center w-20 h-20'>
                <svg
                  class='w-20 h-20 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    class='text-gray-200'
                    stroke='currentColor'
                    stroke-width='3'
                    fill='none'
                    d='M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831'
                  />
                  <path
                    class='text-orange-500'
                    stroke='currentColor'
                    stroke-width='3'
                    stroke-dasharray='90, 100'
                    stroke-linecap='round'
                    fill='none'
                    d='M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831'
                  />
                </svg>
                <span class='absolute text-lg font-bold text-gray-900'>
                  90%
                </span>
              </div>
              <p class='text-sm font-medium text-gray-900 mt-2'>
                API Integration
              </p>
              <p class='text-xs text-gray-500'>Due in 2 days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
