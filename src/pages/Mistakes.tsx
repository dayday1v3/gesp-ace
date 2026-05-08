import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePracticeStore } from '@/stores/practiceStore';

export const Mistakes: React.FC = () => {
  const navigate = useNavigate();
  const { mistakes, removeFromMistakes } = usePracticeStore();

  const handleRemove = (questionId: string) => {
    if (confirm('确定要从错题本中移除这道题吗？')) {
      removeFromMistakes(questionId);
    }
  };

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
          <h1 className="text-2xl font-bold text-text-primary mb-2">📋 错题本</h1>
          <p className="text-text-secondary text-sm">
            共 {mistakes.length} 道错题待复习
          </p>
        </div>

        {mistakes.length === 0 ? (
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
        ) : (
          <div className="space-y-4">
            {mistakes.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-start justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {question.type === 'choice'
                          ? '单选题'
                          : question.type === 'judgment'
                          ? '判断题'
                          : '编程题'}
                      </span>
                      <span className="text-xs text-text-muted">
                        {question.points}分 · {question.knowledgePoint}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(question.id)}
                      icon={<Trash2 className="w-4 h-4" />}
                    >
                      移除
                    </Button>
                  </div>

                  <div className="p-4 space-y-4">
                    <p className="text-text-primary">{question.content}</p>

                    {question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, idx) => {
                          const optionLetter = String.fromCharCode(65 + idx);
                          const isCorrect =
                            option === question.correctAnswer;
                          
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
                                {optionLetter}.
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

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        alert('重新练习: ' + question.id);
                      }}
                    >
                      再练一次
                    </Button>
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
