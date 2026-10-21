"use client";

import { ExamPracticeView } from "./exam-practice-view";
import { useExamPractice } from "./use-exam-practice";

export function ExamPracticeContainer({ subjectSlug }: { subjectSlug: string }) {
  const viewModel = useExamPractice(subjectSlug);

  return <ExamPracticeView {...viewModel} />;
}
