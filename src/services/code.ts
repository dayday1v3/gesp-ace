import api from './api';

export interface CodeRunRequest {
  code: string;
  questionId: string;
}

export interface TestCaseResult {
  passed: boolean;
  expectedOutput: string;
  actualOutput: string;
  time: number;
  memory: number;
  score: number;
}

export interface CodeRunResponse {
  output: string;
  time: number;
  memory: number;
  testCases: TestCaseResult[];
}

export interface AIIssue {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  line?: number;
}

export interface AIReview {
  score: number;
  issues: AIIssue[];
  overallComment: string;
}

export interface CodeSubmitRequest extends CodeRunRequest {
  practiceId: string;
}

export interface CodeSubmitResponse {
  accepted: boolean;
  score: number;
  testCases: TestCaseResult[];
  aiReview?: AIReview;
}

export const codeAPI = {
  run: (data: CodeRunRequest) => api.post<CodeRunResponse>('/code/run', data),

  submit: (data: CodeSubmitRequest) =>
    api.post<CodeSubmitResponse>('/code/submit', data),
};
