import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, LogIn, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/userStore';

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
  const { isLoggedIn, username, logout } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const initial = username?.trim().charAt(0).toUpperCase() || 'U';

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
            {isLoggedIn && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-text-secondary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="切换菜单"
            >
              <Menu className="w-5 h-5 text-text-secondary" />
            </motion.button>

            {isLoggedIn ? (
              <div className="relative hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pr-3 pl-1 py-1 rounded-full bg-bg-secondary hover:bg-bg-secondary/80 transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold">
                    {initial}
                  </span>
                  <span className="text-sm text-text-primary max-w-[120px] truncate">{username || '用户'}</span>
                </motion.button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <button
                        onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-text-primary hover:bg-bg-secondary transition-colors"
                      >
                        <User className="w-4 h-4 text-text-secondary" />
                        <span>个人主页</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-danger hover:bg-danger/5 transition-colors border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>退出登录</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login', { state: { from: location.pathname } })}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium shadow-md hover:bg-primary-dark transition-colors"
              >
                <LogIn className="w-4 h-4" />
                登录 / 注册
              </motion.button>
            )}
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
                  isActive ? 'text-primary' : 'text-text-secondary'
                )}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </motion.button>
            );
          })}
          {isLoggedIn ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs text-danger"
            >
              <LogOut className="w-5 h-5" />
              <span>退出</span>
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/login', { state: { from: location.pathname } })}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs text-primary"
            >
              <LogIn className="w-5 h-5" />
              <span>登录</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
};
