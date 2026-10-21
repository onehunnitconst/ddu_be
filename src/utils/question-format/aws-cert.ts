import { z } from "zod";
import { defineFormat } from "./spec";

/** 원문은 영문, 한국어는 번역이 있을 때만 */
const bilingualText = z.object({
  en: z.string().min(1),
  ko: z.string().min(1).nullable().default(null),
});

export const awsCertContentSchema = z.object({
  stem: bilingualText,
  exhibitImages: z.array(z.string()).default([]),
  options: z
    .array(
      z.object({
        text: bilingualText,
        /** 보기 자체가 이미지인 경우 (예: IAM 정책 캡처) */
        image: z.string().nullable().default(null),
      }),
    )
    .min(4)
    .max(6),
  explanation: bilingualText.nullable().default(null),
  answerNote: z.string().nullable().default(null),
});

export type AwsCertContent = z.infer<typeof awsCertContentSchema>;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const sameSet = (a: number[], b: number[]) =>
  a.length === b.length && a.every((index) => b.includes(index));

/**
 * AWS 자격증: 보기 4–6개(A–F), 정답 1–3개.
 * "(Choose two.)"처럼 정답 개수만큼 고르고, 고른 보기가 정답 전체와 같아야 정답이다.
 */
export const awsCertFormat = defineFormat<AwsCertContent>({
  format: "AWS_CERT",
  contentSchema: awsCertContentSchema,
  normalize: (content) => ({
    stem: content.stem,
    exhibitImages: content.exhibitImages,
    options: content.options.map((option) => ({ text: option.text, image: option.image })),
    explanation: content.explanation,
    answerNote: content.answerNote,
  }),
  optionLabel: (index) => ALPHABET[index] ?? String(index + 1),
  answerCount: { min: 1, max: 3 },
  selection: (answer) =>
    answer.length > 1 ? { mode: "multiple", count: answer.length } : { mode: "single" },
  isCorrect: sameSet,
});
