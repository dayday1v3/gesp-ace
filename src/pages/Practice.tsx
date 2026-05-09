import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, ChevronRight, Filter } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/stores/userStore';

interface Topic {
  id: string;
  name: string;
  count: number;
  mastered: boolean;
}

interface Level {
  level: number;
  name: string;
  topics: Topic[];
}

const knowledgeTree: Level[] = [
  {
    level: 1,
    name: '一级·编程入门',
    topics: [
      { id: 'L1-T1', name: '计算机基础与编程环境', count: 50, mastered: true },
      { id: 'L1-T2', name: '变量定义与使用', count: 80, mastered: true },
      { id: 'L1-T3', name: '基本数据类型', count: 50, mastered: false },
      { id: 'L1-T4', name: '控制语句结构', count: 150, mastered: false },
      { id: 'L1-T5', name: '基本运算', count: 105, mastered: false },
      { id: 'L1-T6', name: '输入输出语句', count: 70, mastered: true },
    ],
  },
  {
    level: 2,
    name: '二级·程序基础设计',
    topics: [
      { id: 'L2-T1', name: '计算机的存储与网络', count: 40, mastered: false },
      { id: 'L2-T2', name: '程序设计语言的特点', count: 30, mastered: false },
      { id: 'L2-T3', name: '流程图的概念与描述', count: 50, mastered: false },
      { id: 'L2-T4', name: 'ASCII编码', count: 45, mastered: false },
      { id: 'L2-T5', name: '数据类型的转换', count: 55, mastered: false },
      { id: 'L2-T6', name: '多层分支/循环结构', count: 80, mastered: false },
    ],
  },
  {
    level: 3,
    name: '三级·数据编码+基础算法',
    topics: [
      { id: 'L3-T1', name: '数据编码', count: 100, mastered: false },
      { id: 'L3-T2', name: '进制转换', count: 185, mastered: false },
      { id: 'L3-T3', name: '位运算', count: 210, mastered: false },
      { id: 'L3-T4', name: '一维数组基本应用', count: 80, mastered: false },
    ],
  },
];

export const Practice: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { levelProgress } = useUserStore();

  const selectedLevel = params.level ? parseInt(params.level) : null;

  const getStatusColor = (mastered: boolean) => {
    return mastered ? 'text-success' : 'text-text-muted';
  };

  const getStatusIcon = (mastered: boolean) => {
    return mastered ? (
      <CheckCircle2 className="w-5 h-5" />
    ) : (
      <Circle className="w-5 h-5" />
    );
  };

  const filteredLevels = selectedLevel
    ? knowledgeTree.filter((l) => l.level === selectedLevel)
    : knowledgeTree;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">📚 刷题模式</h1>
          <p className="text-text-secondary text-sm">
            选择知识点，开始针对性练习！
          </p>
        </div>

        {!selectedLevel && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-secondary">快速选择等级</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((level) => {
                const progress = levelProgress[level];
                const isLocked = level > 1 && (levelProgress[level - 1]?.correctRate || 0) < 0.8;
                
                return (
                  <motion.button
                    key={level}
                    whileHover={!isLocked ? { scale: 1.05 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => !isLocked && navigate(`/practice/${level}`)}
                    disabled={isLocked}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isLocked
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : progress?.correctRate >= 0.8
                        ? 'bg-success/10 text-success hover:bg-success/20'
                        : progress?.correctRate >= 0.4
                        ? 'bg-warning/10 text-yellow-600 hover:bg-warning/20'
                        : 'bg-danger/10 text-danger hover:bg-danger/20'
                    }`}
                  >
                    Lv.{level}
                    {!isLocked && progress && (
                      <span className="ml-1 text-xs">
                        ({Math.round(progress.correctRate * 100)}%)
                      </span>
                    )}
                    {isLocked && <span className="ml-1">🔒</span>}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {selectedLevel && (
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/practice')}
            >
              ← 返回全部等级
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {filteredLevels.map((level, levelIndex) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: levelIndex * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📁</span>
                      <div>
                        <h3 className="font-bold text-text-primary">
                          {level.name}
                        </h3>
                        <p className="text-xs text-text-secondary">
                          {level.topics.length} 个知识点 ·{' '}
                          {level.topics.reduce((sum, t) => sum + t.count, 0)} 道题
                        </p>
                      </div>
                    </div>
                    {selectedLevel === level.level && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          navigate(`/practice/question/${level.level}/${level.topics[0].id}`);
                        }}
                      >
                        开始练习
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {level.topics.map((topic, topicIndex) => (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: levelIndex * 0.1 + topicIndex * 0.05 }}
                    >
                      <button
                        onClick={() => {
                          alert('开始练习: ' + topic.name);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className={getStatusColor(topic.mastered)}>
                            {getStatusIcon(topic.mastered)}
                          </span>
                          <span className="text-text-primary group-hover:text-primary transition-colors">
                            {topic.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-text-muted">
                            {topic.count}题
                          </span>
                          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};
