import { Button } from "@/components/ui/button";
import { SELECT_CLASS } from "@/features/admin/constants";
import { cn } from "@/utils/cn";
import { QuestionEditor } from "./components/question-editor";
import type { AdminQuestionsViewModel } from "./use-admin-questions";
import { questionSummary } from "./utils/preview";

type AdminQuestionsViewProps = AdminQuestionsViewModel;

export function AdminQuestionsView(props: AdminQuestionsViewProps) {
  const { subjects, subjectSlug, sets, setId, questions, question, message, selectSubject, selectSet, selectQuestion } =
    props;

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
        <select
          aria-label="문제 묶음"
          className={SELECT_CLASS}
          value={setId ?? ""}
          disabled={!sets || sets.length === 0}
          onChange={(event) => selectSet(event.target.value)}
        >
          {sets?.length === 0 && <option value="">문제 묶음이 없습니다</option>}
          {sets?.map((set) => (
            <option key={set.id} value={set.id}>
              {set.title} ({set.questionCount})
            </option>
          ))}
        </select>

        {!question && message?.tone === "error" && <p className="text-sm text-destructive">{message.text}</p>}

        {questions === null ? (
          setId && <p className="py-6 text-center text-sm text-muted-foreground">불러오는 중…</p>
        ) : (
          <ul className="flex max-h-[40vh] flex-col overflow-y-auto rounded-lg border text-sm md:max-h-[70vh]">
            {questions.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => selectQuestion(item.id)}
                  className={cn(
                    "h-auto w-full justify-start gap-3 rounded-none px-3 py-2 text-left font-normal whitespace-normal",
                    item.id === question?.id && "bg-muted",
                  )}
                >
                  <span className="w-8 shrink-0 font-semibold text-muted-foreground">{item.number}</span>
                  <span className="line-clamp-2 min-w-0">{questionSummary(item) || "(형식 오류)"}</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <section className="min-w-0">
        {question ? (
          <QuestionEditor {...props} question={question} />
        ) : (
          <p className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
            왼쪽 목록에서 고칠 문제를 고르세요.
          </p>
        )}
      </section>
    </div>
  );
}
