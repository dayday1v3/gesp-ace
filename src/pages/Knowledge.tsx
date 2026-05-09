import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Topic {
  id: string;
  name: string;
  count: number;
  mastered: boolean;
  progress: number;
}

interface Level {
  level: number;
  name: string;
  topics: Topic[];
}

const knowledgeData: Level[] = [
  {
    level: 1,
    name: '一级·编程入门',
    topics: [
      { id: 'L1-T1', name: '计算机基础与编程环境', count: 50, mastered: true, progress: 85 },
      { id: 'L1-T2', name: '变量定义与使用', count: 80, mastered: true, progress: 92 },
      { id: 'L1-T3', name: '基本数据类型', count: 50, mastered: false, progress: 65 },
      { id: 'L1-T4', name: '控制语句结构', count: 150, mastered: false, progress: 45 },
      { id: 'L1-T5', name: '基本运算', count: 105, mastered: false, progress: 70 },
      { id: 'L1-T6', name: '输入输出语句', count: 70, mastered: true, progress: 88 },
    ],
  },
  {
    level: 2,
    name: '二级·程序基础设计',
    topics: [
      { id: 'L2-T1', name: '计算机的存储与网络', count: 40, mastered: false, progress: 30 },
      { id: 'L2-T2', name: '程序设计语言的特点', count: 30, mastered: false, progress: 25 },
      { id: 'L2-T3', name: '流程图的概念与描述', count: 50, mastered: false, progress: 15 },
      { id: 'L2-T4', name: 'ASCII编码', count: 45, mastered: false, progress: 40 },
      { id: 'L2-T5', name: '数据类型的转换', count: 55, mastered: false, progress: 20 },
      { id: 'L2-T6', name: '多层分支/循环结构', count: 80, mastered: false, progress: 10 },
    ],
  },
  {
    level: 3,
    name: '三级·数据编码+基础算法',
    topics: [
      { id: 'L3-T1', name: '数据编码', count: 100, mastered: false, progress: 0 },
      { id: 'L3-T2', name: '进制转换', count: 185, mastered: false, progress: 0 },
      { id: 'L3-T3', name: '位运算', count: 210, mastered: false, progress: 0 },
      { id: 'L3-T4', name: '一维数组基本应用', count: 80, mastered: false, progress: 0 },
    ],
  },
];

const getProgressColor = (progress: number) => {
  if (progress >= 80) return { bg: 'bg-success', text: 'text-success', label: '掌握' };
  if (progress >= 40) return { bg: 'bg-warning', text: 'text-yellow-600', label: '学习中' };
  if (progress > 0) return { bg: 'bg-danger', text: 'text-danger', label: '薄弱' };
  return { bg: 'bg-gray-300', text: 'text-gray-400', label: '未开始' };
};

export const Knowledge: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            返回
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            知识点地图
          </h1>
          <p className="text-text-secondary text-sm">
            了解自己的知识掌握情况，查漏补缺！
          </p>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-3">
          {[
            { label: '已掌握', count: 3, color: 'bg-success' },
            { label: '学习中', count: 3, color: 'bg-warning' },
            { label: '薄弱', count: 6, color: 'bg-danger' },
            { label: '未开始', count: 8, color: 'bg-gray-300' },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 text-center shadow-sm"
            >
              <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-2`} />
              <p className="text-2xl font-bold text-text-primary">{item.count}</p>
              <p className="text-xs text-text-muted">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          {knowledgeData.map((level, levelIndex) => {
            const masteredCount = level.topics.filter((t) => t.progress >= 80).length;
            const levelProgress = (masteredCount / level.topics.length) * 100;

            return (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: levelIndex * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">📁</span>
                        <div>
                          <h3 className="font-bold text-text-primary">
                            {level.name}
                          </h3>
                          <p className="text-xs text-text-secondary">
                            {masteredCount}/{level.topics.length} 知识点已掌握
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        {Math.round(levelProgress)}%
                      </span>
                    </div>
                    <div className="bg-white/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        transition={{ duration: 1, delay: levelIndex * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {level.topics.map((topic) => {
                      const progressInfo = getProgressColor(topic.progress);

                      return (
                        <motion.div
                          key={topic.id}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {topic.progress >= 80 ? (
                              <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                            )}
                            <div>
                              <p className="text-text-primary group-hover:text-primary transition-colors font-medium">
                                {topic.name}
                              </p>
                              <p className="text-xs text-text-muted">
                                {topic.count} 道题
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${progressInfo.bg} bg-opacity-20 ${progressInfo.text}`}
                            >
                              {progressInfo.label}
                            </span>
                            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
