import type { LocalizedText, QuestionResult, QuestionView } from "./question";

/** 풀이 결과 (prisma/schema.prisma의 AttemptResult와 같은 값) */
export type AttemptOutcome = "CORRECT" | "INCORRECT" | "DONT_KNOW";

/** GET /api/exams/[subject]/questions/random */
export type RandomQuestionResponse = {
  question: QuestionView;
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
