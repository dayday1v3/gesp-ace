import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, FileQuestion, Settings, Bell,
  Search, Filter, Plus, Edit, Trash2, Eye, MoreVertical,
  ChevronDown, CheckCircle2, XCircle, LogOut, ChevronRight,
  Book, Trophy, Target, Clock, TrendingUp, Upload, FileText,
  Check, AlertCircle, Loader2, X, Download, Trash, RefreshCw,
  ChevronLeft, FileCheck, SplitSquareVertical
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

const sidebarMenu = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
  { icon: FileQuestion, label: '题库管理', path: '/admin/questions' },
  { icon: Users, label: '用户管理', path: '/admin/users' },
  { icon: BookOpen, label: '知识手册', path: '/admin/handbook' },
  { icon: Bell, label: '每日一题', path: '/admin/daily' },
  { icon: Settings, label: '系统设置', path: '/admin/settings' },
];

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

export const QuestionManagement: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeLevel, setActiveLevel] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedParsedQuestions, setSelectedParsedQuestions] = useState<string[]>([]);

  const questions = [
    {
      id: 'q001',
      content: '在C++中，以下哪个是合法的变量名？',
      type: 'choice',
      difficulty: 1,
      knowledgePoint: '变量定义',
      accuracy: 0.85,
      usedCount: 234,
      status: 'active',
      createdAt: '2024-01-15'
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
      createdAt: '2024-01-14'
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
      createdAt: '2024-01-13'
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
      createdAt: '2024-01-12'
    },
  ];

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setIsLoading(true);
      parsePDF(file);
    }
  };

  const parsePDF = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';

        const progress = Math.round((i / numPages) * 100);
        setImportProgress(progress);
      }

      const questions = extractQuestions(fullText);
      setParsedQuestions(questions);
      setImportStep('preview');
      setIsLoading(false);
    } catch (error) {
      console.error('PDF解析失败:', error);
      setIsLoading(false);
      alert('PDF解析失败，请检查文件格式');
    }
  };

  const extractQuestions = (text: string): any[] => {
    const questions: any[] = [];
    const lines = text.split('\n').filter(line => line.trim());

    let currentQuestion: any = null;
    let optionBuffer: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.match(/^\d+[.、)]/) || line.match(/^[（(]\d+[)）]/)) {
        if (currentQuestion) {
          if (currentQuestion.type === 'choice') {
            currentQuestion.options = [...optionBuffer];
          }
          questions.push(currentQuestion);
          optionBuffer = [];
        }

        const content = line.replace(/^\d+[.、)）]/, '').replace(/^[（(]\d+[)）]/, '').trim();
        const nextLine = lines[i + 1]?.trim() || '';

        let type = 'choice';
        if (nextLine.includes('正确') || nextLine.includes('错误') || nextLine.includes('对') || nextLine.includes('错')) {
          type = 'judgment';
        } else if (nextLine.match(/^[A-Da-d][.、)]/) || line.toLowerCase().includes('下列')) {
          type = 'choice';
        } else if (line.includes('程序') || line.includes('编写') || line.includes('代码')) {
          type = 'coding';
        }

        currentQuestion = {
          id: `import_${Date.now()}_${questions.length}`,
          content,
          type,
          difficulty: 1,
          knowledgePoint: '未分类',
          options: [],
          correctAnswer: '',
        };
      } else if (currentQuestion) {
        if (currentQuestion.type === 'choice' && line.match(/^[A-Da-d][.、)]/)) {
          const option = line.replace(/^[A-Da-d][.、)]/, '').trim();
          optionBuffer.push(option);
        } else if (line.includes('答案') || line.includes('正确答案')) {
          const answerMatch = line.match(/[A-Da-d]/);
          if (answerMatch) {
            currentQuestion.correctAnswer = answerMatch[0].toUpperCase();
          }
        } else if (line.includes('解析') || line.includes('说明')) {
          currentQuestion.explanation = line;
        }
      }
    }

    if (currentQuestion) {
      if (currentQuestion.type === 'choice') {
        currentQuestion.options = [...optionBuffer];
      }
      questions.push(currentQuestion);
    }

    return questions;
  };

  const handleImport = () => {
    const selectedForImport = parsedQuestions.filter(q =>
      selectedParsedQuestions.includes(q.id)
    );
    console.log('导入题目:', selectedForImport, '到等级:', activeLevel);
    setImportStep('result');
  };

  const resetImport = () => {
    setShowImportModal(false);
    setImportStep('upload');
    setSelectedFile(null);
    setParsedQuestions([]);
    setSelectedParsedQuestions([]);
    setImportProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleQuestionSelection = (id: string) => {
    setSelectedParsedQuestions(prev =>
      prev.includes(id)
        ? prev.filter(qId => qId !== id)
        : [...prev, id]
    );
  };

  const selectAllQuestions = () => {
    if (selectedParsedQuestions.length === parsedQuestions.length) {
      setSelectedParsedQuestions([]);
    } else {
      setSelectedParsedQuestions(parsedQuestions.map(q => q.id));
    }
  };

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
                item.label === '题库管理'
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
              <h1 className="text-2xl font-bold text-gray-900">题库管理</h1>
              <p className="text-gray-500 text-sm">共 {totalQuestions.toLocaleString()} 道题目，覆盖 GESP 全部8个等级</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                导入PDF
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                添加题目
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Level Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              选择题库等级
            </h3>
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-5`} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{level.icon}</span>
                      <span className={`text-lg font-bold ${
                        activeLevel === level.level ? 'text-primary' : 'text-gray-700'
                      }`}>
                        {level.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{level.stage}</p>
                    <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">
                        {level.questionCount} 题
                      </span>
                      {activeLevel === level.level && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Level Statistics */}
          <div className="grid grid-cols-4 gap-4">
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

          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索题目内容..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">全部类型</option>
                <option value="choice">单选题</option>
                <option value="judgment">判断题</option>
                <option value="coding">编程题</option>
              </select>

              <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                更多筛选
              </button>
            </div>
          </div>

          {/* Questions Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {currentLevelInfo.icon} {currentLevelInfo.name} - 题目列表
              </h3>
              <span className="text-sm text-gray-500">
                共 {currentLevelInfo.questionCount} 道题目
              </span>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">题目内容</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">类型</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">难度</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">知识点</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">正确率</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">使用次数</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">操作</th>
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
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 line-clamp-2 max-w-md">
                        {question.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        添加于 {question.createdAt}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeLabels[question.type].bgColor} ${typeLabels[question.type].color}`}>
                        {typeLabels[question.type].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyLabels[question.difficulty].color}`}>
                        {difficultyLabels[question.difficulty].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{question.knowledgePoint}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-full rounded-full ${
                              question.accuracy >= 0.7 ? 'bg-green-500' :
                              question.accuracy >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${question.accuracy * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{Math.round(question.accuracy * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{question.usedCount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        question.status === 'active'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-gray-500/10 text-gray-600'
                      }`}>
                        {question.status === 'active' ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="预览">
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
                onClick={resetImport}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {importStep === 'upload' && (
                <div className="space-y-6">
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-500 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        点击选择PDF文件或将文件拖拽到此处
                      </p>
                      <p className="text-sm text-gray-500">
                        支持 GESP 真题、模拟题等 PDF 格式文件
                      </p>
                    </label>
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
                      <SplitSquareVertical className="w-5 h-5 text-gray-600" />
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
              )}

              {importStep === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        已解析 {parsedQuestions.length} 道题目
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">全选</span>
                        <button
                          onClick={selectAllQuestions}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            selectedParsedQuestions.length === parsedQuestions.length
                              ? 'bg-green-600 border-green-600'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {selectedParsedQuestions.length === parsedQuestions.length && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      已选择 {selectedParsedQuestions.length} 道题目
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[60vh] overflow-auto">
                    {parsedQuestions.map((question, index) => (
                      <div
                        key={question.id}
                        className={`border rounded-xl p-4 transition-all ${
                          selectedParsedQuestions.includes(question.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleQuestionSelection(question.id)}
                            className={`w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors mt-1 ${
                              selectedParsedQuestions.includes(question.id)
                                ? 'bg-green-600 border-green-600'
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {selectedParsedQuestions.includes(question.id) && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-500">
                                #{index + 1}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                question.type === 'choice'
                                  ? 'bg-blue-100 text-blue-700'
                                  : question.type === 'judgment'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {question.type === 'choice' ? '单选题' :
                                 question.type === 'judgment' ? '判断题' : '编程题'}
                              </span>
                              <span className="text-xs text-gray-400">
                                知识点：{question.knowledgePoint}
                              </span>
                            </div>
                            <p className="text-gray-900 mb-2">{question.content}</p>
                            {question.options.length > 0 && (
                              <div className="space-y-1 text-sm text-gray-600">
                                {question.options.map((opt: string, i: number) => (
                                  <div key={i}>
                                    {String.fromCharCode(65 + i)}. {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                            {question.correctAnswer && (
                              <div className="mt-2 text-sm text-green-600">
                                答案：{question.correctAnswer}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importStep === 'result' && (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    导入成功！
                  </h3>
                  <p className="text-gray-600 mb-6">
                    成功导入 {selectedParsedQuestions.length} 道题目到 {currentLevelInfo.name} 题库
                  </p>
                  <button
                    onClick={resetImport}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    完成
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-700 font-medium mb-2">正在解析PDF...</p>
                    <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 transition-all duration-300"
                        style={{ width: `${importProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{importProgress}%</p>
                  </div>
                </div>
              )}
            </div>

            {importStep === 'preview' && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setImportStep('upload')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  重新选择文件
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={resetImport}
                    className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={selectedParsedQuestions.length === 0}
                    className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    确认导入 ({selectedParsedQuestions.length})
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};
