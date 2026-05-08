import { motion } from 'framer-motion';
import { ArrowLeft, Play, Send, Moon, Sun, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const sampleQuestion = {
  id: 'c1',
  title: 'Hello World',
  description: '请编写一个程序，输出 "Hello World"（不包括引号）。',
  input: '无输入',
  output: 'Hello World',
  points: 25,
};

export const Coding: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [code, setCode] = useState('#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}');
  const [output, setOutput] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      if (code.includes('Hello World')) {
        setOutput('Hello World');
        setResult('correct');
      } else {
        setOutput('Hello World');
        setResult('wrong');
      }
      setIsRunning(false);
    }, 1000);
  };

  const handleSubmit = () => {
    handleRun();
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
              <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                💡 代码模板
              </h3>
              <div className="bg-gray-50 rounded-xl p-3 text-sm font-mono text-text-secondary">
                <p>#include &lt;iostream&gt;</p>
                <p>using namespace std;</p>
                <p>int main() {'{'}</p>
                <p className="pl-4">// 在这里编写代码</p>
                <p className="pl-4">cout &lt;&lt; "Hello World";</p>
                <p>    return 0;</p>
                <p>{'}'}</p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary-light p-4 flex items-center justify-between">
                <span className="text-white font-medium">📝 代码编辑</span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
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
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none ${
                  isDark
                    ? 'bg-gray-900 text-green-400'
                    : 'bg-gray-50 text-gray-800'
                }`}
                spellCheck={false}
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
                  <div
                    className={`p-4 rounded-xl font-mono text-sm ${
                      isDark ? 'bg-gray-900 text-green-400' : 'bg-gray-900 text-green-400'
                    }`}
                  >
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
