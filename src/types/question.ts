/**
 * 형태(format)와 무관하게 화면·API가 다루는 문제 타입.
 * DB의 questions.content(JSONB)는 형태마다 구조가 다르며, src/utils/question-format/ 이 이 타입으로 바꾼다.
 */

/** prisma/schema.prisma의 QuestionFormat과 같은 값 */
export type QuestionFormat = "AWS_CERT" | "KR_TECH_WRITTEN" | "TOEIC_PART5";

/** 원문 언어가 형태마다 달라 둘 중 하나 이상만 있다 (AWS: en 필수·ko 번역, 기사: ko만) */
export type LocalizedText = {
  ko: string | null;
  en: string | null;
};

export type QuestionOption = {
  /** 보기 순서 인덱스(0부터). 선택·정답은 이 값으로 주고받는다 */
  index: number;
  /** 형태별 표기 (A, B… / ①, ②…) */
  label: string;
  text: LocalizedText;
  /** 보기 자체가 이미지인 경우 */
  image: string | null;
};

/**
 * 고르는 방식
 * - single: 하나만 고른다
 * - multiple: count개를 고른다 (AWS "Choose two" 등)
 */
export type SelectionRule = { mode: "single" } | { mode: "multiple"; count: number };

/** 풀이 화면에 내려주는 문제 (정답·해설 제외) */
export type QuestionView = {
  id: string;
  number: number;
  format: QuestionFormat;
  section: string | null;
  /** 출처: 문제 묶음 제목 · 세부 구분 · 번호 (예: "해커스 토익 700+ 실전모의고사 · Part 5 · 101번") */
  source: string | null;
  stem: LocalizedText;
  /** 문제에 첨부된 이미지 (표, 다이어그램 등) */
  exhibitImages: string[];
  options: QuestionOption[];
  selection: SelectionRule;
};

/** 채점 후 내려주는 정답·해설 */
export type QuestionResult = {
  correct: boolean;
  answer: number[];
  explanation: LocalizedText | null;
  /** 정답에 대한 원본 메모 (AWS 일부 문제) */
  answerNote: string | null;
};
