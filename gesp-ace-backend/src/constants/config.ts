export const CACHE_KEYS = {
  daily_questions: (userId: string, date: string) => `daily:${userId}:${date}`,
  user_progress: (userId: string) => `user:${userId}:progress`,
  question_list: (level: number, page: number) => `questions:${level}:${page}`,
  question_detail: (id: string) => `question:${id}`,
  knowledge_tree: (level?: number) => level ? `knowledge:tree:${level}` : 'knowledge:tree:all',
  diagnosis: (userId: string) => `diagnosis:${userId}`,
  weekly_report: (userId: string, week: string) => `report:weekly:${userId}:${week}`,
  monthly_report: (userId: string, month: string) => `report:monthly:${userId}:${month}`,
  leaderboard: (type: string) => `leaderboard:${type}`,
} as const;

export const CACHE_TTL = {
  daily_questions: 60 * 60 * 24,
  user_stats: 60 * 5,
  question_detail: 60 * 60,
  knowledge_tree: 60 * 60 * 24,
  diagnosis: 60 * 30,
  leaderboard: 60 * 15,
} as const;

export const PRACTICE_CONFIG = {
  DAILY_QUESTION_COUNT: 3,
  EXAM_CHOICE_COUNT: 15,
  EXAM_JUDGMENT_COUNT: 10,
  EXAM_CODING_COUNT: 2,
  EXAM_TIME_LIMIT_L1_L4: 120,
  EXAM_TIME_LIMIT_L5_L8: 180,
  CODING_TIME_LIMIT: 60 * 60 * 2,
} as const;

export const DIFFICULTY_LABELS = {
  1: '简单',
  2: '中等',
  3: '困难',
} as const;

export const QUESTION_TYPE_LABELS = {
  choice: '单选题',
  judgment: '判断题',
  coding: '编程题',
} as const;

export const PRACTICE_TYPE_LABELS = {
  daily: '每日一练',
  topic: '刷题',
  exam: '模拟考试',
  timed: '计时练习',
} as const;

export const LEVEL_STATUS = {
  LOCKED: 'locked',
  IN_PROGRESS: 'in_progress',
  WEAK: 'weak',
  MASTERED: 'mastered',
} as const;

export const MASTERY_THRESHOLD = 0.8;
export const WEAK_THRESHOLD = 0.4;

export const STREAK_BONUS_POINTS = 10;
export const PERFECT_DAY_BONUS = 5;

export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function getWeekString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + 1);
  return `${year}-W${Math.ceil(start.getDate() / 7).toString().padStart(2, '0')}`;
}

export function getMonthString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}
