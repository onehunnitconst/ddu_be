import type { LocalizedText } from "@/types/question";

export type Language = "ko" | "en";

/** 원하는 언어가 없으면 다른 언어로 대체한다 */
export function pickText(text: LocalizedText, language: Language): string {
  const fallback: Language = language === "ko" ? "en" : "ko";
  return text[language] ?? text[fallback] ?? "";
}
