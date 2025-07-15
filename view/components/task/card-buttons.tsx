import { Task } from '@/types';
import { Calendar, CheckSquare, Paperclip } from 'lucide-react';
import { Button } from '../ui/button';
import CalendarComponent from '../ui/calender';
import { Dropdown, DropdownItem } from '../ui/dropdown';

export default function CardButtons({ task }: { task: Task }) {
  return (
    <div className='mb-3'>
      <div className='flex flex-wrap gap-2'>
        <Dropdown
          trigger={
            <Button
              variant='subtle'
              size='xs'
            >
              <CheckSquare className='size-4 mr-2' />
              Checklist
            </Button>
          }
        >
          <div className='w-40'>
            <DropdownItem>Add Member 1</DropdownItem>
            <DropdownItem>Add Member 2</DropdownItem>
            <DropdownItem>Add Member 3</DropdownItem>
          </div>
        </Dropdown>

        <Dropdown
          trigger={
            <Button
              variant='subtle'
              size='xs'
            >
              <Calendar className='size-4 mr-2' />
              Dates
            </Button>
          }
        >
          <CalendarComponent
            onDateSelect={(date) => {
              task.dueDate = date.toISOString();
            }}
            selectedDate={new Date(task.dueDate || Date.now())}
          />
        </Dropdown>

        <Dropdown
          trigger={
            <Button
              variant='subtle'
              size='xs'
            >
              <Paperclip className='size-4 mr-2' />
              Attachment
            </Button>
          }
        >
          <div className='w-40'>
            <p className='font-semibold'>Add attachment</p>
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
