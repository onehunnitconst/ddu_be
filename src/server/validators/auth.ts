import { z } from "zod";
import {
  LOGIN_ID_PATTERN,
  NICKNAME_PATTERN,
  PASSWORD_PATTERN,
} from "@/utils/user-rules";

export const signupSchema = z.object({
  loginId: z
    .string()
    .regex(LOGIN_ID_PATTERN, "아이디는 영문 소문자로 시작하는 4–20자의 영문 소문자·숫자·_ 조합이어야 합니다."),
  password: z
    .string()
    .regex(PASSWORD_PATTERN, "비밀번호는 영문과 숫자를 포함한 8–64자여야 하며 공백을 쓸 수 없습니다."),
  nickname: z
    .string()
    .regex(NICKNAME_PATTERN, "닉네임은 한글·영문·숫자 2–12자여야 합니다."),
});

/** 로그인은 형식 규칙을 드러내지 않고, 해시 비용 남용만 막도록 길이만 제한한다 */
export const loginSchema = z.object({
  loginId: z.string("아이디를 입력해 주세요.").min(1, "아이디를 입력해 주세요.").max(64),
  password: z.string("비밀번호를 입력해 주세요.").min(1, "비밀번호를 입력해 주세요.").max(128),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

