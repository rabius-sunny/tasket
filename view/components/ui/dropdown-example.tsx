import { Button } from '@/components/ui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownSeparator
} from '@/components/ui/dropdown';

export const DropdownExample = () => {
  const handleEdit = () => {
    console.log('Edit clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  const handleShare = () => {
    console.log('Share clicked');
  };

  return (
    <div className='p-8 space-y-4'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
        Dropdown Examples
      </h2>

      <div className='space-y-4'>
        {/* Basic Dropdown */}
        <div>
          <h3 className='text-lg font-medium mb-2'>Basic Dropdown</h3>
          <Dropdown trigger={<Button variant='outline'>Actions ↓</Button>}>
            <DropdownItem onClick={handleEdit}>Edit</DropdownItem>
            <DropdownItem onClick={handleShare}>Share</DropdownItem>
            <DropdownSeparator />
            <DropdownItem
              onClick={handleDelete}
              variant='danger'
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>

        {/* Right-aligned Dropdown */}
        <div>
          <h3 className='text-lg font-medium mb-2'>Right-aligned Dropdown</h3>
          <Dropdown
            position='center'
            trigger={<Button variant='secondary'>User Menu ↓</Button>}
          >
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownSeparator />
            <DropdownItem variant='danger'>Sign Out</DropdownItem>
          </Dropdown>
        </div>

        {/* Custom Trigger */}
        <div>
          <h3 className='text-lg font-medium mb-2'>Custom Trigger</h3>
          <Dropdown
            position='center'
            trigger={
              <div className='flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600'>
                <div className='w-8 h-8 bg-primary rounded-full'></div>
                <span className='text-sm font-medium'>John Doe</span>
                <span className='text-xs text-gray-500'>↓</span>
              </div>
            }
          >
            <DropdownItem>View Profile</DropdownItem>
            <DropdownItem>Account Settings</DropdownItem>
            <DropdownItem>Notifications</DropdownItem>
            <DropdownSeparator />
            <DropdownItem variant='danger'>Logout</DropdownItem>
          </Dropdown>
        </div>

        {/* Wide Dropdown */}
        <div>
          <h3 className='text-lg font-medium mb-2'>Wide Dropdown</h3>
          <Dropdown
            trigger={<Button>Create New ↓</Button>}
            contentClassName='min-w-48'
          >
            <DropdownItem>
              <div>
                <div className='font-medium'>New Task</div>
                <div className='text-xs text-gray-500'>Create a new task</div>
              </div>
            </DropdownItem>
            <DropdownItem>
              <div>
                <div className='font-medium'>New Board</div>
                <div className='text-xs text-gray-500'>Create a new board</div>
              </div>
            </DropdownItem>
            <DropdownItem>
              <div>
                <div className='font-medium'>New Workspace</div>
                <div className='text-xs text-gray-500'>
                  Create a new workspace
                </div>
              </div>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
