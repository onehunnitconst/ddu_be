import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EXAM_TABS, type ExamTab } from "./constants";

type ExamViewProps = {
  title: string;
  hasQuestions: boolean;
  tab: ExamTab;
  onTabChange: (tab: ExamTab) => void;
  /** 탭 내용 (Container가 주입) */
  practice: ReactNode;
  wrong: ReactNode;
  history: ReactNode;
};

export function ExamView({ title, hasQuestions, tab, onTabChange, practice, wrong, history }: ExamViewProps) {
  const heading = <h1 className="truncate text-xl font-bold sm:text-2xl">{title} 기출</h1>;

  if (!hasQuestions) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-5 pb-8 sm:gap-6 sm:pt-8">
        {heading}
        <p className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          아직 준비 중인 과목입니다.
        </p>
      </div>
    );
  }

  return (
    // 모바일에서는 문제 탭의 하단 버튼 줄이 화면 끝에 붙으므로 아래 여백을 두지 않는다 (여백만큼 페이지가 괜히 스크롤된다)
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 sm:pb-8">
      <Tabs value={tab} onValueChange={(value) => onTabChange(value as ExamTab)} className="gap-0">
        {/* 제목과 탭은 전역 헤더(h-14) 아래에 고정한다. 좌우 여백까지 배경으로 덮어 아래 내용이 비치지 않게 한다 */}
        <div className="sticky top-14 z-20 -mx-4 flex flex-col gap-3 border-b bg-background px-4 pt-4 pb-3 sm:gap-4 sm:pt-6">
          {heading}
          <TabsList className="w-full sm:w-fit">
            {EXAM_TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className="flex-1 px-4 sm:flex-none">
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {/* 문제 탭은 탭을 오가도 풀던 문제가 유지되도록 마운트를 유지한다.
            오답 풀이·풀이 기록 탭은 열 때마다 새로 마운트되어 최신 기록으로 불러온다 */}
        <TabsContent value="practice" keepMounted className="pt-4">
          {practice}
        </TabsContent>
        <TabsContent value="wrong" className="pt-4">
          {wrong}
        </TabsContent>
        <TabsContent value="history" className="pt-4 pb-8 sm:pb-0">
          {history}
        </TabsContent>
      </Tabs>
    </div>
  );
}
