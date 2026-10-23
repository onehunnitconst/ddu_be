"use client";

import { FileTextIcon, ListCollapseIcon, SquareKanbanIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { VIEW_MODES, type ViewMode } from "../constants";
import { useStickyOffset } from "../hooks/use-sticky-offset";
import { useViewMode } from "../hooks/use-view-mode";
import type { RenderedColumn } from "../types";
import { ConceptAccordion } from "./concept-accordion";
import { ConceptColumns } from "./concept-columns";
import { ConceptDocument } from "./concept-document";

const VIEW_ICONS: Record<ViewMode, ReactNode> = {
  board: <SquareKanbanIcon className="size-4" />,
  accordion: <ListCollapseIcon className="size-4" />,
  document: <FileTextIcon className="size-4" />,
};

const VIEWS: Record<ViewMode, (props: { columns: RenderedColumn[] }) => ReactNode> = {
  board: ConceptColumns,
  accordion: ConceptAccordion,
  document: ConceptDocument,
};

type ConceptViewsProps = {
  title: string;
  /** 과목 탭 (서버에서 렌더링) */
  tabs: ReactNode;
  columns: RenderedColumn[];
};

/**
 * 제목·과목 탭·보기 방식 전환을 전역 헤더 아래에 고정하고,
 * 현재 과목을 고른 방식(보드·아코디언·문서)으로 보여준다
 */
export function ConceptViews({ title, tabs, columns }: ConceptViewsProps) {
  const { viewMode, setViewMode } = useViewMode();
  const stickyRef = useStickyOffset<HTMLDivElement>();
  const View = VIEWS[viewMode];

  return (
    <div className="flex flex-col gap-6">
      {/* 전역 헤더(h-14) 바로 아래에 고정. 좌우 여백까지 배경으로 덮어 아래 내용이 비치지 않게 한다 */}
      <div ref={stickyRef} className="sticky top-14 z-30 -mx-4 flex flex-col gap-4 border-b bg-background px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">{title} 개념</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 max-w-full overflow-x-auto">{tabs}</div>
          {columns.length > 0 && (
            <div role="group" aria-label="보기 방식" className="flex items-center gap-1">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  aria-pressed={viewMode === mode.value}
                  aria-label={mode.label}
                  title={mode.label}
                  onClick={() => setViewMode(mode.value)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    viewMode === mode.value && "bg-muted font-medium text-foreground",
                  )}
                >
                  {VIEW_ICONS[mode.value]}
                  {/* 좁은 화면에서는 아이콘만 보인다 */}
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {columns.length === 0 ? (
        <p className="rounded-lg border p-8 text-center text-sm text-muted-foreground">아직 준비 중인 과목입니다.</p>
      ) : (
        <View columns={columns} />
      )}
    </div>
  );
}
