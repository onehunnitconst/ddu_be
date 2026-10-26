import type {
  AttemptRequest,
  AttemptResponse,
  HistoryResponse,
  PracticeMode,
  QuestionReviewResponse,
  RandomQuestionResponse,
} from "@/types/exam";
import { apiRequest } from "./api-client";

export function fetchRandomQuestion(
  subjectSlug: string,
  { excludeId, mode = "all" }: { excludeId?: string; mode?: PracticeMode } = {},
) {
  const query = new URLSearchParams();
  if (excludeId) query.set("exclude", excludeId);
  if (mode !== "all") query.set("mode", mode);
  const search = query.size > 0 ? `?${query}` : "";
  return apiRequest<RandomQuestionResponse>(`/api/exams/${subjectSlug}/questions/random${search}`);
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

export function fetchQuestionReview(questionId: string) {
  return apiRequest<QuestionReviewResponse>(`/api/questions/${questionId}`);
}
