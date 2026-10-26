export const ADMIN_SECTIONS = [
  { value: "questions", label: "문제", href: "/admin/questions" },
  { value: "concepts", label: "개념", href: "/admin/concepts" },
  { value: "users", label: "회원", href: "/admin/users" },
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number]["value"];

export const SELECT_CLASS =
  "h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export const UNSAVED_CONFIRM = "저장하지 않은 변경 사항이 있습니다. 버리고 이동할까요?";
