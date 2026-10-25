import { z } from "zod";
import { defineFormat } from "./spec";

export const toeicPart5ContentSchema = z.object({
  /** 영문 한 문장, 빈칸은 `-------` */
  stem: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  /** 한국어 해설 (정답 근거·해석·어휘), 없으면 null */
  explanation: z.string().min(1).nullable().default(null),
});

export type ToeicPart5Content = z.infer<typeof toeicPart5ContentSchema>;

const en = (text: string) => ({ en: text, ko: null });

/**
 * TOEIC Part 5: 영문 한 문장의 빈칸에 들어갈 보기를 (A)–(D) 중 하나 고른다.
 * 문제 해석은 해설에만 두어, 풀기 전에는 영문만 보인다.
 */
export const toeicPart5Format = defineFormat<ToeicPart5Content>({
  format: "TOEIC_PART5",
  contentSchema: toeicPart5ContentSchema,
  normalize: (content) => ({
    stem: en(content.stem),
    exhibitImages: [],
    options: content.options.map((text) => ({ text: en(text), image: null })),
    explanation: content.explanation ? { ko: content.explanation, en: null } : null,
    answerNote: null,
  }),
  optionLabel: (index) => "ABCD"[index] ?? String(index + 1),
  answerCount: { min: 1, max: 1 },
  selection: () => ({ mode: "single" }),
  isCorrect: (answer, selected) => selected.length === 1 && selected[0] === answer[0],
});
