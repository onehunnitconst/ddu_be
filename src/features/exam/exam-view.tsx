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
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-bold">{title} 기출</h1>

      {hasQuestions ? (
        <Tabs value={tab} onValueChange={(value) => onTabChange(value as ExamTab)}>
          <TabsList>
            {EXAM_TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className="px-4">
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* 문제 탭은 탭을 오가도 풀던 문제가 유지되도록 마운트를 유지한다.
              오답 풀이·풀이 기록 탭은 열 때마다 새로 마운트되어 최신 기록으로 불러온다 */}
          <TabsContent value="practice" keepMounted className="pt-4">
            {practice}
          </TabsContent>
          <TabsContent value="wrong" className="pt-4">
            {wrong}
          </TabsContent>
          <TabsContent value="history" className="pt-4">
            {history}
          </TabsContent>
        </Tabs>
      ) : (
        <p className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          아직 준비 중인 과목입니다.
        </p>
      )}
    </div>
  );
}
