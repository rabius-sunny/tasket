import { JSX, Show, createSignal, onMount, onCleanup } from 'solid-js';
import { X } from 'lucide-solid';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal(props: ModalProps) {
  const [isVisible, setIsVisible] = createSignal(false);
  let modalRef: HTMLDivElement | undefined;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      props.onClose();
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === modalRef) {
      props.onClose();
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleEscape);
    onCleanup(() => {
      document.removeEventListener('keydown', handleEscape);
    });
  });

  // Animation logic
  const handleShow = () => {
    if (props.show) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow exit animation
      setTimeout(() => setIsVisible(false), 150);
    }
  };

  // Watch for prop changes
  onMount(() => {
    handleShow();
  });

  // Update visibility when show prop changes
  const prevShow = () => props.show;
  onMount(() => {
    const interval = setInterval(() => {
      if (prevShow() !== props.show) {
        handleShow();
      }
    }, 50);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <Show when={isVisible()}>
      <div
        ref={modalRef!}
        class={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-150 ${
          props.show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div class='fixed inset-0 bg-black bg-opacity-50' />

        {/* Modal */}
        <div
          class={`relative bg-white rounded-lg shadow-xl w-full ${
            sizes[props.size || 'md']
          } transform transition-all duration-150 ${
            props.show ? 'scale-100' : 'scale-95'
          }`}
        >
          {/* Header */}
          <Show when={props.title}>
            <div class='flex items-center justify-between p-6 border-b border-gray-200'>
              <h3 class='text-lg font-semibold text-gray-900'>{props.title}</h3>
              <button
                onClick={props.onClose}
                class='text-gray-400 hover:text-gray-500 transition-colors'
              >
                <X class='w-6 h-6' />
              </button>
            </div>
          </Show>

          {/* Content */}
          <div class='p-6'>{props.children}</div>
        </div>
      </div>
    </Show>
  );
}
