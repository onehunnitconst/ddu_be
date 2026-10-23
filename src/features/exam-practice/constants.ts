import type { AttemptOutcome } from "@/types/exam";

export const OUTCOME_TEXT: Record<AttemptOutcome, string> = {
  CORRECT: "정답입니다!",
  INCORRECT: "오답입니다.",
  DONT_KNOW: "정답을 확인하세요.",
};

export const PRACTICE_TEXT = {
  submit: "제출",
  dontKnow: "모르겠어요",
  next: "다음 문제",
  retry: "다시 시도",
  answer: "정답",
  explanation: "해설",
  note: "참고",
  noExplanation: "이 문제에는 해설이 없습니다.",
  loginToRecord: "로그인하면 풀이 기록이 저장됩니다.",
  recorded: "풀이 기록에 저장했습니다.",
  sessionExpired: "로그인이 만료되었습니다. 다시 로그인해 주세요.",
  loadFailed: "문제를 불러오지 못했습니다.",
  submitFailed: "제출하지 못했습니다. 잠시 후 다시 시도해 주세요.",
} as const;

export const LANGUAGE_LABEL = { ko: "한국어", en: "English" } as const;
