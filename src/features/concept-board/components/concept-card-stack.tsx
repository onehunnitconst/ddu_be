"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import type { ColumnTone } from "../constants";

type ConceptCardStackProps = {
  title: string;
  chapterTitle: string;
  tone: ColumnTone;
  /** 서버에서 렌더링한 본문 */
  body: ReactNode;
  /** 누르면 스택 화면이 열리는 요소와 그 내용 */
  trigger: ReactElement;
  /** trigger가 <button>이 아니면 false */
  nativeButton?: boolean;
  children: ReactNode;
};

export function ChapterLabel({ title, tone }: { title: string; tone: ColumnTone }) {
  return <span className={cn("w-fit rounded px-1.5 py-0.5 text-xs", tone.label)}>{title}</span>;
}

/**
 * 카드를 누르면 고정된 상단(전역 헤더 + 개념 페이지 고정 영역) 아래를 덮는 화면을 쌓아 본문 전체를 보여준다.
 * X 버튼이나 Esc로 닫는다
 */
export function ConceptCardStack({
  title,
  chapterTitle,
  tone,
  body,
  trigger,
  nativeButton = true,
  children,
}: ConceptCardStackProps) {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger nativeButton={nativeButton} render={trigger}>
        {children}
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Popup
          className={cn(
            // 고정 영역 아래(--concept-sticky-bottom)부터 화면 끝까지, 앱 너비(MainLayout의 max-w-6xl)만큼 덮는다. 값이 아직 없으면 대략적인 기본값
            "fixed inset-x-0 mx-auto w-full max-w-6xl bottom-0 top-[var(--concept-sticky-bottom,9rem)] z-30 flex flex-col border-t bg-background shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.15)] outline-none",
            "duration-150 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-4 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-4",
          )}
        >
          <DialogPrimitive.Close
            render={<Button variant="ghost" size="icon-sm" className="absolute top-3 right-4 z-10" />}
          >
            <XIcon />
            <span className="sr-only">닫기</span>
          </DialogPrimitive.Close>

          <div className="overflow-y-auto">
            <article className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8">
              <header className="flex flex-col gap-2 pr-10">
                <DialogPrimitive.Title className="text-2xl leading-snug font-bold">{title}</DialogPrimitive.Title>
                <ChapterLabel title={chapterTitle} tone={tone} />
              </header>
              <div className="text-[15px] leading-relaxed">{body}</div>
            </article>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
