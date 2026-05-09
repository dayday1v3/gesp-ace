export const ErrorCode = {
  SUCCESS: { code: 200, message: '成功' },

  BAD_REQUEST: { code: 400, message: '请求参数错误' },
  UNAUTHORIZED: { code: 401, message: '未登录' },
  FORBIDDEN: { code: 403, message: '无权限访问' },
  NOT_FOUND: { code: 404, message: '资源不存在' },
  METHOD_NOT_ALLOWED: { code: 405, message: '方法不允许' },
  CONFLICT: { code: 409, message: '资源冲突' },
  TOO_MANY_REQUESTS: { code: 429, message: '请求过于频繁' },
  INTERNAL_SERVER_ERROR: { code: 500, message: '服务器内部错误' },

  INVALID_PARAMS: { code: 1001, message: '参数错误' },
  NOT_FOUND_RESOURCE: { code: 1002, message: '资源不存在' },

  USERNAME_EXISTS: { code: 2001, message: '用户名已存在' },
  EMAIL_EXISTS: { code: 2002, message: '邮箱已被使用' },
  WRONG_PASSWORD: { code: 2003, message: '密码错误' },
  TOKEN_EXPIRED: { code: 2004, message: 'Token 已过期' },
  TOKEN_INVALID: { code: 2005, message: 'Token 无效' },
  ACCOUNT_DISABLED: { code: 2006, message: '账户已被禁用' },
  USERNAME_NOT_FOUND: { code: 2007, message: '用户名不存在' },

  DAILY_COMPLETED: { code: 3001, message: '今日已完成每日一练' },
  PRACTICE_NOT_FOUND: { code: 3002, message: '练习记录不存在' },
  QUESTION_NOT_FOUND: { code: 3003, message: '题目不存在' },
  ANSWER_ALREADY_SUBMITTED: { code: 3004, message: '已提交过答案' },
  PRACTICE_ALREADY_COMPLETED: { code: 3005, message: '练习已完成' },
  CANNOT_START_EXAM: { code: 3006, message: '无法开始考试' },

  CODE_COMPILE_ERROR: { code: 4001, message: '代码编译错误' },
  CODE_TIME_LIMIT: { code: 4002, message: '运行超时' },
  CODE_MEMORY_LIMIT: { code: 4003, message: '内存超限' },
  CODE_RUNTIME_ERROR: { code: 4004, message: '运行时错误' },
  CODE_WRONG_ANSWER: { code: 4005, message: '答案错误' },
  JUDGE_SERVICE_ERROR: { code: 4006, message: '判题服务错误' },

  ACHIEVEMENT_ALREADY_EARNED: { code: 5001, message: '成就已获得' },

  FAVORITE_ALREADY_EXISTS: { code: 6001, message: '已收藏该题目' },
  FAVORITE_NOT_FOUND: { code: 6002, message: '收藏不存在' },

  MISTAKE_ALREADY_EXISTS: { code: 7001, message: '错题已存在' },
  MISTAKE_NOT_FOUND: { code: 7002, message: '错题不存在' },

  HANDBOOK_NOT_FOUND: { code: 8001, message: '手册不存在' },
  HANDBOOK_ALREADY_READ: { code: 8002, message: '手册已阅读' },

  REPORT_NOT_FOUND: { code: 9001, message: '报告不存在' },
} as const;

export type ErrorCodeType = typeof ErrorCode;
export type ErrorCodeKey = keyof ErrorCode;
