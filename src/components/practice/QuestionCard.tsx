import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Question } from '@/stores/practiceStore';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  isCorrect?: boolean;
  showResult?: boolean;
  onSelect: (answer: string) => void;
  onNext?: () => void;
  index: number;
  total: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  isCorrect,
  showResult,
  onSelect,
  onNext,
  index,
  total,
}) => {
  const typeLabels = {
    choice: '单选题',
    judgment: '判断题',
    coding: '编程题',
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl shadow-card overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary to-primary-light p-4">
        <div className="flex items-center justify-between text-white/90 text-sm">
          <span>第 {index + 1} 题</span>
          <span>
            {typeLabels[question.type]} · {question.points}分
          </span>
        </div>
        <div className="mt-2 bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / total) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        <p className="text-lg text-text-primary leading-relaxed">
          {question.content}
        </p>

        {question.type !== 'judgment' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const optionLetter = String.fromCharCode(65 + idx);
              
              return (
                <motion.button
                  key={option}
                  whileHover={!showResult ? { scale: 1.01 } : {}}
                  whileTap={!showResult ? { scale: 0.99 } : {}}
                  onClick={() => !showResult && onSelect(option)}
                  disabled={showResult}
                  className={cn(
                    'w-full p-4 rounded-2xl text-left transition-all duration-300',
                    'border-2 flex items-center gap-4',
                    !showResult &&
                      'hover:border-primary hover:bg-primary/5 cursor-pointer',
                    showResult &&
                      isSelected &&
                      isCorrect &&
                      'border-success bg-success/10 cursor-default',
                    showResult &&
                      isSelected &&
                      !isCorrect &&
                      'border-danger bg-danger/10 cursor-default',
                    showResult &&
                      !isSelected &&
                      option === question.correctAnswer &&
                      'border-success bg-success/5 cursor-default',
                    showResult &&
                      !isSelected &&
                      !isCorrect &&
                      'border-gray-200 bg-gray-50 opacity-60 cursor-default'
                  )}
                >
                  <span
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0',
                      !showResult && 'bg-primary/10 text-primary',
                      showResult &&
                        isSelected &&
                        isCorrect &&
                        'bg-success text-white',
                      showResult &&
                        isSelected &&
                        !isCorrect &&
                        'bg-danger text-white',
                      showResult &&
                        !isSelected &&
                        option === question.correctAnswer &&
                        'bg-success text-white',
                      showResult &&
                        !isSelected &&
                        !isCorrect &&
                        'bg-gray-200 text-gray-500'
                    )}
                  >
                    {showResult && isSelected && isCorrect && (
                      <Check className="w-6 h-6" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <X className="w-6 h-6" />
                    )}
                    {showResult &&
                      !isSelected &&
                      option === question.correctAnswer && (
                        <Check className="w-6 h-6" />
                      )}
                    {!showResult && optionLetter}
                  </span>
                  <span className="flex-1 text-text-primary">{option}</span>
                </motion.button>
              );
            })}
          </div>
        )}

        {question.type === 'judgment' && (
          <div className="grid grid-cols-2 gap-4">
            {['正确', '错误'].map((option) => {
              const isSelected = selectedAnswer === option;
              const isOptionCorrect = question.correctAnswer === option;
              
              return (
                <motion.button
                  key={option}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  onClick={() => !showResult && onSelect(option)}
                  disabled={showResult}
                  className={cn(
                    'p-6 rounded-2xl text-lg font-medium transition-all duration-300 border-2',
                    !showResult &&
                      'border-primary bg-primary/5 hover:bg-primary/10 cursor-pointer',
                    showResult &&
                      isSelected &&
                      isOptionCorrect &&
                      'border-success bg-success/10 text-success',
                    showResult &&
                      isSelected &&
                      !isOptionCorrect &&
                      'border-danger bg-danger/10 text-danger',
                    showResult &&
                      !isSelected &&
                      isOptionCorrect &&
                      'border-success bg-success/5 text-success',
                    showResult &&
                      !isSelected &&
                      !isOptionCorrect &&
                      'border-gray-200 bg-gray-50 opacity-60'
                  )}
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
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'p-4 rounded-2xl',
                isCorrect ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              )}
            >
              <div className="flex items-center gap-2 font-bold text-lg mb-2">
                {isCorrect ? (
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
                <span className="ml-auto">
                  {isCorrect ? `+${question.points}分` : '+0分'}
                </span>
              </div>

              {!isCorrect && question.analysis && (
                <div className="mt-3 p-3 bg-white rounded-xl">
                  <p className="text-sm text-text-secondary">
                    <strong>正确答案：</strong>
                    {question.type === 'judgment'
                      ? question.correctAnswer === '正确' ? '正确' : '错误'
                      : question.options?.find(
                          (o) => o === question.correctAnswer
                        )}
                  </p>
                  <p className="text-sm text-text-secondary mt-2">
                    <strong>解析：</strong>
                    {question.analysis}
                  </p>
                </div>
              )}

              {isCorrect && question.analysis && (
                <div className="mt-3 p-3 bg-white rounded-xl">
                  <p className="text-sm text-text-secondary">
                    {question.analysis}
                  </p>
                </div>
              )}

              {onNext && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onNext}
                  className="mt-4 w-full btn-primary"
                >
                  {index + 1 < total ? (
                    <>
                      下一题
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    '完成练习'
                  )}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
