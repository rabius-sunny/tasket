import { useAsync } from '@/lib/hooks';
import { User } from '@/types';
import { CheckCircle, Plus, Users2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { DebouncedInput } from '../ui/debounced-input';
import { Dropdown, DropdownItem } from '../ui/dropdown';
import { Input } from '../ui/input';
import TinyLoader from '../ui/tiny-loader';

type TProps = {
  members: User[];
  workspaceId: number;
};

export default function WorkspaceMembers({ members, workspaceId }: TProps) {
  const [type, setType] = useState<'all' | 'invite'>('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useAsync<User[]>(
    () =>
      type === 'invite' &&
      search &&
      `/users/invite?workspaceId=${workspaceId}&key=${search}`
  );

  console.log('data', { data, length: data?.length });

  return (
    <div>
      <Dropdown
        className='z-[100]'
        trigger={
          <div className='flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg'>
            <Users2 className='size-4' />
            <span className='font-medium'>Workspace members</span>
          </div>
        }
      >
        <div className='size-80 p-3  overflow-hidden'>
          <div className='flex gap-1'>
            <Button
              onClick={() => setType('all')}
              className='w-full rounded-r-none'
              size='sm'
              variant={type === 'all' ? 'primary' : 'subtle'}
            >
              <Users2 className='size-4 mr-2' />
              All Members
            </Button>
            <Button
              onClick={() => setType('invite')}
              className='w-full rounded-l-none'
              size='sm'
              variant={type === 'invite' ? 'primary' : 'subtle'}
            >
              <Plus className='size-4 mr-2' />
              Add Member
            </Button>
          </div>
          {type === 'all' ? (
            <div
              className='bg-gray-100 p-2 rounded-lg mt-4 w-full overflow-y-auto h-[248px]'
              id='custom-scrollbar'
            >
              {members.map((member, idx) => (
                <DropdownItem
                  className='flex items-center gap-3 relative cursor-auto group border-b-2 border-gray-200 w-full'
                  key={idx}
                >
                  <Avatar
                    fallback={member.username[0]}
                    size='sm'
                  />
                  <div className='flex flex-col -space-y-1'>
                    <span className='font-medium'>{member.username}</span>
                    <span className='text-xs text-gray-500'>
                      {member.email}
                    </span>
                  </div>
                  {/* TODO: handle prevent self removal */}
                  <XCircle className='text-transparent group-hover:text-red-500 size-5 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' />
                </DropdownItem>
              ))}
            </div>
          ) : (
            <div>
              <DebouncedInput
                comp={Input}
                className='text-gray-700 py-1 text-sm my-3'
                placeholder='search by username or email'
                onChange={(value) =>
                  value.trim().length > 2 && setSearch(value)
                }
              />
              {isLoading ? (
                <TinyLoader
                  title='members'
                  className='mt-8'
                />
              ) : data?.length > 0 ? (
                data.map((member, idx) => (
                  <DropdownItem
                    className='flex items-center gap-3 relative cursor-auto group border-b-2 border-gray-200 w-full'
                    key={idx}
                  >
                    <Avatar
                      fallback={member.username[0]}
                      size='sm'
                    />
                    <div className='flex flex-col -space-y-1'>
                      <span className='font-medium'>{member.username}</span>
                      <span className='text-xs text-gray-500'>
                        {member.email}
                      </span>
                    </div>
                    {/* TODO: handle prevent self removal */}
                    <CheckCircle className='text-transparent group-hover:text-emerald-600 size-5 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer' />
                  </DropdownItem>
                ))
              ) : (
                <div className='text-gray-500 text-sm text-center py-4'>
                  {search
                    ? 'No members found'
                    : 'Start typing to search for members'}
                </div>
              )}
            </div>
          )}
        </div>
      </Dropdown>
    </div>
  );
}
