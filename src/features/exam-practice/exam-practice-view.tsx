import { RichText } from "@/components/rich-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { pickText } from "@/utils/localized-text";
import { ExamImage } from "./components/exam-image";
import { OptionList } from "./components/option-list";
import { ResultPanel } from "./components/result-panel";
import { LANGUAGE_LABEL, PRACTICE_TEXT } from "./constants";
import type { ExamPracticeViewModel } from "./use-exam-practice";

type ExamPracticeViewProps = ExamPracticeViewModel;

export function ExamPracticeView({
  phase,
  question,
  selected,
  attempt,
  message,
  language,
  requiredCount,
  canSubmit,
  isLoggedIn,
  setLanguage,
  toggleOption,
  submit,
  dontKnow,
  next,
  retry,
}: ExamPracticeViewProps) {
  if (phase === "error" || !question) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
        {phase === "error" ? (
          <>
            <p>{message}</p>
            <Button variant="outline" onClick={retry}>
              {PRACTICE_TEXT.retry}
            </Button>
          </>
        ) : (
          <p>문제를 불러오는 중…</p>
        )}
      </div>
    );
  }

  // 다음 문제를 불러오는 동안에는 직전 결과를 그대로 보여준다
  const revealed = attempt !== null && (phase === "revealed" || phase === "loading");
  const busy = phase === "loading" || phase === "submitting";
  const hasKorean = question.stem.ko !== null;

  return (
    <article className="flex flex-col gap-5" aria-busy={busy}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">#{question.number}</Badge>
          {question.selection.mode === "multiple" && (
            <Badge variant="outline">{requiredCount}개 선택</Badge>
          )}
        </div>
        {hasKorean && (
          <div className="flex gap-1" role="group" aria-label="문제 언어">
            {(["ko", "en"] as const).map((value) => (
              <Button
                key={value}
                size="sm"
                variant={language === value ? "secondary" : "ghost"}
                aria-pressed={language === value}
                onClick={() => setLanguage(value)}
              >
                {LANGUAGE_LABEL[value]}
              </Button>
            ))}
          </div>
        )}
      </div>

      {question.source && <p className="-mt-3 text-xs text-muted-foreground">출처: {question.source}</p>}

      <div className="flex flex-col gap-3 text-base leading-relaxed">
        <RichText text={pickText(question.stem, language)} />
        {question.exhibitImages.map((src) => (
          <ExamImage key={src} src={src} alt={`${question.number}번 문제 첨부 이미지`} />
        ))}
      </div>

      <OptionList
        options={question.options}
        selected={selected}
        answer={revealed ? attempt.result.answer : null}
        multiple={question.selection.mode === "multiple"}
        disabled={phase !== "answering"}
        language={language}
        onToggle={toggleOption}
      />

      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}

      {revealed ? (
        <>
          <ResultPanel
            attempt={attempt}
            format={question.format}
            language={language}
            isLoggedIn={isLoggedIn}
          />
          <Button className="self-end" onClick={next} disabled={phase === "loading"}>
            {phase === "loading" ? "불러오는 중…" : PRACTICE_TEXT.next}
          </Button>
        </>
      ) : (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={dontKnow} disabled={phase !== "answering"}>
            {PRACTICE_TEXT.dontKnow}
          </Button>
          <Button onClick={submit} disabled={!canSubmit}>
            {phase === "submitting" ? "채점 중…" : PRACTICE_TEXT.submit}
          </Button>
        </div>
      )}
    </article>
  );
}
