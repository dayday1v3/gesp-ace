export interface LevelConfig {
  level: number;
  name: string;
  description: string;
  unlockRequirement: number;
  examDuration: number;
  questionCount: {
    choice: number;
    judgment: number;
    coding: number;
  };
}

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    name: '编程入门',
    description: '掌握基本的编程概念和 C++ 入门知识',
    unlockRequirement: 0,
    examDuration: 120,
    questionCount: { choice: 15, judgment: 10, coding: 2 },
  },
  {
    level: 2,
    name: '程序基础设计',
    description: '掌握程序设计语言的特点和基础算法思想',
    unlockRequirement: 0.8,
    examDuration: 120,
    questionCount: { choice: 15, judgment: 10, coding: 2 },
  },
  {
    level: 3,
    name: '数据编码+基础算法',
    description: '掌握数据编码、进制转换和基础算法',
    unlockRequirement: 0.8,
    examDuration: 120,
    questionCount: { choice: 15, judgment: 10, coding: 2 },
  },
  {
    level: 4,
    name: '函数+排序+文件',
    description: '掌握函数、排序算法和文件操作',
    unlockRequirement: 0.8,
    examDuration: 120,
    questionCount: { choice: 15, judgment: 10, coding: 2 },
  },
  {
    level: 5,
    name: '数论+链表+二分',
    description: '掌握数论、链表和二分查找',
    unlockRequirement: 0.8,
    examDuration: 180,
    questionCount: { choice: 15, judgment: 10, coding: 2 },
  },
  {
    level: 6,
    name: '树+搜索+动态规划',
    description: '掌握树结构、搜索算法和动态规划',
    unlockRequirement: 0.8,
    examDuration: 180,
    questionCount: { choice: 15, judgment: 10, coding: 2 },
  },
  {
    level: 7,
    name: '图论初步',
    description: '掌握图的基本概念和常见算法',
    unlockRequirement: 0.8,
    examDuration: 180,
    questionCount: { choice: 15, judgment: 10, coding: 2 },
  },
  {
    level: 8,
    name: '高级算法',
    description: '掌握高级算法和数据结构',
    unlockRequirement: 0.8,
    examDuration: 180,
    questionCount: { choice: 15, judgment: 10, coding: 2 },
  },
];

export const LEVEL_MAP = new Map(LEVELS.map((l) => [l.level, l]));

export function getLevelName(level: number): string {
  return LEVEL_MAP.get(level)?.name ?? `等级${level}`;
}

export function getLevelConfig(level: number): LevelConfig | undefined {
  return LEVEL_MAP.get(level);
}

export function getUnlockedLevels(unlockedLevel: number): number[] {
  return LEVELS.filter((l) => l.level <= unlockedLevel).map((l) => l.level);
}

export function getNextUnlockedLevel(currentLevel: number): number | null {
  const nextLevel = LEVELS.find((l) => l.level === currentLevel + 1);
  return nextLevel ? nextLevel.level : null;
}

export function canUnlockLevel(level: number, correctRate: number): boolean {
  const config = getLevelConfig(level);
  if (!config) return false;
  return correctRate >= config.unlockRequirement;
}
