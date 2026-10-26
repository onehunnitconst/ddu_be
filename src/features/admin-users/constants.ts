import type { AdminUser } from "@/types/admin";

export const USER_FILTERS = [
  { value: "all", label: "전체", matches: (users: AdminUser[]) => users },
  { value: "pending", label: "승인 대기", matches: (users: AdminUser[]) => users.filter((user) => !user.approvedAt) },
] as const;

export type UserFilter = (typeof USER_FILTERS)[number]["value"];

/** 가입·풀이 시각 표기 (예: 2026. 10. 26. 오후 09:15) */
export const userDateFormat = new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" });
