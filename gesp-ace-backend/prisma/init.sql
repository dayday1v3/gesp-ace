-- Initialize database with default data

-- Insert levels
INSERT INTO levels (level, name, description, unlock_requirement, status) VALUES
(1, '编程入门', '掌握基本的编程概念和 C++ 入门知识', 0, 'unlocked'),
(2, '程序基础设计', '掌握程序设计语言的特点和基础算法思想', 0.80, 'locked'),
(3, '数据编码+基础算法', '掌握数据编码、进制转换和基础算法', 0.80, 'locked'),
(4, '函数+排序+文件', '掌握函数、排序算法和文件操作', 0.80, 'locked'),
(5, '数论+链表+二分', '掌握数论、链表和二分查找', 0.80, 'locked'),
(6, '树+搜索+动态规划', '掌握树结构、搜索算法和动态规划', 0.80, 'locked'),
(7, '图论初步', '掌握图的基本概念和常见算法', 0.80, 'locked'),
(8, '高级算法', '掌握高级算法和数据结构', 0.80, 'locked')
ON CONFLICT (level) DO NOTHING;

-- Insert knowledge points for Level 1
INSERT INTO knowledge_points (code, name, level_id, sort_order) VALUES
('L1-T1', '计算机基础与编程环境', 1, 1),
('L1-T2', '变量定义与使用', 1, 2),
('L1-T3', '基本数据类型', 1, 3),
('L1-T4', '运算符与表达式', 1, 4),
('L1-T5', '控制语句结构', 1, 5),
('L1-T6', '输入输出语句', 1, 6)
ON CONFLICT (code) DO NOTHING;

-- Insert achievements
INSERT INTO achievements (id, name, description, icon, condition_type, condition_value) VALUES
('first_practice', '初次练习', '完成第一次练习', '🌱', 'practice_count', 1),
('streak_3', '连续3天', '连续打卡3天', '🔥', 'streak_days', 3),
('streak_7', '连续7天', '连续打卡7天', '⭐', 'streak_days', 7),
('streak_30', '连续30天', '连续打卡30天', '👑', 'streak_days', 30),
('master_level1', '一级达人', '掌握一级所有知识点', '🏆', 'level_mastered', 1),
('master_level2', '二级达人', '掌握二级所有知识点', '🏆', 'level_mastered', 2),
('question_100', '百题斩', '完成100道题目', '📚', 'question_count', 100),
('question_500', '五百题斩', '完成500道题目', '📖', 'question_count', 500),
('perfect_day', '完美一天', '每日一练全对', '💯', 'daily_perfect', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert sample questions
INSERT INTO questions (id, type, content, options, answer, analysis, difficulty, points, level_id, knowledge_point_id, year, season, test_cases) VALUES
(
  'q001',
  'choice',
  '在C++中，以下哪个是合法的变量名？',
  '["2name", "_name", "my-name", "class"]'::jsonb,
  '_name',
  '变量名的命名规则：必须以字母或下划线开头（不能是数字）；不能包含特殊字符如"-"；不能使用关键字如"class"。因此B选项"_name"是正确的。',
  1,
  2,
  1,
  (SELECT id FROM knowledge_points WHERE code = 'L1-T2'),
  2024,
  '春季',
  NULL
),
(
  'q002',
  'judgment',
  'C++中，所有语句都必须以分号结束。',
  NULL,
  '错误',
  '在C++中，除了结构控制语句的末尾（如if、while等），其他语句确实需要以分号结束。但结构控制语句本身不需要分号。',
  1,
  2,
  1,
  (SELECT id FROM knowledge_points WHERE code = 'L1-T6'),
  2024,
  '春季',
  NULL
),
(
  'q003',
  'coding',
  '请编写一个程序，输入一个整数，输出它的两倍。',
  NULL,
  '#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n * 2;
    return 0;
}',
  '这道题需要先读取输入的整数，然后将这个整数乘以2并输出。',
  1,
  25,
  1,
  (SELECT id FROM knowledge_points WHERE code = 'L1-T6'),
  2024,
  '春季',
  '[{"input": "5", "output": "10"}, {"input": "100", "output": "200"}, {"input": "-3", "output": "-6"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_level_id ON questions(level_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_points_level ON knowledge_points(level_id);
CREATE INDEX IF NOT EXISTS idx_practices_user ON practices(user_id);
CREATE INDEX IF NOT EXISTS idx_practices_started ON practices(started_at);
CREATE INDEX IF NOT EXISTS idx_answers_practice ON answers(practice_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_user ON mistakes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
