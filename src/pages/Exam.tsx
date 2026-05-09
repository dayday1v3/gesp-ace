import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Clock, FileQuestion, AlertCircle, Play, Lock, Eye, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CodeEditor } from '@/components/ui/CodeEditor';

interface Question {
  id: string;
  type: 'choice' | 'judge' | 'program';
  level: number;
  score: number;
  content: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

interface ExamConfig {
  level: number;
  name: string;
  duration: number;
  choiceCount: number;
  judgeCount: number;
  programCount: number;
}

const examConfigs: ExamConfig[] = [
  { level: 1, name: '一级·编程入门', duration: 120, choiceCount: 15, judgeCount: 10, programCount: 2 },
  { level: 2, name: '二级·程序基础设计', duration: 120, choiceCount: 15, judgeCount: 10, programCount: 2 },
  { level: 3, name: '三级·数据编码+基础算法', duration: 120, choiceCount: 15, judgeCount: 10, programCount: 2 },
  { level: 4, name: '四级·函数+排序+文件', duration: 120, choiceCount: 15, judgeCount: 10, programCount: 2 },
  { level: 5, name: '五级·C++标准模板库', duration: 180, choiceCount: 15, judgeCount: 10, programCount: 2 },
  { level: 6, name: '六级·数据结构基础', duration: 180, choiceCount: 15, judgeCount: 10, programCount: 2 },
  { level: 7, name: '七级·算法设计', duration: 180, choiceCount: 15, judgeCount: 10, programCount: 2 },
  { level: 8, name: '八级·竞赛级算法', duration: 180, choiceCount: 15, judgeCount: 10, programCount: 2 },
];

const generateQuestions = (config: ExamConfig): Question[] => {
  const questions: Question[] = [];
  
  for (let i = 0; i < config.choiceCount; i++) {
    questions.push({
      id: `C${i + 1}`,
      type: 'choice',
      level: config.level,
      score: 4,
      content: `【选择题 ${i + 1}】下列关于C++的说法正确的是？`,
      options: ['A. C++是纯面向对象的语言', 'B. C++支持多重继承', 'C. C++程序必须以main作为入口', 'D. C++不能进行系统级编程'],
      correctAnswer: 1,
      explanation: 'C++支持多重继承，允许一个类继承多个基类。其他选项均不正确。',
    });
  }
  
  for (let i = 0; i < config.judgeCount; i++) {
    questions.push({
      id: `J${i + 1}`,
      type: 'judge',
      level: config.level,
      score: 2,
      content: `【判断题 ${i + 1}】在C++中，endl可以用于换行并刷新缓冲区。`,
      correctAnswer: 'true',
      explanation: 'endl是C++的换行操作符，相当于"\n"加上flush操作，可以强制刷新输出缓冲区。',
    });
  }
  
  for (let i = 0; i < config.programCount; i++) {
    questions.push({
      id: `P${i + 1}`,
      type: 'program',
      level: config.level,
      score: 25,
      content: `【编程题 ${i + 1}】(25分) 请编写程序，实现以下功能：输入一个整数n，计算并输出1+2+3+...+n的值。\n\n【输入格式】一个整数n (1≤n≤1000)\n【输出格式】输出1+2+...+n的值\n【样例输入】100\n【样例输出】5050`,
      correctAnswer: '',
      explanation: '本题可以使用循环累加或等差数列公式n*(n+1)/2求解。注意n的范围是1到1000，不会溢出int类型。',
    });
  }
  
  return questions;
};

const ExamStart: React.FC<{ config: ExamConfig; onStart: () => void }> = ({ config, onStart }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/exam')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <div className="text-lg font-bold text-gray-900">GESP {config.level}级模拟考试</div>
          <div className="w-20"></div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h1 className="text-3xl font-bold mb-2">GESP {config.level}级模拟考试</h1>
              <p className="text-white/80">{config.name}</p>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                考试须知
              </h2>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center flex-shrink-0">1</span>
                    <div>
                      <p className="font-medium">考试时长</p>
                      <p className="text-sm text-gray-600">{config.duration} 分钟，严格计时</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <p className="font-medium">题型分布</p>
                      <p className="text-sm text-gray-600">
                        {config.choiceCount}道选择题（每题{4}分）+ {config.judgeCount}道判断题（每题{2}分）+ {config.programCount}道编程题（每题{25}分）
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center flex-shrink-0">3</span>
                    <div>
                      <p className="font-medium">编程题部分分</p>
                      <p className="text-sm text-gray-600">每道编程题{config.programCount > 0 ? '25分' : ''}，包含5个测试点，每个测试点5分</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center flex-shrink-0">4</span>
                    <div>
                      <p className="font-medium">答题要求</p>
                      <p className="text-sm text-gray-600">选择题和判断题点击选项即可作答；编程题需在代码编辑器中编写代码并提交</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-sm flex items-center justify-center flex-shrink-0">5</span>
                    <div>
                      <p className="font-medium">注意事项</p>
                      <p className="text-sm text-gray-600">考试过程中可以切换题目，但必须点击"提交试卷"才能交卷；交卷后无法修改答案</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{config.choiceCount}</div>
                    <div className="text-sm text-gray-600">选择题</div>
                    <div className="text-xs text-gray-500">{config.choiceCount * 4}分</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{config.judgeCount}</div>
                    <div className="text-sm text-gray-600">判断题</div>
                    <div className="text-xs text-gray-500">{config.judgeCount * 2}分</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{config.programCount}</div>
                    <div className="text-sm text-gray-600">编程题</div>
                    <div className="text-xs text-gray-500">{config.programCount * 25}分</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                  <span className="text-lg font-bold text-gray-900">总分：100分</span>
                  <span className="text-sm text-gray-600 ml-2">及格线：60分</span>
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full" onClick={onStart}>
                <Play className="w-5 h-5 mr-2" />
                开始考试
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

const ExamTaking: React.FC<{ config: ExamConfig; questions: Question[]; onSubmit: (answers: Record<string, string | number>, code: Record<string, string>) => void }> = ({ config, questions, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [code, setCode] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(config.duration * 60);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    onSubmit(answers, code);
  };

  const answeredCount = Object.keys(answers).length;
  const choiceAnswered = questions.filter(q => q.type === 'choice' && answers[q.id] !== undefined).length;
  const judgeAnswered = questions.filter(q => q.type === 'judge' && answers[q.id] !== undefined).length;
  const programAnswered = questions.filter(q => q.type === 'program' && code[q.id] !== undefined && code[q.id].trim() !== '').length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">GESP {config.level}级模拟考试</div>
          <div className={`px-4 py-2 rounded-full font-mono text-lg font-bold ${timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
            <Clock className="w-5 h-5 inline mr-2" />
            {formatTime(timeLeft)}
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowSubmitConfirm(true)}>
            <Send className="w-4 h-4 mr-1" />
            交卷
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <Card className="sticky top-24">
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-3">答题进度</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">选择题</span>
                    <span className="font-medium text-orange-600">{choiceAnswered}/{config.choiceCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(choiceAnswered / config.choiceCount) * 100}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">判断题</span>
                    <span className="font-medium text-blue-600">{judgeAnswered}/{config.judgeCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(judgeAnswered / config.judgeCount) * 100}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">编程题</span>
                    <span className="font-medium text-green-600">{programAnswered}/{config.programCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(programAnswered / config.programCount) * 100}%` }}></div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">已答题目</span>
                    <span className="font-bold text-orange-600">{answeredCount + programAnswered}/{questions.length}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">题目导航</h3>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 mb-2">选择题 (1-{config.choiceCount})</div>
                  <div className="grid grid-cols-5 gap-1">
                    {questions.slice(0, config.choiceCount).map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`aspect-square rounded text-xs font-medium transition-all ${
                          idx === currentIndex
                            ? 'bg-orange-500 text-white'
                            : answers[q.id] !== undefined
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="text-xs text-gray-500 mb-2">判断题 ({config.choiceCount + 1}-{config.choiceCount + config.judgeCount})</div>
                  <div className="grid grid-cols-5 gap-1">
                    {questions.slice(config.choiceCount, config.choiceCount + config.judgeCount).map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(config.choiceCount + idx)}
                        className={`aspect-square rounded text-xs font-medium transition-all ${
                          config.choiceCount + idx === currentIndex
                            ? 'bg-orange-500 text-white'
                            : answers[q.id] !== undefined
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {config.choiceCount + idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="text-xs text-gray-500 mb-2">编程题 ({config.choiceCount + config.judgeCount + 1}-{questions.length})</div>
                  <div className="grid grid-cols-2 gap-1">
                    {questions.slice(config.choiceCount + config.judgeCount).map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(config.choiceCount + config.judgeCount + idx)}
                        className={`p-2 rounded text-xs font-medium transition-all ${
                          config.choiceCount + config.judgeCount + idx === currentIndex
                            ? 'bg-orange-500 text-white'
                            : code[q.id] !== undefined && code[q.id].trim() !== ''
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        P{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-9">
            <Card>
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                    {currentQuestion.type === 'choice' ? '选择题' : currentQuestion.type === 'judge' ? '判断题' : '编程题'}
                  </span>
                  <span className="text-white/80 text-sm">
                    第 {currentIndex + 1} / {questions.length} 题
                  </span>
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                  {currentQuestion.score} 分
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-lg text-gray-900 leading-relaxed whitespace-pre-line">
                    {currentQuestion.content}
                  </p>
                </div>

                {currentQuestion.type === 'choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAnswers({ ...answers, [currentQuestion.id]: idx })}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          answers[currentQuestion.id] === idx
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            answers[currentQuestion.id] === idx
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {answers[currentQuestion.id] === idx && (
                            <Check className="w-5 h-5 text-orange-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'judge' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: 'true' })}
                      className={`p-8 rounded-xl border-2 text-center transition-all ${
                        answers[currentQuestion.id] === 'true'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="text-5xl mb-2">✓</div>
                      <div className="font-medium">正确 (True)</div>
                    </button>
                    <button
                      onClick={() => setAnswers({ ...answers, [currentQuestion.id]: 'false' })}
                      className={`p-8 rounded-xl border-2 text-center transition-all ${
                        answers[currentQuestion.id] === 'false'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="text-5xl mb-2">✗</div>
                      <div className="font-medium">错误 (False)</div>
                    </button>
                  </div>
                )}

                {currentQuestion.type === 'program' && (
                  <div>
                    <CodeEditor
                      value={code[currentQuestion.id] || ''}
                      onChange={(value) => setCode({ ...code, [currentQuestion.id]: value })}
                      language="cpp"
                      height="400px"
                    />
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">提示</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        请在代码编辑器中编写C++程序。确保程序能够通过所有测试用例。
                        每个编程题包含5个测试点，部分正确也可以获得部分分数。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                上一题
              </Button>
              
              <div className="text-sm text-gray-500">
                {answers[currentQuestion.id] !== undefined || (currentQuestion.type === 'program' && code[currentQuestion.id]?.trim())
                  ? '✓ 已作答'
                  : '○ 未作答'}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
              >
                下一题
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">确认交卷</h3>
                <p className="text-gray-600">
                  您已回答 {answeredCount + programAnswered} / {questions.length} 题
                </p>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700">选择题</span>
                  <span className="font-medium text-orange-600">{choiceAnswered}/{config.choiceCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">判断题</span>
                  <span className="font-medium text-blue-600">{judgeAnswered}/{config.judgeCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">编程题</span>
                  <span className="font-medium text-green-600">{programAnswered}/{config.programCount}</span>
                </div>
              </div>

              {answeredCount + programAnswered < questions.length && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-yellow-800">
                    ⚠️ 还有 {questions.length - answeredCount - programAnswered} 道题未作答
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowSubmitConfirm(false)}>
                  返回检查
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleSubmit}>
                  确认交卷
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExamResult: React.FC<{ config: ExamConfig; questions: Question[]; answers: Record<string, string | number>; code: Record<string, string>; onClose: () => void }> = ({ config, questions, answers, code, onClose }) => {
  const navigate = useNavigate();
  
  const calculateScore = () => {
    let totalScore = 0;
    let choiceScore = 0;
    let judgeScore = 0;
    let programScore = 0;

    questions.forEach(q => {
      if (q.type === 'choice' && answers[q.id] === q.correctAnswer) {
        totalScore += q.score;
        choiceScore += q.score;
      }
      if (q.type === 'judge' && answers[q.id] === q.correctAnswer) {
        totalScore += q.score;
        judgeScore += q.score;
      }
    });

    return { totalScore, choiceScore, judgeScore, programScore };
  };

  const { totalScore, choiceScore, judgeScore, programScore } = calculateScore();
  const passScore = 60;
  const isPassed = totalScore >= passScore;

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'from-green-500 to-emerald-500', text: '优秀' };
    if (score >= 80) return { grade: 'B', color: 'from-blue-500 to-cyan-500', text: '良好' };
    if (score >= 70) return { grade: 'C', color: 'from-yellow-500 to-orange-500', text: '中等' };
    if (score >= 60) return { grade: 'D', color: 'from-orange-500 to-red-500', text: '及格' };
    return { grade: 'E', color: 'from-red-500 to-pink-500', text: '不及格' };
  };

  const gradeInfo = getGrade(totalScore);

  const choiceCorrect = questions.filter(q => q.type === 'choice' && answers[q.id] === q.correctAnswer).length;
  const judgeCorrect = questions.filter(q => q.type === 'judge' && answers[q.id] === q.correctAnswer).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <div className="text-lg font-bold text-gray-900">考试成绩</div>
          <div className="w-20"></div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6 overflow-hidden">
            <div className={`bg-gradient-to-r ${gradeInfo.color} p-8 text-center text-white`}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm mb-4"
              >
                <span className="text-6xl font-black">{gradeInfo.grade}</span>
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">
                {isPassed ? '恭喜通过考试！🎉' : '继续加油！💪'}
              </h2>
              <p className="text-white/80">
                GESP {config.level}级 · {config.name}
              </p>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-orange-600 mb-2">{totalScore}</div>
                <div className="text-gray-600">
                  总分 <span className="font-bold">100</span> 分 · 及格线 <span className="font-bold">{passScore}</span> 分
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{choiceScore}</div>
                  <div className="text-sm text-gray-600">选择题得分</div>
                  <div className="text-xs text-gray-500 mt-1">{choiceCorrect}/{config.choiceCount} 正确</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{judgeScore}</div>
                  <div className="text-sm text-gray-600">判断题得分</div>
                  <div className="text-xs text-gray-500 mt-1">{judgeCorrect}/{config.judgeCount} 正确</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{programScore}</div>
                  <div className="text-sm text-gray-600">编程题得分</div>
                  <div className="text-xs text-gray-500 mt-1">待批改</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">题目详情</h3>
                <div className="space-y-2">
                  {questions.map((q, idx) => {
                    const isCorrect = q.type === 'program' 
                      ? false 
                      : answers[q.id] === q.correctAnswer;
                    return (
                      <div key={q.id} className={`flex items-center justify-between p-3 rounded-lg ${
                        q.type === 'program' 
                          ? 'bg-green-50' 
                          : isCorrect 
                          ? 'bg-green-50' 
                          : 'bg-red-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          {q.type === 'program' 
                            ? <span className="text-green-600">P{idx - config.choiceCount - config.judgeCount + 1}</span>
                            : <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              第{idx + 1}题
                            </span>
                          }
                          <span className="text-sm text-gray-600">{q.score}分</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          q.type === 'program' 
                            ? 'text-green-600' 
                            : isCorrect 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {q.type === 'program' ? '待批改' : isCorrect ? '正确' : '错误'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800 mb-1">考试说明</p>
                    <p className="text-sm text-orange-700">
                      编程题需要人工或AI批改，当前显示的分数为选择题和判断题的得分。
                      编程题总分{config.programCount * 25}分，待批改完成后可在"练习历史"中查看最终成绩。
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/exam')}>
                  返回考试列表
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => navigate('/')}>
                  返回首页
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export const Exam: React.FC = () => {
  const navigate = useNavigate();
  const [examState, setExamState] = useState<'list' | 'start' | 'taking' | 'result'>('list');
  const [selectedConfig, setSelectedConfig] = useState<ExamConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [code, setCode] = useState<Record<string, string>>({});

  const handleStartExam = (config: ExamConfig) => {
    setSelectedConfig(config);
    setQuestions(generateQuestions(config));
    setAnswers({});
    setCode({});
    setExamState('start');
  };

  const handleStartTaking = () => {
    setExamState('taking');
  };

  const handleSubmitExam = (finalAnswers: Record<string, string | number>, finalCode: Record<string, string>) => {
    setAnswers(finalAnswers);
    setCode(finalCode);
    setExamState('result');
  };

  const handleBackToList = () => {
    setExamState('list');
    setSelectedConfig(null);
    setQuestions([]);
    setAnswers({});
    setCode({});
  };

  if (examState === 'list') {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
            <div className="text-lg font-bold text-gray-900">模拟考试</div>
            <div className="w-20"></div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 mb-6 text-white"
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl">📋</div>
              <div>
                <h2 className="text-xl font-bold mb-2">GESP认证模拟考试</h2>
                <ul className="space-y-1 text-white/90 text-sm">
                  <li>• 1-4级考试时长：120分钟</li>
                  <li>• 5-8级考试时长：180分钟</li>
                  <li>• 题型：{examConfigs[0].choiceCount}选择 + {examConfigs[0].judgeCount}判断 + {examConfigs[0].programCount}编程</li>
                  <li>• 编程题采用部分分机制，每个测试点独立计分</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {examConfigs.map((config, index) => (
              <motion.div
                key={config.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xl font-bold">
                          Lv{config.level}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{config.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                              {config.duration}分钟
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileQuestion className="w-4 h-4" />
                        <span>{config.choiceCount}道选择题</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileQuestion className="w-4 h-4" />
                        <span>{config.judgeCount}道判断题</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileQuestion className="w-4 h-4" />
                        <span>{config.programCount}道编程题</span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => handleStartExam(config)}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      开始考试
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (examState === 'start' && selectedConfig) {
    return <ExamStart config={selectedConfig} onStart={handleStartTaking} />;
  }

  if (examState === 'taking' && selectedConfig) {
    return <ExamTaking config={selectedConfig} questions={questions} onSubmit={handleSubmitExam} />;
  }

  if (examState === 'result' && selectedConfig) {
    return <ExamResult config={selectedConfig} questions={questions} answers={answers} code={code} onClose={handleBackToList} />;
  }

  return null;
};
