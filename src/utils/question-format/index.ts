import type {
  QuestionFormat,
  QuestionResult,
  QuestionView,
} from "@/types/question";
import { awsCertFormat } from "./aws-cert";
import { krTechWrittenFormat } from "./kr-tech-written";
import { toeicPart2Format } from "./toeic-part2";
import { toeicPart5Format } from "./toeic-part5";
import type { NormalizedContent, QuestionFormatSpec } from "./spec";

/** 형태 레지스트리: format 값으로 해당 형태의 규칙을 찾는다 */
const FORMATS: { [F in QuestionFormat]: QuestionFormatSpec<unknown> } = {
  AWS_CERT: awsCertFormat as QuestionFormatSpec<unknown>,
  KR_TECH_WRITTEN: krTechWrittenFormat as QuestionFormatSpec<unknown>,
  TOEIC_PART2: toeicPart2Format as QuestionFormatSpec<unknown>,
  TOEIC_PART5: toeicPart5Format as QuestionFormatSpec<unknown>,
};

export function getQuestionFormat(format: QuestionFormat) {
  return FORMATS[format];
}

export class QuestionFormatError extends Error {
  constructor(
    readonly questionId: string,
    message: string,
  ) {
    super(`[question ${questionId}] ${message}`);
    this.name = "QuestionFormatError";
  }
}

/** DB의 questions 행에서 형태 해석에 필요한 값 */
export type QuestionRecord = {
  id: string;
  number: number;
  format: QuestionFormat;
  section: string | null;
  content: unknown;
  answer: number[];
  /** 출처 표시용 문제 묶음 (조회 시 함께 가져온 경우) */
  set?: { title: string };
};

/** "묶음 제목 · 세부 구분 · N번" (묶음을 모르면 null) */
const toSource = ({ set, section, number }: QuestionRecord) =>
  set ? [set.title, section, `${number}번`].filter(Boolean).join(" · ") : null;

export type ParsedQuestion = {
  record: QuestionRecord;
  spec: QuestionFormatSpec<unknown>;
  content: NormalizedContent;
};

/**
 * format으로 형태를 식별해 content를 검증·정규화한다.
 * 구조가 맞지 않거나 정답이 형태 규칙에 어긋나면 QuestionFormatError를 던진다.
 */
export function parseQuestion(record: QuestionRecord): ParsedQuestion {
  const spec = getQuestionFormat(record.format);
  if (!spec) throw new QuestionFormatError(record.id, `unknown format: ${record.format}`);

  const parsed = spec.contentSchema.safeParse(record.content);
  if (!parsed.success) {
    throw new QuestionFormatError(record.id, `invalid ${record.format} content: ${parsed.error.message}`);
  }
  const content = spec.normalize(parsed.data);

  const { answer } = record;
  const { min, max } = spec.answerCount;
  const inRange = answer.every((index) => index >= 0 && index < content.options.length);
  const unique = new Set(answer).size === answer.length;
  if (answer.length < min || answer.length > max || !inRange || !unique) {
    throw new QuestionFormatError(record.id, `invalid answer for ${record.format}: [${answer}]`);
  }

  return { record, spec, content };
}

/** 풀이 화면용 (정답·해설 제외). 음원 URL은 서버가 Storage에서 발급해 덧붙인다 */
export function toQuestionView({ record, spec, content }: ParsedQuestion): Omit<QuestionView, "audioUrl"> {
  return {
    id: record.id,
    number: record.number,
    format: record.format,
    section: record.section,
    source: toSource(record),
    stem: content.stem,
    exhibitImages: content.exhibitImages,
    options: content.options.map((option, index) => ({
      ...option,
      index,
      label: spec.optionLabel(index),
    })),
    selection: spec.selection(record.answer),
  };
}

/** 사용자가 고른 보기 인덱스를 형태별 규칙으로 채점한다 */
export function gradeQuestion(
  { record, spec, content }: ParsedQuestion,
  selected: number[],
): QuestionResult {
  return {
    correct: spec.isCorrect(record.answer, [...new Set(selected)]),
    answer: record.answer,
    explanation: content.explanation,
    answerNote: content.answerNote,
  };
}

/** 클라이언트에서 정답 인덱스를 표기로 보여줄 때 (예: [0, 2] → "A, C") */
export function formatAnswerLabels(format: QuestionFormat, answer: number[]) {
  const spec = getQuestionFormat(format);
  return answer.map((index) => spec.optionLabel(index)).join(", ");
}

export type { NormalizedContent, QuestionFormatSpec } from "./spec";
