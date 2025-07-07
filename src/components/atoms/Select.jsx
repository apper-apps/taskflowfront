import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Select = React.forwardRef(({ 
  children,
  className,
  error = false,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-3 pr-10 rounded-xl border bg-surface text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer',
          error ? 'border-error ring-error/20' : 'border-gray-200 hover:border-gray-300',
          className
        )}
        {...props}
      >
        {children}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-500" />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;