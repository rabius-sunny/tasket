import { JSX, splitProps } from 'solid-js';

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: JSX.Element;
  rightIcon?: JSX.Element;
}

export default function Input(props: InputProps) {
  const [local, others] = splitProps(props, [
    'label',
    'error',
    'icon',
    'rightIcon',
    'class'
  ]);

  return (
    <div class='w-full'>
      {local.label && (
        <label class='block text-sm font-medium text-gray-700 mb-1'>
          {local.label}
        </label>
      )}
      <div class='relative'>
        {local.icon && (
          <div class='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            {local.icon}
          </div>
        )}
        <input
          class={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            local.icon ? 'pl-10' : 'pl-3'
          } ${local.rightIcon ? 'pr-10' : 'pr-3'} ${
            local.error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : ''
          } ${local.class || ''}`}
          {...others}
        />
        {local.rightIcon && (
          <div class='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
            {local.rightIcon}
          </div>
        )}
      </div>
      {local.error && <p class='mt-1 text-sm text-red-600'>{local.error}</p>}
    </div>
  );
}
