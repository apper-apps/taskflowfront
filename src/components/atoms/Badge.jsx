import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const Badge = React.forwardRef(({ 
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-gradient-to-r from-primary to-secondary text-white',
    secondary: 'bg-gradient-to-r from-secondary to-primary text-white',
    accent: 'bg-gradient-to-r from-accent to-yellow-500 text-white',
    success: 'bg-gradient-to-r from-success to-green-600 text-white',
    warning: 'bg-gradient-to-r from-warning to-yellow-600 text-white',
    error: 'bg-gradient-to-r from-error to-red-600 text-white',
    high: 'bg-gradient-to-r from-error to-red-500 text-white shadow-lg shadow-red-500/20',
    medium: 'bg-gradient-to-r from-warning to-yellow-500 text-white shadow-lg shadow-yellow-500/20',
    low: 'bg-gradient-to-r from-success to-green-500 text-white shadow-lg shadow-green-500/20'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  return (
    <motion.span
      ref={ref}
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.span>
  );
});

Badge.displayName = 'Badge';

export default Badge;