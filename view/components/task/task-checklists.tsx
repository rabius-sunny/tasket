'use client';

import { Task } from '@/types';
import { formatDate, getDueDateStatus } from '@/utils/date';
import { CheckSquare, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { TransparentInput } from '../ui/transparent-input';

type TProps = {
  items: Task['checklists'];
};

export default function TaskCheckLists({ items }: TProps) {
  const dueDateStatus = (date: string) =>
    date ? getDueDateStatus(date) : null;

  const [openInputs, setOpenInputs] = useState<{ [key: number]: boolean }>({});

  return (
    <div className='mt-6'>
      {items && items.length > 0 && (
        <div>
          <div className='space-y-4'>
            {/* Checklist Items */}
            {items.map((checklist, idx) => {
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
                <div key={idx}>
                  <div className='mb-3'>
                    <div className='flex items-center gap-2 mb-2'>
                      <CheckSquare className='h-5 w-5 text-gray-600' />
                      <TransparentInput
                        className='font-semibold text-gray-700'
                        defaultValue={checklist.title}
                      />
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
                  <div className=''>
                    {checklist.items.map((item, idxx) => (
                      <div
                        key={idxx}
                        className='flex items-center gap-1.5 p-2 hover:bg-gray-200 rounded group'
                      >
                        <div className='size-6 mt-1'>
                          <input
                            type='checkbox'
                            className='size-5'
                            defaultChecked={item.completed}
                            onChange={(e) => {
                              console.log('status', e.target.checked);
                            }}
                          />
                        </div>
                        <TransparentInput
                          className={`flex-1 text-sm ${
                            item.completed
                              ? 'line-through text-gray-500'
                              : 'text-gray-700'
                          }`}
                          defaultValue={item.title}
                        />
                        {item.dueDate && dueDateStatus(item.dueDate) && (
                          <div
                            className={`flex items-center  text-xs justify-center w-24 py-1 rounded ${
                              dueDateStatus(item?.dueDate)?.color
                            }`}
                          >
                            <span>{formatDate(item.dueDate)}</span>
                          </div>
                        )}
                        {item.assignedUser && (
                          <div className='w-8'>
                            <Avatar
                              fallback={item.assignedUser.username[0]}
                              size='sm'
                            />
                          </div>
                        )}
                        <div className='w-7'>
                          <MoreHorizontal className='opacity-0 group-hover:opacity-100 size-7 p-1 group-hover:bg-white cursor-pointer rounded-full' />
                        </div>
                      </div>
                    ))}
                  </div>
                  {!openInputs[idx] ? (
                    <Button
                      variant='outline'
                      onClick={() =>
                        setOpenInputs((prev) => ({ ...prev, [idx]: true }))
                      }
                      size='sm'
                      className='text-gray-600 px-2 py-1 text-xs mt-2 hover:text-gray-800'
                    >
                      <Plus className='size-4 mr-1' />
                      Add an item
                    </Button>
                  ) : (
                    <Input
                      autoFocus
                      defaultValue={checklist.title}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setOpenInputs((prev) => ({ ...prev, [idx]: false }));
                          if (e.currentTarget.value.trim() !== '') {
                            alert(e.currentTarget.value);
                          }
                        }
                      }}
                      type='text'
                      placeholder='Add title'
                      className='mt-2 text-sm focus-visible:ring-1! focus:ring-indigo-500!'
                      onBlur={(e) => {
                        setOpenInputs((prev) => ({ ...prev, [idx]: false }));
                        if (e.currentTarget.value.trim() !== '') {
                          alert(e.currentTarget.value);
                        }
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
