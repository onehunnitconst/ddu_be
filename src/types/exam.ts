import type { LocalizedText, QuestionResult, QuestionView } from "./question";

/** 풀이 결과 (prisma/schema.prisma의 AttemptResult와 같은 값) */
export type AttemptOutcome = "CORRECT" | "INCORRECT" | "DONT_KNOW";

/** 문제를 고르는 범위: 과목 전체 | 마지막 풀이가 오답·모름인 문제 */
export type PracticeMode = "all" | "wrong";

/** GET /api/exams/[subject]/questions/random?exclude=&mode= */
export type RandomQuestionResponse = {
  question: QuestionView;
  /** 고를 수 있었던 문제 수 (오답 풀이에서는 남은 오답 수, 지금 문제 포함) */
  poolSize: number;
};

/** GET /api/questions/[id] — 풀이 기록에서 다시 보기 (푼 적 있는 문제만) */
export type QuestionReviewResponse = {
  question: QuestionView;
  /** 마지막 풀이 기준의 채점 결과와 정답·해설 */
  result: QuestionResult;
  /** 최근 순 */
  attempts: Array<{ outcome: AttemptOutcome; selected: number[]; attemptedAt: string }>;
};

/** POST /api/questions/[id]/attempts — 보기를 고르거나, 모르겠다고 한다 */
export type AttemptRequest = { selected: number[] } | { dontKnow: true };

export type AttemptResponse = {
  outcome: AttemptOutcome;
  result: QuestionResult;
  /** 로그인 상태여서 풀이 기록에 저장됐는지 */
  recorded: boolean;
};

export type HistoryItem = {
  questionId: string;
  number: number;
  /** 문제 본문 앞부분 */
  stemPreview: LocalizedText;
  attempts: number;
  correct: number;
  incorrect: number;
  dontKnow: number;
  lastOutcome: AttemptOutcome;
  lastAttemptedAt: string;
};

/** GET /api/exams/[subject]/history */
export type HistoryResponse = {
  summary: {
    /** 과목 전체 문제 수 */
    totalQuestions: number;
    /** 한 번 이상 푼 문제 수 */
    solvedQuestions: number;
    totalAttempts: number;
    correctAttempts: number;
  };
  /** 최근에 푼 순서 */
  items: HistoryItem[];
};
