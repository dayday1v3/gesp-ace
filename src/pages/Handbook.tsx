import { motion } from 'framer-motion';
import { ArrowLeft, Book, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface HandbookTopic {
  id: string;
  title: string;
  content: string;
  examples?: string[];
  tips?: string[];
}

interface Handbook {
  level: number;
  name: string;
  topics: HandbookTopic[];
}

const handbooks: Handbook[] = [
  {
    level: 1,
    name: '一级·编程入门',
    topics: [
      {
        id: 'H1-1',
        title: '什么是变量',
        content: '变量就像一个盒子，我们可以给它起名字，然后在盒子里存放数据。比如：int age = 10; 表示定义了一个叫age的盒子，里面存放数字10。',
        examples: [
          'int a = 5; // 定义整型变量a，值为5',
          'double pi = 3.14; // 定义浮点型变量pi，值为3.14',
          'char grade = \'A\'; // 定义字符型变量grade，值为\'A\'',
        ],
        tips: [
          '变量名不能以数字开头',
          '变量名不能使用关键字（如int、if等）',
          '变量名区分大小写（age和Age是不同的）',
        ],
      },
      {
        id: 'H1-2',
        title: '基本数据类型',
        content: 'C++中有几种基本数据类型：整型（int）、浮点型（double/float）、字符型（char）、布尔型（bool）。不同的数据类型占用不同的内存空间。',
        examples: [
          'int: 整数，如 1, 100, -5',
          'double: 小数，如 3.14, -2.5',
          'char: 字符，如 \'A\', \'a\', \'1\'',
          'bool: 布尔，只有 true 和 false',
        ],
        tips: [
          '整数运算结果还是整数',
          '浮点数运算会有精度误差',
          '字符用单引号，字符串用双引号',
        ],
      },
      {
        id: 'H1-3',
        title: 'if语句',
        content: 'if语句用于条件判断，根据条件的真假决定是否执行某段代码。',
        examples: [
          'if (age >= 18) {\n    cout << "成年人";\n}',
          'if (score >= 60) {\n    cout << "及格";\n} else {\n    cout << "不及格";\n}',
        ],
        tips: [
          'if后面要跟括号，括号里是条件',
          '条件为真时执行大括号里的代码',
          'else表示条件为假时执行',
        ],
      },
      {
        id: 'H1-4',
        title: 'for循环',
        content: 'for循环用于重复执行某段代码指定次数。',
        examples: [
          'for (int i = 1; i <= 5; i++) {\n    cout << i << endl;\n}',
        ],
        tips: [
          '第一个表达式：循环变量初始化',
          '第二个表达式：循环条件',
          '第三个表达式：循环变量的更新',
        ],
      },
    ],
  },
  {
    level: 2,
    name: '二级·程序基础设计',
    topics: [
      {
        id: 'H2-1',
        title: 'ASCII编码',
        content: 'ASCII码是用数字表示字符的一种编码方式。\'A\'的ASCII码是65，\'a\'是97，\'0\'是48。',
        examples: [
          'char c = \'A\';\ncout << (int)c; // 输出65',
          'for (char c = \'A\'; c <= \'Z\'; c++)\n    cout << c;',
        ],
        tips: [
          '大写字母A-Z的ASCII码是65-90',
          '小写字母a-z的ASCII码是97-122',
          '数字0-9的ASCII码是48-57',
        ],
      },
      {
        id: 'H2-2',
        title: '流程图基础',
        content: '流程图是一种用图形表示算法步骤的方法。椭圆表示开始/结束，平行四边形表示输入/输出，菱形表示判断，矩形表示处理。',
        examples: [
          '开始 → 输入年龄 → 年龄>=18? → 是 → 成年人 → 结束',
          '开始 → 输入成绩 → 成绩>=60? → 是 → 及格',
          '                              → 否 → 不及格 → 结束',
        ],
        tips: [
          '流程图帮助理解程序的执行流程',
          '注意判断分支的完整性',
          '循环可以用带箭头的流程线表示',
        ],
      },
    ],
  },
  {
    level: 3,
    name: '三级·数据编码+基础算法',
    topics: [
      {
        id: 'H3-1',
        title: '进制转换',
        content: '计算机中常用二进制、八进制、十进制、十六进制。进制转换是GESP三级的重要内容。',
        examples: [
          '十进制10 → 二进制1010',
          '十进制255 → 十六进制FF',
          '二进制1010 → 十进制10',
        ],
        tips: [
          '十进制转二进制：除2取余，倒序排列',
          '二进制转十进制：按权展开求和',
          '十六进制用0-9和A-F表示',
        ],
      },
      {
        id: 'H3-2',
        title: '一维数组',
        content: '数组是一组相同类型数据的集合，通过下标访问每个元素。',
        examples: [
          'int a[5]; // 定义包含5个整数的数组',
          'int b[3] = {1, 2, 3}; // 定义并初始化',
          'for (int i = 0; i < 5; i++)\n    cin >> a[i];',
        ],
        tips: [
          '数组下标从0开始',
          '注意数组越界问题',
          '数组名表示数组首地址',
        ],
      },
    ],
  },
];

export const Handbook: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const currentHandbook = handbooks.find((h) => h.level === selectedLevel);

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
            <Book className="w-7 h-7 text-primary" />
            知识手册
          </h1>
          <p className="text-text-secondary text-sm">
            系统学习各等级知识点，打好坚实基础
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {handbooks.map((handbook) => (
              <button
                key={handbook.level}
                onClick={() => {
                  setSelectedLevel(handbook.level);
                  setExpandedTopic(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedLevel === handbook.level
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                Lv.{handbook.level} {handbook.name.split('·')[1]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {currentHandbook?.topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedTopic(expandedTopic === topic.id ? null : topic.id)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="font-bold text-text-primary">
                      {topic.title}
                    </span>
                  </div>
                  <motion.div
                    animate={{
                      rotate: expandedTopic === topic.id ? 90 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedTopic === topic.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-4 space-y-4">
                        <div className="bg-primary/5 rounded-xl p-4">
                          <h4 className="font-bold text-text-primary mb-2">📖 内容</h4>
                          <p className="text-text-secondary leading-relaxed">
                            {topic.content}
                          </p>
                        </div>

                        {topic.examples && (
                          <div className="bg-gray-900 rounded-xl p-4">
                            <h4 className="font-bold text-white mb-3">💻 示例代码</h4>
                            <pre className="text-green-400 text-sm font-mono overflow-x-auto">
                              {topic.examples.map((example, i) => (
                                <div key={i} className="mb-2">
                                  {example}
                                </div>
                              ))}
                            </pre>
                          </div>
                        )}

                        {topic.tips && (
                          <div className="bg-warning/10 rounded-xl p-4">
                            <h4 className="font-bold text-warning mb-3">💡 小贴士</h4>
                            <ul className="space-y-2">
                              {topic.tips.map((tip, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-text-secondary"
                                >
                                  <span className="text-warning">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate('/practice')}
                          icon={<Book className="w-4 h-4" />}
                        >
                          去练习相关题目
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

import { AnimatePresence } from 'framer-motion';
