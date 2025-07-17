import React, { useCallback, useEffect, useRef } from 'react';

type DebouncedInputProps<T extends React.ElementType> = {
  comp: T;
  onChange: (value: string) => void;
  delay?: number;
} & Omit<React.ComponentProps<T>, 'onChange'>;

export function DebouncedInput<T extends React.ElementType = 'input'>({
  comp,
  onChange,
  delay = 500,
  ...props
}: DebouncedInputProps<T>) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        onChange(value);
      }, delay);
    },
    [onChange, delay]
  );

  return React.createElement(comp, {
    ...props,
    onChange: handleChange
  });
}
