import { Task } from '@/types';
import { formatDateTime } from '@/utils/date';
import { FileText, MoreHorizontal } from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

type TProps = { task: Task };

export default function TaskComments({ task }: TProps) {
  return (
    <div>
      <div className='col-span-2 pl-4 h-full border-l border-gray-200'>
        <div className='mb-6'>
          <div className='flex items-center gap-2 mb-3'>
            <FileText className='h-5 w-5 text-gray-600' />
            <h3 className='font-semibold text-gray-800'>Activity</h3>
          </div>
          <div className='ml-7 space-y-4'>
            {/* Add Comment */}
            <div className='flex items-start gap-3'>
              <Avatar
                fallback='YU'
                alt='You'
                size='sm'
              />
              <div className='flex-1'>
                <div className='space-y-2'>
                  <Textarea
                    placeholder='Write a comment...'
                    className='min-h-[80px]'
                    autoFocus
                  />
                  <div className='flex gap-2'>
                    <Button size='sm'>Save</Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {}}
                    >
                      Cancel
                    </Button>
                  </div>
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
                      <div className='bg-white border border-gray-200 rounded-lg p-3'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='font-medium text-gray-800'>
                            {comment.author.username}
                          </span>
                          <div className='flex items-center gap-2'>
                            <span className='text-xs text-gray-500'>
                              {formatDateTime(comment.createdAt)}
                            </span>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-6 w-6 p-0'
                            >
                              <MoreHorizontal className='h-3 w-3' />
                            </Button>
                          </div>
                        </div>
                        <p className='text-gray-700 whitespace-pre-line'>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
