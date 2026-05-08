import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Trash2, Sparkles, Check, X, Play, Filter, BarChart3, RotateCcw, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePracticeStore, type Question } from '@/stores/practiceStore';

type FilterType = 'all' | 'to_review' | 'mastered';
type ViewMode = 'list' | 'practice';

export const Mistakes: React.FC = () => {
  const navigate = useNavigate();
  const { mistakes, removeFromMistakes, dailyAnswers } = usePracticeStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const filteredMistakes = mistakes.filter((q) => {
    if (filter === 'to_review') return !masteredIds.has(q.id);
    if (filter === 'mastered') return masteredIds.has(q.id);
    return true;
  });

  const currentQuestion = filteredMistakes[currentPracticeIndex];

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const handleMarkMastered = () => {
    if (!currentQuestion) return;
    setMasteredIds((prev) => new Set([...prev, currentQuestion.id]));
    goToNext();
  };

  const handleUndoMastered = (questionId: string) => {
    setMasteredIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  };

  const goToNext = () => {
    if (currentPracticeIndex < filteredMistakes.length - 1) {
      setCurrentPracticeIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setViewMode('list');
      setCurrentPracticeIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const startPractice = () => {
    if (filteredMistakes.length === 0) return;
    setViewMode('practice');
    setCurrentPracticeIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const stats = {
    total: mistakes.length,
    toReview: mistakes.filter((q) => !masteredIds.has(q.id)).length,
    mastered: mistakes.filter((q) => masteredIds.has(q.id)).length,
  };

  const typeLabels = {
    choice: '单选题',
    judgment: '判断题',
    coding: '编程题',
  };

  if (viewMode === 'practice' && currentQuestion) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              返回列表
            </Button>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
              <span>复习进度</span>
              <span>{currentPracticeIndex + 1}/{filteredMistakes.length}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentPracticeIndex + 1) / filteredMistakes.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-primary to-primary-light"
              />
            </div>
          </div>

          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white rounded-3xl shadow-card overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary to-primary-light p-4">
              <div className="flex items-center justify-between text-white/90 text-sm">
                <span>第 {currentPracticeIndex + 1} 题</span>
                <span>{typeLabels[currentQuestion.type]} · {currentQuestion.points}分</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-lg text-text-primary leading-relaxed">
                {currentQuestion.content}
              </p>

              {currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const optionLetter = String.fromCharCode(65 + idx);

                    return (
                      <motion.button
                        key={option}
                        whileHover={!showResult ? { scale: 1.01 } : {}}
                        whileTap={!showResult ? { scale: 0.99 } : {}}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border-2 flex items-center gap-4 ${
                          !showResult && 'hover:border-primary hover:bg-primary/5 cursor-pointer'
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
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                          !showResult && 'bg-primary/10 text-primary'
                        } ${
                          showResult && isSelected && isCorrect && 'bg-success text-white'
                        } ${
                          showResult && isSelected && !isCorrect && 'bg-danger text-white'
                        } ${
                          showResult && !isSelected && isCorrect && 'bg-success text-white'
                        } ${
                          showResult && !isSelected && !isCorrect && 'bg-gray-200 text-gray-500'
                        }`}>
                          {showResult && (isSelected || isCorrect) && <Check className="w-6 h-6" />}
                          {!showResult && optionLetter}
                        </span>
                        <span className="flex-1 text-text-primary">{option}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'judgment' && (
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

              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-lg mb-2">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>🎉 回答正确！</span>
                        </>
                      ) : (
                        <>
                          <span>😢</span>
                          <span>回答错误</span>
                        </>
                      )}
                    </div>

                    {currentQuestion.analysis && (
                      <div className="mt-3 p-3 bg-white rounded-xl">
                        <p className="text-sm text-text-secondary">
                          <strong>解析：</strong>
                          {currentQuestion.analysis}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      {!masteredIds.has(currentQuestion.id) && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleMarkMastered}
                          icon={<Check className="w-4 h-4" />}
                          className="flex-1"
                        >
                          标记已掌握
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToNext}
                        className="flex-1"
                      >
                        {currentPracticeIndex < filteredMistakes.length - 1 ? '下一题' : '完成复习'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

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
            📋 错题本
            <span className="text-sm font-normal text-text-secondary ml-2">
              共 {stats.total} 道错题
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="text-center p-4">
            <BarChart3 className="w-6 h-6 text-text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            <p className="text-xs text-text-muted">总错题</p>
          </Card>
          <Card className="text-center p-4">
            <Target className="w-6 h-6 text-danger mx-auto mb-2" />
            <p className="text-2xl font-bold text-danger">{stats.toReview}</p>
            <p className="text-xs text-text-muted">待复习</p>
          </Card>
          <Card className="text-center p-4">
            <Check className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">{stats.mastered}</p>
            <p className="text-xs text-text-muted">已掌握</p>
          </Card>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-2 flex-1">
            {[
              { value: 'all', label: '全部' },
              { value: 'to_review', label: '待复习' },
              { value: 'mastered', label: '已掌握' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value as FilterType)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === item.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={startPractice}
            disabled={stats.toReview === 0}
            icon={<Play className="w-4 h-4" />}
          >
            开始复习
          </Button>
        </div>

        {stats.total === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              太棒了！
            </h2>
            <p className="text-text-secondary mb-6">
              你的错题本空空如也，继续保持！
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/daily')}
              icon={<BookOpen className="w-5 h-5" />}
            >
              去练习
            </Button>
          </motion.div>
        ) : filteredMistakes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <p className="text-text-secondary mb-4">
              {filter === 'to_review' ? '所有错题都已掌握！' : '暂无已掌握的错题'}
            </p>
            <Button
              variant="ghost"
              onClick={() => setFilter('all')}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              查看全部
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredMistakes.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-start justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {typeLabels[question.type]}
                      </span>
                      <span className="text-xs text-text-muted">
                        {question.points}分 · {question.knowledgePoint}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {masteredIds.has(question.id) && (
                        <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          已掌握
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUndoMastered(question.id)}
                        icon={masteredIds.has(question.id) ? <RotateCcw className="w-4 h-4" /> : undefined}
                      >
                        {masteredIds.has(question.id) ? '重置' : ''}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('确定要从错题本中移除这道题吗？')) {
                            removeFromMistakes(question.id);
                          }
                        }}
                        icon={<Trash2 className="w-4 h-4" />}
                        className="text-danger hover:bg-danger/10"
                      >
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="text-text-primary">{question.content}</p>

                    {question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, idx) => {
                          const isCorrect = option === question.correctAnswer;
                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border-2 ${
                                isCorrect
                                  ? 'border-success bg-success/10 text-success'
                                  : 'border-gray-200 bg-gray-50 text-text-muted'
                              }`}
                            >
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + idx)}.
                              </span>
                              {option}
                              {isCorrect && (
                                <span className="ml-2">✓ 正确答案</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {question.type === 'judgment' && (
                      <div className="flex gap-3">
                        <div
                          className={`flex-1 p-3 rounded-xl border-2 ${
                            question.correctAnswer === '正确'
                              ? 'border-success bg-success/10 text-success'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          ✓ 正确
                        </div>
                        <div
                          className={`flex-1 p-3 rounded-xl border-2 ${
                            question.correctAnswer === '错误'
                              ? 'border-success bg-success/10 text-success'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          ✗ 错误
                        </div>
                      </div>
                    )}

                    {question.analysis && (
                      <div className="p-4 bg-primary/5 rounded-xl border-l-4 border-primary">
                        <div className="flex items-center gap-2 text-primary font-medium mb-2">
                          <Sparkles className="w-4 h-4" />
                          <span>解析</span>
                        </div>
                        <p className="text-text-secondary text-sm">
                          {question.analysis}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant={masteredIds.has(question.id) ? 'ghost' : 'primary'}
                        size="sm"
                        onClick={() => {
                          if (masteredIds.has(question.id)) {
                            handleUndoMastered(question.id);
                          } else {
                            setMasteredIds((prev) => new Set([...prev, question.id]));
                          }
                        }}
                        icon={masteredIds.has(question.id) ? <RotateCcw className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        className="flex-1"
                      >
                        {masteredIds.has(question.id) ? '取消掌握' : '标记已掌握'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
