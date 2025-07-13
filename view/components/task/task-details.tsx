import { useAsync } from '@/lib/hooks';
import { Task } from '@/types';
import { Button } from '../ui/button';
import { Dropdown, DropdownItem, DropdownSeparator } from '../ui/dropdown';
import { Modal } from '../ui/modal';

type TProps = {
  task: Task;
  isOpen: boolean;
  setIsOpen: () => void;
};

export default function TaskDetails({ task, isOpen, setIsOpen }: TProps) {
  const { data } = useAsync<Task>(() => isOpen && '/tasks/' + task.id);
  console.log('data', data);
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={setIsOpen}
        title='Task Details'
        size='xl'
      >
        <Dropdown trigger={<Button variant='outline'>Actions ↓</Button>}>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Share</DropdownItem>
          <DropdownSeparator />
          <DropdownItem variant='danger'>Delete</DropdownItem>
        </Dropdown>
      </Modal>
    </div>
  );
}
