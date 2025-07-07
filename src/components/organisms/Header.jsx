import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AuthContext } from '@/App';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ onToggleSidebar }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border-b border-gray-100 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold text-gray-900">TaskFlow</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.emailAddress}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="LogOut" className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;