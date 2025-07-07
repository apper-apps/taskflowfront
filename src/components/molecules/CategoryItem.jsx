import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';

const CategoryItem = ({ 
  category, 
  taskCount = 0, 
  isActive = false,
  className 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      <NavLink
        to={`/category/${category.Id}`}
        className={({ isActive }) => cn(
          'flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group',
          isActive 
            ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-r-2 border-primary text-primary' 
            : 'hover:bg-gray-50 text-gray-700'
        )}
      >
        <div 
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-200',
            isActive ? 'animate-pulse-glow' : 'group-hover:scale-110'
          )}
          style={{ backgroundColor: category.color }}
        />
        
        <span className="flex-1 font-medium truncate">
          {category.name}
        </span>
        
        <span className={cn(
          'text-sm font-medium px-2 py-1 rounded-full',
          isActive 
            ? 'bg-primary/20 text-primary' 
            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
        )}>
          {taskCount}
        </span>
      </NavLink>
    </motion.div>
  );
};

export default CategoryItem;