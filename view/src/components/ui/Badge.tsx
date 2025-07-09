import { JSX, Show } from 'solid-js';

interface BadgeProps {
  children: JSX.Element;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  class?: string;
}

export default function Badge(props: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const variant = props.variant || 'default';
  const size = props.size || 'sm';

  return (
    <span
      class={`inline-flex items-center font-medium rounded-full ${
        variants[variant]
      } ${sizes[size]} ${props.class || ''}`}
    >
      {props.children}
    </span>
  );
}
