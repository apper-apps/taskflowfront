import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskCard from '@/components/molecules/TaskCard';
import TaskForm from '@/components/molecules/TaskForm';
import FilterBar from '@/components/molecules/FilterBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useTasks';

const TaskList = ({ selectedCategoryId = null }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { 
    tasks, 
    loading, 
    error, 
    addTask, 
    updateTask, 
    deleteTask,
    toggleTaskComplete,
    loadTasks 
  } = useTasks();

  const { categories } = useCategories();

  const handleAddTask = async (taskData) => {
    await addTask({
      ...taskData,
      categoryId: selectedCategoryId || taskData.categoryId
    });
  };

  const handleUpdateTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.Id, taskData);
      setEditingTask(null);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleToggleComplete = async (taskId) => {
    await toggleTaskComplete(taskId);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriorityFilter('');
    setCategoryFilter('');
  };

  const filteredTasks = tasks.filter(task => {
    // Category filter
    if (selectedCategoryId && task.categoryId !== selectedCategoryId) return false;
    if (categoryFilter && task.categoryId !== categoryFilter) return false;
    
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Priority filter
    if (priorityFilter && task.priority !== priorityFilter) return false;
    
    return true;
  });

  const getTaskCategory = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Loading type="tasks" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Error 
          title="Failed to load tasks"
          message={error}
          onRetry={loadTasks}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900">
              {selectedCategoryId ? 
                categories.find(cat => cat.Id === selectedCategoryId)?.name || 'Category' : 
                'All Tasks'
              }
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          
          <Button
            variant="accent"
            size="lg"
            onClick={() => setShowTaskForm(true)}
            className="shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            Add Task
          </Button>
        </div>

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          categories={categories}
          selectedCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onClearFilters={clearFilters}
        />
      </div>

      <AnimatePresence mode="wait">
        {filteredTasks.length === 0 ? (
          <Empty
            title="No tasks found"
            message={searchQuery || priorityFilter || categoryFilter ? 
              "No tasks match your current filters. Try adjusting your search criteria." :
              "Create your first task to get started with TaskFlow."
            }
            onAction={() => setShowTaskForm(true)}
            actionText="Add Task"
            icon="CheckSquare"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <AnimatePresence>
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  category={getTaskCategory(task.categoryId)}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <TaskForm
        task={editingTask}
        categories={categories}
        isOpen={showTaskForm}
        onSubmit={editingTask ? handleUpdateTask : handleAddTask}
        onCancel={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
      />
    </div>
  );
};

export default TaskList;