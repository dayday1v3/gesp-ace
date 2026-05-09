import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface DailyPracticeBannerProps {
  streakDays: number;
  completedToday: boolean;
  remainingQuestions: number;
}

export const DailyPracticeBanner: React.FC<DailyPracticeBannerProps> = ({
  streakDays,
  completedToday,
  remainingQuestions,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-light rounded-3xl p-6 text-white"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Star className="w-6 h-6" />
          </motion.div>
          <span className="text-sm font-medium opacity-90">每日一练</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
            第 {streakDays} 天打卡
          </span>
        </div>

        {completedToday ? (
          <div className="space-y-3">
            <p className="text-lg font-bold">🎉 今日任务已完成！</p>
            <p className="text-sm opacity-80">明天再来打卡吧，继续保持哦~</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-lg font-bold">
              今天还有 {remainingQuestions} 题未完成
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/daily')}
              className="bg-white text-primary hover:bg-white/90 border-0"
            >
              开始答题
            </Button>
          </div>
        )}
      </div>

      {streakDays >= 7 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="absolute top-2 right-2 text-2xl"
        >
          🔥
        </motion.div>
      )}
    </motion.div>
  );
};
