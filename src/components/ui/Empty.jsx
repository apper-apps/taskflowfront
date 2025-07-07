import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  title = "No tasks yet", 
  message = "Create your first task to get started with TaskFlow.", 
  onAction,
  actionText = "Add Task",
  icon = "CheckSquare",
  showAction = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name={icon} className="w-12 h-12 text-white" />
      </div>
      
      <h3 className="text-2xl font-display font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {showAction && onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;