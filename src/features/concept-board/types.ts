import type { ReactNode } from "react";
import type { ConceptColumn } from "./use-concept-board";

/** 본문을 서버에서 렌더링해 둔 카드. 모든 뷰가 같은 노드를 함께 쓴다 */
export type RenderedCard = {
  id: string;
  title: string;
  body: ReactNode;
};

export type RenderedColumn = Omit<ConceptColumn, "cards"> & { cards: RenderedCard[] };
