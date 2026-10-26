import type { AdminQuestion } from "@/types/admin";
import type { QuestionFormat } from "@/types/question";
import { pickText } from "@/utils/localized-text";
import { getQuestionFormat, type NormalizedContent } from "@/utils/question-format";

export type ContentPreview =
  | {
      ok: true;
      content: NormalizedContent;
      labels: string[];
      answerCount: { min: number; max: number };
    }
  | { ok: false; error: string };

/** 편집 중인 content(JSON 문자열)를 형태 규칙으로 검사하고 화면용으로 펼친다 */
export function previewContent(format: QuestionFormat, contentText: string): ContentPreview {
  let json: unknown;
  try {
    json = JSON.parse(contentText);
  } catch (error) {
    return { ok: false, error: `JSON 문법 오류: ${error instanceof Error ? error.message : String(error)}` };
  }

  const spec = getQuestionFormat(format);
  const parsed = spec.contentSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues.map((issue) => `${issue.path.join(".") || "(전체)"}: ${issue.message}`).join("\n"),
    };
  }
  const content = spec.normalize(parsed.data);
  return {
    ok: true,
    content,
    labels: content.options.map((_, index) => spec.optionLabel(index)),
    answerCount: spec.answerCount,
  };
}

/** 문제 목록에 보일 한 줄 요약 (형태 규칙에 맞지 않으면 빈 문자열) */
export function questionSummary(question: AdminQuestion): string {
  const spec = getQuestionFormat(question.format);
  const parsed = spec.contentSchema.safeParse(question.content);
  if (!parsed.success) return "";
  const content = spec.normalize(parsed.data);
  return pickText(content.preview ?? content.stem, "ko").replace(/\s+/g, " ");
}
