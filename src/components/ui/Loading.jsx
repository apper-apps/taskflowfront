import { motion } from 'framer-motion';

const Loading = ({ type = 'tasks' }) => {
  const renderTasksSkeleton = () => (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-gradient-to-r from-secondary to-primary rounded opacity-30 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-secondary to-primary rounded opacity-30 animate-pulse" />
              <div className="flex items-center space-x-2">
                <div className="w-16 h-3 bg-gradient-to-r from-secondary to-primary rounded opacity-20 animate-pulse" />
                <div className="w-12 h-3 bg-gradient-to-r from-secondary to-primary rounded opacity-20 animate-pulse" />
              </div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-full opacity-20 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCategoriesSkeleton = () => (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center space-x-3 p-3 rounded-lg"
        >
          <div className="w-3 h-3 bg-gradient-to-r from-secondary to-primary rounded-full opacity-30 animate-pulse" />
          <div className="flex-1 h-4 bg-gradient-to-r from-secondary to-primary rounded opacity-30 animate-pulse" />
          <div className="w-6 h-4 bg-gradient-to-r from-secondary to-primary rounded opacity-20 animate-pulse" />
        </motion.div>
      ))}
    </div>
  );

  if (type === 'categories') {
    return renderCategoriesSkeleton();
  }

  return renderTasksSkeleton();
};

export default Loading;