import type {
  AdminConceptCard,
  AdminConceptCardUpdate,
  AdminConceptCourse,
  AdminQuestion,
  AdminQuestionSet,
  AdminQuestionUpdate,
  AdminUser,
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

/** 이미지를 올리고 공개 URL을 받는다 */
export async function uploadAdminImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { url } = await apiRequest<{ url: string }>("/api/admin/images", { method: "POST", body: form });
  return url;
}

export async function fetchAdminUsers() {
  const { users } = await apiRequest<{ users: AdminUser[] }>("/api/admin/users");
  return users;
}

export async function setAdminUserApproval(userId: string, approved: boolean) {
  const { user } = await apiRequest<{ user: AdminUser }>(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: { approved },
  });
  return user;
}
