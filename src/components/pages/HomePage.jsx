import { useState } from 'react';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <TaskList />
    </motion.div>
  );
};

export default HomePage;