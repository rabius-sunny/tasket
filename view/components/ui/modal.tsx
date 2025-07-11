/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md'
}: ModalProps) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  // Render modal in a portal to cover the whole screen
  return createPortal(
    <div className='fixed inset-0 z-modal overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 transition-opacity bg-black/20 backdrop-blur-sm z-modal-backdrop'
          onClick={onClose}
        />
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div
          className={cn(
            'inline-block w-full text-left align-bottom transition-all transform',
            'bg-white dark:bg-gray-800 rounded-lg shadow-custom-xl sm:my-8 sm:align-middle border border-gray-200 dark:border-gray-700',
            'relative z-modal-content',
            sizeClasses[size]
          )}
        >
          {title && (
            <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700 sm:px-6'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                {title}
              </h3>
            </div>
          )}
          <div className='px-4 py-3 sm:px-6 text-gray-900 dark:text-gray-100'>
            {children}
          </div>
        </div>
      </div>
    </div>,
    typeof window !== 'undefined' ? document.body : (null as any)
  );
};

export { Modal };
