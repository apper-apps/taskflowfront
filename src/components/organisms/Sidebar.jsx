import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CategoryItem from '@/components/molecules/CategoryItem';
import CategoryForm from '@/components/molecules/CategoryForm';
import Loading from '@/components/ui/Loading';
import { useCategories } from '@/hooks/useCategories';
import { useTasks } from '@/hooks/useTasks';

const Sidebar = ({ isOpen, onToggle }) => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError,
    addCategory,
    updateCategory,
    deleteCategory,
    loadCategories
  } = useCategories();

  const { tasks } = useTasks();

  const getTaskCount = (categoryId) => {
    return tasks.filter(task => task.categoryId === categoryId).length;
  };

  const handleAddCategory = async (categoryData) => {
    await addCategory(categoryData);
  };

  const handleUpdateCategory = async (categoryData) => {
    if (editingCategory) {
      await updateCategory(editingCategory.Id, categoryData);
      setEditingCategory(null);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(categoryId);
    }
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-100">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-gray-900">TaskFlow</h1>
            <p className="text-sm text-gray-600">Effortless productivity</p>
          </div>
        </Link>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <Link
            to="/"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span className="font-medium">All Tasks</span>
          </Link>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Categories
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCategoryForm(true)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>
          </div>

          {categoriesLoading ? (
            <Loading type="categories" />
          ) : categoriesError ? (
            <div className="text-sm text-red-600 p-3 bg-red-50 rounded-lg">
              Failed to load categories
            </div>
          ) : (
            <div className="space-y-1">
              {categories.map(category => (
                <div key={category.Id} className="group relative">
                  <CategoryItem 
                    category={category}
                    taskCount={getTaskCount(category.Id)}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      className="p-1 hover:bg-gray-100 rounded-lg mr-1"
                    >
                      <ApperIcon name="Edit2" className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.Id)}
                      className="p-1 hover:bg-red-50 hover:text-red-600 rounded-lg"
                    >
                      <ApperIcon name="Trash2" className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CategoryForm
        category={editingCategory}
        isOpen={showCategoryForm}
        onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
        onCancel={() => {
          setShowCategoryForm(false);
          setEditingCategory(null);
        }}
      />
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden'
        }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
        onClick={onToggle}
      />

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: isOpen ? 0 : '-100%'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-surface shadow-2xl z-50 lg:hidden overflow-y-auto custom-scrollbar"
      >
        <div className="p-4 border-b border-gray-100 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>
        {sidebarContent}
      </motion.div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-surface border-r border-gray-100 overflow-y-auto custom-scrollbar">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;