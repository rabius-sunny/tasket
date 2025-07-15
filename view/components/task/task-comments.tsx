import { Task } from '@/types';
import { formatDateTime } from '@/utils/date';
import { Check, FileText, MoreHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

type TProps = { task: Task };

export default function TaskComments({ task }: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='col-span-2 px-4 pt-4 pb-20 h-full border-l border-gray-200 overflow-y-auto'>
      <div className=''>
        <div className='flex items-center gap-2 mb-3'>
          <FileText className='h-5 w-5 text-gray-600' />
          <h3 className='font-semibold text-gray-800'>Commentary</h3>
        </div>
        <div className='space-y-2'>
          {/* Add Comment */}
          <div className='flex items-start gap-3'>
            <div className='w-7 h-full grid gap-2 justify-center'>
              <Avatar
                fallback='Y'
                alt='You'
                size='sm'
                className='size-6'
              />
              {isOpen && (
                <div className='h-full grid justify-center gap-2'>
                  <Check className='size-6 p-1 rounded-full cursor-pointer bg-emerald-600 hover:opacity-75 text-white' />

                  <X className='size-6 p-1 rounded-full cursor-pointer bg-red-500 hover:opacity-75 text-white' />
                </div>
              )}
            </div>
            <div className='flex-1'>
              <div className='space-y-2'>
                <Textarea
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => setIsOpen(false)}
                  placeholder='Write a comment...'
                  className='text-sm h-24'
                />
              </div>
            </div>
          </div>

          {/* Existing Comments */}
          {task.comments && task.comments.length > 0 && (
            <div className='space-y-4'>
              {task.comments.map((comment) => (
                <div
                  key={comment.id}
                  className='flex items-start gap-3'
                >
                  <Avatar
                    fallback={comment.author.username[0]}
                    alt={comment.author.username}
                    size='sm'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='font-medium text-gray-700 font-mono'>
                        @{comment.author.username}
                      </span>
                      <Button
                        size='sm'
                        className='bg-transparent hover:bg-gray-300 size-7 p-0 rounded-full'
                      >
                        <MoreHorizontal className='size-5 text-black' />
                      </Button>
                    </div>
                    <p className='text-gray-600 text-sm whitespace-pre-line'>
                      {comment.content}asjkd fasl Lorem, ipsum dolor sit amet
                      consectetur adipisicing elit. Maiores totam blanditiis
                      veritatis minus! Nihil quae dolor, est blanditiis nulla
                      quod?
                    </p>
                    <div className='text-xs text-gray-500'>
                      {formatDateTime(comment.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
