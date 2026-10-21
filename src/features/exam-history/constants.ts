import type { AttemptOutcome } from "@/types/exam";

export const OUTCOME_BADGE: Record<
  AttemptOutcome,
  { label: string; variant: "default" | "destructive" | "secondary" }
> = {
  CORRECT: { label: "정답", variant: "default" },
  INCORRECT: { label: "오답", variant: "destructive" },
  DONT_KNOW: { label: "모름", variant: "secondary" },
};

export const HISTORY_TEXT = {
  loginRequired: "풀이 기록은 로그인 후 확인할 수 있습니다.",
  loginHint: "오른쪽 위의 로그인 버튼을 눌러 주세요.",
  empty: "아직 푼 문제가 없습니다. 문제 탭에서 풀어 보세요.",
  retry: "다시 시도",
} as const;
