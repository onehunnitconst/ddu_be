export const SITE_NAME = "뚜비컨티뉴";

/** 헤더 상단 메뉴. 각 메뉴의 서브 메뉴는 src/utils/subjects.ts의 SUBJECTS로 구성된다 (`${basePath}/${slug}`) */
export const MENUS = [
  { label: "개념", basePath: "/concepts" },
  { label: "기출", basePath: "/exams" },
] as const;

