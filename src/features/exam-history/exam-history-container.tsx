"use client";

import { ExamHistoryView } from "./exam-history-view";
import { useExamHistory } from "./use-exam-history";

export function ExamHistoryContainer({ subjectSlug }: { subjectSlug: string }) {
  const viewModel = useExamHistory(subjectSlug);

  return <ExamHistoryView {...viewModel} />;
}
