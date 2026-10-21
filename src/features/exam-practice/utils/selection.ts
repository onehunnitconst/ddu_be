import type { SelectionRule } from "@/types/question";

export const requiredCount = (rule: SelectionRule) =>
  rule.mode === "multiple" ? rule.count : 1;

/**
 * 보기를 눌렀을 때의 새 선택 상태.
 * single은 바꿔 고르고, multiple은 토글하되 정해진 개수를 넘기지 않는다.
 */
export function toggleSelection(selected: number[], index: number, rule: SelectionRule) {
  if (rule.mode === "single") return [index];
  if (selected.includes(index)) return selected.filter((value) => value !== index);
  if (selected.length >= rule.count) return selected;
  return [...selected, index].sort((a, b) => a - b);
}

export type OptionState = "idle" | "selected" | "correct" | "wrong" | "missed";

/**
 * 보기 하나의 표시 상태.
 * 정답 공개 후: 고른 정답 correct, 고른 오답 wrong, 놓친 정답 missed
 */
export function optionState(index: number, selected: number[], answer: number[] | null): OptionState {
  const isSelected = selected.includes(index);
  if (!answer) return isSelected ? "selected" : "idle";

  const isAnswer = answer.includes(index);
  if (isAnswer) return isSelected ? "correct" : "missed";
  return isSelected ? "wrong" : "idle";
}
