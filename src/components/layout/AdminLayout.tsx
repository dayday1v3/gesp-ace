import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileQuestion,
  Settings,
  Bell,
  LogOut,
  Menu,
  X as XIcon
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarMenu = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
  { icon: FileQuestion, label: '题库管理', path: '/admin/questions' },
  { icon: Users, label: '用户管理', path: '/admin/users' },
  { icon: BookOpen, label: '知识手册', path: '/admin/handbook' },
  { icon: Bell, label: '每日一题', path: '/admin/daily' },
  { icon: Settings, label: '系统设置', path: '/admin/settings' },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const getActiveLabel = () => {
    const active = sidebarMenu.find(item => location.pathname === item.path);
    return active?.label || '管理后台';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">GESP Ace</h2>
              <p className="text-xs text-gray-500">{getActiveLabel()}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 flex flex-col z-50"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h2 className="font-bold text-gray-900">GESP Ace</h2>
                    <p className="text-xs text-gray-500">管理后台</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {sidebarMenu.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">退出登录</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h2 className="font-bold text-gray-900">GESP Ace</h2>
              <p className="text-xs text-gray-500">管理后台</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarMenu.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
};
