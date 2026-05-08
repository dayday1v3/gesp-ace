import { motion } from 'framer-motion';
import { ArrowLeft, History, Check, X, Clock, Calendar, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useHistoryStore } from '@/stores/historyStore';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, clearHistory } = useHistoryStore();
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'correct') return item.isCorrect;
    if (filter === 'wrong') return !item.isCorrect;
    return true;
  });

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;

    if (diff < 86400000) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}分${secs}秒`;
  };

  const stats = {
    total: history.length,
    correct: history.filter((h) => h.isCorrect).length,
    wrong: history.filter((h) => !h.isCorrect).length,
  };

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
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            返回
          </Button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
            <History className="w-7 h-7 text-primary" />
            做题历史
          </h1>
          <p className="text-text-secondary text-sm">
            记录你的每一次进步
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="text-center p-4">
            <Calendar className="w-6 h-6 text-text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            <p className="text-xs text-text-muted">总做题</p>
          </Card>
          <Card className="text-center p-4">
            <Check className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-success">{stats.correct}</p>
            <p className="text-xs text-text-muted">答对</p>
          </Card>
          <Card className="text-center p-4">
            <X className="w-6 h-6 text-danger mx-auto mb-2" />
            <p className="text-2xl font-bold text-danger">{stats.wrong}</p>
            <p className="text-xs text-text-muted">答错</p>
          </Card>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: '全部' },
            { value: 'correct', label: '答对' },
            { value: 'wrong', label: '答错' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as typeof filter)}
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

        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-text-secondary mb-4">
              {filter === 'all' ? '还没有做题记录' : `没有${filter === 'correct' ? '答对' : '答错'}的记录`}
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/daily')}
              icon={<Clock className="w-4 h-4" />}
            >
              开始练习
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.isCorrect
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {item.isCorrect ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            item.isCorrect
                              ? 'bg-success/10 text-success'
                              : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {typeLabels[item.questionType]}
                        </span>
                        <span className="text-xs text-text-muted">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>

                      <p className="text-text-primary text-sm mb-2 line-clamp-2">
                        {item.questionContent}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          用时 {formatDuration(item.timeSpent)}
                        </span>
                        <span>
                          你的答案：
                          <span
                            className={
                              item.isCorrect ? 'text-success' : 'text-danger'
                            }
                          >
                            {item.answer}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('确定要清空所有做题历史吗？')) {
                  clearHistory();
                }
              }}
              icon={<Trash2 className="w-4 h-4" />}
              className="text-danger hover:bg-danger/10"
            >
              清空历史记录
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};
