import type { QuestionFormat } from "./question";

/** GET /api/admin/question-sets?subject= */
export type AdminQuestionSet = {
  id: string;
  title: string;
  questionCount: number;
};

/** 편집용 문제 (content는 DB의 JSONB 원본 그대로) */
export type AdminQuestion = {
  id: string;
  number: number;
  format: QuestionFormat;
  section: string | null;
  content: unknown;
  /** 정답 보기 인덱스 (0부터) */
  answer: number[];
  audioPath: string | null;
  /** 음원 미리 듣기용 signed URL */
  audioUrl: string | null;
};

/** PUT /api/admin/questions/[id] */
export type AdminQuestionUpdate = {
  section: string | null;
  answer: number[];
  audioPath: string | null;
  content: unknown;
};

/** GET /api/admin/concepts?subject= — 과목 > 단원 > 카드 */
export type AdminConceptCourse = {
  id: string;
  title: string;
  chapters: Array<{
    id: string;
    title: string;
    cards: AdminConceptCard[];
  }>;
};

export type AdminConceptCard = {
  id: string;
  /** 앵커로 쓰이는 식별자 (편집하지 않음) */
  slug: string;
  title: string;
  body: string;
};

/** PUT /api/admin/concept-cards/[id] */
export type AdminConceptCardUpdate = {
  title: string;
  body: string;
};

/** GET /api/admin/users — 회원 한 명 */
export type AdminUser = {
  id: string;
  loginId: string;
  nickname: string;
  isAdmin: boolean;
  /** 승인 시각, 승인 대기면 null */
  approvedAt: string | null;
  /** 가입 시각 (UUID v7 id에 담긴 생성 시각) */
  createdAt: string;
  /** 풀이 횟수 (전 과목) */
  attempts: number;
  lastAttemptAt: string | null;
};

/** PATCH /api/admin/users/[id] */
export type AdminUserUpdate = {
  approved: boolean;
};
