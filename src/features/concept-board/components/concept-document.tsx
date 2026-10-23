"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/utils/cn";
import { useActiveHeading } from "../hooks/use-active-heading";
import type { RenderedColumn } from "../types";

type ConceptDocumentProps = {
  columns: RenderedColumn[];
};

const cardAnchor = (cardId: string) => `card-${cardId}`;

/**
 * 문서 뷰 (GitBook 형태): 왼쪽 사이드바에서 단원을 고르면 그 단원의 카드 본문을 한 페이지로 보여주고,
 * 아래에 이전/다음 단원, 넓은 화면에서는 오른쪽에 단원 안 목차를 둔다
 */
export function ConceptDocument({ columns }: ConceptDocumentProps) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // 과목이 바뀌어 단원 수가 줄어도 범위를 벗어나지 않게 한다
  const index = Math.min(chapterIndex, columns.length - 1);
  const chapter = columns[index];
  const prev = columns[index - 1];
  const next = columns[index + 1];
  const activeId = useActiveHeading(chapter.cards.map((card) => cardAnchor(card.id)));

  /** 단원을 바꾸고(필요하면 특정 카드로) 스크롤한다 — 새 단원이 그려진 뒤 위치를 잡도록 flushSync */
  const goTo = (nextIndex: number, cardId?: string) => {
    flushSync(() => setChapterIndex(nextIndex));
    const target = cardId ? document.getElementById(cardAnchor(cardId)) : contentRef.current;
    target?.scrollIntoView({ block: "start" });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_12rem]">
      {/* 왼쪽: 단원 목록 (현재 단원은 카드 제목까지 펼침) */}
      <nav aria-label="단원" className="hidden lg:block">
        <ol className="sticky top-[calc(var(--concept-sticky-bottom,9rem)+1rem)] flex max-h-[calc(100vh-var(--concept-sticky-bottom,9rem)-2rem)] flex-col gap-0.5 overflow-y-auto pr-2 text-sm">
          {columns.map((column, i) => (
            <li key={column.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === index ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-muted-foreground hover:bg-muted hover:text-foreground",
                  i === index && "bg-muted font-semibold text-foreground",
                )}
              >
                <span className={cn("size-2 shrink-0 rounded-full", column.tone.label)} />
                {column.title}
              </button>
              {i === index && (
                <ol className="my-1 ml-3 flex flex-col border-l pl-2">
                  {column.cards.map((card) => (
                    <li key={card.id}>
                      <button
                        type="button"
                        onClick={() => goTo(i, card.id)}
                        className={cn(
                          "w-full rounded px-2 py-1 text-left text-[13px] text-muted-foreground hover:text-foreground",
                          activeId === cardAnchor(card.id) && "font-medium text-foreground",
                        )}
                      >
                        {card.title}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* 가운데: 현재 단원 본문 */}
      <div ref={contentRef} className="flex min-w-0 scroll-mt-[calc(var(--concept-sticky-bottom,9rem)+1rem)] flex-col gap-8">
        {/* 좁은 화면에서는 사이드바 대신 단원 선택 */}
        <select
          aria-label="단원 선택"
          value={index}
          onChange={(event) => goTo(Number(event.target.value))}
          className="h-9 rounded-md border bg-background px-2 text-sm lg:hidden"
        >
          {columns.map((column, i) => (
            <option key={column.id} value={i}>
              {column.title}
            </option>
          ))}
        </select>

        <header className="flex flex-col gap-2 border-b pb-4">
          <span className="text-sm text-muted-foreground">
            단원 {index + 1} / {columns.length}
          </span>
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
        </header>

        {chapter.cards.map((card) => (
          <article key={card.id} id={cardAnchor(card.id)} className="flex scroll-mt-[calc(var(--concept-sticky-bottom,9rem)+1rem)] flex-col gap-3">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <div className="text-[15px] leading-relaxed">{card.body}</div>
          </article>
        ))}

        {/* 이전 / 다음 단원 */}
        <div className="grid gap-3 border-t pt-6 sm:grid-cols-2">
          {prev ? (
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="flex flex-col items-start gap-1 rounded-lg border p-4 text-left hover:bg-muted/60"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ChevronLeftIcon className="size-3" /> 이전 단원
              </span>
              <span className="font-medium">{prev.title}</span>
            </button>
          ) : (
            <span />
          )}
          {next && (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="flex flex-col items-end gap-1 rounded-lg border p-4 text-right hover:bg-muted/60"
            >
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                다음 단원 <ChevronRightIcon className="size-3" />
              </span>
              <span className="font-medium">{next.title}</span>
            </button>
          )}
        </div>
      </div>

      {/* 오른쪽: 이 단원의 목차 (넓은 화면) */}
      <nav aria-label="이 단원의 목차" className="hidden xl:block">
        <div className="sticky top-[calc(var(--concept-sticky-bottom,9rem)+1rem)] flex flex-col gap-2 text-[13px]">
          <p className="font-semibold">이 단원의 목차</p>
          <ol className="flex flex-col gap-1 border-l">
            {chapter.cards.map((card) => (
              <li key={card.id}>
                <a
                  href={`#${cardAnchor(card.id)}`}
                  className={cn(
                    "-ml-px block border-l border-transparent py-0.5 pl-3 text-muted-foreground hover:text-foreground",
                    activeId === cardAnchor(card.id) && "border-foreground font-medium text-foreground",
                  )}
                >
                  {card.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </div>
  );
}
