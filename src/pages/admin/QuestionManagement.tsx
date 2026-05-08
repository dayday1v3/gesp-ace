import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState as useReactState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, FileQuestion, Settings, Bell,
  Search, Filter, Plus, Edit, Trash2, Eye, MoreVertical, 
  ChevronDown, CheckCircle2, XCircle, LogOut, ChevronRight
} from 'lucide-react';

const sidebarMenu = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/admin/dashboard' },
  { icon: FileQuestion, label: '题库管理', path: '/admin/questions' },
  { icon: Users, label: '用户管理', path: '/admin/users' },
  { icon: BookOpen, label: '知识手册', path: '/admin/handbook' },
  { icon: Bell, label: '每日一题', path: '/admin/daily' },
  { icon: Settings, label: '系统设置', path: '/admin/settings' },
];

export const QuestionManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const questions = [
    { 
      id: 'q001', 
      content: '在C++中，以下哪个是合法的变量名？', 
      type: 'choice', 
      level: 1, 
      difficulty: 1,
      knowledgePoint: '变量定义',
      accuracy: 0.85,
      usedCount: 234,
      status: 'active'
    },
    { 
      id: 'q002', 
      content: 'C++中，所有语句都必须以分号结束。', 
      type: 'judgment', 
      level: 1, 
      difficulty: 1,
      knowledgePoint: '语法基础',
      accuracy: 0.92,
      usedCount: 189,
      status: 'active'
    },
    { 
      id: 'q003', 
      content: '请编写一个程序，输出 Hello World', 
      type: 'coding', 
      level: 1, 
      difficulty: 2,
      knowledgePoint: '输入输出',
      accuracy: 0.68,
      usedCount: 156,
      status: 'active'
    },
    { 
      id: 'q004', 
      content: '下列哪个选项不是C++的关键字？', 
      type: 'choice', 
      level: 1, 
      difficulty: 1,
      knowledgePoint: '关键字',
      accuracy: 0.45,
      usedCount: 98,
      status: 'active'
    },
  ];

  const typeLabels: Record<string, { label: string; color: string }> = {
    choice: { label: '单选题', color: 'bg-blue-500/10 text-blue-600' },
    judgment: { label: '判断题', color: 'bg-green-500/10 text-green-600' },
    coding: { label: '编程题', color: 'bg-purple-500/10 text-purple-600' },
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
              <p className="text-gray-500 text-sm">共 2,567 道题目</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                添加题目
              </button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap gap-4">
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
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">全部等级</option>
                <option value="1">一级</option>
                <option value="2">二级</option>
                <option value="3">三级</option>
                <option value="4">四级</option>
              </select>

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
            </div>
          </div>

          {/* Questions Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">题目</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">类型</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">等级</th>
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
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeLabels[question.type].color}`}>
                        {typeLabels[question.type].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">Lv.{question.level}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
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
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
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
              显示 1-4 条，共 2,567 条
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
                上一页
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded-lg">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
              <span className="px-2">...</span>
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">257</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
                下一页
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
