import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const CategoryForm = ({ 
  category = null, 
  onSubmit, 
  onCancel,
  isOpen = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#5B46F0'
  });

  const predefinedColors = [
    '#5B46F0', '#8B7FF7', '#22C55E', '#F59E0B', 
    '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899',
    '#F97316', '#14B8A6', '#6366F1', '#84CC16'
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        color: category.color || '#5B46F0'
      });
    } else {
      setFormData({
        name: '',
        color: '#5B46F0'
      });
    }
  }, [category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await onSubmit(formData);
      if (category) {
        toast.success('Category updated successfully!');
      } else {
        toast.success('Category created successfully!');
      }
      onCancel();
    } catch (error) {
      toast.error('Failed to save category');
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
              {category ? 'Edit Category' : 'Add New Category'}
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
              Category Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter category name..."
              className="w-full"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleChange('color', color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    formData.color === color 
                      ? 'border-gray-400 scale-110' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
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
              {category ? 'Update Category' : 'Add Category'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CategoryForm;