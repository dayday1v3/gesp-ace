import { motion } from 'framer-motion';
import { Heart, BookOpen, Sparkles, Check, Trash2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFavoritesStore } from '@/stores/favoritesStore';

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavoritesStore();

  const typeLabels: Record<string, string> = {
    choice: '单选题',
    judgment: '判断题',
    coding: '编程题',
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
            icon={<span className="text-lg">←</span>}
          >
            返回
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-500" />
            我的收藏
          </h1>
          <p className="text-text-secondary text-sm">
            共 {favorites.length} 道收藏题目
          </p>
        </div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-8xl mb-6"
            >
              💝
            </motion.div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              还没有收藏
            </h2>
            <p className="text-text-secondary mb-6">
              在练习中看到重要的题目，可以点击收藏按钮保存起来哦~
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/practice')}
              icon={<BookOpen className="w-5 h-5" />}
            >
              去练习
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {favorites.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex items-start justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                        {typeLabels[question.type]}
                      </span>
                      <span className="text-xs text-text-muted">
                        {question.points}分 · {question.knowledgePoint}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(question.id)}
                      icon={<Trash2 className="w-4 h-4" />}
                      className="text-danger hover:bg-danger/10"
                    >
                      取消收藏
                    </Button>
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
                                <span className="ml-2">✓</span>
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
                            question.correctAnswer === 'true'
                              ? 'border-success bg-success/10 text-success'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          ✓ 正确
                        </div>
                        <div
                          className={`flex-1 p-3 rounded-xl border-2 ${
                            question.correctAnswer === 'false'
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
                        alert('开始练习: ' + question.id);
                      }}
                      icon={<Play className="w-4 h-4" />}
                    >
                      开始练习
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
