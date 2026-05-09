import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { QuestionCard } from '@/components/practice/QuestionCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { usePracticeStore, type Question } from '@/stores/practiceStore';
import { useUserStore } from '@/stores/userStore';

const mockDailyQuestions: Question[] = [
  {
    id: 'd1',
    type: 'choice',
    content: '在C++中，以下哪个是合法的变量名？',
    options: ['2name', '_name', 'my-name', 'class'],
    correctAnswer: '_name',
    knowledgePoint: 'L1-T2',
    difficulty: 1,
    points: 2,
    analysis:
      '变量名的命名规则：必须以字母或下划线开头（不能是数字）；不能包含特殊字符如"-"；不能使用关键字如"class"。因此B选项"_name"是正确的。',
  },
  {
    id: 'd2',
    type: 'judgment',
    content: 'C++中，所有语句都必须以分号结束。',
    correctAnswer: '正确',
    knowledgePoint: 'L1-T1',
    difficulty: 1,
    points: 2,
    analysis:
      '在C++中，除了结构控制语句的末尾（如if、while等），大多数语句确实需要以分号结束。',
  },
  {
    id: 'd3',
    type: 'coding',
    content: '请编写一个程序，输入一个整数，输出它的两倍。',
    options: [
      '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    cout << n * 2;\n    return 0;\n}',
    ],
    correctAnswer: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    cout << n * 2;\n    return 0;\n}',
    knowledgePoint: 'L1-T6',
    difficulty: 1,
    points: 25,
    analysis:
      '这道题需要先读取输入的整数，然后将这个整数乘以2并输出。',
  },
];

export const Daily: React.FC = () => {
  const navigate = useNavigate();
  const { addStreak } = useUserStore();
  const {
    dailyQuestions,
    setDailyQuestions,
    dailyAnswers,
    dailyCompleted,
    currentQuestionIndex,
    submitAnswer,
    nextQuestion,
    todayCompleted,
    markTodayCompleted,
  } = usePracticeStore();

  useEffect(() => {
    if (dailyQuestions.length === 0) {
      setDailyQuestions(mockDailyQuestions);
    }
  }, [dailyQuestions.length, setDailyQuestions]);

  const currentQuestion = dailyQuestions[currentQuestionIndex];
  const selectedAnswer = currentQuestion
    ? dailyAnswers[currentQuestion.id]
    : undefined;
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const showResult = !!selectedAnswer;
  const isLastQuestion = currentQuestionIndex === dailyQuestions.length - 1;
  const isAllCompleted = dailyCompleted >= dailyQuestions.length;

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    submitAnswer(currentQuestion.id, answer);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      if (!todayCompleted) {
        addStreak();
        markTodayCompleted();
      }
    } else {
      nextQuestion();
    }
  };

  if (dailyQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  if (isAllCompleted) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="max-w-md mx-auto text-center space-y-8"
          >
            <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl"
          >
              🎉
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-text-primary">
                太棒了！
              </h1>
              <p className="text-text-secondary">
                你已完成今日所有练习，继续保持！
              </p>
            </div>

            <Card className="text-left">
              <div className="flex items-center gap-4 mb-4">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-bold text-text-primary">今日收获</p>
                  <p className="text-sm text-text-secondary">继续保持，好成绩在向你招手！</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-success">3</p>
                  <p className="text-xs text-text-muted">完成题目</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">29</p>
                  <p className="text-xs text-text-muted">获得积分</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-warning">1</p>
                  <p className="text-xs text-text-muted">连续打卡</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/')}
                icon={<ArrowLeft className="w-5 h-5" />}
              >
                返回首页
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate('/practice')}
              >
                继续刷题
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
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            📝 每日一练
          </h1>
          <p className="text-text-secondary text-sm">
            每天练习一点点，进步看得见！
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
            <span>进度</span>
            <span>
              {dailyCompleted}/{dailyQuestions.length} 完成
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(dailyCompleted / dailyQuestions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              isCorrect={isCorrect}
              showResult={showResult}
              onSelect={handleAnswer}
              onNext={showResult ? handleNext : undefined}
              index={currentQuestionIndex}
              total={dailyQuestions.length}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
