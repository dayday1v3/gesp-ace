import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Target, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TimedQuestion {
  id: string;
  content: string;
  options?: string[];
  correctAnswer: string;
  timeLimit: number;
}

const timedQuestions: TimedQuestion[] = [
  {
    id: 't1',
    content: '在C++中，以下哪个是合法的变量名？',
    options: ['2name', '_name', 'my-name', 'class'],
    correctAnswer: '_name',
    timeLimit: 30,
  },
  {
    id: 't2',
    content: 'C++中，所有语句都必须以分号结束。',
    correctAnswer: 'true',
    timeLimit: 20,
  },
  {
    id: 't3',
    content: '下面哪个是C++的关键字？',
    options: ['Name', 'name', 'cout', 'cout2'],
    correctAnswer: 'cout',
    timeLimit: 30,
  },
];

type TimerMode = 'countdown' | 'stopwatch';

export const TimedPractice: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('countdown');
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(timedQuestions.length);
  const [completedCount, setCompletedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = timedQuestions[currentIndex];

  useEffect(() => {
    if (isActive && mode === 'countdown' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, mode, timeLeft]);

  const handleTimeUp = () => {
    if (!showResult) {
      setShowResult(true);
      setWrongCount((prev) => prev + 1);
      setCompletedCount((prev) => prev + 1);
      
      if (currentIndex < totalQuestions - 1) {
        setTimeout(() => {
          goToNext();
        }, 1500);
      } else {
        setTimeout(() => {
          setIsFinished(true);
        }, 1500);
      }
    }
  };

  const startTimer = () => {
    setIsActive(true);
    setTimeLeft(currentQuestion?.timeLimit || 30);
  };

  const pauseTimer = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(currentQuestion?.timeLimit || 30);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompletedCount(0);
    setWrongCount(0);
    setIsFinished(false);
  };

  const handleSelectAnswer = (answer: string) => {
    if (showResult || !isActive) return;
    
    pauseTimer();
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / currentQuestion.timeLimit * 10);
      setScore((prev) => prev + 10 + timeBonus);
    } else {
      setWrongCount((prev) => prev + 1);
    }

    setCompletedCount((prev) => prev + 1);

    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        goToNext();
      }, 1500);
    } else {
      setTimeout(() => {
        setIsFinished(true);
      }, 1500);
    }
  };

  const goToNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(timedQuestions[currentIndex + 1]?.timeLimit || 30);
      setIsActive(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              练习完成！
            </h1>
            <p className="text-text-secondary mb-8">
              你在限时挑战中表现不错，继续加油！
            </p>

            <Card className="text-left mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-xl">
                  <p className="text-3xl font-bold text-success">{score}</p>
                  <p className="text-sm text-text-muted">获得积分</p>
                </div>
                <div className="text-center p-4 bg-danger/10 rounded-xl">
                  <p className="text-3xl font-bold text-danger">{wrongCount}</p>
                  <p className="text-sm text-text-muted">答错题数</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={resetTimer}
                icon={<RotateCcw className="w-5 h-5" />}
              >
                再来一次
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/practice')}
              >
                返回练习
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            返回
          </Button>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2 flex items-center justify-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            计时挑战
          </h1>
          <p className="text-text-secondary text-sm">
            每道题都有时间限制，考验你的速度和准确率！
          </p>
        </div>

        {!isActive && !selectedAnswer ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center">
              <div className="text-6xl mb-4">⏱️</div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                第 {currentIndex + 1} 题
              </h2>
              <p className="text-text-secondary mb-6">
                时间限制：{currentQuestion?.timeLimit}秒
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={startTimer}
                icon={<Play className="w-5 h-5" />}
                className="px-8"
              >
                开始计时
              </Button>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
                <span>进度</span>
                <span>{currentIndex + 1}/{totalQuestions}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-primary-light"
                />
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className={`w-6 h-6 ${timeLeft <= 10 ? 'text-danger' : 'text-primary'}`} />
                <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-danger' : 'text-text-primary'}`}>
                  {timeLeft}
                </span>
                <span className="text-text-muted">秒</span>
              </div>

              <div className="flex gap-2">
                {isActive ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={pauseTimer}
                    icon={<Pause className="w-4 h-4" />}
                  >
                    暂停
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startTimer}
                    icon={<Play className="w-4 h-4" />}
                  >
                    继续
                  </Button>
                )}
              </div>
            </div>

            {timeLeft <= 10 && !showResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 bg-danger/10 rounded-xl border-2 border-danger"
              >
                <div className="flex items-center gap-2 text-danger">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-bold">时间不多了！</span>
                </div>
              </motion.div>
            )}

            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-card overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary to-primary-light p-4">
                <div className="flex items-center justify-between text-white/90 text-sm">
                  <span>第 {currentIndex + 1} 题</span>
                  <span>限时 {currentQuestion.timeLimit} 秒</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-lg text-text-primary leading-relaxed">
                  {currentQuestion.content}
                </p>

                {currentQuestion.options ? (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                      const optionLetter = String.fromCharCode(65 + idx);
                      const isSelected = selectedAnswer === option;
                      const isCorrect = option === currentQuestion.correctAnswer;

                      return (
                        <motion.button
                          key={option}
                          whileHover={!showResult ? { scale: 1.01 } : {}}
                          whileTap={!showResult ? { scale: 0.99 } : {}}
                          onClick={() => handleSelectAnswer(option)}
                          disabled={showResult}
                          className={`w-full p-4 rounded-2xl text-left transition-all border-2 flex items-center gap-4 ${
                            !showResult && 'hover:border-primary hover:bg-primary/5'
                          } ${
                            showResult && isSelected && isCorrect && 'border-success bg-success/10'
                          } ${
                            showResult && isSelected && !isCorrect && 'border-danger bg-danger/10'
                          } ${
                            showResult && !isSelected && isCorrect && 'border-success bg-success/5'
                          } ${
                            showResult && !isSelected && !isCorrect && 'border-gray-200 opacity-60'
                          }`}
                        >
                          <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            !showResult && 'bg-primary/10 text-primary'
                          } ${
                            showResult && isSelected && isCorrect && 'bg-success text-white'
                          } ${
                            showResult && isSelected && !isCorrect && 'bg-danger text-white'
                          } ${
                            showResult && !isSelected && (isCorrect || !isCorrect) && 'bg-gray-200 text-gray-500'
                          }`}>
                            {showResult && (isSelected || isCorrect) && (isCorrect ? '✓' : '✗')}
                            {!showResult && optionLetter}
                          </span>
                          <span className="flex-1 text-text-primary">{option}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {['正确', '错误'].map((option) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrect = currentQuestion.correctAnswer === option;

                      return (
                        <motion.button
                          key={option}
                          whileHover={!showResult ? { scale: 1.02 } : {}}
                          whileTap={!showResult ? { scale: 0.98 } : {}}
                          onClick={() => handleSelectAnswer(option)}
                          disabled={showResult}
                          className={`p-6 rounded-2xl text-lg font-medium transition-all border-2 ${
                            !showResult && 'border-primary bg-primary/5 hover:bg-primary/10'
                          } ${
                            showResult && isSelected && isCorrect && 'border-success bg-success/10 text-success'
                          } ${
                            showResult && isSelected && !isCorrect && 'border-danger bg-danger/10 text-danger'
                          } ${
                            showResult && !isSelected && isCorrect && 'border-success bg-success/5 text-success'
                          } ${
                            showResult && !isSelected && !isCorrect && 'border-gray-200 opacity-60'
                          }`}
                        >
                          {option}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}

        <div className="mt-6">
          <Button
            variant="ghost"
            className="w-full"
            onClick={resetTimer}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            重置练习
          </Button>
        </div>
      </main>
    </div>
  );
};
