import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Markdown } from "@/components/markdown";
import { ImageUploadTextarea } from "@/features/admin/components/image-upload-textarea";
import { SELECT_CLASS } from "@/features/admin/constants";
import { cn } from "@/utils/cn";
import type { AdminConceptsViewModel } from "./use-admin-concepts";

type AdminConceptsViewProps = AdminConceptsViewModel;

export function AdminConceptsView({
  subjects,
  subjectSlug,
  courses,
  card,
  draft,
  isDirty,
  isSaving,
  message,
  fieldErrors,
  selectSubject,
  selectCard,
  setTitle,
  setBody,
  reset,
  save,
}: AdminConceptsViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
      <aside className="flex min-w-0 flex-col gap-3">
        <select
          aria-label="종목"
          className={SELECT_CLASS}
          value={subjectSlug}
          onChange={(event) => selectSubject(event.target.value)}
        >
          {subjects.map((subject) => (
            <option key={subject.slug} value={subject.slug}>
              {subject.name}
            </option>
          ))}
        </select>

        {!card && message?.tone === "error" && <p className="text-sm text-destructive">{message.text}</p>}

        {courses === null ? (
          <p className="py-6 text-center text-sm text-muted-foreground">불러오는 중…</p>
        ) : courses.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">개념 과목이 없습니다.</p>
        ) : (
          <nav className="flex max-h-[75vh] flex-col gap-3 overflow-y-auto rounded-lg border p-2 text-sm" aria-label="개념 카드">
            {courses.map((course) => (
              <details key={course.id} open={courses.length === 1}>
                <summary className="cursor-pointer rounded-md px-2 py-1 font-semibold hover:bg-muted">
                  {course.title}
                </summary>
                {course.chapters.map((chapter) => (
                  <div key={chapter.id} className="mt-1 ml-2">
                    <p className="px-2 py-1 text-xs font-medium text-muted-foreground">{chapter.title}</p>
                    <ul>
                      {chapter.cards.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => selectCard(item.id)}
                            className={cn(
                              "w-full rounded-md px-2 py-1 text-left hover:bg-muted",
                              item.id === card?.id && "bg-muted font-medium",
                            )}
                          >
                            {item.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </details>
            ))}
          </nav>
        )}
      </aside>

      <section className="min-w-0">
        {card && draft ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">#{card.slug}</Badge>
              {isDirty && <Badge variant="secondary">수정됨</Badge>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="card-title">제목</Label>
              <Input
                id="card-title"
                value={draft.title}
                onChange={(event) => setTitle(event.target.value)}
                aria-invalid={Boolean(fieldErrors.title)}
              />
              {fieldErrors.title && <p className="text-xs text-destructive">{fieldErrors.title.join(" ")}</p>}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="card-body">본문 (마크다운 · 수식은 $…$ / $$…$$)</Label>
                <ImageUploadTextarea
                  id="card-body"
                  rows={24}
                  value={draft.body}
                  onValueChange={setBody}
                  formatImage={(url) => `![](${url})`}
                  aria-invalid={Boolean(fieldErrors.body)}
                />
                {fieldErrors.body && <p className="text-xs text-destructive">{fieldErrors.body.join(" ")}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-medium">미리보기</p>
                <div className="min-h-40 rounded-lg border p-4 text-sm">
                  <h3 className="mb-2 font-semibold">{draft.title}</h3>
                  <Markdown text={draft.body} />
                </div>
              </div>
            </div>

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
              <Button onClick={save} disabled={!isDirty || isSaving}>
                {isSaving ? "저장 중…" : "저장"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            왼쪽 목록에서 고칠 카드를 고르세요.
          </p>
        )}
      </section>
    </div>
  );
}
