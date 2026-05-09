const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mockUsers = [
  { id: '1', username: 'test', password: '123456', level: 2, score: 1500 }
];

const mockDailyQuestions = [
  {
    id: 'q1',
    type: 'choice',
    content: '下列哪个不是C++的关键字？',
    options: ['int', 'float', 'String', 'char'],
    correctAnswer: 'C',
    knowledgePoint: { code: 'L2-T2', name: '变量定义与使用' },
    difficulty: 1,
    points: 2,
    analysis: 'C++的关键字包括int、float、char等，而String不是C++关键字。'
  },
  {
    id: 'q2',
    type: 'judgment',
    content: '在C++中，变量名可以包含数字。',
    correctAnswer: 'A',
    knowledgePoint: { code: 'L2-T2', name: '变量定义与使用' },
    difficulty: 1,
    points: 2,
    analysis: '变量名可以包含数字，但不能以数字开头。'
  },
  {
    id: 'q3',
    type: 'choice',
    content: '关于break语句的说法正确的是？',
    options: [
      'break只能用于循环语句',
      'break可以跳出所有嵌套循环',
      'break用于结束当前循环',
      'break可以单独使用'
    ],
    correctAnswer: 'C',
    knowledgePoint: { code: 'L2-T3', name: '循环结构' },
    difficulty: 2,
    points: 3,
    analysis: 'break语句用于提前结束当前循环（for、while、do-while），跳出循环体。'
  }
];

let mockPracticeRecords = [];

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'GESP Ace Backend is running!' });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = mockUsers.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: user.id,
          username: user.username,
          level: user.level,
          score: user.score
        }
      }
    });
  } else {
    res.status(401).json({ code: 401, message: '用户名或密码错误' });
  }
});

app.post('/api/v1/auth/register', (req, res) => {
  const { username, password } = req.body;
  
  if (mockUsers.find(u => u.username === username)) {
    res.status(400).json({ code: 400, message: '用户名已存在' });
    return;
  }
  
  const newUser = {
    id: String(mockUsers.length + 1),
    username,
    password,
    level: 1,
    score: 0
  };
  
  mockUsers.push(newUser);
  
  res.json({
    code: 200,
    message: '注册成功',
    data: {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: newUser.id,
        username: newUser.username,
        level: newUser.level,
        score: newUser.score
      }
    }
  });
});

app.get('/api/v1/questions/daily', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      questions: mockDailyQuestions,
      practiceId: 'practice-' + Date.now()
    }
  });
});

app.post('/api/v1/practice/start', (req, res) => {
  const { type, targetLevel, count } = req.body;
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      practiceId: 'practice-' + Date.now(),
      questions: mockDailyQuestions.slice(0, count || 3)
    }
  });
});

app.post('/api/v1/practice/answer', (req, res) => {
  const { practiceId, questionId, answer } = req.body;
  const question = mockDailyQuestions.find(q => q.id === questionId);
  
  const isCorrect = question && answer === question.correctAnswer;
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      isCorrect,
      correctAnswer: question?.correctAnswer || '',
      score: isCorrect ? (question?.points || 0) : 0
    }
  });
});

app.post('/api/v1/practice/complete', (req, res) => {
  const { practiceId } = req.body;
  
  mockPracticeRecords.push({
    practiceId,
    completedAt: new Date().toISOString()
  });
  
  res.json({
    code: 200,
    message: '练习完成',
    data: { practiceId }
  });
});

app.get('/api/v1/users/me', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      id: '1',
      username: 'test',
      level: 2,
      score: 1500,
      progress: {
        totalQuestions: 150,
        correctAnswers: 120,
        streak: 7
      }
    }
  });
});

app.get('/api/v1/diagnosis', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      weakPoints: [
        { code: 'L2-T3', name: '循环结构', accuracy: 65 },
        { code: 'L2-T4', name: '条件分支', accuracy: 70 }
      ],
      strongPoints: [
        { code: 'L2-T1', name: '基本数据类型', accuracy: 95 },
        { code: 'L2-T2', name: '变量定义与使用', accuracy: 88 }
      ],
      predictedScore: 78,
      suggestions: [
        '建议加强循环结构的练习',
        '建议多做条件分支相关题目'
      ]
    }
  });
});

app.get('/api/v1/reports/weekly', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: {
      week: '2024-05-06至2024-05-12',
      totalQuestions: 35,
      correctRate: 82,
      studyDays: 5,
      scoreChange: 120
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
