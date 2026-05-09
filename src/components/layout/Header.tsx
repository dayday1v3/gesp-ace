import { motion } from 'framer-motion';
import { Bell, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/daily', label: '每日一练', icon: '📝' },
  { path: '/practice', label: '刷题', icon: '📚' },
  { path: '/exam', label: '模拟考试', icon: '📋' },
  { path: '/profile', label: '我的', icon: '👤' },
];

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="text-3xl">🎯</span>
            <span className="text-xl font-bold text-gradient bg-gradient-to-r from-primary to-primary-light bg-clip-text">
              GESP Ace
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-secondary hover:bg-bg-secondary'
                  )}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </motion.button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:block w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              张
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="md:hidden border-t border-gray-100 bg-white"
      >
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-text-secondary'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.header>
  );
};
