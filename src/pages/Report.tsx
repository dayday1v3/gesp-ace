import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, Target, BookOpen, Award, Clock, Flame, BarChart3, CheckCircle2, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type ReportType = 'week' | 'month';

const weeklyData = {
  totalQuestions: 87,
  correctRate: 0.72,
  practiceTime: 245,
  streakDays: 7,
  improvement: 8.5,
  topicsProgress: [
    { name: '循环结构', progress: 35, target: 80 },
    { name: '进制转换', progress: 42, target: 80 },
    { name: '函数参数', progress: 28, target: 80 },
    { name: '贪心算法', progress: 15, target: 80 },
  ],
  dailyActivity: [
    { day: '周一', questions: 12, rate: 0.75 },
    { day: '周二', questions: 15, rate: 0.68 },
    { day: '周三', questions: 10, rate: 0.80 },
    { day: '周四', questions: 18, rate: 0.65 },
    { day: '周五', questions: 14, rate: 0.72 },
    { day: '周六', questions: 10, rate: 0.78 },
    { day: '周日', questions: 8, rate: 0.85 },
  ],
  weakPoints: [
    { name: '循环嵌套', count: 12, trend: 'down' },
    { name: '进制转换', count: 8, trend: 'down' },
    { name: '贪心策略', count: 15, trend: 'stable' },
  ],
  strongPoints: [
    { name: '变量定义', count: 45, trend: 'up' },
    { name: '基本运算', count: 38, trend: 'up' },
    { name: '输入输出', count: 32, trend: 'up' },
  ],
};

const monthlyData = {
  totalQuestions: 356,
  correctRate: 0.68,
  practiceTime: 1050,
  streakDays: 28,
  improvement: 15.2,
  levelsCompleted: 1,
  achievements: ['first_practice', 'streak_3', 'streak_7', 'streak_14'],
  rankChange: '+12%',
};

export const Report: React.FC = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<ReportType>('week');

  const currentData = reportType === 'week' ? weeklyData : monthlyData;

  const stats = [
    {
      icon: BookOpen,
      label: '做题数量',
      value: reportType === 'week' ? '87' : '356',
      unit: '道',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Target,
      label: '正确率',
      value: reportType === 'week' ? '72' : '68',
      unit: '%',
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: Clock,
      label: '学习时长',
      value: reportType === 'week' ? '245' : '1050',
      unit: '分钟',
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      icon: Flame,
      label: '连续打卡',
      value: reportType === 'week' ? '7' : '28',
      unit: '天',
      color: 'text-danger',
      bg: 'bg-danger/10',
    },
  ];

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
            📊 学习报告
          </h1>
          <p className="text-text-secondary text-sm">
            记录你的每一步成长
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setReportType('week')}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
              reportType === 'week'
                ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            📅 周报
          </button>
          <button
            onClick={() => setReportType('month')}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all ${
              reportType === 'month'
                ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            📆 月报
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center p-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-text-primary">
                  {stat.value}
                  <span className="text-sm text-text-muted ml-1">{stat.unit}</span>
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-success/10 to-green-200/10 rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎉</span>
              <div>
                <h3 className="font-bold text-text-primary">
                  {reportType === 'week' ? '本周提升' : '本月提升'}
                </h3>
                <p className="text-sm text-text-secondary">
                  相比{reportType === 'week' ? '上周' : '上月'}正确率提升
                </p>
              </div>
            </div>
            <div className="text-3xl font-bold text-success">
              +{reportType === 'week' ? weeklyData.improvement : monthlyData.improvement}%
            </div>
          </div>
        </div>

        {reportType === 'week' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <h2 className="font-bold text-text-primary text-lg">每日练习情况</h2>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyData.dailyActivity.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="text-center"
                    >
                      <p className="text-xs text-text-muted mb-2">{day.day}</p>
                      <div className="h-24 bg-gray-100 rounded-lg relative overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${day.rate * 100}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.05 }}
                          className={`absolute bottom-0 w-full rounded-lg ${
                            day.rate >= 0.8 ? 'bg-success' :
                            day.rate >= 0.6 ? 'bg-warning' : 'bg-danger'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-text-secondary mt-2">{day.questions}题</p>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-success" />
                    <span className="text-xs text-text-muted">80%+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-warning" />
                    <span className="text-xs text-text-muted">60-80%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-danger" />
                    <span className="text-xs text-text-muted">&lt;60%</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-danger" />
                  <h2 className="font-bold text-text-primary text-lg">薄弱知识点进度</h2>
                </div>
                <div className="space-y-4">
                  {weeklyData.topicsProgress.map((topic, index) => {
                    const gap = topic.target - topic.progress;
                    return (
                      <motion.div
                        key={topic.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-text-primary font-medium">{topic.name}</span>
                          <span className="text-sm text-text-secondary">
                            {topic.progress}% → {topic.target}%
                            <span className="text-danger ml-2">(-{gap}%)</span>
                          </span>
                        </div>
                        <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${topic.progress}%` }}
                            transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                            className="h-full bg-gradient-to-r from-danger to-red-400 rounded-full"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-success" />
                    <h2 className="font-bold text-text-primary text-lg">进步知识点</h2>
                  </div>
                  <div className="space-y-3">
                    {weeklyData.strongPoints.map((point, index) => (
                      <motion.div
                        key={point.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-success/5 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          <span className="text-text-primary">{point.name}</span>
                        </div>
                        <span className="text-success font-bold">+{point.count}题</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-danger" />
                    <h2 className="font-bold text-text-primary text-lg">仍需加强</h2>
                  </div>
                  <div className="space-y-3">
                    {weeklyData.weakPoints.map((point, index) => (
                      <motion.div
                        key={point.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-danger/5 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-danger font-bold">{point.count}题</span>
                          <span className="text-text-primary">{point.name}</span>
                        </div>
                        <span className={`text-sm ${
                          point.trend === 'down' ? 'text-success' : 'text-text-muted'
                        }`}>
                          {point.trend === 'down' ? '↓ 减少' : '→ 持平'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </>
        )}

        {reportType === 'month' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h2 className="font-bold text-text-primary text-lg mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-warning" />
                本月成就
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '🎯', name: '初次练习', desc: '完成第一道题', unlocked: true },
                  { icon: '🔥', name: '坚持不懈', desc: '连续打卡3天', unlocked: true },
                  { icon: '⭐', name: '一周达人', desc: '连续打卡7天', unlocked: true },
                  { icon: '🌟', name: '月度坚持', desc: '连续打卡30天', unlocked: true },
                  { icon: '📚', name: '题海战士', desc: '完成300题', unlocked: true },
                  { icon: '🎓', name: '一级通关', desc: '通过一级考试', unlocked: false },
                  { icon: '🏆', name: '全国前20%', desc: '排名达标', unlocked: false },
                  { icon: '💎', name: '钻石会员', desc: '完成全部成就', unlocked: false },
                ].map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className={`p-4 rounded-2xl text-center transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-warning/20 to-yellow-200/20 border-2 border-warning/30'
                        : 'bg-gray-100 opacity-60'
                    }`}
                  >
                    <div className={`text-4xl mb-2 ${!achievement.unlocked && 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <p className={`text-sm font-medium ${
                      achievement.unlocked ? 'text-text-primary' : 'text-text-muted'
                    }`}>
                      {achievement.name}
                    </p>
                    <p className="text-xs text-text-muted">{achievement.desc}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-primary-light/10">
            <div className="flex items-start gap-4">
              <span className="text-5xl">💡</span>
              <div className="flex-1">
                <h3 className="font-bold text-text-primary mb-2">
                  下一步建议
                </h3>
                <ul className="text-sm text-text-secondary space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    继续加强循环结构练习，这是出错最多的知识点
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    建议每天保持30分钟的刷题习惯，不要间断
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    可以开始尝试做一些简单的编程题，锻炼代码能力
                  </li>
                </ul>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate('/practice')}
                  icon={<BookOpen className="w-4 h-4" />}
                >
                  开始练习
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};
