import { JSX, Show } from 'solid-js';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}

export default function Avatar(props: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const size = props.size || 'md';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      class={`relative inline-flex items-center justify-center ${
        sizes[size]
      } rounded-full ${props.class || ''}`}
    >
      <Show
        when={props.src}
        fallback={
          <div class='w-full h-full bg-gray-300 rounded-full flex items-center justify-center font-medium text-gray-600'>
            {props.name ? getInitials(props.name) : '?'}
          </div>
        }
      >
        <img
          src={props.src}
          alt={props.alt || props.name}
          class='w-full h-full rounded-full object-cover'
        />
      </Show>
    </div>
  );
}
