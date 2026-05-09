import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowLeft, RotateCcw, Home, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';

export const PracticeResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { answers = [], questions = [] } = location.state || {};

  const correctCount = questions.reduce((count, q, idx) => {
    return answers[idx] === q.correctAnswer ? count + 1 : count;
  }, 0);

  const totalQuestions = questions.length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const score = correctCount * 10;

  const getGrade = (accuracy: number) => {
    if (accuracy >= 90) return { grade: 'S', color: 'from-purple-500 to-pink-500', text: '完美！' };
    if (accuracy >= 80) return { grade: 'A', color: 'from-green-500 to-emerald-500', text: '优秀！' };
    if (accuracy >= 70) return { grade: 'B', color: 'from-blue-500 to-cyan-500', text: '良好！' };
    if (accuracy >= 60) return { grade: 'C', color: 'from-yellow-500 to-orange-500', text: '及格' };
    return { grade: 'D', color: 'from-red-500 to-rose-500', text: '需努力' };
  };

  const gradeInfo = getGrade(accuracy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden">
            <div className={`bg-gradient-to-r ${gradeInfo.color} p-8 text-center`}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm mb-4"
              >
                <span className="text-6xl font-black text-white">{gradeInfo.grade}</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">{gradeInfo.text}</h2>
              <p className="text-white/80">继续保持，下次会更好！</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-1">{accuracy}%</div>
                  <div className="text-sm text-gray-500">正确率</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-1">{correctCount}/{totalQuestions}</div>
                  <div className="text-sm text-gray-500">正确题数</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">+{score}</div>
                  <div className="text-sm text-gray-500">获得积分</div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">答题详情</h3>
                {questions.map((q: any, idx: number) => {
                  const isCorrect = answers[idx] === q.correctAnswer;
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border-2 ${
                        isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              第 {idx + 1} 题 - {q.knowledge}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {q.content}
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {isCorrect ? '正确' : '错误'}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/practice')}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  再练一次
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/practice')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  返回练习
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => navigate('/')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  返回首页
                </Button>
              </div>
            </div>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex items-center justify-center gap-2 text-gray-500"
          >
            <Trophy className="w-5 h-5" />
            <span>恭喜获得 {score} 积分，继续加油！</span>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};
