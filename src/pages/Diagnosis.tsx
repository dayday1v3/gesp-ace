import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Target, TrendingUp, Award, Sparkles, ChevronRight, BookOpen, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const weakPoints = [
  { name: '循环结构', level: 2, accuracy: 0.35, questionCount: 45 },
  { name: '进制转换', level: 3, accuracy: 0.42, questionCount: 38 },
  { name: '函数参数传递', level: 4, accuracy: 0.28, questionCount: 22 },
  { name: '贪心算法', level: 5, accuracy: 0.15, questionCount: 12 },
];

const knowledgeRadarData = [
  { subject: '变量定义', A: 85, fullMark: 100 },
  { subject: '循环结构', A: 35, fullMark: 100 },
  { subject: '函数', A: 62, fullMark: 100 },
  { subject: '数组', A: 78, fullMark: 100 },
  { subject: '排序算法', A: 55, fullMark: 100 },
  { subject: '贪心算法', A: 15, fullMark: 100 },
];

const studyPaths = {
  shortTerm: [
    { title: '本周重点', items: ['循环结构强化练习', '进制转换专项突破', '函数参数传递理解'] },
  ],
  longTerm: [
    { title: '考前冲刺方案', items: ['前2周：薄弱知识点专项训练', '前1周：模拟考试实战演练', '考前3天：错题本全面复习'] },
  ],
};

const predictionData = {
  currentScore: 68,
  minScore: 58,
  maxScore: 82,
  trend: 'up',
};

const achievements = [
  { icon: '🎯', name: '初次练习', unlocked: true },
  { icon: '🔥', name: '坚持不懈', unlocked: true },
  { icon: '⭐', name: '一周达人', unlocked: true },
  { icon: '🌟', name: '月度坚持', unlocked: false },
  { icon: '🏆', name: '知识大师', unlocked: false },
];

const rankPercent = 45;

export const Diagnosis: React.FC = () => {
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
            <Brain className="w-7 h-7 text-primary" />
            AI 智能诊断
          </h1>
          <p className="text-text-secondary text-sm">
            基于你的学习数据，量身定制的提升方案
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-text-primary text-lg">薄弱知识点</h2>
                  <p className="text-xs text-text-muted">需要重点加强的领域</p>
                </div>
              </div>

              <div className="space-y-4">
                {weakPoints.map((point, index) => (
                  <motion.div
                    key={point.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-danger/5 rounded-2xl border border-danger/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💪</span>
                        <div>
                          <h3 className="font-bold text-text-primary">{point.name}</h3>
                          <p className="text-xs text-text-muted">Lv.{point.level} · {point.questionCount}道题</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-danger">{Math.round(point.accuracy * 100)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${point.accuracy * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-danger to-red-400 rounded-full"
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/practice')}
                        icon={<BookOpen className="w-4 h-4" />}
                        className="flex-1"
                      >
                        开始练习
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success to-green-400 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-text-primary text-lg">学习路径推荐</h2>
                  <p className="text-xs text-text-muted">AI 为你定制的学习计划</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-text-primary">短期计划（本周）</h3>
                  </div>
                  <div className="space-y-2">
                    {studyPaths.shortTerm[0].items.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="text-text-primary text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-warning" />
                    <h3 className="font-bold text-text-primary">长期规划（考前）</h3>
                  </div>
                  <div className="space-y-2">
                    {studyPaths.longTerm[0].items.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-warning/5 rounded-xl"
                      >
                        <span className="w-6 h-6 rounded-full bg-warning text-white text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="text-text-primary text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-info to-blue-400 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-text-primary text-lg">考前预测分</h2>
                  <p className="text-xs text-text-muted">基于历史数据的估算</p>
                </div>
              </div>

              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center mx-auto">
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                      <div>
                        <p className="text-5xl font-bold text-primary">{predictionData.currentScore}</p>
                        <p className="text-sm text-text-muted">预测分数</p>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 text-3xl"
                  >
                    🎯
                  </motion.div>
                </div>

                <div className="flex justify-center gap-8 mb-4">
                  <div>
                    <p className="text-sm text-text-muted">最低估计</p>
                    <p className="text-2xl font-bold text-text-secondary">{predictionData.minScore}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">最高估计</p>
                    <p className="text-2xl font-bold text-success">{predictionData.maxScore}</p>
                  </div>
                </div>

                <div className="p-4 bg-success/10 rounded-2xl">
                  <div className="flex items-center justify-center gap-2 text-success">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold">相比上周提升 8 分</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-2">继续保持，成绩还会继续提升！</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warning to-yellow-400 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-text-primary text-lg">全国排名</h2>
                  <p className="text-xs text-text-muted">击败全国考生比例</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-warning/20 to-yellow-200/20 flex items-center justify-center mx-auto">
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                      <div>
                        <p className="text-5xl font-bold text-warning">{rankPercent}%</p>
                        <p className="text-sm text-text-muted">超越考生</p>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 text-3xl"
                  >
                    🏆
                  </motion.div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-warning/5 rounded-xl">
                  <span className="text-text-secondary text-sm">青铜</span>
                  <span className="text-text-muted text-xs">0-20%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-xl border-2 border-warning">
                  <span className="text-text-secondary text-sm font-bold">白银</span>
                  <span className="text-warning text-xs font-bold">当前</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warning/5 rounded-xl">
                  <span className="text-text-secondary text-sm">黄金</span>
                  <span className="text-text-muted text-xs">20-50%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warning/5 rounded-xl">
                  <span className="text-text-secondary text-sm">钻石</span>
                  <span className="text-text-muted text-xs">50-80%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-warning/5 rounded-xl">
                  <span className="text-text-secondary text-sm">王者</span>
                  <span className="text-text-muted text-xs">80-100%</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h2 className="font-bold text-text-primary text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              学习建议
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💡</span>
                  <h3 className="font-bold text-text-primary">重点突破</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  循环结构和贪心算法是你的薄弱环节，建议每天花15分钟专项练习
                </p>
              </div>
              <div className="p-4 bg-success/5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⏰</span>
                  <h3 className="font-bold text-text-primary">时间管理</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  建议单次练习控制在25分钟内，保持注意力集中，提高学习效率
                </p>
              </div>
              <div className="p-4 bg-warning/5 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-bold text-text-primary">目标设定</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  距离下次考试还有45天，按计划学习，有望突破80分大关！
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};
