import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const TaskCard = ({ 
  task, 
  category, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className 
}) => {
  const handleToggleComplete = async () => {
    try {
      await onToggleComplete(task.Id);
      if (!task.completed) {
        toast.success('Task completed! 🎉', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.Id);
        toast.success('Task deleted');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'default';
    }
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    const dueDate = parseISO(task.dueDate);
    if (isToday(dueDate)) return 'today';
    if (isPast(dueDate)) return 'overdue';
    return 'upcoming';
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'bg-surface rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100',
        task.completed && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            className="task-completion-animation"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={cn(
              'font-medium text-gray-900 truncate',
              task.completed && 'line-through text-gray-500'
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="p-1 hover:bg-red-50 hover:text-red-600 rounded-lg"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            {category && (
              <div className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse-glow"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-gray-600">{category.name}</span>
              </div>
            )}
            
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
            
            {task.dueDate && (
              <div className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded-full text-xs',
                dueDateStatus === 'overdue' && 'bg-red-100 text-red-700',
                dueDateStatus === 'today' && 'bg-accent/20 text-yellow-700',
                dueDateStatus === 'upcoming' && 'bg-blue-100 text-blue-700'
              )}>
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>{format(parseISO(task.dueDate), 'MMM d')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;