import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, ChevronLeft, ChevronRight, Flame, Gift, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';

interface DailyQuestion {
  id: string;
  type: 'choice' | 'judge' | 'program';
  subject: string;
  content: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

const dailyQuestions: DailyQuestion[] = [
  {
    id: 'D1',
    type: 'choice',
    subject: '选择题',
    content: '在C++中，以下哪个是合法的变量名？',
    options: ['2name', 'my-name', 'my_name', 'class'],
    correctAnswer: 2,
    explanation: '变量名必须以字母或下划线开头，不能以数字开头，不能使用关键字（如class）。my_name符合命名规则。',
  },
  {
    id: 'D2',
    type: 'judge',
    subject: '判断题',
    content: '在C++中，endl可以用来换行。',
    correctAnswer: 'true',
    explanation: 'endl是C++中的换行符，它不仅会换行，还会刷新输出缓冲区。相当于\n加上flush。',
  },
  {
    id: 'D3',
    type: 'choice',
    subject: '选择题',
    content: '执行 cout << 5/2; 会输出什么？',
    options: ['2.5', '2', '2.500000', '5/2'],
    correctAnswer: 1,
    explanation: '5和2都是整数，整数除法会截断小数部分，所以结果是2。要得到2.5，需要使用5.0/2或5.0/2.0。',
  },
];

export const DailyPractice: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(string | number | null)[]>([null, null, null]);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(7);

  const currentQuestion = dailyQuestions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < dailyQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(answers[currentIndex - 1]);
      setShowResult(answers[currentIndex - 1] !== null);
    }
  };

  const completedCount = answers.filter(a => a !== null).length;
  const correctCount = dailyQuestions.reduce((count, q, idx) => {
    return answers[idx] === q.correctAnswer ? count + 1 : count;
  }, 0);

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center"
            >
              <span className="text-6xl">🎉</span>
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              今日练习完成！
            </h2>
            <p className="text-gray-600 mb-8">
              连续打卡 <span className="text-orange-600 font-bold">{streak + 1}</span> 天
            </p>

            <Card className="mb-6">
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{correctCount}/3</div>
                    <div className="text-sm text-gray-500">正确题数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">+{correctCount * 10}</div>
                    <div className="text-sm text-gray-500">获得积分</div>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Flame className="w-6 h-6 text-orange-600" />
                    <span className="text-lg font-bold text-orange-700">连续 {streak + 1} 天</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    继续保持！坚持就是胜利 💪
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-6 h-6 text-amber-600" />
                    <span className="text-lg font-bold text-amber-700">今日奖励</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {correctCount === 3 ? '全部正确！获得额外奖励 x2' : '继续努力，明天全对可获得额外奖励！'}
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/')}
              >
                返回首页
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/practice')}
              >
                <Star className="w-4 h-4 mr-2" />
                更多练习
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">每日一练</h1>
              <p className="text-sm text-gray-500 mt-1">
                今日任务：{completedCount}/3 已完成
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  连续 {streak} 天
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            {dailyQuestions.map((q, idx) => (
              <div
                key={q.id}
                className={`flex-1 h-2 rounded-full transition-all ${
                  answers[idx] !== null
                    ? answers[idx] === q.correctAnswer
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : idx === currentIndex
                    ? 'bg-orange-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    <span className="font-medium">{currentQuestion.subject}</span>
                  </div>
                  <span className="text-sm">
                    第 {currentIndex + 1} / {dailyQuestions.length} 题
                  </span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-lg text-gray-900 mb-6 leading-relaxed">
                  {currentQuestion.content}
                </p>

                {currentQuestion.type === 'choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => !showResult && setSelectedAnswer(idx)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          showResult
                            ? idx === currentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : selectedAnswer === idx
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-gray-50'
                            : selectedAnswer === idx
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            showResult
                              ? idx === currentQuestion.correctAnswer
                                ? 'bg-green-500 text-white'
                                : selectedAnswer === idx
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200'
                              : selectedAnswer === idx
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showResult && idx === currentQuestion.correctAnswer && (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'judge' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => !showResult && setSelectedAnswer('true')}
                      disabled={showResult}
                      className={`p-8 rounded-xl border-2 text-center transition-all ${
                        showResult
                          ? currentQuestion.correctAnswer === 'true'
                            ? 'border-green-500 bg-green-50'
                            : selectedAnswer === 'true'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                          : selectedAnswer === 'true'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-5xl mb-2">✓</div>
                      <div className="font-medium">正确</div>
                    </button>
                    <button
                      onClick={() => !showResult && setSelectedAnswer('false')}
                      disabled={showResult}
                      className={`p-8 rounded-xl border-2 text-center transition-all ${
                        showResult
                          ? currentQuestion.correctAnswer === 'false'
                            ? 'border-green-500 bg-green-50'
                            : selectedAnswer === 'false'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                          : selectedAnswer === 'false'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-5xl mb-2">✗</div>
                      <div className="font-medium">错误</div>
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-6 p-4 rounded-xl ${
                        isCorrect ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className={`font-medium mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {isCorrect ? '回答正确！🎉' : '回答错误'}
                          </p>
                          {!isCorrect && (
                            <div className="mb-3 p-3 bg-white/60 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">正确答案：</p>
                              <p className="font-medium text-green-700">
                                {currentQuestion.type === 'choice'
                                  ? currentQuestion.options?.[currentQuestion.correctAnswer as number]
                                  : currentQuestion.correctAnswer === 'true' ? '正确' : '错误'}
                              </p>
                            </div>
                          )}
                          <div className="p-3 bg-white/60 rounded-lg">
                            <p className="text-sm font-medium text-gray-800 mb-1">💡 解析</p>
                            <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一题
          </Button>

          {!showResult ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
            >
              提交答案
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
            >
              {currentIndex === dailyQuestions.length - 1 ? '完成练习' : '下一题'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};
