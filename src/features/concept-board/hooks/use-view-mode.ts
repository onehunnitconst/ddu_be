"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_VIEW_MODE, VIEW_MODES, type ViewMode } from "../constants";

const STORAGE_KEY = "concept-view-mode";
const listeners = new Set<() => void>();

const isViewMode = (value: string | null): value is ViewMode => VIEW_MODES.some((mode) => mode.value === value);

const readMode = (): ViewMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isViewMode(saved) ? saved : DEFAULT_VIEW_MODE;
  } catch {
    // 개인정보 보호 모드 등에서 storage 접근이 막히면 기본값
    return DEFAULT_VIEW_MODE;
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

/** 개념 페이지의 보기 방식(보드/아코디언/문서). 브라우저에 기억해 다른 과목·다음 방문에도 유지한다 */
export function useViewMode() {
  // 서버 렌더링과 첫 hydration은 기본값으로 맞추고, 그 뒤 저장된 값으로 바뀐다
  const viewMode = useSyncExternalStore(subscribe, readMode, () => DEFAULT_VIEW_MODE);

  const setViewMode = (mode: ViewMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // 저장하지 못해도 이번 화면에서는 바뀌도록 아래에서 알린다
    }
    listeners.forEach((listener) => listener());
  };

  return { viewMode, setViewMode };
}
