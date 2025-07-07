import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const FilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  priorityFilter, 
  onPriorityChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onClearFilters 
}) => {
  const hasActiveFilters = searchQuery || priorityFilter || selectedCategory;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-4 shadow-sm border border-gray-100 mb-6"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <ApperIcon 
              name="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
            />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="min-w-[120px]"
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </Select>
          
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name}
              </option>
            ))}
          </Select>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="md"
              onClick={onClearFilters}
              className="px-3 py-2 text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="X" className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;