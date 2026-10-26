export const EXAM_TABS = [
  { value: "practice", label: "문제" },
  { value: "wrong", label: "오답 풀이" },
  { value: "history", label: "풀이 기록" },
] as const;

export type ExamTab = (typeof EXAM_TABS)[number]["value"];
