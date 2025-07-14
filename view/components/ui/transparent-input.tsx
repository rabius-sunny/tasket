import { cn } from '@/utils/random';
import {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  forwardRef
} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
}

const TransparentInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className='w-full'>
        {label}
        <input
          title='Click to edit'
          ref={ref}
          id={inputId}
          className={cn(
            'cursor-pointer block w-full text-sm px-2 py-1',
            'focus:outline-none focus:border-b-2 focus:border-indigo-500',
            'disabled:bg-secondary-50 disabled:text-secondary-500',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

TransparentInput.displayName = 'TransparentInput';

const TransparentTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className='w-full'>
        {label}
        <textarea
          title='Click to edit'
          ref={ref}
          id={inputId}
          className={cn(
            'cursor-pointer block w-full text-sm px-2 py-1 rounded-md',
            'focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:shadow-lg',
            'disabled:bg-secondary-50 disabled:text-secondary-500',
            // 'border-none outline-none',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

TransparentInput.displayName = 'TransparentInput';
TransparentTextarea.displayName = 'TransparentTextarea';

export { TransparentInput, TransparentTextarea };
