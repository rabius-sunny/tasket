import { JSX, createSignal, Show } from 'solid-js';

interface DropdownProps {
  trigger: JSX.Element;
  children: JSX.Element;
  align?: 'left' | 'right';
  class?: string;
}

export function Dropdown(props: DropdownProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggle = () => setIsOpen(!isOpen());
  const close = () => setIsOpen(false);

  return (
    <div class={`relative inline-block text-left ${props.class || ''}`}>
      <div onClick={toggle}>{props.trigger}</div>

      <Show when={isOpen()}>
        <div
          class='fixed inset-0 z-10'
          onClick={close}
        />
        <div
          class={`absolute z-20 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
            props.align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div
            class='py-1'
            role='menu'
          >
            {props.children}
          </div>
        </div>
      </Show>
    </div>
  );
}

interface DropdownItemProps {
  children: JSX.Element;
  onClick?: () => void;
  disabled?: boolean;
  class?: string;
}

export function DropdownItem(props: DropdownItemProps) {
  return (
    <button
      class={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
        props.disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${props.class || ''}`}
      onClick={props.onClick}
      disabled={props.disabled}
      role='menuitem'
    >
      {props.children}
    </button>
  );
}

interface DropdownDividerProps {
  class?: string;
}

export function DropdownDivider(props: DropdownDividerProps) {
  return <div class={`border-t border-gray-100 my-1 ${props.class || ''}`} />;
}
