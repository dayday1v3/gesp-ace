import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Clock, Trophy, Lightbulb, Bookmark, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';

interface Question {
  id: string;
  type: 'choice' | 'judge' | 'program';
  level: number;
  knowledge: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

const sampleQuestions: Question[] = [
  {
    id: 'Q001',
    type: 'choice',
    level: 1,
    knowledge: '变量定义与使用',
    difficulty: 'easy',
    content: '下列关于变量的定义，哪个是正确的？',
    options: ['int a = 5;', 'int a:5;', 'a = 5 int;', 'var a = 5;'],
    correctAnswer: 0,
    explanation: '在C++中，变量定义的标准格式是：数据类型 变量名 = 初始值; int a = 5; 符合这个格式。',
  },
  {
    id: 'Q002',
    type: 'judge',
    level: 1,
    knowledge: '基本数据类型',
    difficulty: 'easy',
    content: 'C++中的 int 类型一定占用4个字节。',
    correctAnswer: 'false',
    explanation: 'int 类型的大小取决于编译器和平台，通常是4个字节（32位系统），但在某些嵌入式系统中可能是2个字节。',
  },
  {
    id: 'Q003',
    type: 'choice',
    level: 1,
    knowledge: '输入输出语句',
    difficulty: 'medium',
    content: '如果想输出 "Hello World"，以下哪个代码是正确的？',
    options: ['print("Hello World");', 'cout << "Hello World";', 'printf "Hello World";', 'echo "Hello World";'],
    correctAnswer: 1,
    explanation: 'C++使用 cout 和流操作符 << 来输出内容，格式为：cout << 内容; 注意每条语句要以分号结束。',
  },
  {
    id: 'Q004',
    type: 'choice',
    level: 1,
    knowledge: '控制语句结构',
    difficulty: 'medium',
    content: '以下哪个关键字用于跳出当前循环？',
    options: ['break', 'continue', 'return', 'exit'],
    correctAnswer: 0,
    explanation: 'break 用于跳出当前循环（for、while、do-while），continue 用于跳过本次循环剩余语句进入下一次循环。',
  },
  {
    id: 'Q005',
    type: 'program',
    level: 1,
    knowledge: '基本运算',
    difficulty: 'hard',
    content: '编写一个程序，计算并输出 1+2+3+...+100 的结果。',
    correctAnswer: 5050,
    explanation: '这是一个等差数列求和问题，可以使用循环累加或数学公式：n*(n+1)/2 = 100*101/2 = 5050。',
  },
];

export const PracticeQuestion: React.FC = () => {
  const navigate = useNavigate();
  const { levelId, topicId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(string | number | null)[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = sampleQuestions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < sampleQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsBookmarked(false);
    } else {
      navigate('/practice/result', { state: { answers, questions: sampleQuestions } });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(answers[currentIndex - 1] || null);
      setShowResult(answers[currentIndex - 1] !== null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/practice')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回练习列表
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentQuestion.knowledge} - 练习
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                第 {currentIndex + 1} / {sampleQuestions.length} 题
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-full">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <Button
                variant={isBookmarked ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="flex gap-1 mb-6">
            {sampleQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setSelectedAnswer(answers[idx] || null);
                  setShowResult(answers[idx] !== null);
                }}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                  idx === currentIndex
                    ? 'bg-orange-500 text-white'
                    : answers[idx] !== null
                    ? 'bg-orange-200 text-orange-800'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
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
            <Card className="mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                      {currentQuestion.difficulty === 'easy' ? '简单' : currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                    <span className="px-2 py-1 bg-white/20 rounded text-xs text-white">
                      {currentQuestion.type === 'choice' ? '选择题' : currentQuestion.type === 'judge' ? '判断题' : '编程题'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-white text-sm">
                    <Trophy className="w-4 h-4" />
                    <span>+{currentQuestion.difficulty === 'easy' ? 10 : currentQuestion.difficulty === 'medium' ? 20 : 30} 积分</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {currentQuestion.content}
                  </p>
                </div>

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
                              ? 'border-green-500 bg-green-50 text-green-900'
                              : selectedAnswer === idx
                              ? 'border-red-500 bg-red-50 text-red-900'
                              : 'border-gray-200 bg-gray-50 text-gray-700'
                            : selectedAnswer === idx
                            ? 'border-orange-500 bg-orange-50 text-orange-900'
                            : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            showResult
                              ? idx === currentQuestion.correctAnswer
                                ? 'bg-green-500 text-white'
                                : selectedAnswer === idx
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                              : selectedAnswer === idx
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showResult && idx === currentQuestion.correctAnswer && (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          )}
                          {showResult && selectedAnswer === idx && idx !== currentQuestion.correctAnswer && (
                            <XCircle className="w-6 h-6 text-red-600" />
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
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        showResult
                          ? currentQuestion.correctAnswer === 'true'
                            ? 'border-green-500 bg-green-50'
                            : selectedAnswer === 'true'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                          : selectedAnswer === 'true'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">✓</div>
                      <div className={`font-medium ${showResult && currentQuestion.correctAnswer === 'true' ? 'text-green-700' : showResult && selectedAnswer === 'true' ? 'text-red-700' : 'text-gray-700'}`}>
                        正确
                      </div>
                    </button>
                    <button
                      onClick={() => !showResult && setSelectedAnswer('false')}
                      disabled={showResult}
                      className={`p-6 rounded-xl border-2 text-center transition-all ${
                        showResult
                          ? currentQuestion.correctAnswer === 'false'
                            ? 'border-green-500 bg-green-50'
                            : selectedAnswer === 'false'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                          : selectedAnswer === 'false'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-orange-300'
                      }`}
                    >
                      <div className="text-4xl mb-2">✗</div>
                      <div className={`font-medium ${showResult && currentQuestion.correctAnswer === 'false' ? 'text-green-700' : showResult && selectedAnswer === 'false' ? 'text-red-700' : 'text-gray-700'}`}>
                        错误
                      </div>
                    </button>
                  </div>
                )}

                {currentQuestion.type === 'program' && (
                  <div className="bg-gray-900 rounded-xl p-4 text-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">请在下方编写代码</span>
                      <span className="text-xs text-gray-500">C++</span>
                    </div>
                    <textarea
                      className="w-full h-64 bg-gray-800 rounded-lg p-4 text-sm font-mono text-green-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="// 请输入你的代码..."
                      disabled={showResult}
                    />
                    {showResult && (
                      <div className="mt-4 p-4 bg-green-900/30 rounded-lg">
                        <p className="text-green-400 text-sm">✓ 代码已提交（演示模式）</p>
                      </div>
                    )}
                  </div>
                )}

                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`mt-6 p-4 rounded-xl ${
                        isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={`font-medium mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {isCorrect ? '回答正确！🎉' : '回答错误'}
                          </p>
                          {!isCorrect && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-600">正确答案：</p>
                              <p className="text-red-700 font-medium">
                                {currentQuestion.type === 'choice' 
                                  ? currentQuestion.options?.[currentQuestion.correctAnswer as number]
                                  : currentQuestion.correctAnswer === 'true' ? '正确' : '错误'}
                              </p>
                            </div>
                          )}
                          <div className="bg-white/60 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Lightbulb className="w-4 h-4 text-amber-600" />
                              <span className="text-sm font-medium text-amber-800">解析</span>
                            </div>
                            <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
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
                  {currentIndex === sampleQuestions.length - 1 ? '查看结果' : '下一题'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
