import type { z } from "zod";
import type {
  LocalizedText,
  QuestionFormat,
  QuestionOption,
  SelectionRule,
} from "@/types/question";

/** 형태별 content를 형태와 무관한 구조로 펼친 결과 */
export type NormalizedContent = {
  stem: LocalizedText;
  exhibitImages: string[];
  options: Array<Omit<QuestionOption, "index" | "label">>;
  explanation: LocalizedText | null;
  answerNote: string | null;
};

/**
 * 문제 형태 하나의 규칙.
 * 새 형태를 추가하려면 이 인터페이스를 구현하고 index.ts의 레지스트리에 등록한다.
 */
export type QuestionFormatSpec<Content> = {
  format: QuestionFormat;
  /** questions.content(JSONB)의 구조 */
  contentSchema: z.ZodType<Content>;
  normalize: (content: Content) => NormalizedContent;
  /** 보기 순서 인덱스 → 표기 */
  optionLabel: (index: number) => string;
  /** 정답 개수 허용 범위 */
  answerCount: { min: number; max: number };
  selection: (answer: number[]) => SelectionRule;
  /** 사용자가 고른 보기 인덱스가 정답인지 */
  isCorrect: (answer: number[], selected: number[]) => boolean;
};

export const defineFormat = <Content>(spec: QuestionFormatSpec<Content>) => spec;
