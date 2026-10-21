import { RichText } from "@/components/rich-text";
import { Badge } from "@/components/ui/badge";
import type { HistoryItem } from "@/types/exam";
import { pickText } from "@/utils/localized-text";
import { OUTCOME_BADGE } from "../constants";

const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function HistoryList({ items }: { items: HistoryItem[] }) {
  return (
    <ul className="flex flex-col divide-y rounded-lg border">
      {items.map((item) => {
        const badge = OUTCOME_BADGE[item.lastOutcome];
        return (
          <li key={item.questionId} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="w-12 shrink-0 text-sm font-semibold text-muted-foreground">
                #{item.number}
              </span>
              <p className="line-clamp-2 min-w-0 text-sm">
                <RichText text={pickText(item.stemPreview, "ko").replace(/\s+/g, " ")} />
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 pl-15 text-xs text-muted-foreground sm:pl-0">
              <span>
                <span className="font-semibold text-foreground">{item.attempts}회</span> 풀이 · 정답 {item.correct} · 오답{" "}
                {item.incorrect} · 모름 {item.dontKnow}
              </span>
              <Badge variant={badge.variant}>최근 {badge.label}</Badge>
              <time dateTime={item.lastAttemptedAt} className="hidden w-24 text-right md:block">
                {dateFormat.format(new Date(item.lastAttemptedAt))}
              </time>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
