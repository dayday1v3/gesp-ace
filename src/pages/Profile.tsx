import { motion } from 'framer-motion';
import {
  User,
  Settings,
  Award,
  Calendar,
  TrendingUp,
  ChevronRight,
  Bell,
  Moon,
  LogOut,
  Crown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/stores/userStore';

const achievements = [
  { id: 'first', icon: '🎯', name: '初次练习', desc: '完成第一道题', unlocked: true },
  { id: 'streak3', icon: '🔥', name: '坚持不懈', desc: '连续打卡3天', unlocked: true },
  { id: 'streak7', icon: '⭐', name: '一周达人', desc: '连续打卡7天', unlocked: true },
  { id: 'streak30', icon: '🌟', name: '月度坚持', desc: '连续打卡30天', unlocked: false },
  { id: 'master', icon: '🏆', name: '知识大师', desc: '通过一级考试', unlocked: false },
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { username, streakDays, totalPracticeDays, achievements: userAchievements, totalScore, logout } =
    useUserStore();

  const stats = [
    { label: '连续打卡', value: `${streakDays}天`, icon: Calendar, color: 'text-warning' },
    { label: '学习天数', value: `${totalPracticeDays}天`, icon: TrendingUp, color: 'text-success' },
    { label: '总积分', value: `${totalScore}分`, icon: Award, color: 'text-primary' },
  ];

  const menuItems = [
    { icon: User, label: '个人信息', path: '/profile' },
    { icon: Bell, label: '通知设置', path: '/profile' },
    { icon: Moon, label: '深色模式', path: '/profile' },
    { icon: Settings, label: '账号设置', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary to-primary-light text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold"
              >
                {username.charAt(0)}
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{username}</h1>
                  {streakDays >= 7 && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-2xl"
                    >
                      🔥
                    </motion.span>
                  )}
                </div>
                <p className="text-white/80 text-sm">
                  温暖的代码伙伴 · 加油学习！
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-text-primary">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-warning" />
            我的成就
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {achievements.map((achievement, index) => {
              const isUnlocked = userAchievements.includes(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`p-4 rounded-2xl text-center transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-warning/20 to-yellow-200/20 border-2 border-warning/30'
                      : 'bg-gray-100 opacity-60'
                  }`}
                >
                  <motion.div
                    animate={
                      isUnlocked
                        ? {
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1],
                          }
                        : {}
                    }
                    transition={{
                      repeat: isUnlocked ? Infinity : 0,
                      duration: 2,
                    }}
                    className={`text-4xl mb-2 ${!isUnlocked && 'grayscale'}`}
                  >
                    {achievement.icon}
                  </motion.div>
                  <p
                    className={`text-sm font-medium ${
                      isUnlocked ? 'text-text-primary' : 'text-text-muted'
                    }`}
                  >
                    {achievement.name}
                  </p>
                  <p className="text-xs text-text-muted">{achievement.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-bold text-text-primary mb-4">设置</h2>
          <Card className="p-0 overflow-hidden">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-text-secondary" />
                  <span className="text-text-primary">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted" />
              </motion.button>
            ))}
          </Card>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Button
            variant="ghost"
            className="w-full text-danger hover:bg-danger/10"
            icon={<LogOut className="w-5 h-5" />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            退出登录
          </Button>
        </motion.div>
      </main>
    </div>
  );
};
