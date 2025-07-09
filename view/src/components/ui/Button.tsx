import { JSX, splitProps } from 'solid-js';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: JSX.Element;
}

export default function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, [
    'variant',
    'size',
    'loading',
    'children',
    'class'
  ]);

  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline:
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variant = local.variant || 'primary';
  const size = local.size || 'md';

  return (
    <button
      class={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        local.class || ''
      }`}
      disabled={local.loading}
      {...others}
    >
      {local.loading && <Loader2 class='animate-spin -ml-1 mr-2 h-4 w-4' />}
      {local.children}
    </button>
  );
}
