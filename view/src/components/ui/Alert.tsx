import { JSX, Show } from 'solid-js';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-solid';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: JSX.Element;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  class?: string;
}

export default function Alert(props: AlertProps) {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-400',
      title: 'text-blue-800'
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-400',
      title: 'text-green-800'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-400',
      title: 'text-yellow-800'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-400',
      title: 'text-red-800'
    }
  };

  const variant = props.variant || 'info';
  const variantStyles = variants[variant];

  const getIcon = () => {
    switch (variant) {
      case 'info':
        return <Info class='w-5 h-5' />;
      case 'success':
        return <CheckCircle class='w-5 h-5' />;
      case 'warning':
        return <AlertTriangle class='w-5 h-5' />;
      case 'error':
        return <XCircle class='w-5 h-5' />;
      default:
        return null;
    }
  };

  return (
    <div
      class={`border rounded-md p-4 ${variantStyles.container} ${
        props.class || ''
      }`}
    >
      <div class='flex'>
        <div class={`flex-shrink-0 ${variantStyles.icon}`}>{getIcon()}</div>
        <div class='ml-3 flex-1'>
          <Show when={props.title}>
            <h3 class={`text-sm font-medium ${variantStyles.title}`}>
              {props.title}
            </h3>
          </Show>
          <div class={`text-sm ${props.title ? 'mt-1' : ''}`}>
            {props.children}
          </div>
        </div>
        <Show when={props.dismissible}>
          <div class='ml-auto pl-3'>
            <button
              class={`inline-flex rounded-md p-1.5 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantStyles.icon}`}
              onClick={props.onDismiss}
            >
              <X class='w-5 h-5' />
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
