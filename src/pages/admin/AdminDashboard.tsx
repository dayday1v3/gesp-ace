import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, FileQuestion, Settings, Bell, 
  TrendingUp, Clock, Award, BarChart3, CheckCircle2, XCircle, 
  Eye, Edit, Trash2, Plus, Search, Filter, LogOut, ChevronRight, GraduationCap
} from 'lucide-react';

const sidebarMenu = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
  { icon: FileQuestion, label: '题库管理', path: '/admin/questions' },
  { icon: GraduationCap, label: '学科与等级', path: '/admin/curriculum' },
  { icon: Users, label: '用户管理', path: '/admin/users' },
  { icon: BookOpen, label: '知识手册', path: '/admin/handbook' },
  { icon: Bell, label: '每日一题', path: '/admin/daily' },
  { icon: Settings, label: '系统设置', path: '/admin/settings' },
];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const stats = [
    { label: '总用户数', value: '1,234', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: '今日活跃', value: '456', icon: Eye, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: '题目总数', value: '2,567', icon: FileQuestion, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: '今日打卡', value: '789', icon: CheckCircle2, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const recentActivity = [
    { user: '李明', action: '完成了每日一练', time: '5分钟前', type: 'practice' },
    { user: '王芳', action: '收藏了题目', time: '10分钟前', type: 'favorite' },
    { user: '张强', action: '开始模拟考试', time: '15分钟前', type: 'exam' },
    { user: '刘洋', action: '突破了80分', time: '20分钟前', type: 'achievement' },
  ];

  const topTopics = [
    { name: '循环结构', questions: 156, accuracy: 0.68 },
    { name: '函数', questions: 134, accuracy: 0.72 },
    { name: '数组', questions: 112, accuracy: 0.75 },
    { name: '条件判断', questions: 98, accuracy: 0.82 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
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
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === item.label
                  ? 'bg-primary text-white'
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
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
              <p className="text-gray-500 text-sm">欢迎回来，管理员！</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <p className="font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">超级管理员</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +12%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">最近动态</h2>
                <button className="text-primary text-sm font-medium hover:underline">
                  查看全部
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                      {activity.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">热门知识点</h2>
                <button className="text-primary text-sm font-medium hover:underline">
                  查看全部
                </button>
              </div>
              <div className="space-y-4">
                {topTopics.map((topic, index) => (
                  <div key={topic.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-900 text-sm font-medium">{topic.name}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{topic.questions}题</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                        style={{ width: `${topic.accuracy * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      平均正确率 {Math.round(topic.accuracy * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">快捷操作</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/admin/questions')}
                className="flex flex-col items-center gap-2 p-4 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors"
              >
                <Plus className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium text-gray-900">添加题目</span>
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="flex flex-col items-center gap-2 p-4 bg-blue-500/5 hover:bg-blue-500/10 rounded-xl transition-colors"
              >
                <Users className="w-8 h-8 text-blue-500" />
                <span className="text-sm font-medium text-gray-900">用户列表</span>
              </button>
              <button
                onClick={() => navigate('/admin/daily')}
                className="flex flex-col items-center gap-2 p-4 bg-green-500/5 hover:bg-green-500/10 rounded-xl transition-colors"
              >
                <BookOpen className="w-8 h-8 text-green-500" />
                <span className="text-sm font-medium text-gray-900">每日一题</span>
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="flex flex-col items-center gap-2 p-4 bg-purple-500/5 hover:bg-purple-500/10 rounded-xl transition-colors"
              >
                <Settings className="w-8 h-8 text-purple-500" />
                <span className="text-sm font-medium text-gray-900">系统设置</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
