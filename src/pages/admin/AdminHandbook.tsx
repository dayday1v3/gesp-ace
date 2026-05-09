import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, FileQuestion, Settings, Bell,
  Search, Plus, Edit, Trash2, Eye, Upload, Download, FileText,
  ChevronRight, CheckCircle2, Book, Target, Clock, FolderOpen
} from 'lucide-react';

const sidebarMenu = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
  { icon: FileQuestion, label: '题库管理', path: '/admin/questions' },
  { icon: Users, label: '用户管理', path: '/admin/users' },
  { icon: BookOpen, label: '知识手册', path: '/admin/handbook' },
  { icon: Bell, label: '每日一题', path: '/admin/daily' },
  { icon: Settings, label: '系统设置', path: '/admin/settings' },
];

const GESP_LEVELS = [
  { level: 1, name: '一级', stage: '小学', icon: '🌱', chapters: 12, topics: 45 },
  { level: 2, name: '二级', stage: '小学', icon: '🌿', chapters: 14, topics: 52 },
  { level: 3, name: '三级', stage: '小学', icon: '🌳', chapters: 15, topics: 58 },
  { level: 4, name: '四级', stage: '初中', icon: '📚', chapters: 18, topics: 67 },
  { level: 5, name: '五级', stage: '初中', icon: '💡', chapters: 20, topics: 78 },
  { level: 6, name: '六级', stage: '初中', icon: '🔮', chapters: 22, topics: 85 },
  { level: 7, name: '七级', stage: '高中', icon: '🚀', chapters: 25, topics: 96 },
  { level: 8, name: '八级', stage: '高中', icon: '🏆', chapters: 28, topics: 108 },
];

export const AdminHandbook: React.FC = () => {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const currentLevel = GESP_LEVELS.find(l => l.level === activeLevel)!;

  const chapters = [
    { id: 'ch1', name: '编程基础概念', topics: 8, questions: 156, difficulty: 1 },
    { id: 'ch2', name: '变量与数据类型', topics: 10, questions: 234, difficulty: 1 },
    { id: 'ch3', name: '运算符与表达式', topics: 6, questions: 189, difficulty: 1 },
    { id: 'ch4', name: '顺序结构', topics: 5, questions: 145, difficulty: 1 },
    { id: 'ch5', name: '选择结构', topics: 8, questions: 267, difficulty: 2 },
    { id: 'ch6', name: '循环结构', topics: 10, questions: 312, difficulty: 2 },
  ];

  const topics = [
    { id: 't1', name: '什么是编程', content: '编程是让计算机执行特定任务的过程...', relatedQuestions: 12, mastery: 0.85 },
    { id: 't2', name: '计算机的工作原理', content: '计算机通过执行指令来完成各种任务...', relatedQuestions: 15, mastery: 0.78 },
    { id: 't3', name: '算法的基本概念', content: '算法是解决问题的明确步骤序列...', relatedQuestions: 18, mastery: 0.72 },
    { id: 't4', name: '程序的基本结构', content: '程序通常包含输入、处理和输出三个部分...', relatedQuestions: 10, mastery: 0.88 },
  ];

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
                item.label === '知识手册'
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
              <h1 className="text-2xl font-bold text-gray-900">知识手册</h1>
              <p className="text-gray-500 text-sm">管理 GESP 各等级的知识点和章节内容</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出手册
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                添加章节
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {GESP_LEVELS.map((level) => (
              <motion.button
                key={level.level}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveLevel(level.level)}
                className={`relative p-4 rounded-2xl border-2 transition-all overflow-hidden ${
                  activeLevel === level.level
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{level.icon}</span>
                  <span className={`text-lg font-bold ${
                    activeLevel === level.level ? 'text-primary' : 'text-gray-700'
                  }`}>
                    {level.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{level.stage}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{level.chapters} 章</span>
                  <span>{level.topics} 知识点</span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">章节总数</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{currentLevel.chapters}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-500/10 rounded-xl">
                  <Book className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">知识点总数</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{currentLevel.topics}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">关联题目</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">1,303</p>
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
                <span className="text-sm text-gray-500">学习人次</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">12,456</p>
            </motion.div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {currentLevel.icon} {currentLevel.name} - 章节列表
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索章节..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <button className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  批量导入
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedChapter === chapter.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                  onClick={() => setSelectedChapter(selectedChapter === chapter.id ? null : chapter.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{chapter.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>{chapter.topics} 个知识点</span>
                          <span>{chapter.questions} 道关联题目</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        chapter.difficulty === 1
                          ? 'bg-green-500/10 text-green-600'
                          : chapter.difficulty === 2
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}>
                        {chapter.difficulty === 1 ? '入门' : chapter.difficulty === 2 ? '基础' : '进阶'}
                      </span>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                        selectedChapter === chapter.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>

                  {selectedChapter === chapter.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="space-y-3">
                        {topics.map((topic) => (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                          >
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{topic.name}</h5>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{topic.content}</p>
                            </div>
                            <div className="flex items-center gap-4 ml-4">
                              <div className="text-right">
                                <p className="text-xs text-gray-500">{topic.relatedQuestions} 题</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ width: `${topic.mastery * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500">{Math.round(topic.mastery * 100)}%</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                  <Eye className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                  <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        添加知识点
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
