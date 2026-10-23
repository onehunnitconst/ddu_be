import { cn } from "@/utils/cn";
import type { RenderedColumn } from "../types";
import { ConceptCardItem } from "./concept-card-item";

type ConceptColumnsProps = {
  columns: RenderedColumn[];
};

/**
 * 보드 뷰: 단원 = 열. 보드 높이를 화면(고정 영역 아래 ~ 페이지 아래 여백 위)에 맞추고 세로·가로 스크롤을 보드 안에서 처리해,
 * 카드가 길어도 가로 스크롤바가 항상 화면 아래에 보이게 한다 (Notion 보드처럼)
 */
export function ConceptColumns({ columns }: ConceptColumnsProps) {
  return (
    // 3.5rem = 고정 영역과의 간격(gap-6) + 페이지 아래 여백(pb-8)
    <div className="flex h-[calc(100dvh-var(--concept-sticky-bottom,9rem)-3.5rem)] min-h-80 items-start gap-3 overflow-auto pb-2">
      {columns.map((column) => (
        <section
          key={column.id}
          aria-label={column.title}
          className={cn("flex w-80 shrink-0 flex-col gap-2 rounded-xl p-2", column.tone.column)}
        >
          <header className="flex items-center gap-2 px-1 py-1">
            {/* 단원명이 길면 잘리므로 title로 전체 이름을 보여준다 */}
            <h2
              title={column.title}
              className={cn("truncate rounded px-1.5 py-0.5 text-sm font-medium", column.tone.label)}
            >
              {column.title}
            </h2>
            <span className="text-sm text-muted-foreground">{column.cards.length}</span>
          </header>
          {column.cards.map((card) => (
            <ConceptCardItem key={card.id} card={card} column={column} />
          ))}
        </section>
      ))}
    </div>
  );
}
