import { RichText } from "@/components/rich-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadEditor } from "@/features/admin/components/image-upload-editor";
import { ExamImage } from "@/features/exam-practice/components/exam-image";
import type { AdminQuestion } from "@/types/admin";
import { cn } from "@/utils/cn";
import { pickText } from "@/utils/localized-text";
import type { AdminQuestionsViewModel } from "../use-admin-questions";

type QuestionEditorProps = AdminQuestionsViewModel & { question: AdminQuestion };

/** 문제 하나의 편집 폼과, 저장 전에 형태 규칙으로 검사한 미리보기 */
export function QuestionEditor({
  question,
  draft,
  preview,
  isDirty,
  isSaving,
  message,
  fieldErrors,
  setSection,
  setAudioPath,
  setContentText,
  toggleAnswer,
  reset,
  save,
}: QuestionEditorProps) {
  if (!draft) return null;
  const answerError = preview?.ok
    ? draft.answer.length < preview.answerCount.min || draft.answer.length > preview.answerCount.max
    : false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold">#{question.number}</h2>
        <Badge variant="outline">{question.format}</Badge>
        {isDirty && <Badge variant="secondary">수정됨</Badge>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="question-section">세부 구분</Label>
          <Input
            id="question-section"
            value={draft.section}
            onChange={(event) => setSection(event.target.value)}
            aria-invalid={Boolean(fieldErrors.section)}
          />
          <FieldError messages={fieldErrors.section} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="question-audio">음원 경로 (Storage audio 버킷)</Label>
          <Input
            id="question-audio"
            value={draft.audioPath}
            placeholder="없음"
            onChange={(event) => setAudioPath(event.target.value)}
            aria-invalid={Boolean(fieldErrors.audioPath)}
          />
          <FieldError messages={fieldErrors.audioPath} />
        </div>
      </div>
      {question.audioUrl && (
        <audio key={question.audioUrl} src={question.audioUrl} controls preload="none" className="w-full">
          저장된 음원
        </audio>
      )}

      <div className="flex flex-col gap-1.5">
        <p className="text-sm leading-none font-medium">content (JSON)</p>
        <ImageUploadEditor
          language="json"
          ariaLabel="content (JSON)"
          minHeight="22rem"
          value={draft.contentText}
          onValueChange={setContentText}
          formatImage={(url) => JSON.stringify(url)}
          hint="올린 이미지 URL이 커서 위치에 문자열로 들어갑니다. exhibitImages 배열이나 보기의 image에 넣으세요."
          invalid={Boolean(fieldErrors.content) || preview?.ok === false}
        />
        <FieldError messages={fieldErrors.content} />
      </div>

      <section className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <p className="font-medium">미리보기 · 정답 선택</p>
        {preview?.ok === false && <p className="whitespace-pre-wrap text-destructive">{preview.error}</p>}
        {preview?.ok && (
          <>
            <RichText text={pickText(preview.content.stem, "ko")} className="text-base" />
            {preview.content.exhibitImages.map((src) => (
              <ExamImage key={src} src={src} alt="문제 첨부 이미지" />
            ))}
            <ul className="flex flex-col gap-1.5">
              {preview.content.options.map((option, index) => {
                const checked = draft.answer.includes(index);
                return (
                  <li key={index}>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-2 rounded-md border bg-background p-2",
                        checked && "border-green-600 ring-1 ring-green-600",
                      )}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggleAnswer(index)} className="mt-1" />
                      <span className="w-6 shrink-0 font-semibold">{preview.labels[index]}</span>
                      <span className="flex min-w-0 flex-col gap-2">
                        <RichText
                          text={pickText(option.text, "ko") || (option.image ? "" : "(음원으로만 제시)")}
                        />
                        {option.image && <ExamImage src={option.image} alt={`보기 ${preview.labels[index]} 이미지`} />}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <p className={cn("text-xs", answerError ? "text-destructive" : "text-muted-foreground")}>
              정답 {preview.answerCount.min === preview.answerCount.max
                ? `${preview.answerCount.min}개`
                : `${preview.answerCount.min}–${preview.answerCount.max}개`}
              를 고르세요.
            </p>
            {preview.content.explanation && (
              <div className="flex flex-col gap-1 border-t pt-3">
                <p className="font-medium">해설</p>
                <RichText text={pickText(preview.content.explanation, "ko")} className="text-muted-foreground" />
              </div>
            )}
          </>
        )}
        <FieldError messages={fieldErrors.answer} />
      </section>

      <div className="flex items-center justify-end gap-2">
        {message && (
          <p
            role={message.tone === "error" ? "alert" : "status"}
            className={cn("mr-auto text-sm", message.tone === "error" ? "text-destructive" : "text-green-700 dark:text-green-400")}
          >
            {message.text}
          </p>
        )}
        <Button variant="outline" onClick={reset} disabled={!isDirty || isSaving}>
          되돌리기
        </Button>
        <Button onClick={save} disabled={!isDirty || isSaving || preview?.ok === false || answerError}>
          {isSaving ? "저장 중…" : "저장"}
        </Button>
      </div>
    </div>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="whitespace-pre-wrap text-xs text-destructive">{messages.join("\n")}</p>;
}
