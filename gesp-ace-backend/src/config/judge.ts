const JUDGE0_URL = process.env.JUDGE0_URL || 'http://localhost:2358';

export interface JudgeSubmission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

export interface JudgeResult {
  token: string;
  status: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  time: string;
  memory: number;
}

export const LANGUAGE_IDS = {
  cpp: 54,
  c: 50,
  python3: 71,
  java: 62,
} as const;

export const STATUS_CODES = {
  QUEUED: 1,
  PROCESSING: 2,
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT_EXCEEDED: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR_SIGSEGV: 7,
  RUNTIME_ERROR_SIGx87: 8,
  RUNTIME_ERROR: 9,
  OUT_OF_RANGE: 10,
  PRESENTATION_ERROR: 11,
  MEMORY_LIMIT_EXCEEDED: 12,
  SECURITY_VIOLATION: 13,
  INPUT_PREPARATION_CRASH: 14,
  CHALLENGE: 15,
  UNKNOWN: 16,
} as const;

export class JudgeService {
  private baseUrl: string;

  constructor(baseUrl: string = JUDGE0_URL) {
    this.baseUrl = baseUrl;
  }

  private encodeBase64(str: string): string {
    return Buffer.from(str).toString('base64');
  }

  private decodeBase64(str: string): string {
    return Buffer.from(str, 'base64').toString('utf-8');
  }

  async createSubmission(submission: JudgeSubmission): Promise<string> {
    const response = await fetch(`${this.baseUrl}/submissions?base64=false&wait=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_code: submission.source_code,
        language_id: submission.language_id,
        stdin: submission.stdin ? this.encodeBase64(submission.stdin) : undefined,
        expected_output: submission.expected_output
          ? this.encodeBase64(submission.expected_output)
          : undefined,
        cpu_time_limit: submission.cpu_time_limit || 1,
        memory_limit: submission.memory_limit || 256000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.token;
  }

  async getSubmission(token: string): Promise<JudgeResult> {
    const response = await fetch(`${this.baseUrl}/submissions/${token}?base64=false`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      ...result,
      stdout: result.stdout ? this.decodeBase64(result.stdout) : null,
      stderr: result.stderr ? this.decodeBase64(result.stderr) : null,
      compile_output: result.compile_output ? this.decodeBase64(result.compile_output) : null,
    };
  }

  async runAndWait(submission: JudgeSubmission): Promise<JudgeResult> {
    const token = await this.createSubmission(submission);

    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await this.getSubmission(token);

      if (result.status.id !== STATUS_CODES.QUEUED && result.status.id !== STATUS_CODES.PROCESSING) {
        return result;
      }

      attempts++;
    }

    throw new Error('Judge execution timeout');
  }

  async compileCode(sourceCode: string, languageId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.runAndWait({
        source_code: sourceCode,
        language_id: languageId,
      });

      if (result.status.id === STATUS_CODES.COMPILATION_ERROR) {
        return {
          success: false,
          error: result.compile_output || 'Compilation error',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const judgeService = new JudgeService();

export async function checkJudge0Health(): Promise<boolean> {
  try {
    const response = await fetch(`${JUDGE0_URL}/`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}
