export const ADMIN_SECTIONS = [
  { value: "questions", label: "문제", href: "/admin/questions" },
  { value: "concepts", label: "개념", href: "/admin/concepts" },
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number]["value"];

/** 관리 화면에서 쓰는 텍스트 입력 상자 (shadcn Input과 같은 테두리) */
export const TEXTAREA_CLASS =
  "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

export const SELECT_CLASS =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export const UNSAVED_CONFIRM = "저장하지 않은 변경 사항이 있습니다. 버리고 이동할까요?";
