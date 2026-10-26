"use client";

import { useSyncExternalStore } from "react";
import { applyTheme, readAppliedTheme, THEME_CHANGE_EVENT, THEME_STORAGE_KEY, type Theme } from "@/utils/theme";

function subscribe(onChange: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  // 아직 고르지 않았으면 OS 설정이 바뀔 때 따라간다
  const onSystemChange = () => {
    try {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return;
    } catch {}
    document.documentElement.classList.toggle("dark", media.matches);
    document.documentElement.style.colorScheme = media.matches ? "dark" : "light";
    onChange();
  };
  // 다른 탭에서 바꾼 테마도 맞춘다
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY || (event.newValue !== "light" && event.newValue !== "dark")) return;
    document.documentElement.classList.toggle("dark", event.newValue === "dark");
    document.documentElement.style.colorScheme = event.newValue;
    onChange();
  };

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

/**
 * 현재 테마와 전환 함수. 서버 렌더링 중에는 테마를 알 수 없어 null을 돌려준다
 * (실제 테마는 layout의 인라인 스크립트가 첫 페인트 전에 적용한다)
 */
export function useTheme() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, readAppliedTheme, () => null);

  return {
    theme,
    toggleTheme: () => applyTheme(readAppliedTheme() === "dark" ? "light" : "dark"),
  };
}
