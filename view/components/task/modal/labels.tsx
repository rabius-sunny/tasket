import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

type TProps = {
  labels?: string[];
};

export default function TaskModalLabels({ labels }: TProps) {
  const [labelList, setLabelList] = useState<string[]>([]);
  useEffect(() => {
    setLabelList(labels || []);
  }, [labels]);

  return (
    <div className='flex items-center gap-2 mb-6 flex-wrap'>
      {labelList.map((label, idx) => (
        <Badge
          size='sm'
          key={idx}
          className='odd:bg-indigo-500 even:bg-emerald-500 text-white text-xs pt-1 uppercase border-0'
        >
          {label}
        </Badge>
      ))}
      {labelList.length < 5 ? (
        <Badge
          onClick={() => setLabelList([...labelList, 'New Label'])}
          size='sm'
          className='bg-gray-200 text-black text-xs pt-1 uppercase border-0 flex gap-1 items-center'
        >
          <Plus
            className='size-3 -mt-0.5'
            strokeWidth={2.5}
          />
          Add
        </Badge>
      ) : null}
    </div>
  );
}
