import { motion } from 'framer-motion';
import { ArrowLeft, Play, Send, Moon, Sun, Check, X, Lightbulb, AlertTriangle, ThumbsUp, Clock, Zap } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TestCase {
  input: string;
  output: string;
  passed?: boolean;
}

interface CodeReview {
  score: number;
  issues: {
    type: 'error' | 'warning' | 'suggestion';
    message: string;
    line?: number;
  }[];
  overallComment: string;
}

const sampleQuestion = {
  id: 'c1',
  title: 'Hello World',
  description: '请编写一个程序，输出 "Hello World"（不包括引号）。',
  input: '无输入',
  output: 'Hello World',
  points: 25,
  testCases: [
    { input: '', output: 'Hello World' },
  ],
};

export const Coding: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}');
  const [output, setOutput] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>(sampleQuestion.testCases);
  const [showReview, setShowReview] = useState(false);
  const [codeReview, setCodeReview] = useState<CodeReview | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setResult(null);
    
    setTimeout(() => {
      const hasHelloWorld = code.includes('Hello World');
      if (hasHelloWorld) {
        setOutput('Hello World');
        setResult('correct');
        setTestCases([{ ...testCases[0], passed: true }]);
      } else {
        setOutput('Hello World');
        setResult('wrong');
        setTestCases([{ ...testCases[0], passed: false }]);
      }
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmit = () => {
    handleRun();
    setTimeout(() => {
      const mockReview: CodeReview = {
        score: code.includes('Hello World') ? 85 : 60,
        issues: [
          {
            type: 'suggestion',
            message: '建议添加 endl 或换行，使输出更美观',
            line: 6,
          },
          {
            type: 'warning',
            message: '代码可以更简洁',
          },
        ],
        overallComment: code.includes('Hello World') 
          ? '代码基本正确，能够完成题目要求。建议注意代码格式和输出换行。'
          : '代码存在问题，请检查输出内容是否完全正确。',
      };
      setCodeReview(mockReview);
      setShowReview(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/daily')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            返回
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              icon={isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            >
              {isDark ? '浅色' : '深色'}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            💻 编程题 · {sampleQuestion.title}
          </h1>
          <p className="text-text-secondary text-sm">
            {sampleQuestion.points}分 · 请认真编写代码
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-primary/10 to-primary-light/10">
              <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                📝 题目描述
              </h3>
              <p className="text-text-secondary mb-4">{sampleQuestion.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-text-muted font-medium min-w-[50px]">输入：</span>
                  <span className="text-text-secondary">{sampleQuestion.input}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-text-muted font-medium min-w-[50px]">输出：</span>
                  <span className="text-text-secondary">{sampleQuestion.output}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-text-primary mb-3">💡 提示</h3>
              <div className="p-3 bg-warning/10 rounded-xl">
                <p className="text-sm text-text-secondary">
                  使用 <code className="bg-gray-100 px-1 rounded">cout</code> 输出内容，注意大小写！
                </p>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning" />
                测试用例
              </h3>
              <div className="space-y-2">
                {testCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border-2 ${
                      tc.passed === true
                        ? 'border-success bg-success/10'
                        : tc.passed === false
                        ? 'border-danger bg-danger/10'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">
                        测试点 {idx + 1}
                      </span>
                      {tc.passed === true && (
                        <span className="flex items-center gap-1 text-success text-sm">
                          <Check className="w-4 h-4" /> 通过
                        </span>
                      )}
                      {tc.passed === false && (
                        <span className="flex items-center gap-1 text-danger text-sm">
                          <X className="w-4 h-4" /> 未通过
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary">
                      <div>输入：{tc.input || '(无)'}</div>
                      <div>预期输出：{tc.output}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {showReview && codeReview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-warning" />
                    AI 代码审查
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-secondary">代码评分</span>
                      <span className={`text-2xl font-bold ${
                        codeReview.score >= 80 ? 'text-success' :
                        codeReview.score >= 60 ? 'text-warning' : 'text-danger'
                      }`}>
                        {codeReview.score}分
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${codeReview.score}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full ${
                          codeReview.score >= 80 ? 'bg-success' :
                          codeReview.score >= 60 ? 'bg-warning' : 'bg-danger'
                        }`}
                      />
                    </div>
                  </div>

                  {codeReview.issues.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {codeReview.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl ${
                            issue.type === 'error' ? 'bg-danger/10' :
                            issue.type === 'warning' ? 'bg-warning/10' :
                            'bg-info/10'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {issue.type === 'error' && <AlertTriangle className="w-4 h-4 text-danger mt-0.5" />}
                            {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />}
                            {issue.type === 'suggestion' && <Lightbulb className="w-4 h-4 text-info mt-0.5" />}
                            <div className="flex-1">
                              <p className="text-sm text-text-primary">
                                {issue.message}
                              </p>
                              {issue.line && (
                                <p className="text-xs text-text-muted mt-1">
                                  第 {issue.line} 行
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 bg-primary/5 rounded-xl">
                    <p className="text-sm text-text-secondary">
                      {codeReview.overallComment}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="space-y-4">
            <Card className="p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-light p-4 flex items-center justify-between">
                <span className="text-white font-medium">📝 代码编辑</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRun}
                    loading={isRunning}
                    icon={<Play className="w-4 h-4" />}
                    className="bg-white/20 border-0 text-white hover:bg-white/30"
                  >
                    运行
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSubmit}
                    loading={isRunning}
                    icon={<Send className="w-4 h-4" />}
                    className="bg-white text-primary border-0 hover:bg-white/90"
                  >
                    提交
                  </Button>
                </div>
              </div>
              <Editor
                height="500px"
                defaultLanguage="cpp"
                theme={isDark ? 'vs-dark' : 'light'}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              />
            </Card>

            {output && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={result === 'correct' ? 'border-2 border-success' : 'border-2 border-danger'}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-text-primary flex items-center gap-2">
                      📤 运行结果
                    </h3>
                    {result && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result === 'correct'
                            ? 'bg-success/10 text-success'
                            : 'bg-danger/10 text-danger'
                        }`}
                      >
                        {result === 'correct' ? (
                          <>
                            <Check className="w-4 h-4 inline mr-1" />
                            答案正确！
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 inline mr-1" />
                            答案错误
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900 text-green-400 font-mono text-sm">
                    {output}
                  </div>
                  {result === 'correct' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="mt-4 text-center"
                    >
                      <p className="text-success font-bold text-lg">
                        🎉 恭喜！获得 {sampleQuestion.points} 分！
                      </p>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
