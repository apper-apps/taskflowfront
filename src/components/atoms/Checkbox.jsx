import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = React.forwardRef(({ 
  checked = false,
  onChange,
  className,
  size = 'md',
  ...props 
}, ref) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.div
      className={cn(
        'relative cursor-pointer',
        sizes[size],
        className
      )}
      onClick={() => onChange && onChange(!checked)}
      whileTap={{ scale: 0.9 }}
      {...props}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        className="sr-only"
      />
      
      <div className={cn(
        'flex items-center justify-center rounded-md border-2 transition-all duration-200',
        sizes[size],
        checked 
          ? 'bg-gradient-to-r from-primary to-secondary border-primary shadow-lg' 
          : 'bg-surface border-gray-300 hover:border-primary'
      )}>
        <motion.div
          initial={false}
          animate={{ 
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon 
            name="Check" 
            className={cn(
              'text-white',
              size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4'
            )} 
          />
        </motion.div>
      </div>
    </motion.div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;