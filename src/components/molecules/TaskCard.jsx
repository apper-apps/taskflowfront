import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { cn } from '@/utils/cn';
import { subtaskService } from '@/services/api/subtaskService';

const TaskCard = ({ 
  task, 
  category, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  className 
}) => {
  const [subtasks, setSubtasks] = useState([]);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);

  // Ensure task exists and has required properties
  if (!task) {
    return null;
  }

  useEffect(() => {
    if (showSubtasks && task?.Id) {
      loadSubtasks();
    }
  }, [showSubtasks, task?.Id]);

  const loadSubtasks = async () => {
    if (!task?.Id) return;
    
    try {
      setLoadingSubtasks(true);
      const data = await subtaskService.getByTaskId(task.Id);
      setSubtasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load subtasks:', error);
      setSubtasks([]);
    } finally {
      setLoadingSubtasks(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!task?.Id || !onToggleComplete) return;
    
    try {
      await onToggleComplete(task.Id);
      if (!task.completed) {
        toast.success('Task completed! 🎉', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      toast.error('Failed to update task');
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskName.trim() || !task?.Id) return;
    
    try {
      const newSubtask = await subtaskService.create({
        Name: newSubtaskName,
        taskId: task.Id,
        completed: false
      });
      
      if (newSubtask) {
        setSubtasks(prev => [...prev, newSubtask]);
        setNewSubtaskName('');
        toast.success('Subtask added');
      }
    } catch (error) {
      console.error('Failed to add subtask:', error);
      toast.error('Failed to add subtask');
    }
  };

  const handleToggleSubtask = async (subtaskId, newCheckedValue) => {
    if (!subtaskId) return;
    
    try {
      const updatedSubtask = await subtaskService.update(subtaskId, { 
        completed: newCheckedValue 
      });
      
      setSubtasks(prev => prev.map(st => 
        st.Id === subtaskId ? { ...st, completed: newCheckedValue } : st
      ));
    } catch (error) {
      console.error('Failed to update subtask:', error);
      toast.error('Failed to update subtask');
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    if (!subtaskId) return;
    
    try {
      await subtaskService.delete(subtaskId);
      setSubtasks(prev => prev.filter(st => st.Id !== subtaskId));
      toast.success('Subtask deleted');
    } catch (error) {
      console.error('Failed to delete subtask:', error);
      toast.error('Failed to delete subtask');
    }
  };

  const getSubtaskProgress = () => {
    if (!Array.isArray(subtasks) || subtasks.length === 0) return 0;
    const completed = subtasks.filter(st => st?.completed === true).length;
    return Math.round((completed / subtasks.length) * 100);
  };

  const handleDelete = async () => {
    if (!task?.Id || !onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.Id);
        toast.success('Task deleted');
      } catch (error) {
        console.error('Failed to delete task:', error);
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
    // Use correct database field name 'due_date'
    if (!task?.due_date) return null;
    
    try {
      const dueDate = parseISO(task.due_date);
      if (isToday(dueDate)) return 'today';
      if (isPast(dueDate)) return 'overdue';
      return 'upcoming';
    } catch (error) {
      console.error('Invalid date format:', task.due_date);
      return null;
    }
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
        task?.completed && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={Boolean(task?.completed)}
            onChange={handleToggleComplete}
            className="task-completion-animation"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={cn(
              'font-medium text-gray-900 truncate',
              task?.completed && 'line-through text-gray-500'
            )}>
              {task?.title || task?.Name || 'Untitled Task'}
            </h3>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit && onEdit(task)}
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
                  style={{ backgroundColor: category.color || '#5B46F0' }}
                />
                <span className="text-gray-600">{category.name || category.Name}</span>
              </div>
            )}
            
            {task?.priority && (
              <Badge variant={getPriorityColor(task.priority)} size="sm">
                {task.priority}
              </Badge>
            )}
            
            {task?.due_date && (
              <div className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded-full text-xs',
                dueDateStatus === 'overdue' && 'bg-red-100 text-red-700',
                dueDateStatus === 'today' && 'bg-accent/20 text-yellow-700',
                dueDateStatus === 'upcoming' && 'bg-blue-100 text-blue-700'
              )}>
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>
                  {format(parseISO(task.due_date), 'MMM d')}
                </span>
              </div>
            )}
          </div>

          {/* Subtasks Section */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <ApperIcon 
                  name={showSubtasks ? "ChevronUp" : "ChevronDown"} 
                  className="w-4 h-4 mr-1" 
                />
                <span className="text-xs">
                  Subtasks ({subtasks.length})
                  {subtasks.length > 0 && ` - ${getSubtaskProgress()}% complete`}
                </span>
              </Button>
              {subtasks.length > 0 && (
                <div className="w-16 bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${getSubtaskProgress()}%` }}
                  />
                </div>
              )}
            </div>

            {showSubtasks && (
              <div className="mt-3 space-y-2">
                {loadingSubtasks ? (
                  <div className="text-xs text-gray-500 py-2">Loading subtasks...</div>
                ) : (
                  <>
                    {Array.isArray(subtasks) && subtasks.map(subtask => {
                      if (!subtask?.Id) return null;
                      
                      return (
                        <div key={subtask.Id} className="flex items-center space-x-2 text-sm">
                          <Checkbox
                            checked={Boolean(subtask.completed)}
                            onChange={(newCheckedValue) => handleToggleSubtask(subtask.Id, newCheckedValue)}
                            className="scale-75"
                          />
                          <span className={cn(
                            "flex-1 text-xs",
                            subtask.completed && "line-through text-gray-400"
                          )}>
                            {subtask.Name || 'Unnamed Subtask'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubtask(subtask.Id)}
                            className="p-1 hover:bg-red-50 hover:text-red-600"
                          >
                            <ApperIcon name="Trash2" className="w-3 h-3" />
                          </Button>
                        </div>
                      );
                    })}
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        type="text"
                        value={newSubtaskName}
                        onChange={(e) => setNewSubtaskName(e.target.value)}
                        placeholder="Add subtask..."
                        className="flex-1 text-xs h-7"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddSubtask}
                        className="p-1 text-primary hover:bg-primary/10"
                      >
                        <ApperIcon name="Plus" className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;