import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import TaskList from '@/components/organisms/TaskList';

const CategoryPage = () => {
  const { categoryId } = useParams();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <TaskList selectedCategoryId={categoryId} />
    </motion.div>
  );
};

export default CategoryPage;