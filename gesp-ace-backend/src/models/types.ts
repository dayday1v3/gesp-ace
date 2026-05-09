import {
  User,
  Level,
  KnowledgePoint,
  Question,
  Practice,
  Answer,
  Mistake,
  Favorite,
  Achievement,
  UserAchievement,
  Handbook,
  HandbookRead,
  Report,
  UserLevelProgress,
  QuestionType,
  PracticeType
} from '@prisma/client';

export type {
  User,
  Level,
  KnowledgePoint,
  Question,
  Practice,
  Answer,
  Mistake,
  Favorite,
  Achievement,
  UserAchievement,
  Handbook,
  HandbookRead,
  Report,
  UserLevelProgress
};

export { QuestionType, PracticeType };

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export interface LevelProgressInfo {
  level: number;
  name: string;
  correctRate: number;
  practicedCount: number;
  status: 'locked' | 'in_progress' | 'mastered' | 'weak';
  knowledgePoints?: KnowledgeProgressInfo[];
}

export interface KnowledgeProgressInfo {
  code: string;
  name: string;
  correctRate: number;
}

export interface QuestionWithKnowledge extends Question {
  knowledgePoint?: KnowledgePoint | null;
}

export interface PracticeWithAnswers extends Practice {
  answers: (Answer & {
    question: QuestionWithKnowledge;
  })[];
}

export interface WeakPoint {
  knowledgeCode: string;
  knowledgeName: string;
  errorRate: number;
  recentMistakes: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface DiagnosisRecommendation {
  type: 'daily' | 'topic' | 'exam';
  title: string;
  description: string;
  knowledgeCodes: string[];
  priority: number;
}

export interface PredictedScore {
  low: number;
  mid: number;
  high: number;
}

export interface DiagnosisReport {
  weakPoints: WeakPoint[];
  recommendations: DiagnosisRecommendation[];
  predictedScore: PredictedScore;
}

export interface TestCase {
  input: string;
  output: string;
  score?: number;
}

export interface TestCaseResult {
  passed: boolean;
  expectedOutput: string;
  actualOutput: string;
  time: number;
  memory: number;
  score: number;
}

export interface JudgeResult {
  accepted: boolean;
  score: number;
  output: string;
  error?: string;
  testCases: TestCaseResult[];
  time: number;
  memory: number;
}

export interface AIReview {
  score: number;
  issues: AIIssue[];
  overallComment: string;
}

export interface AIIssue {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  line?: number;
}

export interface DailyQuestionsResponse {
  date: string;
  questions: Pick<Question, 'id' | 'type' | 'content' | 'options' | 'knowledgePoint' | 'difficulty' | 'points'>[];
}

export interface PracticeStatistics {
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  streakDays: number;
  newAchievements: string[];
}

export interface WeeklyReport {
  period: string;
  stats: {
    practiceDays: number;
    totalQuestions: number;
    correctRate: number;
    timeSpent: number;
    improvedTopics: string[];
  };
}

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}
