import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, FileQuestion, Settings, Bell,
  Search, Plus, Edit, Trash2, Eye, Calendar, Clock, CheckCircle2,
  ChevronLeft, ChevronRight, Star, TrendingUp, Target, FileText,
  BarChart3, RefreshCw, GraduationCap
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

export const AdminDaily: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const dailyQuestions = [
    { date: '2024-01-15', level: 1, question: '在C++中，以下哪个是合法的变量名？', participants: 456, completion: 0.89 },
    { date: '2024-01-14', level: 1, question: 'C++中，所有语句都必须以分号结束。', participants: 423, completion: 0.92 },
    { date: '2024-01-13', level: 2, question: '下列哪个选项不是C++的关键字？', participants: 398, completion: 0.85 },
    { date: '2024-01-12', level: 2, question: '请编写一个程序，计算 1+2+...+100', participants: 367, completion: 0.78 },
    { date: '2024-01-11', level: 3, question: '使用循环结构输出九九乘法表', participants: 334, completion: 0.72 },
    { date: '2024-01-10', level: 3, question: '理解函数调用的基本概念', participants: 312, completion: 0.81 },
    { date: '2024-01-09', level: 4, question: '数组元素的查找算法', participants: 289, completion: 0.75 },
  ];

  const stats = [
    { label: '今日参与', value: '456', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', change: '+12%' },
    { label: '完成率', value: '89%', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', change: '+3%' },
    { label: '本周题目', value: '7', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10', change: '0' },
    { label: '平均用时', value: '12分钟', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10', change: '-2分钟' },
  ];

  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-12 h-12" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasQuestion = dailyQuestions.some(dq => dq.date === dateStr);
      const isToday = day === today.getDate();

      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-12 h-12 rounded-xl flex items-center justify-center relative transition-all ${
            isToday
              ? 'bg-primary text-white font-bold shadow-lg'
              : hasQuestion
              ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {day}
          {hasQuestion && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </motion.button>
      );
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
                item.label === '每日一题'
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
            <Bell className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">每日一题</h1>
              <p className="text-gray-500 text-sm">管理每日练习题目，追踪学生参与情况</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  日历视图
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  列表视图
                </button>
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                设置今日题目
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className={`text-xs font-medium ${
                    stat.change.startsWith('+') ? 'text-green-500' :
                    stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {viewMode === 'calendar' ? (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {currentYear}年 {months[currentMonth]}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="px-3 py-1 text-sm text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      今天
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekdays.map((day) => (
                    <div key={day} className="w-12 h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                      周{day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {renderCalendar()}
                </div>

                <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span>今天</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500/30" />
                    <span>已设置题目</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">今日题目预览</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-xl border-2 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">今日题目</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">一级</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      在C++中，以下哪个是合法的变量名？
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        456 人参与
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        89% 完成
                      </span>
                    </div>
                  </div>

                  <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    设置今日题目
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">题目列表</h3>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  刷新
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">日期</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">等级</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">题目内容</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">参与人数</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">完成率</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dailyQuestions.map((item, index) => (
                    <motion.tr
                      key={item.date}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          Lv.{item.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 line-clamp-1 max-w-md">{item.question}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.participants}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-full rounded-full ${
                                item.completion >= 0.8 ? 'bg-green-500' :
                                item.completion >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${item.completion * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{Math.round(item.completion * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="查看详情">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="编辑">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="删除">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">参与趋势</h3>
            <div className="h-64 flex items-end justify-around gap-4">
              {[65, 72, 68, 78, 82, 85, 89].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-primary to-primary-light rounded-t-xl relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {value}%
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-around mt-4 text-sm text-gray-500">
              <span>1月9日</span>
              <span>1月10日</span>
              <span>1月11日</span>
              <span>1月12日</span>
              <span>1月13日</span>
              <span>1月14日</span>
              <span>1月15日</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
