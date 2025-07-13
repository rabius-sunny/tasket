import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  position?: 'left' | 'right' | 'center';
  className?: string;
  contentClassName?: string;
}

const Dropdown = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  position = 'left',
  className,
  contentClassName
}: DropdownProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Use controlled state if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const positionClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className='cursor-pointer'
      >
        {trigger}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute top-full mt-1 z-50',
            'bg-white dark:bg-gray-800 rounded-lg shadow-custom-xl',
            'border border-gray-200 dark:border-gray-700',
            'min-w-full',
            positionClasses[position],
            contentClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Dropdown Item component for consistent styling
interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'danger';
}

const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  className,
  variant = 'default'
}: DropdownItemProps) => {
  const baseStyles =
    'block w-full px-4 py-2 text-sm text-left transition-colors first:rounded-t-lg last:rounded-b-lg';

  const variants = {
    default:
      'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
    danger:
      'text-error hover:bg-error-50 dark:hover:bg-error-900/20 hover:text-error-600'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        disabled && disabledStyles,
        className
      )}
    >
      {children}
    </button>
  );
};

// Dropdown Separator component
const DropdownSeparator = ({ className }: { className?: string }) => (
  <div className={cn('my-1 h-px bg-gray-200 dark:bg-gray-600', className)} />
);

export { Dropdown, DropdownItem, DropdownSeparator };
