import { SUBJECTS } from "@/utils/subjects";
import { MENUS } from "../constants";

export type HeaderSubMenu = {
  label: string;
  href: string;
  isActive: boolean;
};

export type HeaderMenu = {
  label: string;
  isActive: boolean;
  items: HeaderSubMenu[];
};

const isUnder = (pathname: string | null, href: string) =>
  pathname !== null && (pathname === href || pathname.startsWith(`${href}/`));

/** 현재 경로(모르면 null)를 기준으로 헤더 메뉴와 활성 상태를 만든다 */
export function buildMenus(pathname: string | null): HeaderMenu[] {
  return MENUS.map((menu) => ({
    label: menu.label,
    isActive: isUnder(pathname, menu.basePath),
    items: SUBJECTS.map((subject) => {
      const href = `${menu.basePath}/${subject.slug}`;
      return { label: subject.name, href, isActive: isUnder(pathname, href) };
    }),
  }));
}
