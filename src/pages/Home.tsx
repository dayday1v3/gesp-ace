import { motion } from 'framer-motion';
import { Calendar, BookOpen, FileWarning } from 'lucide-react';
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
      icon: BookOpen,
      label: '知识点地图',
      description: '查看知识掌握度',
      color: 'text-primary',
      bg: 'bg-primary/10',
      path: '/knowledge',
    },
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

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
