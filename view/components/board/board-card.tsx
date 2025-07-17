import { Board } from '@/types';
import { formatRelativeTime } from '@/utils/date';
import { CheckCircle, Clock, MoreHorizontal, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface TProps {
  board: Board;
  workspaceName: string;
}

export const BoardCard = ({ board, workspaceName }: TProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const taskCount = board._count?.tasks || 0;
  const completedPercentage =
    Math.round(((board.tasks.length || 0) / taskCount) * 100) || 0;

  const { push } = useRouter();

  // Generate a beautiful gradient based on the board title
  const gradients = [
    'from-violet-600 via-purple-600 to-blue-600',
    'from-pink-500 via-red-500 to-yellow-500',
    'from-green-400 via-blue-500 to-purple-600',
    'from-orange-400 via-pink-400 to-red-500',
    'from-blue-400 via-purple-500 to-pink-500',
    'from-indigo-400 via-cyan-400 to-blue-500'
  ];

  const gradientIndex = board.id % gradients.length;
  const gradient = gradients[gradientIndex];

  return (
    <div
      className='group cursor-pointer transform transition-all duration-300 hover:scale-105'
      onClick={() => push(`/dashboard/tasks?board=${board.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className='relative overflow-hidden h-full bg-white hover:shadow-2xl transition-all duration-300 border-0 hover:shadow-purple-100/50'>
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Content overlay */}
        <div className='relative z-10 p-6 h-full flex flex-col'>
          {/* Header */}
          <div className='flex items-start justify-between mb-6'>
            <div className='flex-1'>
              <h3 className='text-xl font-bold text-white mb-2 leading-tight'>
                {board.title}
              </h3>
              <p className='text-white/80 text-sm'>{workspaceName}</p>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200'
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle favorite/star action
                }}
              >
                <Star
                  className={`h-4 w-4 ${isHovered ? 'fill-current' : ''}`}
                />
              </Button>

              <Button
                variant='ghost'
                size='sm'
                className='text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200'
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle more options
                }}
              >
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className='space-y-4 flex-1'>
            {/* Progress indicator */}
            <div className='bg-white/20 backdrop-blur-sm rounded-lg p-3'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm text-white/90 font-medium'>
                  Progress - {board.tasks.length} / {taskCount}
                </span>
                <span className='text-sm text-white/90'>
                  {completedPercentage}%
                </span>
              </div>
              <div className='w-full bg-white/20 rounded-full h-2'>
                <div
                  className='bg-white/90 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${completedPercentage}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-between pt-4 text-xs text-white/80'>
            <div className='flex items-center gap-1'>
              <CheckCircle className='size-3 mb-0.5' />
              <span>Total {taskCount} tasks</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='size-3 mb-0.5' />
              <span>{formatRelativeTime(board.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 transition-transform duration-300 group-hover:scale-110' />
        <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 transition-transform duration-300 group-hover:scale-110' />
      </Card>
    </div>
  );
};
