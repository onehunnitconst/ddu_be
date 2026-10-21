import { z } from "zod";

export const uuidSchema = z.uuid();

export const attemptSchema = z.union([
  z.object({ dontKnow: z.literal(true) }),
  z.object({
    selected: z
      .array(z.int().min(0).max(25), "고른 보기가 올바르지 않습니다.")
      .min(1, "보기를 하나 이상 골라 주세요.")
      .max(10),
  }),
]);

export type AttemptInput = z.infer<typeof attemptSchema>;
