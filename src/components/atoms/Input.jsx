import React from 'react';
import { cn } from '@/utils/cn';

const Input = React.forwardRef(({ 
  className,
  type = 'text',
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full px-4 py-3 rounded-xl border bg-surface text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
        error ? 'border-error ring-error/20' : 'border-gray-200 hover:border-gray-300',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;