"use client";

import { useEffect, useRef } from "react";

/** 고정 영역 아래쪽 경계(px)를 담는 CSS 변수. 스택 화면·문서 뷰 사이드바가 이 아래부터 자리 잡는다 */
export const STICKY_OFFSET_VAR = "--concept-sticky-bottom";

/**
 * sticky로 고정된 상단 영역(ref)의 아래쪽 경계를 :root CSS 변수로 알린다.
 * 탭이 줄바꿈되는 등 높이가 바뀌면 다시 계산한다
 */
export function useStickyOffset<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const root = document.documentElement;
    const update = () => {
      // sticky top 값(전역 헤더 높이) + 고정 영역 자신의 높이
      const top = parseFloat(getComputedStyle(element).top) || 0;
      root.style.setProperty(STICKY_OFFSET_VAR, `${top + element.offsetHeight}px`);
    };

    const observer = new ResizeObserver(update);
    observer.observe(element);

    return () => {
      observer.disconnect();
      root.style.removeProperty(STICKY_OFFSET_VAR);
    };
  }, []);

  return ref;
}
