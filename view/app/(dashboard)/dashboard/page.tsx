'use client';

import { useAuth } from '@/components/auth/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDashboardStats, useRecentActivity } from '@/lib/hooks';
import {
  AlertCircle,
  Calendar,
  CheckSquare,
  Clock,
  Folders,
  Plus,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    stats,
    isLoading: statsLoading,
    error: statsError
  } = useDashboardStats();
  const {
    activities,
    isLoading: activitiesLoading,
    error: activitiesError
  } = useRecentActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_created':
        return <Plus className='h-4 w-4 text-blue-600' />;
      case 'task_completed':
        return <CheckSquare className='h-4 w-4 text-green-600' />;
      case 'board_created':
        return <Folders className='h-4 w-4 text-purple-600' />;
      case 'workspace_joined':
        return <Users className='h-4 w-4 text-orange-600' />;
      default:
        return <Clock className='h-4 w-4 text-gray-600' />;
    }
  };

  const isLoading = statsLoading || activitiesLoading;
  const hasError = statsError || activitiesError;

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Failed to load dashboard
          </h2>
          <p className='text-gray-600 mb-4'>
            There was an error loading your dashboard data
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Welcome back, {user?.username}! 👋
          </h1>
          <p className='text-gray-600 mt-1'>
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <div className='mt-4 sm:mt-0 flex gap-3'>
          <Link href='/workspaces'>
            <Button
              variant='outline'
              size='sm'
            >
              <Users className='h-4 w-4 mr-2' />
              Workspaces
            </Button>
          </Link>
          <Link href='/boards'>
            <Button className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'>
              <Plus className='h-4 w-4 mr-2' />
              New Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-blue-600'>Workspaces</p>
              <p className='text-2xl font-bold text-blue-900'>
                {stats?.workspaces || 0}
              </p>
            </div>
            <div className='p-2 bg-blue-200 rounded-lg'>
              <Users className='h-6 w-6 text-blue-600' />
            </div>
          </div>
        </Card>

        <Card className='p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-purple-600'>Boards</p>
              <p className='text-2xl font-bold text-purple-900'>
                {stats?.boards || 0}
              </p>
            </div>
            <div className='p-2 bg-purple-200 rounded-lg'>
              <Folders className='h-6 w-6 text-purple-600' />
            </div>
          </div>
        </Card>

        <Card className='p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-green-600'>Tasks</p>
              <p className='text-2xl font-bold text-green-900'>
                {stats?.tasks || 0}
              </p>
            </div>
            <div className='p-2 bg-green-200 rounded-lg'>
              <CheckSquare className='h-6 w-6 text-green-600' />
            </div>
          </div>
        </Card>

        <Card className='p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-orange-600'>Completed</p>
              <p className='text-2xl font-bold text-orange-900'>
                {stats?.completedTasks || 0}
              </p>
            </div>
            <div className='p-2 bg-orange-200 rounded-lg'>
              <TrendingUp className='h-6 w-6 text-orange-600' />
            </div>
          </div>
        </Card>
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Quick Actions */}
        <div className='lg:col-span-1'>
          <Card className='p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Quick Actions
            </h3>
            <div className='space-y-3'>
              <Link href='/workspaces'>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Users className='h-4 w-4 mr-3' />
                  Create Workspace
                </Button>
              </Link>
              <Link href='/boards'>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Folders className='h-4 w-4 mr-3' />
                  Create Board
                </Button>
              </Link>
              <Link href='/tasks'>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  size='sm'
                >
                  <Plus className='h-4 w-4 mr-3' />
                  Add Task
                </Button>
              </Link>
            </div>
          </Card>

          {/* Overdue Tasks */}
          {stats && stats.overdueTasks > 0 && (
            <Card className='p-6 mt-6 bg-red-50 border-red-200'>
              <div className='flex items-center mb-4'>
                <AlertCircle className='h-5 w-5 text-red-600 mr-2' />
                <h3 className='text-lg font-semibold text-red-900'>
                  Overdue Tasks
                </h3>
              </div>
              <p className='text-sm text-red-700 mb-3'>
                You have {stats.overdueTasks} overdue task
                {stats.overdueTasks > 1 ? 's' : ''} that need attention.
              </p>
              <Link href='/tasks?overdue=true'>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-red-600 border-red-300 hover:bg-red-50'
                >
                  View Overdue Tasks
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div className='lg:col-span-2'>
          <Card className='p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Recent Activity
              </h3>
              <Badge
                variant='secondary'
                size='sm'
              >
                {activities?.length || 0} activities
              </Badge>
            </div>

            <div className='space-y-4'>
              {activities && activities.length > 0 ? (
                activities.slice(0, 6).map((activity) => (
                  <div
                    key={activity.id}
                    className='flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200'
                  >
                    <div className='flex-shrink-0 mt-1'>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900'>
                        {activity.title}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {activity.description}
                      </p>
                      <div className='flex items-center mt-1 space-x-1'>
                        <Clock className='h-3 w-3 text-gray-400' />
                        <span className='text-xs text-gray-500'>
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8'>
                  <Calendar className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600'>No recent activity</p>
                  <p className='text-sm text-gray-500 mt-1'>
                    Start creating workspaces and tasks to see activity here
                  </p>
                </div>
              )}
            </div>

            {activities && activities.length > 6 && (
              <div className='mt-6 pt-4 border-t border-gray-200 text-center'>
                <Link href='/activity'>
                  <Button
                    variant='outline'
                    size='sm'
                  >
                    View All Activity
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
