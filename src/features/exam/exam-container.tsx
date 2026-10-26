"use client";

import { ExamHistoryContainer } from "@/features/exam-history/exam-history-container";
import { ExamPracticeContainer } from "@/features/exam-practice/exam-practice-container";
import { ExamView } from "./exam-view";
import { useExam } from "./use-exam";

type ExamContainerProps = {
  subjectSlug: string;
  subjectName: string;
  hasQuestions: boolean;
};

export function ExamContainer({ subjectSlug, subjectName, hasQuestions }: ExamContainerProps) {
  const { tab, setTab } = useExam();

  return (
    <ExamView
      title={subjectName}
      hasQuestions={hasQuestions}
      tab={tab}
      onTabChange={setTab}
      practice={<ExamPracticeContainer subjectSlug={subjectSlug} mode="all" />}
      wrong={<ExamPracticeContainer subjectSlug={subjectSlug} mode="wrong" />}
      history={<ExamHistoryContainer subjectSlug={subjectSlug} />}
    />
  );
}
