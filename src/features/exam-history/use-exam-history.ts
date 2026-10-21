"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import type { HistoryResponse } from "@/types/exam";
import { ApiError } from "@/utils/api-client";
import { fetchHistory } from "@/utils/exam-api";

type Phase = "loading" | "ready" | "error";

/** 탭이 열릴 때마다(마운트) 최신 기록을 불러온다 */
export function useExamHistory(subjectSlug: string) {
  const { status, setUser } = useSession();

  const [phase, setPhase] = useState<Phase>("loading");
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const showHistory = useCallback((next: HistoryResponse) => {
    setHistory(next);
    setPhase("ready");
  }, []);

  const showError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        // 리프레시까지 실패: 로그아웃 상태로 바꾸면 로그인 안내가 보인다
        setUser(null);
        return;
      }
      setMessage(error instanceof ApiError ? error.message : "풀이 기록을 불러오지 못했습니다.");
      setPhase("error");
    },
    [setUser],
  );

  // 응답이 온 뒤에만 상태를 바꾸고, 언마운트 후 도착한 응답은 버린다
  useEffect(() => {
    if (status !== "authenticated") return;
    let ignore = false;
    fetchHistory(subjectSlug).then(
      (next) => !ignore && showHistory(next),
      (error) => !ignore && showError(error),
    );
    return () => {
      ignore = true;
    };
  }, [status, subjectSlug, showHistory, showError]);

  const retry = () => {
    setPhase("loading");
    setMessage(null);
    fetchHistory(subjectSlug).then(showHistory, showError);
  };

  const summary = history?.summary;
  const accuracy =
    summary && summary.totalAttempts > 0
      ? Math.round((summary.correctAttempts / summary.totalAttempts) * 100)
      : null;

  return {
    sessionStatus: status,
    phase,
    history,
    accuracy,
    message,
    retry,
  };
}

export type ExamHistoryViewModel = ReturnType<typeof useExamHistory>;
