"use client";

import type { PracticeMode } from "@/types/exam";
import { ExamPracticeView } from "./exam-practice-view";
import { useExamPractice } from "./use-exam-practice";

export function ExamPracticeContainer({ subjectSlug, mode }: { subjectSlug: string; mode: PracticeMode }) {
  const viewModel = useExamPractice(subjectSlug, mode);

  return <ExamPracticeView {...viewModel} />;
}
