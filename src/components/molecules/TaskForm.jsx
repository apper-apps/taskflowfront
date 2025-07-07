import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
const TaskForm = ({ 
  task = null, 
  categories = [], 
  onSubmit, 
  onCancel,
  isOpen = false 
}) => {
const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    priority: 'medium',
    dueDate: '',
    notes: ''
  });
  const [showPreview, setShowPreview] = useState(false);

useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        categoryId: task.categoryId || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || '',
        notes: task.notes || ''
      });
    } else {
      setFormData({
        title: '',
        categoryId: '',
        priority: 'medium',
        dueDate: '',
        notes: ''
      });
    }
    setShowPreview(false);
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      await onSubmit(formData);
      if (task) {
        toast.success('Task updated successfully!');
      } else {
        toast.success('Task created successfully!');
      }
      onCancel();
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary to-secondary p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-white">
              {task ? 'Edit Task' : 'Add New Task'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-white hover:bg-white/10 p-2"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title..."
              className="w-full"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              value={formData.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              className="w-full"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.Id} value={category.Id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex space-x-2">
              {['low', 'medium', 'high'].map(priority => (
                <Button
                  key={priority}
                  type="button"
                  variant={formData.priority === priority ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleChange('priority', priority)}
                  className="flex-1 capitalize"
                >
                  {priority}
                </Button>
              ))}
            </div>
          </div>
          
<div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>
            {showPreview ? (
              <div className="min-h-[120px] p-3 border border-gray-200 rounded-lg bg-gray-50 prose prose-sm max-w-none">
                {formData.notes ? (
                  <ReactMarkdown>{formData.notes}</ReactMarkdown>
                ) : (
                  <p className="text-gray-500 italic">No notes added yet</p>
                )}
              </div>
            ) : (
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add notes using Markdown syntax..."
                className="w-full min-h-[120px] p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Supports Markdown: **bold**, *italic*, `code`, [links](url), etc.
            </p>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {task ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default TaskForm;