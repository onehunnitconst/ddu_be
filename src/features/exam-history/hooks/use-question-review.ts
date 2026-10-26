"use client";

import { useState } from "react";
import type { QuestionReviewResponse } from "@/types/exam";
import { ApiError } from "@/utils/api-client";
import { fetchQuestionReview } from "@/utils/exam-api";
import { HISTORY_TEXT } from "../constants";

type ReviewState =
  | { phase: "closed" }
  | { phase: "loading"; questionId: string }
  | { phase: "ready"; questionId: string; review: QuestionReviewResponse }
  | { phase: "error"; questionId: string; message: string };

/** 풀이 기록에서 고른 문제를 다시 보는 팝업의 상태 */
export function useQuestionReview() {
  const [state, setState] = useState<ReviewState>({ phase: "closed" });

  const open = (questionId: string) => {
    setState({ phase: "loading", questionId });
    fetchQuestionReview(questionId).then(
      // 응답이 오기 전에 닫거나 다른 문제를 열었으면 버린다
      (review) =>
        setState((current) =>
          current.phase === "loading" && current.questionId === questionId
            ? { phase: "ready", questionId, review }
            : current,
        ),
      (error) =>
        setState((current) =>
          current.phase === "loading" && current.questionId === questionId
            ? {
                phase: "error",
                questionId,
                message: error instanceof ApiError ? error.message : HISTORY_TEXT.reviewFailed,
              }
            : current,
        ),
    );
  };

  return {
    review: state,
    openReview: open,
    closeReview: () => setState({ phase: "closed" }),
  };
}

export type QuestionReviewState = ReviewState;
