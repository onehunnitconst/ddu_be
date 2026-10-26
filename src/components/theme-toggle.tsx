"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

/** 라이트/다크 전환 버튼. 지금 테마의 반대 테마 아이콘을 보여준다 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환";

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={label} title={label}>
      {/* 서버 렌더링에서는 테마를 몰라 두 아이콘을 CSS(dark 클래스)로 고른다 */}
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </Button>
  );
}
