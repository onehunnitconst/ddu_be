import Link from "next/link";
import { Markdown } from "@/components/markdown";
import { cn } from "@/utils/cn";
import { ConceptViews } from "./components/concept-views";
import type { RenderedColumn } from "./types";
import type { ConceptColumn, ConceptCourseTab } from "./use-concept-board";

type ConceptBoardViewProps = {
  title: string;
  tabs: ConceptCourseTab[];
  /** 현재 과목의 단원 열 */
  columns: ConceptColumn[];
};

export function ConceptBoardView({ title, tabs, columns }: ConceptBoardViewProps) {
  // 본문 마크다운은 여기(서버)서 한 번만 렌더링하고, 모든 뷰와 스택 화면이 같은 노드를 함께 쓴다
  const renderedColumns: RenderedColumn[] = columns.map((column) => ({
    ...column,
    cards: column.cards.map((card) => ({ id: card.id, title: card.title, body: <Markdown text={card.body} /> })),
  }));

  const courseTabs = tabs.length > 0 && (
    <nav aria-label="과목">
      <ul className="inline-flex h-8 items-center rounded-lg bg-muted p-[3px] text-muted-foreground">
        {tabs.map((tab) => (
          <li key={tab.id} className="h-full">
            <Link
              href={tab.href}
              aria-current={tab.isActive ? "page" : undefined}
              className={cn(
                "inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all hover:text-foreground",
                tab.isActive && "bg-background text-foreground shadow-sm dark:bg-input/30",
              )}
            >
              {tab.title}
              <span className="text-xs text-muted-foreground">{tab.cardCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    // 너비 제한과 양쪽 회색 여백은 앱 레이아웃(MainLayout)이 맡는다. 제목은 고정 영역 안에 있어 ConceptViews가 그린다
    <div className="flex-1 px-4 pb-8">
      <ConceptViews title={title} tabs={courseTabs} columns={renderedColumns} />
    </div>
  );
}
