import { RichText } from "@/components/rich-text";
import type { AttemptResponse } from "@/types/exam";
import type { QuestionFormat } from "@/types/question";
import { cn } from "@/utils/cn";
import { pickText, type Language } from "@/utils/localized-text";
import { formatAnswerLabels } from "@/utils/question-format";
import { OUTCOME_TEXT, PRACTICE_TEXT } from "../constants";

type ResultPanelProps = {
  attempt: AttemptResponse;
  format: QuestionFormat;
  language: Language;
  isLoggedIn: boolean;
};

export function ResultPanel({ attempt, format, language, isLoggedIn }: ResultPanelProps) {
  const { outcome, result, recorded } = attempt;

  return (
    <section
      aria-live="polite"
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4 text-sm",
        outcome === "CORRECT" && "border-green-600/40 bg-green-50 dark:bg-green-950/30",
        outcome === "INCORRECT" && "border-red-500/40 bg-red-50 dark:bg-red-950/30",
        outcome === "DONT_KNOW" && "bg-muted/50",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-base font-semibold">{OUTCOME_TEXT[outcome]}</p>
        <p>
          {PRACTICE_TEXT.answer}:{" "}
          <span className="font-semibold">{formatAnswerLabels(format, result.answer)}</span>
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-medium">{PRACTICE_TEXT.explanation}</p>
        {result.explanation ? (
          <RichText text={pickText(result.explanation, language)} className="text-muted-foreground" />
        ) : (
          <p className="text-muted-foreground">{PRACTICE_TEXT.noExplanation}</p>
        )}
      </div>

      {result.answerNote && (
        <p className="text-muted-foreground">
          {PRACTICE_TEXT.note}: {result.answerNote}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        {recorded ? PRACTICE_TEXT.recorded : !isLoggedIn && PRACTICE_TEXT.loginToRecord}
      </p>
    </section>
  );
}
