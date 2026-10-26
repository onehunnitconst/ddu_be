import type {
  AdminConceptCard,
  AdminConceptCardUpdate,
  AdminConceptCourse,
  AdminQuestion,
  AdminQuestionSet,
  AdminQuestionUpdate,
} from "@/types/admin";
import { apiRequest } from "./api-client";

export async function fetchAdminQuestionSets(subjectSlug: string) {
  const { sets } = await apiRequest<{ sets: AdminQuestionSet[] }>(
    `/api/admin/question-sets?subject=${encodeURIComponent(subjectSlug)}`,
  );
  return sets;
}

export async function fetchAdminQuestions(setId: string) {
  const { questions } = await apiRequest<{ questions: AdminQuestion[] }>(
    `/api/admin/question-sets/${setId}/questions`,
  );
  return questions;
}

export async function updateAdminQuestion(questionId: string, body: AdminQuestionUpdate) {
  const { question } = await apiRequest<{ question: AdminQuestion }>(`/api/admin/questions/${questionId}`, {
    method: "PUT",
    body,
  });
  return question;
}

export async function fetchAdminConcepts(subjectSlug: string) {
  const { courses } = await apiRequest<{ courses: AdminConceptCourse[] }>(
    `/api/admin/concepts?subject=${encodeURIComponent(subjectSlug)}`,
  );
  return courses;
}

export async function updateAdminConceptCard(cardId: string, body: AdminConceptCardUpdate) {
  const { card } = await apiRequest<{ card: AdminConceptCard }>(`/api/admin/concept-cards/${cardId}`, {
    method: "PUT",
    body,
  });
  return card;
}
