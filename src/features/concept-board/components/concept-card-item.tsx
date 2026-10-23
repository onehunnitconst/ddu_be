"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RenderedCard, RenderedColumn } from "../types";
import { ChapterLabel, ConceptCardStack } from "./concept-card-stack";

type ConceptCardItemProps = {
  card: RenderedCard;
  column: RenderedColumn;
};

/** 보드의 카드. 본문을 모두 펼쳐 보여주고, 누르면 스택 화면으로 크게 연다 */
export function ConceptCardItem({ card, column }: ConceptCardItemProps) {
  return (
    <ConceptCardStack
      title={card.title}
      chapterTitle={column.title}
      tone={column.tone}
      body={card.body}
      nativeButton={false}
      trigger={
        <Card
          size="sm"
          className="cursor-pointer gap-2 text-left transition-shadow outline-none hover:ring-foreground/25 focus-visible:ring-2 focus-visible:ring-ring"
        />
      }
    >
      <CardHeader className="gap-2">
        <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
        <ChapterLabel title={column.title} tone={column.tone} />
      </CardHeader>
      <CardContent>
        <div className="text-[13px] leading-relaxed">{card.body}</div>
      </CardContent>
    </ConceptCardStack>
  );
}
