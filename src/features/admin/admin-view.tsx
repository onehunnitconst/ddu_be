import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { ADMIN_SECTIONS, type AdminSection } from "./constants";

type AdminViewProps = {
  section: AdminSection;
  /** 선택한 메뉴의 화면 (페이지가 주입) */
  children: ReactNode;
};

/** 관리 화면 공통 틀: 제목과 메뉴(문제 / 개념) */
export function AdminView({ section, children }: AdminViewProps) {
  return (
    <div className="flex flex-col gap-6 px-4 py-8">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold">관리</h1>
        <nav className="flex gap-1" aria-label="관리 메뉴">
          {ADMIN_SECTIONS.map((item) => (
            <Link
              key={item.value}
              href={item.href}
              aria-current={item.value === section ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                item.value === section && "bg-muted font-semibold",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
