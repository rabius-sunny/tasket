import { JSX, createSignal, Show } from 'solid-js';

interface TooltipProps {
  content: string;
  children: JSX.Element;
  position?: 'top' | 'bottom' | 'left' | 'right';
  class?: string;
}

export default function Tooltip(props: TooltipProps) {
  const [isVisible, setIsVisible] = createSignal(false);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900',
    bottom:
      'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-900',
    right:
      'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900'
  };

  const position = props.position || 'top';

  return (
    <div
      class={`relative inline-block ${props.class || ''}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {props.children}

      <Show when={isVisible()}>
        <div class={`absolute z-50 ${positions[position]}`}>
          <div class='bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap'>
            {props.content}
          </div>
          <div class={`absolute w-0 h-0 ${arrows[position]}`} />
        </div>
      </Show>
    </div>
  );
}
