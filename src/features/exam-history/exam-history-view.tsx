import { Button } from "@/components/ui/button";
import { HistoryList } from "./components/history-list";
import { QuestionReviewDialog } from "./components/question-review-dialog";
import { HistorySummary } from "./components/history-summary";
import { HISTORY_TEXT } from "./constants";
import type { ExamHistoryViewModel } from "./use-exam-history";

type ExamHistoryViewProps = ExamHistoryViewModel;

export function ExamHistoryView({
  sessionStatus,
  phase,
  history,
  accuracy,
  message,
  retry,
  review,
  openReview,
  closeReview,
}: ExamHistoryViewProps) {
  if (sessionStatus === "unauthenticated") {
    return (
      <div className="flex flex-col items-center gap-1 py-16 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{HISTORY_TEXT.loginRequired}</p>
        <p>{HISTORY_TEXT.loginHint}</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
        <p>{message}</p>
        <Button variant="outline" onClick={retry}>
          {HISTORY_TEXT.retry}
        </Button>
      </div>
    );
  }

  if (sessionStatus === "loading" || phase === "loading" || !history) {
    return <p className="py-16 text-center text-sm text-muted-foreground">풀이 기록을 불러오는 중…</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <HistorySummary summary={history.summary} accuracy={accuracy} />
      {history.items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{HISTORY_TEXT.empty}</p>
      ) : (
        <HistoryList items={history.items} onSelect={openReview} />
      )}
      <QuestionReviewDialog state={review} onClose={closeReview} />
    </div>
  );
}
