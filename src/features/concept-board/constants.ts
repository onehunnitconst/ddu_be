/** 단원(열) 색상. 단원 순서대로 돌아가며 사용한다 (Notion 보드의 그룹 색상처럼) */
export const COLUMN_TONES = [
  { column: "bg-rose-50 dark:bg-rose-950/30", label: "bg-rose-200/70 text-rose-900 dark:bg-rose-900/60 dark:text-rose-100" },
  { column: "bg-amber-50 dark:bg-amber-950/30", label: "bg-amber-200/70 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100" },
  { column: "bg-stone-100 dark:bg-stone-900/40", label: "bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-100" },
  { column: "bg-sky-50 dark:bg-sky-950/30", label: "bg-sky-200/70 text-sky-900 dark:bg-sky-900/60 dark:text-sky-100" },
  { column: "bg-emerald-50 dark:bg-emerald-950/30", label: "bg-emerald-200/70 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100" },
  { column: "bg-violet-50 dark:bg-violet-950/30", label: "bg-violet-200/70 text-violet-900 dark:bg-violet-900/60 dark:text-violet-100" },
] as const;

export type ColumnTone = (typeof COLUMN_TONES)[number];

/** 보기 방식 (Notion의 Board view / List view처럼) */
export const VIEW_MODES = [
  { value: "board", label: "보드" },
  { value: "accordion", label: "아코디언" },
  { value: "document", label: "문서" },
] as const;

export type ViewMode = (typeof VIEW_MODES)[number]["value"];

export const DEFAULT_VIEW_MODE: ViewMode = "board";

/** 모바일 첫 방문 기본 보기와 그 기준 너비 (Tailwind sm 미만) */
export const MOBILE_DEFAULT_VIEW_MODE: ViewMode = "document";
export const MOBILE_MAX_WIDTH = 639;
