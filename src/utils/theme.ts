/** 화면 테마. 사용자가 고르기 전에는 OS 설정(prefers-color-scheme)을 따른다 */
export type Theme = "light" | "dark";

/** 사용자가 고른 테마를 기억하는 localStorage 키 (없으면 OS 설정) */
export const THEME_STORAGE_KEY = "theme";

/** 테마를 바꾸면 같은 탭의 구독자에게 알리는 이벤트 (storage 이벤트는 다른 탭에만 온다) */
export const THEME_CHANGE_EVENT = "themechange";

/**
 * 첫 페인트 전에 <html>에 dark 클래스를 붙이는 인라인 스크립트 (app/layout.tsx의 <head>).
 * React가 그리기 전에 실행되어야 깜빡임이 없으므로 문자열로 넣는다
 */
export const THEME_INIT_SCRIPT = `(() => {
  try {
    const saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch {}
})();`;

/** 지금 <html>에 적용된 테마 */
export const readAppliedTheme = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

/** 테마를 적용하고 기억한다 */
export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // 저장할 수 없는 환경(사생활 보호 모드 등)에서는 이번 방문에만 적용한다
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}
