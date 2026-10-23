"use client";

import { useEffect, useState } from "react";
import { STICKY_OFFSET_VAR } from "./use-sticky-offset";

/**
 * 화면 위쪽에 걸쳐 있는 제목(id)을 알려준다 — 문서 뷰 오른쪽 목차의 현재 위치 표시용.
 * ids가 바뀌면(다른 단원으로 이동) 관찰 대상을 다시 잡는다
 */
export function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = useState<string>();
  const idsKey = ids.join("\n");

  useEffect(() => {
    const elements = idsKey
      .split("\n")
      .map((id) => document.getElementById(id))
      .filter((element) => element !== null);
    if (elements.length === 0) return;

    // 고정 영역 아래 ~ 화면 위쪽 30% 구간에 들어온 제목 중 가장 위의 것을 현재 위치로 본다
    const stickyBottom =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue(STICKY_OFFSET_VAR)) || 144;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: `-${Math.round(stickyBottom + 16)}px 0px -70% 0px` },
    );
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
}
