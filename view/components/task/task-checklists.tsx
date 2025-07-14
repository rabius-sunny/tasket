'use client';

import { Task } from '@/types';
import { formatDate, getDueDateStatus } from '@/utils/date';
import {
  AlertCircle,
  Check,
  CheckSquare,
  Clock,
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';

type TProps = {
  items: Task['checklists'];
};

export default function TaskCheckLists({ items }: TProps) {
  const dueDateStatus = (date: string) =>
    date ? getDueDateStatus(date) : null;

  return (
    <div className='mt-6'>
      {items && items.length > 0 && (
        <div>
          <div className='ml-7 space-y-4'>
            {/* Checklist Items */}
            {items.map((checklist) => {
              // Calculate progress for this individual checklist
              const totalItems = checklist.items.length;

              const completedItems = checklist.items.filter(
                (item) => item.completed
              ).length;
              const progress =
                totalItems > 0
                  ? Math.round((completedItems / totalItems) * 100)
                  : 0;

              return (
                <div
                  key={checklist.id}
                  className='space-y-2'
                >
                  <div className='mb-3'>
                    <div className='flex items-center gap-2 mb-2'>
                      <CheckSquare className='h-5 w-5 text-gray-600' />
                      <h3 className='font-semibold text-gray-800'>
                        {checklist.title}
                      </h3>
                      {totalItems > 0 && (
                        <div className='flex items-center gap-2 font-medium text-xs'>
                          <span className=' text-gray-500'>
                            {completedItems}/{totalItems}
                          </span>
                          <span>-</span>
                          <span className=' text-gray-600 w-10'>
                            {progress}%
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Progress Bar */}
                    <div className='flex items-center gap-3'>
                      <div className='w-full bg-gray-400 rounded-full h-1.5'>
                        <div
                          className='bg-green-500 size-full rounded-full transition-all duration-300'
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    {checklist.items.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center gap-3 p-2 hover:bg-gray-50 rounded group'
                      >
                        <button className='flex-shrink-0'>
                          {item.completed ? (
                            <div className='w-4 h-4 bg-green-500 rounded flex items-center justify-center'>
                              <Check className='h-3 w-3 text-white' />
                            </div>
                          ) : (
                            <div className='w-4 h-4 border-2 border-gray-300 rounded hover:border-gray-400' />
                          )}
                        </button>
                        <span
                          className={`flex-1 text-sm ${
                            item.completed
                              ? 'line-through text-gray-500'
                              : 'text-gray-700'
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.dueDate && dueDateStatus(item.dueDate) && (
                          <div
                            className={`flex items-center space-x-1 text-xs px-2 py-1 rounded transition-all duration-200 ${
                              dueDateStatus(item?.dueDate)?.color
                            } w-fit`}
                          >
                            {dueDateStatus(item?.dueDate)?.status ===
                            'overdue' ? (
                              <AlertCircle className='h-3 w-3 animate-pulse' />
                            ) : (
                              <Clock className='h-3 w-3' />
                            )}
                            <span>{formatDate(item.dueDate)}</span>
                          </div>
                        )}
                        {item.assignedUser && (
                          <Avatar
                            fallback={item.assignedUser.username[0]}
                            alt={item.assignedUser.username}
                            size='sm'
                          />
                        )}
                        <Button
                          variant='ghost'
                          size='sm'
                          className='opacity-0 group-hover:opacity-100 h-6 w-6 p-0'
                        >
                          <MoreHorizontal className='h-3 w-3' />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-600 hover:text-gray-800'
                  >
                    <Plus className='size-4 mr-1' />
                    Add an item
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
