"use client";

import { AdminQuestionsView } from "./admin-questions-view";
import { useAdminQuestions } from "./use-admin-questions";

export function AdminQuestionsContainer() {
  const viewModel = useAdminQuestions();

  return <AdminQuestionsView {...viewModel} />;
}
