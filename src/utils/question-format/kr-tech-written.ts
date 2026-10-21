import { z } from "zod";
import { defineFormat } from "./spec";

export const krTechWrittenContentSchema = z.object({
  stem: z.string().min(1),
  exhibitImages: z.array(z.string()).default([]),
  options: z
    .array(
      z.object({
        text: z.string(),
        /** 보기가 그림·수식 이미지인 경우 */
        image: z.string().nullable().default(null),
      }),
    )
    .length(4),
  explanation: z.string().min(1).nullable().default(null),
});

export type KrTechWrittenContent = z.infer<typeof krTechWrittenContentSchema>;

const ko = (text: string) => ({ ko: text, en: null });

/** ① ② ③ ④ (U+2460부터) */
const circledNumber = (index: number) => String.fromCodePoint(0x2460 + index);

/**
 * 국가기술자격 필기(기사): 4지선다(①–④), 하나만 고른다.
 * 이의신청으로 복수정답이 인정되면 answer에 여러 개가 들어가며, 그중 하나를 고르면 정답이다.
 */
export const krTechWrittenFormat = defineFormat<KrTechWrittenContent>({
  format: "KR_TECH_WRITTEN",
  contentSchema: krTechWrittenContentSchema,
  normalize: (content) => ({
    stem: ko(content.stem),
    exhibitImages: content.exhibitImages,
    options: content.options.map((option) => ({ text: ko(option.text), image: option.image })),
    explanation: content.explanation ? ko(content.explanation) : null,
    answerNote: null,
  }),
  optionLabel: circledNumber,
  answerCount: { min: 1, max: 4 },
  selection: () => ({ mode: "single" }),
  isCorrect: (answer, selected) => selected.length === 1 && answer.includes(selected[0]),
});
