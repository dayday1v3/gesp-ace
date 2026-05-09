import prisma from '../config/database.js';
import { judgeService, LANGUAGE_IDS } from '../config/judge.js';
import { JudgeResult, TestCaseResult, AIReview, AIIssue } from '../models/types.js';
import { NotFoundError } from '../middlewares/errorHandler.js';

export class JudgeCodeService {
  async runCode(code: string, questionId: string): Promise<{
    output: string;
    time: number;
    memory: number;
    testCases: TestCaseResult[];
  }> {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundError('题目不存在');
    }

    const testCases = (question.testCases as Array<{ input: string; output: string }>) || [];

    if (testCases.length === 0) {
      testCases.push({ input: '', output: question.answer });
    }

    const results: TestCaseResult[] = [];

    for (const tc of testCases) {
      const result = await judgeService.runAndWait({
        source_code: code,
        language_id: LANGUAGE_IDS.cpp,
        stdin: tc.input,
        expected_output: tc.output,
        cpu_time_limit: question.timeLimit,
        memory_limit: question.memoryLimit,
      });

      const passed = result.status.id === 3;
      const actualOutput = result.stdout?.trim() || '';
      const expectedOutput = tc.output.trim();

      results.push({
        passed: passed && actualOutput === expectedOutput,
        expectedOutput,
        actualOutput,
        time: parseFloat(result.time) * 1000,
        memory: result.memory,
        score: passed && actualOutput === expectedOutput ? 5 : 0,
      });
    }

    const totalTime = Math.max(...results.map(r => r.time));
    const totalMemory = Math.max(...results.map(r => r.memory));
    const firstOutput = results[0]?.actualOutput || '';

    return {
      output: firstOutput,
      time: totalTime,
      memory: totalMemory,
      testCases: results,
    };
  }

  async submitCode(
    code: string,
    questionId: string,
    practiceId: string
  ): Promise<{
    accepted: boolean;
    score: number;
    testCases: TestCaseResult[];
    aiReview?: AIReview;
  }> {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundError('题目不存在');
    }

    const testCases = (question.testCases as Array<{ input: string; output: string }>) || [];
    const testCaseScore = testCases.length > 0 ? question.points / testCases.length : question.points;

    const results: TestCaseResult[] = [];
    let totalScore = 0;

    for (const tc of testCases) {
      const result = await judgeService.runAndWait({
        source_code: code,
        language_id: LANGUAGE_IDS.cpp,
        stdin: tc.input,
        expected_output: tc.output,
        cpu_time_limit: question.timeLimit,
        memory_limit: question.memoryLimit,
      });

      const passed = result.status.id === 3;
      const actualOutput = result.stdout?.trim() || '';
      const expectedOutput = tc.output.trim();
      const casePassed = passed && actualOutput === expectedOutput;

      if (casePassed) {
        totalScore += testCaseScore;
      }

      results.push({
        passed: casePassed,
        expectedOutput,
        actualOutput,
        time: parseFloat(result.time) * 1000,
        memory: result.memory,
        score: casePassed ? Math.round(testCaseScore) : 0,
      });
    }

    const accepted = results.every(r => r.passed);
    const finalScore = Math.round(totalScore);

    await prisma.answer.updateMany({
      where: {
        practiceId,
        questionId,
      },
      data: {
        userAnswer: code,
        isCorrect: accepted,
        score: finalScore,
      },
    });

    const aiReview = this.generateAIReview(code, results, accepted);

    return {
      accepted,
      score: finalScore,
      testCases: results,
      aiReview,
    };
  }

  private generateAIReview(code: string, testCases: TestCaseResult[], accepted: boolean): AIReview {
    const issues: AIIssue[] = [];

    if (!code.includes('iostream') && !code.includes('bits/stdc++.h')) {
      issues.push({
        type: 'error',
        message: '代码缺少必要的头文件',
      });
    }

    if (code.includes('using namespace std') === false && !code.includes('std::')) {
      issues.push({
        type: 'suggestion',
        message: '建议使用 std:: 命名空间或 using namespace std',
      });
    }

    if (!code.includes('return 0') && !code.includes('int main')) {
      issues.push({
        type: 'warning',
        message: 'main 函数应返回 0 表示正常结束',
      });
    }

    if (code.split('\n').length > 50) {
      issues.push({
        type: 'suggestion',
        message: '代码较长，建议优化逻辑结构',
      });
    }

    let baseScore = accepted ? 85 : 60;
    if (issues.some(i => i.type === 'error')) baseScore -= 20;
    if (issues.some(i => i.type === 'warning')) baseScore -= 10;
    baseScore = Math.max(baseScore, 0);

    let comment = '';
    if (accepted && issues.length === 0) {
      comment = '代码正确，能够完成题目要求，格式良好。';
    } else if (accepted) {
      comment = '代码正确，能够完成题目要求。建议注意代码格式和最佳实践。';
    } else {
      const failedCount = testCases.filter(t => !t.passed).length;
      comment = `代码存在${failedCount}个测试点未通过，请检查输出格式和边界条件。`;
    }

    return {
      score: baseScore,
      issues,
      overallComment: comment,
    };
  }
}

export const judgeCodeService = new JudgeCodeService();
