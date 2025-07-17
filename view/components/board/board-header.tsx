import { Board } from '@/types';
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
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

type TProps = {
  board: Board;
  totalTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
};

export default function BoardHeader({
  board,
  totalTasks,
  inProgressTasks,
  completedTasks,
  overdueTasks
}: TProps) {
  const { back } = useRouter();
  return (
    <div>
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
                      href={`/dashboard/boards?workspace=${board.workspace?.id}`}
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
      </div>
    </div>
  );
}
