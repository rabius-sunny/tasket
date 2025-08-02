import { User } from '@/types';
import { Plus } from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dropdown, DropdownItem } from '../ui/dropdown';

type TProps = {
  assignee: User[];
};

export default function TaskModalMembers({ assignee }: TProps) {
  return (
    <div className='mb-6'>
      <h4 className='text-sm font-medium text-gray-600 mb-3'>Members</h4>
      <div className='flex items-center flex-wrap gap-2'>
        {assignee.map((user, idx) => (
          <Avatar
            key={idx}
            fallback={user.username[0]}
            alt={user.username}
            size='sm'
            className='cursor-pointer hover:opacity-80 transition-opacity'
          />
        ))}
        <Dropdown
          trigger={
            <Button
              variant='outline'
              title='Add member'
              size='sm'
              className='size-7 bg-emerald-400 rounded-full p-0 border-dashed'
            >
              <Plus className='size-4' />
            </Button>
          }
        >
          <div className='w-40'>
            <DropdownItem>Add Member 1</DropdownItem>
            <DropdownItem>Add Member 2</DropdownItem>
            <DropdownItem>Add Member 3</DropdownItem>
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
