import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LevelStatus } from '@/stores/userStore';

interface LevelCardProps {
  level: number;
  name: string;
  progress: number;
  status: LevelStatus;
  onClick?: () => void;
  index?: number;
}

const statusConfig = {
  mastered: {
    bg: 'bg-gradient-to-br from-success to-green-400',
    icon: '⭐',
    label: '已掌握',
  },
  in_progress: {
    bg: 'bg-gradient-to-br from-warning to-yellow-300',
    icon: '📚',
    label: '进行中',
  },
  weak: {
    bg: 'bg-gradient-to-br from-danger to-red-400',
    icon: '💪',
    label: '待加强',
  },
  locked: {
    bg: 'bg-gradient-to-br from-gray-300 to-gray-400',
    icon: '🔒',
    label: '需解锁',
  },
};

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  name,
  progress,
  status,
  onClick,
  index = 0,
}) => {
  const config = statusConfig[status];
  const isLocked = status === 'locked';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        'relative p-6 rounded-3xl cursor-pointer transition-all duration-300',
        config.bg,
        isLocked && 'cursor-not-allowed opacity-80'
      )}
    >
      {status === 'mastered' && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="absolute -top-2 -right-2 text-3xl"
        >
          ✨
        </motion.div>
      )}

      <div className="text-5xl font-bold text-white/90 mb-2">
        Lv.{level}
      </div>

      <div className="text-white font-medium mb-4 text-sm">
        {name}
      </div>

      {!isLocked ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-white/90 text-xs">
            <span className="flex items-center gap-1">
              <span className="text-lg">{config.icon}</span>
              {config.label}
            </span>
            <span className="font-bold">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <span className="text-xl">{config.icon}</span>
          <span>{config.label}</span>
        </div>
      )}
    </motion.div>
  );
};
