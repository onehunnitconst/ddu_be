import { RichText } from "@/components/rich-text";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExamImage } from "@/features/exam-practice/components/exam-image";
import { OptionList } from "@/features/exam-practice/components/option-list";
import { pickText } from "@/utils/localized-text";
import { formatAnswerLabels } from "@/utils/question-format";
import { HISTORY_TEXT, OUTCOME_BADGE } from "../constants";
import type { QuestionReviewState } from "../hooks/use-question-review";
import { historyDateFormat } from "../utils/date-format";

type QuestionReviewDialogProps = {
  state: QuestionReviewState;
  onClose: () => void;
};

/** 풀이 기록의 문제 하나: 본문·정답·해설과 이 문제의 풀이 이력 */
export function QuestionReviewDialog({ state, onClose }: QuestionReviewDialogProps) {
  const review = state.phase === "ready" ? state.review : null;
  const question = review?.question;

  return (
    <Dialog open={state.phase !== "closed"} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{question ? `#${question.number}` : HISTORY_TEXT.reviewTitle}</DialogTitle>
          {question?.source && <DialogDescription>출처: {question.source}</DialogDescription>}
        </DialogHeader>

        {state.phase === "loading" && (
          <p className="py-10 text-center text-muted-foreground">{HISTORY_TEXT.reviewLoading}</p>
        )}
        {state.phase === "error" && <p className="py-10 text-center text-destructive">{state.message}</p>}

        {review && question && (
          <div className="flex flex-col gap-4">
            {question.audioUrl && (
              <audio src={question.audioUrl} controls preload="metadata" className="w-full">
                {question.number}번 문제 음원
              </audio>
            )}

            <div className="flex flex-col gap-3 text-base leading-relaxed">
              <RichText text={pickText(question.stem, "ko")} />
              {question.exhibitImages.map((src) => (
                <ExamImage key={src} src={src} alt={`${question.number}번 문제 첨부 이미지`} />
              ))}
            </div>

            <OptionList
              options={question.options}
              selected={review.attempts[0].selected}
              answer={review.result.answer}
              multiple={question.selection.mode === "multiple"}
              disabled
              language="ko"
              onToggle={() => {}}
            />

            <section className="flex flex-col gap-1 rounded-lg border bg-muted/40 p-3">
              <p className="font-medium">
                정답: {formatAnswerLabels(question.format, review.result.answer)}
              </p>
              {review.result.explanation ? (
                <RichText text={pickText(review.result.explanation, "ko")} className="text-muted-foreground" />
              ) : (
                <p className="text-muted-foreground">이 문제에는 해설이 없습니다.</p>
              )}
              {review.result.answerNote && (
                <p className="text-muted-foreground">참고: {review.result.answerNote}</p>
              )}
            </section>

            <section className="flex flex-col gap-2">
              <p className="font-medium">{HISTORY_TEXT.reviewAttempts}</p>
              <ul className="flex flex-col divide-y rounded-lg border">
                {review.attempts.map((attempt) => {
                  const badge = OUTCOME_BADGE[attempt.outcome];
                  return (
                    <li key={attempt.attemptedAt} className="flex items-center gap-3 px-3 py-2">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      <span className="text-muted-foreground">
                        {attempt.selected.length > 0
                          ? `고른 답: ${formatAnswerLabels(question.format, attempt.selected)}`
                          : "답을 고르지 않음"}
                      </span>
                      <time dateTime={attempt.attemptedAt} className="ml-auto text-xs text-muted-foreground">
                        {historyDateFormat.format(new Date(attempt.attemptedAt))}
                      </time>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
