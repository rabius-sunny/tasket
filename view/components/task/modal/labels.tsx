import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

type TProps = {
  task?: Task;
  updateTask: (data: any) => Promise<void>;
};

export default function TaskModalLabels({ task, updateTask }: TProps) {
  const [labelList, setLabelList] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (task) setLabelList(task.labels || []);
  }, [task]);

  const handleAddLabel = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value.trim()) {
      setIsAdding(false);
      return;
    }

    setLabelList([...labelList, e.currentTarget.value]);
    updateTask({
      id: task?.id,
      labels: [...labelList, e.currentTarget.value]
    });
    setIsAdding(false);
  };

  return (
    <div className='flex items-center gap-2 mb-6 flex-wrap'>
      {labelList.map((label, idx) => (
        <Badge
          size='sm'
          key={idx}
          className=' odd:bg-indigo-500 even:bg-emerald-500 text-white text-xs pt-1 uppercase border-0'
        >
          {label}
        </Badge>
      ))}
      {labelList.length < 5 ? (
        isAdding ? (
          <input
            autoFocus={isAdding}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddLabel(
                  e as unknown as React.FocusEvent<HTMLInputElement>
                );
              }
            }}
            onBlur={handleAddLabel}
            className='focus:outline-0 focus:ring-0 w-20 border border-indigo-500 rounded-full font-medium px-2 py-0.5 pt-1 text-xs'
            placeholder='enter'
          />
        ) : (
          <Badge
            onClick={() => setIsAdding(true)}
            size='sm'
            className='cursor-pointer bg-gray-200 text-black text-xs pt-1 uppercase border-0 flex gap-1 items-center'
          >
            <Plus
              className='size-3 -mt-0.5'
              strokeWidth={2.5}
            />
            Add
          </Badge>
        )
      ) : null}
    </div>
  );
}
