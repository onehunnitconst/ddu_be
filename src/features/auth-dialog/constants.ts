export type AuthMode = "login" | "signup";

export const AUTH_DIALOG_TEXT = {
  login: {
    title: "로그인",
    description: "아이디와 비밀번호를 입력해 주세요.",
    submit: "로그인",
    switchPrompt: "아직 계정이 없으신가요?",
    switchAction: "회원가입",
  },
  signup: {
    title: "회원가입",
    description: "관리자 승인 후 로그인할 수 있습니다.",
    submit: "가입 신청",
    switchPrompt: "이미 계정이 있으신가요?",
    switchAction: "로그인",
  },
} as const satisfies Record<AuthMode, Record<string, string>>;

export const SUBMITTING_LABEL = "처리 중…";

/** 가입 신청 후 로그인 화면으로 돌아가며 보여주는 안내 */
export const SIGNUP_DONE_NOTICE = "가입 신청이 완료되었습니다. 관리자 승인 후 로그인할 수 있습니다.";

/** 회원가입 입력란 아래에 보여주는 규칙 (src/utils/user-rules.ts와 같은 내용) */
export const SIGNUP_HINTS = {
  loginId: "영문 소문자로 시작, 영문 소문자·숫자·_ 4–20자",
  password: "영문과 숫자를 포함한 8–64자",
  nickname: "한글·영문·숫자 2–12자",
} as const;

export const ERROR_MESSAGES = {
  loginId: "아이디는 영문 소문자로 시작하는 4–20자의 영문 소문자·숫자·_ 조합이어야 합니다.",
  password: "비밀번호는 영문과 숫자를 포함한 8–64자여야 하며 공백을 쓸 수 없습니다.",
  passwordConfirm: "비밀번호가 일치하지 않습니다.",
  nickname: "닉네임은 한글·영문·숫자 2–12자여야 합니다.",
  required: "값을 입력해 주세요.",
  network: "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
} as const;
