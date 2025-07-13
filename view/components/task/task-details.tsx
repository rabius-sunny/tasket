import { formatDate } from '@/lib/utils';
import { Task } from '@/types';
import {
  Archive,
  Calendar,
  Check,
  CheckSquare,
  Copy,
  CreditCard,
  Eye,
  FileText,
  MoreHorizontal,
  Paperclip,
  Plus,
  Tag,
  Trash2,
  User as UserIcon,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Modal } from '../ui/modal';
import { Textarea } from '../ui/textarea';

type TProps = {
  task: Task;
  isOpen: boolean;
  setIsOpen: () => void;
};

export default function TaskDetails({ task, isOpen, setIsOpen }: TProps) {
  const currentTask = task;
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState(currentTask.title);
  const [description, setDescription] = useState(currentTask.description || '');

  // Calculate checklist progress
  const totalChecklistItems =
    currentTask.checklists?.reduce(
      (acc, checklist) => acc + checklist.items.length,
      0
    ) || 0;
  const completedChecklistItems =
    currentTask.checklists?.reduce(
      (acc, checklist) =>
        acc + checklist.items.filter((item) => item.completed).length,
      0
    ) || 0;
  const checklistProgress =
    totalChecklistItems > 0
      ? Math.round((completedChecklistItems / totalChecklistItems) * 100)
      : 0;

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would call an API
      console.log('Adding comment:', newComment);
      setNewComment('');
      setIsAddingComment(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={setIsOpen}
      title=''
      size='xl'
    >
      <div className='grid grid-cols-5 max-w-[800px] w-full  h-[80vh] bg-gray-50'>
        {/* Main Content Area */}
        <div className='col-span-3 bg-white p-6 overflow-y-auto'>
          {/* Card Icon and Title */}
          <div className='flex items-start gap-3 mb-6'>
            <CreditCard className='h-6 w-6 text-gray-600 mt-1 flex-shrink-0' />
            <div className='flex-1'>
              {/* Title Input */}
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingTitle(false);
                      // Here you would typically save the title
                    }
                    if (e.key === 'Escape') {
                      setTitle(currentTask.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className='text-xl font-semibold mb-2'
                  autoFocus
                />
              ) : (
                <h1
                  className='text-xl font-semibold text-gray-800 mb-2 hover:bg-gray-100 p-2 rounded cursor-pointer transition-colors'
                  onClick={() => setIsEditingTitle(true)}
                >
                  {title}
                </h1>
              )}
              <div className='flex items-center gap-4 text-sm text-gray-600'>
                <span>
                  in list{' '}
                  <span className='underline hover:text-gray-800 cursor-pointer'>
                    {currentTask.status.replace('-', ' ')}
                  </span>
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-auto p-1 text-sm'
                >
                  <Eye className='h-4 w-4 mr-1' />
                  Watch
                </Button>
              </div>
            </div>
          </div>

          {/* Add to card buttons - horizontally aligned */}
          <div className='mb-6'>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200'
              >
                <UserIcon className='h-4 w-4 mr-2' />
                Members
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200'
              >
                <Tag className='h-4 w-4 mr-2' />
                Labels
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200'
              >
                <CheckSquare className='h-4 w-4 mr-2' />
                Checklist
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200'
              >
                <Calendar className='h-4 w-4 mr-2' />
                Dates
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='bg-gray-100 hover:bg-gray-200'
              >
                <Paperclip className='h-4 w-4 mr-2' />
                Attachment
              </Button>
            </div>
          </div>

          {/* Members */}
          {currentTask.user && currentTask.user.length > 0 && (
            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-600 mb-3'>
                Members
              </h4>
              <div className='flex flex-wrap gap-2'>
                {currentTask.user.map((user) => (
                  <Avatar
                    key={user.id}
                    fallback={user.username[0]}
                    alt={user.username}
                    size='md'
                    className='cursor-pointer hover:opacity-80 transition-opacity'
                  />
                ))}
                <Button
                  variant='outline'
                  size='sm'
                  className='w-8 h-8 rounded-full p-0 border-dashed'
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}

          {/* Labels */}
          {currentTask.labels && currentTask.labels.length > 0 && (
            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-600 mb-3'>Labels</h4>
              <div className='flex flex-wrap gap-2'>
                {currentTask.labels.map((label, idx) => (
                  <Badge
                    key={idx}
                    className='bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Due Date */}
          {currentTask.dueDate && (
            <div className='mb-6'>
              <h4 className='text-sm font-medium text-gray-600 mb-3'>
                Due Date
              </h4>
              <div className='flex items-center gap-2'>
                <Badge
                  className={
                    new Date(currentTask.dueDate) < new Date()
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-green-100 text-green-700 border-green-200'
                  }
                >
                  <Calendar className='h-3 w-3 mr-1' />
                  {formatDate(currentTask.dueDate)}
                </Badge>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-6 px-2'
                >
                  {new Date(currentTask.dueDate) < new Date()
                    ? 'Overdue'
                    : 'Complete'}
                </Button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className='mb-6'>
            <div className='flex items-center gap-2 mb-3'>
              <FileText className='h-5 w-5 text-gray-600' />
              <h3 className='font-semibold text-gray-800'>Description</h3>
            </div>
            <div className='ml-7'>
              {isEditingDescription ? (
                <div className='space-y-2'>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Add a more detailed description...'
                    className='min-h-[120px]'
                    autoFocus
                  />
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      onClick={() => {
                        setIsEditingDescription(false);
                        // Here you would typically save the description
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        setDescription(currentTask.description || '');
                        setIsEditingDescription(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className='bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors'
                  onClick={() => setIsEditingDescription(true)}
                >
                  {description ? (
                    <p className='text-gray-700 whitespace-pre-line'>
                      {description}
                    </p>
                  ) : (
                    <p className='text-gray-500 italic'>
                      Add a more detailed description...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Checklists */}
          {currentTask.checklists && currentTask.checklists.length > 0 && (
            <div className='mb-6'>
              <div className='flex items-center gap-2 mb-3'>
                <CheckSquare className='h-5 w-5 text-gray-600' />
                <h3 className='font-semibold text-gray-800'>Checklist</h3>
                {totalChecklistItems > 0 && (
                  <span className='text-sm text-gray-500'>
                    {completedChecklistItems}/{totalChecklistItems}
                  </span>
                )}
              </div>
              <div className='ml-7 space-y-4'>
                {/* Progress Bar */}
                {totalChecklistItems > 0 && (
                  <div className='flex items-center gap-3'>
                    <span className='text-sm text-gray-600 w-10'>
                      {checklistProgress}%
                    </span>
                    <div className='flex-1 bg-gray-200 rounded-full h-2'>
                      <div
                        className='bg-green-500 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${checklistProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Checklist Items */}
                {currentTask.checklists.map((checklist) => (
                  <div
                    key={checklist.id}
                    className='space-y-2'
                  >
                    <h4 className='font-medium text-gray-700'>
                      {checklist.title}
                    </h4>
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
                          {item.dueDate && (
                            <Badge
                              variant='secondary'
                              className='text-xs'
                            >
                              {formatDate(item.dueDate)}
                            </Badge>
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
                      <Plus className='h-4 w-4 mr-1' />
                      Add an item
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity/Comments */}
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
                  {isAddingComment ? (
                    <div className='space-y-2'>
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder='Write a comment...'
                        className='min-h-[80px]'
                        autoFocus
                      />
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          onClick={handleAddComment}
                        >
                          Save
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => {
                            setIsAddingComment(false);
                            setNewComment('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className='bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 cursor-text transition-colors'
                      onClick={() => setIsAddingComment(true)}
                    >
                      <p className='text-gray-500'>Write a comment...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Existing Comments */}
              {currentTask.comments && currentTask.comments.length > 0 && (
                <div className='space-y-4'>
                  {currentTask.comments.map((comment) => (
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
                                {formatDate(comment.createdAt)}
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

        {/* Sidebar */}
        <div className='col-span-2 bg-gray-50 p-4 border-l border-gray-200'>
          {/* Add to card */}
          <div className='mb-6'>
            <h4 className='text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide'>
              Add to card
            </h4>
            <div className='space-y-2'>
              <Button
                variant='ghost'
                className='w-full justify-start bg-gray-100 hover:bg-gray-200'
              >
                <UserIcon className='h-4 w-4 mr-2' />
                Members
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start bg-gray-100 hover:bg-gray-200'
              >
                <Tag className='h-4 w-4 mr-2' />
                Labels
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start bg-gray-100 hover:bg-gray-200'
              >
                <CheckSquare className='h-4 w-4 mr-2' />
                Checklist
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start bg-gray-100 hover:bg-gray-200'
              >
                <Calendar className='h-4 w-4 mr-2' />
                Dates
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start bg-gray-100 hover:bg-gray-200'
              >
                <Paperclip className='h-4 w-4 mr-2' />
                Attachment
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start bg-gray-100 hover:bg-gray-200'
              >
                <FileText className='h-4 w-4 mr-2' />
                Cover
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className='mb-6'>
            <h4 className='text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide'>
              Actions
            </h4>
            <div className='space-y-2'>
              <Button
                variant='ghost'
                className='w-full justify-start bg-gray-100 hover:bg-gray-200'
              >
                <MoreHorizontal className='h-4 w-4 mr-2' />
                Move
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start bg-gray-100 hover:bg-gray-200'
              >
                <Copy className='h-4 w-4 mr-2' />
                Copy
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start bg-gray-100 hover:bg-gray-200'
              >
                <Archive className='h-4 w-4 mr-2' />
                Archive
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start bg-red-50 hover:bg-red-100 text-red-600'
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Delete
              </Button>
            </div>
          </div>

          {/* Members */}
          {currentTask.user && currentTask.user.length > 0 && (
            <div>
              <h4 className='text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide'>
                Members
              </h4>
              <div className='flex flex-wrap gap-2'>
                {currentTask.user.map((user) => (
                  <Avatar
                    key={user.id}
                    fallback={user.username[0]}
                    alt={user.username}
                    size='md'
                    className='cursor-pointer hover:opacity-80 transition-opacity'
                  />
                ))}
                <Button
                  variant='outline'
                  size='sm'
                  className='w-8 h-8 rounded-full p-0 border-dashed'
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Close button */}
        <Button
          onClick={setIsOpen}
          variant='ghost'
          size='sm'
          className='absolute top-2 right-2 h-8 w-8 p-0 hover:bg-gray-200'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    </Modal>
  );
}
