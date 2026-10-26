import { BookOpenIcon, ClipboardListIcon } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";

export type HomeSubject = {
  slug: string;
  name: string;
  /** 개념 카드 수 (0이면 준비 중) */
  conceptCards: number;
  /** 기출 문제 수 (0이면 준비 중) */
  questions: number;
};

/** 메인 화면: 종목마다 개념·기출로 들어가는 버튼을 격자로 보여준다 */
export function HomeView({ subjects }: { subjects: HomeSubject[] }) {
  return (
    <div className="flex flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">무엇을 공부할까요?</h1>
        <p className="text-sm text-muted-foreground">종목을 골라 개념을 정리하거나 기출 문제를 풀어 보세요.</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <li key={subject.slug}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <MenuButton
                  href={`/concepts/${subject.slug}`}
                  icon={BookOpenIcon}
                  label="개념"
                  detail={subject.conceptCards > 0 ? `카드 ${subject.conceptCards}장` : null}
                />
                <MenuButton
                  href={`/exams/${subject.slug}`}
                  icon={ClipboardListIcon}
                  label="기출"
                  detail={subject.questions > 0 ? `${subject.questions}문제` : null}
                />
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

type MenuButtonProps = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  /** 내용 요약. null이면 준비 중으로 보여준다 (들어가면 각 화면이 준비 중 안내를 한다) */
  detail: string | null;
};

function MenuButton({ href, icon: Icon, label, detail }: MenuButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-start gap-1 rounded-lg border p-3 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        !detail && "text-muted-foreground",
      )}
    >
      <Icon className="size-5" />
      <span className="font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{detail ?? "준비 중"}</span>
    </Link>
  );
}
