import type {
  AttemptRequest,
  AttemptResponse,
  HistoryResponse,
  RandomQuestionResponse,
} from "@/types/exam";
import { apiRequest } from "./api-client";

export async function fetchRandomQuestion(subjectSlug: string, excludeId?: string) {
  const query = excludeId ? `?exclude=${encodeURIComponent(excludeId)}` : "";
  const { question } = await apiRequest<RandomQuestionResponse>(
    `/api/exams/${subjectSlug}/questions/random${query}`,
  );
  return question;
}

export function submitAttempt(questionId: string, body: AttemptRequest) {
  return apiRequest<AttemptResponse>(`/api/questions/${questionId}/attempts`, {
    method: "POST",
    body,
  });
}

export function fetchHistory(subjectSlug: string) {
  return apiRequest<HistoryResponse>(`/api/exams/${subjectSlug}/history`);
}
