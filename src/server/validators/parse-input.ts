import { z } from "zod";
import { badRequest } from "@/server/errors";

/** 검증 실패 시 필드별 메시지를 담은 400 오류를 던진다 */
export function parseInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw badRequest(
      "입력값이 올바르지 않습니다.",
      z.flattenError(result.error).fieldErrors as Record<string, string[]>,
    );
  }
  return result.data;
}
