import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import type { RenderedColumn } from "../types";

type ConceptAccordionProps = {
  columns: RenderedColumn[];
};

/** 아코디언 뷰: 단원별 카드 제목을 누르면 그 자리에서 본문이 펼쳐진다 (여러 개 동시에 열 수 있음) */
export function ConceptAccordion({ columns }: ConceptAccordionProps) {
  return (
    <div className="flex flex-col gap-6">
      {columns.map((column) => (
        <section key={column.id} aria-label={column.title} className="flex flex-col gap-2">
          <header className="flex items-center gap-2">
            <h2 className={cn("rounded px-1.5 py-0.5 text-sm font-medium", column.tone.label)}>{column.title}</h2>
            <span className="text-sm text-muted-foreground">{column.cards.length}</span>
          </header>
          <div className="divide-y rounded-lg border">
            {column.cards.map((card) => (
              // 열고 닫는 상태는 <details>가 직접 들고 있다
              <details key={card.id} className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 text-sm transition-colors outline-none hover:bg-muted/60 focus-visible:bg-muted [&::-webkit-details-marker]:hidden">
                  <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                  <span className="flex-1 font-medium">{card.title}</span>
                </summary>
                <div className="border-t bg-muted/20 px-4 py-4 pl-11 text-sm leading-relaxed">{card.body}</div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
