import { z } from "zod";

/** 빈 문자열은 null로 */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max}자 이내로 입력해 주세요.`)
    .nullable()
    .transform((value) => value || null);

export const questionUpdateSchema = z.object({
  section: optionalText(50),
  answer: z
    .array(z.int().min(0).max(25), "정답은 보기 번호(0부터) 목록이어야 합니다.")
    .min(1, "정답을 하나 이상 입력해 주세요.")
    .max(10),
  audioPath: optionalText(255).refine(
    (value) => value === null || /^[A-Za-z0-9][A-Za-z0-9/_.-]*\.mp3$/.test(value),
    "음원 경로는 영문·숫자·/_-. 로 된 .mp3 경로여야 합니다.",
  ),
  /** 형태별 구조 검사는 서비스가 parseQuestion으로 한다 */
  content: z.unknown(),
});

export const conceptCardUpdateSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해 주세요.").max(200, "200자 이내로 입력해 주세요."),
  body: z.string().max(50_000, "본문이 너무 깁니다."),
});
