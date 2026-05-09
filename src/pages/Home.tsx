import { motion } from 'framer-motion';
import { Calendar, BookOpen, FileWarning, Brain, TrendingUp } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { LevelCard } from '@/components/common/LevelCard';
import { DailyPracticeBanner } from '@/components/common/DailyPracticeBanner';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/stores/userStore';
import { usePracticeStore } from '@/stores/practiceStore';
import { useNavigate } from 'react-router-dom';

const levelNames = [
  '编程入门',
  '程序基础设计',
  '数据编码+基础算法',
  '函数+排序+文件',
  '数论+链表+二分',
  '树+搜索+动态规划',
  '图论初步',
  '高级算法',
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { username, streakDays, levelProgress, examDate } = useUserStore();
  const { mistakes, todayCompleted, dailyQuestions } = usePracticeStore();

  const remainingQuestions = dailyQuestions.length > 0 
    ? Math.max(0, dailyQuestions.length - Object.keys(usePracticeStore.getState().dailyAnswers).length)
    : 3;

  const daysUntilExam = Math.ceil(
    (new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const quickActions = [
    {
      icon: Brain,
      label: 'AI智能诊断',
      description: '薄弱点分析+学习路径',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      path: '/diagnosis',
    },
    {
      icon: TrendingUp,
      label: '学习报告',
      description: '周报/月报+进步追踪',
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      path: '/report',
    },
    {
      icon: BookOpen,
      label: '知识点地图',
      description: '查看知识掌握度',
      color: 'text-primary',
      bg: 'bg-primary/10',
      path: '/knowledge',
    },
  ];

  const bottomActions = [
    {
      icon: FileWarning,
      label: '错题本',
      description: `${mistakes.length}题待复习`,
      color: 'text-danger',
      bg: 'bg-danger/10',
      path: '/mistakes',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-text-primary">
            👋 欢迎回来，{username}！
          </h1>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              距离下次GESP考试还有 <strong className="text-primary">{daysUntilExam}</strong> 天
            </span>
          </div>
        </motion.div>

        <DailyPracticeBanner
          streakDays={streakDays}
          completedToday={todayCompleted}
          remainingQuestions={remainingQuestions}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100"
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">🤖</div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-purple-700 mb-2">
                AI 智能诊断报告
              </h2>
              <p className="text-sm text-purple-600 mb-4">
                检测到 4 个薄弱知识点，制定了个性化学习路径
              </p>
              <div className="flex flex-wrap gap-2">
                {['循环结构', '进制转换', '函数参数传递', '贪心算法'].map((topic) => (
                  <span key={topic} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {topic}
                  </span>
                ))}
              </div>
              <button
                onClick={() => navigate('/diagnosis')}
                className="mt-4 text-purple-700 font-medium text-sm flex items-center gap-1 hover:underline"
              >
                查看详细诊断
                <span>→</span>
              </button>
            </div>
          </div>
        </motion.div>

        <section>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-text-primary mb-4"
          >
            📊 等级进度
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((level, index) => {
              const progress = levelProgress[level] || {
                correctRate: 0,
                practicedCount: 0,
                status: 'locked' as const,
              };
              
              let shouldUnlock = true;
              if (level > 1) {
                const prevProgress = levelProgress[level - 1];
                shouldUnlock = prevProgress?.correctRate >= 0.8;
              }

              return (
                <LevelCard
                  key={level}
                  level={level}
                  name={levelNames[level - 1]}
                  progress={progress.correctRate}
                  status={shouldUnlock ? progress.status : 'locked'}
                  index={index}
                  onClick={() => navigate(`/practice/${level}`)}
                />
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card
                hover
                onClick={() => navigate(action.path)}
                className="flex items-center gap-4"
              >
                <div className={`p-3 rounded-2xl ${action.bg}`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary">{action.label}</h3>
                  <p className="text-sm text-text-secondary">{action.description}</p>
                </div>
                <span className="text-2xl">→</span>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bottomActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card
                hover
                onClick={() => navigate(action.path)}
                className="flex items-center gap-4"
              >
                <div className={`p-3 rounded-2xl ${action.bg}`}>
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary">{action.label}</h3>
                  <p className="text-sm text-text-secondary">{action.description}</p>
                </div>
                <span className="text-2xl">→</span>
              </Card>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-3xl p-6"
        >
          <h3 className="font-bold text-lg text-text-primary mb-2">
            💡 学习小贴士
          </h3>
          <p className="text-text-secondary text-sm">
            每天坚持练习一点点，积少成多！建议先从薄弱知识点开始巩固，再逐步提升难度哦~
          </p>
        </motion.section>
      </main>

      <footer className="text-center py-6 text-text-muted text-sm">
        <p>© 2026 GESP Ace - 温暖的代码伙伴</p>
      </footer>
    </div>
  );
};
