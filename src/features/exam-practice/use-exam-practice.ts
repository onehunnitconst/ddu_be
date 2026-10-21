"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import type { AttemptRequest, AttemptResponse } from "@/types/exam";
import type { QuestionView } from "@/types/question";
import { ApiError } from "@/utils/api-client";
import { fetchRandomQuestion, submitAttempt } from "@/utils/exam-api";
import type { Language } from "@/utils/localized-text";
import { PRACTICE_TEXT } from "./constants";
import { requiredCount, toggleSelection } from "./utils/selection";

/**
 * - loading: 문제를 불러오는 중
 * - answering: 보기를 고르는 중 (정답 비공개)
 * - submitting: 제출 중
 * - revealed: 채점 결과와 정답 공개
 * - error: 문제를 불러오지 못함
 */
type Phase = "loading" | "answering" | "submitting" | "revealed" | "error";

export function useExamPractice(subjectSlug: string) {
  const { status, setUser } = useSession();

  const [phase, setPhase] = useState<Phase>("loading");
  const [question, setQuestion] = useState<QuestionView | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [attempt, setAttempt] = useState<AttemptResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("ko");

  const showQuestion = useCallback((next: QuestionView) => {
    setQuestion(next);
    setSelected([]);
    setAttempt(null);
    setPhase("answering");
  }, []);

  const showLoadError = useCallback((error: unknown) => {
    setMessage(error instanceof ApiError ? error.message : PRACTICE_TEXT.loadFailed);
    setPhase("error");
  }, []);

  // 첫 문제: 응답이 온 뒤에만 상태를 바꾸고, 언마운트 후 도착한 응답은 버린다
  useEffect(() => {
    let ignore = false;
    fetchRandomQuestion(subjectSlug).then(
      (next) => !ignore && showQuestion(next),
      (error) => !ignore && showLoadError(error),
    );
    return () => {
      ignore = true;
    };
  }, [subjectSlug, showQuestion, showLoadError]);

  const load = (excludeId?: string) => {
    setPhase("loading");
    setMessage(null);
    fetchRandomQuestion(subjectSlug, excludeId).then(showQuestion, showLoadError);
  };

  const send = async (body: AttemptRequest) => {
    if (!question || phase !== "answering") return;
    setPhase("submitting");
    setMessage(null);
    try {
      setAttempt(await submitAttempt(question.id, body));
      setPhase("revealed");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // 리프레시까지 실패: 로그아웃 상태로 바꾸고 다시 제출하면 비로그인으로 채점된다
        setUser(null);
        setMessage(PRACTICE_TEXT.sessionExpired);
      } else {
        setMessage(error instanceof ApiError ? error.message : PRACTICE_TEXT.submitFailed);
      }
      setPhase("answering");
    }
  };

  const required = question ? requiredCount(question.selection) : 1;

  return {
    phase,
    question,
    selected,
    attempt,
    message,
    language,
    requiredCount: required,
    canSubmit: phase === "answering" && selected.length === required,
    isLoggedIn: status === "authenticated",
    setLanguage,
    toggleOption: (index: number) => {
      if (!question || phase !== "answering") return;
      setSelected((current) => toggleSelection(current, index, question.selection));
    },
    submit: () => send({ selected }),
    dontKnow: () => send({ dontKnow: true }),
    next: () => load(question?.id),
    retry: () => load(),
  };
}

export type ExamPracticeViewModel = ReturnType<typeof useExamPractice>;
