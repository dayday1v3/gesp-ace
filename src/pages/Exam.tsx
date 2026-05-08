import { motion } from 'framer-motion';
import { ArrowLeft, Clock, FileQuestion, Trophy, Play, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ExamLevel {
  level: number;
  name: string;
  duration: string;
  questions: string;
  difficulty: '简单' | '中等' | '困难';
  completed: boolean;
  bestScore?: number;
}

const examLevels: ExamLevel[] = [
  {
    level: 1,
    name: '一级·编程入门',
    duration: '120分钟',
    questions: '15选择 + 10判断 + 2编程',
    difficulty: '简单',
    completed: true,
    bestScore: 92,
  },
  {
    level: 2,
    name: '二级·程序基础设计',
    duration: '120分钟',
    questions: '15选择 + 10判断 + 2编程',
    difficulty: '简单',
    completed: false,
  },
  {
    level: 3,
    name: '三级·数据编码+基础算法',
    duration: '120分钟',
    questions: '15选择 + 10判断 + 2编程',
    difficulty: '中等',
    completed: false,
  },
  {
    level: 4,
    name: '四级·函数+排序+文件',
    duration: '120分钟',
    questions: '15选择 + 10判断 + 2编程',
    difficulty: '中等',
    completed: false,
  },
];

const difficultyColors = {
  简单: 'bg-success/10 text-success',
  中等: 'bg-warning/10 text-yellow-600',
  困难: 'bg-danger/10 text-danger',
};

export const Exam: React.FC = () => {
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
            <Trophy className="w-6 h-6 text-primary" />
            模拟考试
          </h1>
          <p className="text-text-secondary text-sm">
            全真模拟，熟悉考试流程！
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">📋</div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-text-primary mb-2">
                考试说明
              </h2>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• 考试时长：1-4级120分钟，5-8级180分钟</li>
                <li>• 题型分布：15道选择题 + 10道判断题 + 2道编程题</li>
                <li>• 编程题有部分分机制，每个测试点单独计分</li>
                <li>• 请认真作答，系统会自动评分</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {examLevels.map((exam, index) => (
            <motion.div
              key={exam.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-card transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-2xl font-bold">
                        Lv{exam.level}
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary text-lg">
                          {exam.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[exam.difficulty]}`}
                          >
                            {exam.difficulty}
                          </span>
                          {exam.completed && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                              已完成
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {exam.bestScore && (
                      <div className="text-right">
                        <p className="text-xs text-text-muted">最高分</p>
                        <p className="text-2xl font-bold text-success">
                          {exam.bestScore}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock className="w-4 h-4" />
                      <span>考试时长：{exam.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <FileQuestion className="w-4 h-4" />
                      <span>{exam.questions}</span>
                    </div>
                  </div>

                  <Button
                    variant={exam.completed ? 'secondary' : 'primary'}
                    className="w-full"
                    icon={
                      exam.completed ? (
                        <Play className="w-5 h-5" />
                      ) : (
                        <Crown className="w-5 h-5" />
                      )
                    }
                    onClick={() => {
                      alert(
                        exam.completed
                          ? '重新开始 ' + exam.name + ' 考试'
                          : '开始 ' + exam.name + ' 考试'
                      );
                    }}
                  >
                    {exam.completed ? '重新考试' : '开始考试'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 bg-warning/10 rounded-3xl"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">💡</span>
            <div>
              <h3 className="font-bold text-text-primary mb-2">考试小贴士</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>1. 编程题先理清思路再动手写代码</li>
                <li>2. 注意控制程序的时间复杂度和空间复杂度</li>
                <li>3. 提交前可以用小数据测试程序正确性</li>
                <li>4. 遇到难题可以先跳过，保证会做的题目得分</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
