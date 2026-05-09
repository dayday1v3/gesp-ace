import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Plus, Edit, Trash2, Eye,
  CheckCircle2, Book, Target, Clock, TrendingUp,
  Upload, X, FileCheck, Check, AlertCircle,
  LayoutDashboard, FileQuestion as FileQuestionIcon, Users, BookOpen, Bell, Settings, LogOut, GraduationCap
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { RichTextEditor } from '../../components/ui/RichTextEditor';

const GESP_LEVELS = [
  { level: 1, name: '一级', stage: '小学', description: '图形化编程基础', color: 'from-emerald-500 to-teal-500', icon: '🌱', questionCount: 456 },
  { level: 2, name: '二级', stage: '小学', description: '图形化编程进阶', color: 'from-teal-500 to-cyan-500', icon: '🌿', questionCount: 389 },
  { level: 3, name: '三级', stage: '小学', description: '图形化编程拓展', color: 'from-cyan-500 to-blue-500', icon: '🌳', questionCount: 312 },
  { level: 4, name: '四级', stage: '初中', description: 'Python/C++入门', color: 'from-blue-500 to-indigo-500', icon: '📚', questionCount: 445 },
  { level: 5, name: '五级', stage: '初中', description: 'Python/C++进阶', color: 'from-indigo-500 to-purple-500', icon: '💡', questionCount: 398 },
  { level: 6, name: '六级', stage: '初中', description: 'Python/C++数据结构', color: 'from-purple-500 to-pink-500', icon: '🔮', questionCount: 356 },
  { level: 7, name: '七级', stage: '高中', description: 'C++算法基础', color: 'from-pink-500 to-orange-500', icon: '🚀', questionCount: 289 },
  { level: 8, name: '八级', stage: '高中', description: 'C++算法竞赛', color: 'from-orange-500 to-red-500', icon: '🏆', questionCount: 122 },
];

const sidebarMenu = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
  { icon: FileQuestionIcon, label: '题库管理', path: '/admin/questions' },
  { icon: GraduationCap, label: '学科与等级', path: '/admin/curriculum' },
  { icon: Users, label: '用户管理', path: '/admin/users' },
  { icon: BookOpen, label: '知识手册', path: '/admin/handbook' },
  { icon: Bell, label: '每日一题', path: '/admin/daily' },
  { icon: Settings, label: '系统设置', path: '/admin/settings' },
];

export const QuestionManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingForm, setEditingForm] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    type: 'choice',
    difficulty: 1,
    knowledgePoint: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    status: 'active'
  });

  const getActiveLabel = () => {
    const active = sidebarMenu.find(item => location.pathname === item.path);
    return active?.label || '管理后台';
  };

  const [questions, setQuestions] = useState([
    {
      id: 'q001',
      content: '在C++中，以下哪个是合法的变量名？',
      type: 'choice',
      difficulty: 1,
      knowledgePoint: '变量定义',
      accuracy: 0.85,
      usedCount: 234,
      status: 'active',
      createdAt: '2024-01-15',
      options: ['A. 123abc', 'B. _abc', 'C. class', 'D. var-1'],
      correctAnswer: 'B',
      explanation: '变量名不能以数字开头，不能使用关键字，不能包含特殊字符（除下划线）。'
    },
    {
      id: 'q002',
      content: 'C++中，所有语句都必须以分号结束。',
      type: 'judgment',
      difficulty: 1,
      knowledgePoint: '语法基础',
      accuracy: 0.92,
      usedCount: 189,
      status: 'active',
      createdAt: '2024-01-14',
      correctAnswer: 'true',
      explanation: '在C++中，大部分语句需要以分号结束，但结构体、类的定义等不需要。'
    },
    {
      id: 'q003',
      content: '请编写一个程序，输出 Hello World',
      type: 'coding',
      difficulty: 2,
      knowledgePoint: '输入输出',
      accuracy: 0.68,
      usedCount: 156,
      status: 'active',
      createdAt: '2024-01-13',
      correctAnswer: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello World" << endl;\n    return 0;\n}',
      explanation: '这是经典的Hello World程序，使用cout输出内容。'
    },
    {
      id: 'q004',
      content: '下列哪个选项不是C++的关键字？',
      type: 'choice',
      difficulty: 1,
      knowledgePoint: '关键字',
      accuracy: 0.45,
      usedCount: 98,
      status: 'active',
      createdAt: '2024-01-12',
      options: ['A. int', 'B. char', 'C. string', 'D. float'],
      correctAnswer: 'C',
      explanation: 'string不是C++关键字，它是标准库中的一个类。int、char、float都是基本数据类型关键字。'
    },
  ]);

  const typeLabels: Record<string, { label: string; color: string; bgColor: string }> = {
    choice: { label: '单选题', color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
    judgment: { label: '判断题', color: 'text-green-600', bgColor: 'bg-green-500/10' },
    coding: { label: '编程题', color: 'text-purple-600', bgColor: 'bg-purple-500/10' },
  };

  const difficultyLabels: Record<number, { label: string; color: string }> = {
    1: { label: '简单', color: 'text-green-600 bg-green-500/10' },
    2: { label: '中等', color: 'text-yellow-600 bg-yellow-500/10' },
    3: { label: '困难', color: 'text-red-600 bg-red-500/10' },
  };

  const currentLevelInfo = GESP_LEVELS.find(l => l.level === activeLevel)!;
  const totalQuestions = GESP_LEVELS.reduce((sum, l) => sum + l.questionCount, 0);

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleOpenEditModal = (question: any) => {
    setEditingForm({ ...question });
    setShowEditModal(true);
  };

  const handleSaveEditFromList = () => {
    if (!editingForm) return;
    setQuestions(prev =>
      prev.map(q => q.id === editingForm.id ? { ...editingForm } : q)
    );
    setShowEditModal(false);
    setEditingForm(null);
  };

  const handleDeleteFromList = (id: string) => {
    if (confirm('确定要删除这道题目吗？删除后无法恢复。')) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleCancelEditFromList = () => {
    setShowEditModal(false);
    setEditingForm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">GESP Ace</h2>
              <p className="text-xs text-gray-500">题库管理</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
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
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[85%] max-w-[280px] bg-white flex flex-col z-50 shadow-2xl"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">GESP Ace</h2>
                    <p className="text-xs text-gray-500">管理后台</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {sidebarMenu.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      location.pathname === item.path
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              <div className="p-4 border-t border-gray-100 bg-gray-50">
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
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col h-screen sticky top-0">
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
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">题库管理</h1>
              <p className="text-gray-500 text-xs sm:text-sm">共 {totalQuestions.toLocaleString()} 道题目，覆盖 GESP 全部8个等级</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">导入PDF</span>
                <span className="xs:hidden">导入</span>
              </button>
              <button
                onClick={() => {
                  setNewQuestion({
                    content: '',
                    type: 'choice',
                    difficulty: 1,
                    knowledgePoint: '',
                    options: ['', '', '', ''],
                    correctAnswer: '',
                    explanation: '',
                    status: 'active'
                  });
                  setShowAddModal(true);
                }}
                className="px-3 sm:px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">添加题目</span>
                <span className="xs:hidden">添加</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Level Cards */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Book className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              选择题库等级
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
              {GESP_LEVELS.map((level) => (
                <motion.button
                  key={level.level}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveLevel(level.level)}
                  className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all overflow-hidden ${
                    activeLevel === level.level
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-5`} />
                  <div className="relative">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <span className="text-lg sm:text-2xl">{level.icon}</span>
                      <span className={`text-sm sm:text-lg font-bold ${
                        activeLevel === level.level ? 'text-primary' : 'text-gray-700'
                      }`}>
                        {level.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1 hidden sm:block">{level.stage}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 hidden sm:block">{level.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">
                        {level.questionCount} 题
                      </span>
                      {activeLevel === level.level && (
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <Book className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">题目总数</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{currentLevelInfo.questionCount}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded-xl">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">平均正确率</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">72.5%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">本周新增</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">+28</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-500/10 rounded-xl">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">使用次数</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </motion.div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索题目内容..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                <option value="all">全部类型</option>
                <option value="choice">单选题</option>
                <option value="judgment">判断题</option>
                <option value="coding">编程题</option>
              </select>

              <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm sm:hidden">
                <Filter className="w-4 h-4" />
                筛选
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors items-center gap-2 text-sm hidden sm:flex">
                <Filter className="w-4 h-4" />
                更多筛选
              </button>
            </div>
          </div>

          {/* Questions Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                {currentLevelInfo.icon} {currentLevelInfo.name} - 题目列表
              </h3>
              <span className="text-xs sm:text-sm text-gray-500">
                共 {currentLevelInfo.questionCount} 道题目
              </span>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[800px] sm:min-w-0">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600">题目内容</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600">类型</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 hidden md:table-cell">难度</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 hidden lg:table-cell">知识点</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 hidden sm:table-cell">正确率</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 hidden lg:table-cell">使用次数</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 hidden sm:table-cell">状态</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {questions.map((question) => (
                  <motion.tr
                    key={question.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <p className="text-sm text-gray-900 line-clamp-2 max-w-xs sm:max-w-md">
                        {question.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                        添加于 {question.createdAt}
                      </p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${typeLabels[question.type].bgColor} ${typeLabels[question.type].color}`}>
                        {typeLabels[question.type].label}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${difficultyLabels[question.difficulty].color}`}>
                        {difficultyLabels[question.difficulty].label}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 hidden lg:table-cell">{question.knowledgePoint}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div
                            className={`h-full rounded-full ${
                              question.accuracy >= 0.7 ? 'bg-green-500' :
                              question.accuracy >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${question.accuracy * 100}%` }}
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">{Math.round(question.accuracy * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">{question.usedCount}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        question.status === 'active'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-gray-500/10 text-gray-600'
                      }`}>
                        {question.status === 'active' ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(question)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteFromList(question.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">
              显示 1-4 条，共 {currentLevelInfo.questionCount} 条
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
                上一页
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded-lg">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
              <span className="px-2 text-gray-400">...</span>
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
                {Math.ceil(currentLevelInfo.questionCount / 10)}
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
                下一页
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && editingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <Edit className="w-6 h-6" />
                <h2 className="text-xl font-bold">编辑题目</h2>
              </div>
              <button
                onClick={handleCancelEditFromList}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  题目内容 <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  content={editingForm.content}
                  onChange={(content) => setEditingForm({ ...editingForm, content })}
                  placeholder="请输入题目内容，支持粘贴图片..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    题目类型
                  </label>
                  <select
                    value={editingForm.type}
                    onChange={(e) => setEditingForm({ ...editingForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="choice">单选题</option>
                    <option value="judgment">判断题</option>
                    <option value="coding">编程题</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    难度等级
                  </label>
                  <select
                    value={editingForm.difficulty}
                    onChange={(e) => setEditingForm({ ...editingForm, difficulty: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">简单</option>
                    <option value="2">中等</option>
                    <option value="3">困难</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  知识点
                </label>
                <input
                  type="text"
                  value={editingForm.knowledgePoint}
                  onChange={(e) => setEditingForm({ ...editingForm, knowledgePoint: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：变量定义、循环结构等"
                />
              </div>

              {editingForm.type === 'choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选项 <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {(editingForm.options || []).map((opt: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 w-6">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...(editingForm.options || [])];
                            newOptions[i] = e.target.value;
                            setEditingForm({ ...editingForm, options: newOptions });
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`选项 ${String.fromCharCode(65 + i)}`}
                        />
                        {(editingForm.options || []).length > 2 && (
                          <button
                            onClick={() => {
                              const newOptions = editingForm.options.filter((_: any, idx: number) => idx !== i);
                              setEditingForm({ ...editingForm, options: newOptions });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const newOptions = [...(editingForm.options || []), ''];
                      setEditingForm({ ...editingForm, options: newOptions });
                    }}
                    className="mt-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    添加选项
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  正确答案 <span className="text-red-500">*</span>
                </label>
                {editingForm.type === 'choice' ? (
                  <select
                    value={editingForm.correctAnswer}
                    onChange={(e) => setEditingForm({ ...editingForm, correctAnswer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">请选择正确答案</option>
                    {(editingForm.options || []).map((_: string, i: number) => (
                      <option key={i} value={String.fromCharCode(65 + i)}>
                        {String.fromCharCode(65 + i)}
                      </option>
                    ))}
                  </select>
                ) : editingForm.type === 'judgment' ? (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value="true"
                        checked={editingForm.correctAnswer === 'true'}
                        onChange={(e) => setEditingForm({ ...editingForm, correctAnswer: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">正确</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value="false"
                        checked={editingForm.correctAnswer === 'false'}
                        onChange={(e) => setEditingForm({ ...editingForm, correctAnswer: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">错误</span>
                    </label>
                  </div>
                ) : (
                  <textarea
                    value={editingForm.correctAnswer || ''}
                    onChange={(e) => setEditingForm({ ...editingForm, correctAnswer: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                    rows={8}
                    placeholder="输入编程题的参考答案代码..."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  解析说明
                </label>
                <textarea
                  value={editingForm.explanation || ''}
                  onChange={(e) => setEditingForm({ ...editingForm, explanation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="输入题目解析和答题技巧..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={editingForm.status === 'active'}
                      onChange={(e) => setEditingForm({ ...editingForm, status: e.target.value })}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-sm text-gray-700">启用</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={editingForm.status === 'inactive'}
                      onChange={(e) => setEditingForm({ ...editingForm, status: e.target.value })}
                      className="w-4 h-4 text-gray-600"
                    />
                    <span className="text-sm text-gray-700">禁用</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={handleCancelEditFromList}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveEditFromList}
                disabled={!editingForm.content || !editingForm.correctAnswer}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                保存修改
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <div className="flex items-center gap-3">
                <FileCheck className="w-6 h-6" />
                <h2 className="text-xl font-bold">导入PDF题目</h2>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-500 transition-colors">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    点击选择PDF文件或将文件拖拽到此处
                  </p>
                  <p className="text-sm text-gray-500">
                    支持 GESP 真题、模拟题等 PDF 格式文件
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">导入说明：</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>系统会自动识别PDF中的题目内容</li>
                        <li>支持单选题、判断题和编程题</li>
                        <li>导入前请预览并确认题目解析结果</li>
                        <li>可选择要导入的题目并指定目标等级</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    当前目标等级
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {GESP_LEVELS.map((level) => (
                      <button
                        key={level.level}
                        onClick={() => setActiveLevel(level.level)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          activeLevel === level.level
                            ? 'bg-green-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-green-500'
                        }`}
                      >
                        {level.icon} {level.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary to-indigo-600 text-white">
              <div className="flex items-center gap-3">
                <Plus className="w-6 h-6" />
                <h2 className="text-xl font-bold">新建题目</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  题目内容 <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  content={newQuestion.content}
                  onChange={(content) => setNewQuestion({ ...newQuestion, content })}
                  placeholder="请输入题目内容，支持粘贴图片..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    题目类型
                  </label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="choice">单选题</option>
                    <option value="judgment">判断题</option>
                    <option value="coding">编程题</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    难度等级
                  </label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="1">简单</option>
                    <option value="2">中等</option>
                    <option value="3">困难</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  知识点
                </label>
                <input
                  type="text"
                  value={newQuestion.knowledgePoint}
                  onChange={(e) => setNewQuestion({ ...newQuestion, knowledgePoint: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="例如：变量定义、循环结构等"
                />
              </div>

              {newQuestion.type === 'choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选项 <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {newQuestion.options.map((opt: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 w-6">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...newQuestion.options];
                            newOptions[i] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: newOptions });
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder={`选项 ${String.fromCharCode(65 + i)}`}
                        />
                        {newQuestion.options.length > 2 && (
                          <button
                            onClick={() => {
                              const newOptions = newQuestion.options.filter((_: any, idx: number) => idx !== i);
                              setNewQuestion({ ...newQuestion, options: newOptions });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const newOptions = [...newQuestion.options, ''];
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                    className="mt-3 px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    添加选项
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  正确答案 <span className="text-red-500">*</span>
                </label>
                {newQuestion.type === 'choice' ? (
                  <select
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">请选择正确答案</option>
                    {newQuestion.options.map((_: string, i: number) => (
                      <option key={i} value={String.fromCharCode(65 + i)}>
                        选项 {String.fromCharCode(65 + i)}
                      </option>
                    ))}
                  </select>
                ) : newQuestion.type === 'judgment' ? (
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="newCorrectAnswer"
                        value="true"
                        checked={newQuestion.correctAnswer === 'true'}
                        onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-gray-700">正确</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="newCorrectAnswer"
                        value="false"
                        checked={newQuestion.correctAnswer === 'false'}
                        onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-gray-700">错误</span>
                    </label>
                  </div>
                ) : (
                  <textarea
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
                    rows={8}
                    placeholder="输入编程题的参考答案代码..."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  解析说明
                </label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                  placeholder="输入题目解析和答题技巧..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标等级
                </label>
                <select
                  value={activeLevel}
                  onChange={(e) => setActiveLevel(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {GESP_LEVELS.map((level) => (
                    <option key={level.level} value={level.level}>
                      {level.icon} {level.name} - {level.stage} {level.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (!newQuestion.content) {
                    alert('请输入题目内容');
                    return;
                  }
                  if (newQuestion.type === 'choice' && !newQuestion.correctAnswer) {
                    alert('请选择正确答案');
                    return;
                  }
                  if (newQuestion.type === 'judgment' && !newQuestion.correctAnswer) {
                    alert('请选择正确答案');
                    return;
                  }
                  if (newQuestion.type === 'coding' && !newQuestion.correctAnswer) {
                    alert('请输入参考答案代码');
                    return;
                  }
                  
                  const newQ = {
                    id: 'q' + Date.now(),
                    ...newQuestion,
                    accuracy: 0,
                    usedCount: 0,
                    createdAt: new Date().toISOString().split('T')[0]
                  };
                  setQuestions(prev => [newQ, ...prev]);
                  setShowAddModal(false);
                }}
                disabled={!newQuestion.content}
                className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                创建题目
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
