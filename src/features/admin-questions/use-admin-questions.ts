"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AdminQuestion, AdminQuestionSet } from "@/types/admin";
import { fetchAdminQuestions, fetchAdminQuestionSets, updateAdminQuestion } from "@/utils/admin-api";
import { ApiError } from "@/utils/api-client";
import { SUBJECTS } from "@/utils/subjects";
import { UNSAVED_CONFIRM } from "@/features/admin/constants";
import { previewContent } from "./utils/preview";

type Draft = {
  section: string;
  audioPath: string;
  contentText: string;
  answer: number[];
};

const toDraft = (question: AdminQuestion): Draft => ({
  section: question.section ?? "",
  audioPath: question.audioPath ?? "",
  contentText: JSON.stringify(question.content, null, 2),
  answer: question.answer,
});

const sameDraft = (a: Draft, b: Draft) =>
  a.section === b.section &&
  a.audioPath === b.audioPath &&
  a.contentText === b.contentText &&
  a.answer.join(",") === b.answer.join(",");

const DEFAULT_SUBJECT = (SUBJECTS.find((subject) => subject.hasQuestions) ?? SUBJECTS[0]).slug;

const errorMessage = (error: unknown, fallback: string) => (error instanceof ApiError ? error.message : fallback);

/** 문제 관리: 종목 → 문제 묶음 → 문제를 골라 세부 구분·음원 경로·정답·content를 고친다 */
export function useAdminQuestions() {
  const [subjectSlug, setSubjectSlug] = useState<string>(DEFAULT_SUBJECT);
  const [sets, setSets] = useState<AdminQuestionSet[] | null>(null);
  const [setId, setSetId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AdminQuestion[] | null>(null);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // 마지막으로 보낸 목록 요청만 반영한다 (빠르게 바꿔 고를 때 늦게 온 응답을 버린다)
  const requestRef = useRef(0);

  const question = questions?.find((item) => item.id === questionId) ?? null;
  const isDirty = question !== null && draft !== null && !sameDraft(draft, toDraft(question));
  const preview = useMemo(
    () => (question && draft ? previewContent(question.format, draft.contentText) : null),
    [question, draft],
  );

  const confirmDiscard = () => !isDirty || window.confirm(UNSAVED_CONFIRM);

  const clearEditor = () => {
    setQuestionId(null);
    setDraft(null);
    setMessage(null);
    setFieldErrors({});
  };

  const showQuestions = (request: number) => (next: AdminQuestion[]) => {
    if (request === requestRef.current) setQuestions(next);
  };
  const showListError = (request: number) => (error: unknown) => {
    if (request === requestRef.current) {
      setMessage({ tone: "error", text: errorMessage(error, "목록을 불러오지 못했습니다.") });
    }
  };

  const loadSet = (nextSetId: string | null, request = ++requestRef.current) => {
    setSetId(nextSetId);
    setQuestions(null);
    clearEditor();
    if (nextSetId) fetchAdminQuestions(nextSetId).then(showQuestions(request), showListError(request));
  };

  const showSets = (request: number) => (next: AdminQuestionSet[]) => {
    if (request !== requestRef.current) return;
    setSets(next);
    loadSet(next[0]?.id ?? null, request);
  };

  // 처음 열 때 기본 종목의 묶음 목록을 불러온다 (응답이 온 뒤에만 상태를 바꾼다)
  useEffect(() => {
    const request = ++requestRef.current;
    fetchAdminQuestionSets(DEFAULT_SUBJECT).then(showSets(request), showListError(request));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 첫 마운트에만 실행
  }, []);

  const selectSubject = (slug: string) => {
    if (!confirmDiscard()) return;
    const request = ++requestRef.current;
    setSubjectSlug(slug);
    setSets(null);
    loadSet(null, request);
    fetchAdminQuestionSets(slug).then(showSets(request), showListError(request));
  };

  const selectQuestion = (id: string) => {
    if (id === questionId || !confirmDiscard()) return;
    const next = questions?.find((item) => item.id === id);
    if (!next) return;
    setQuestionId(id);
    setDraft(toDraft(next));
    setMessage(null);
    setFieldErrors({});
  };

  const save = async () => {
    if (!question || !draft || isSaving) return;
    let content: unknown;
    try {
      content = JSON.parse(draft.contentText);
    } catch {
      setMessage({ tone: "error", text: "content가 올바른 JSON이 아닙니다." });
      return;
    }
    setIsSaving(true);
    setMessage(null);
    setFieldErrors({});
    try {
      const saved = await updateAdminQuestion(question.id, {
        section: draft.section,
        audioPath: draft.audioPath,
        answer: draft.answer,
        content,
      });
      setQuestions((current) => current?.map((item) => (item.id === saved.id ? saved : item)) ?? null);
      setDraft(toDraft(saved));
      setMessage({ tone: "success", text: "저장했습니다." });
    } catch (error) {
      setMessage({ tone: "error", text: errorMessage(error, "저장하지 못했습니다.") });
      if (error instanceof ApiError && error.fields) setFieldErrors(error.fields);
    } finally {
      setIsSaving(false);
    }
  };

  const updateDraft = (patch: Partial<Draft>) => setDraft((current) => (current ? { ...current, ...patch } : current));

  return {
    subjects: SUBJECTS,
    subjectSlug,
    sets,
    setId,
    questions,
    question,
    draft,
    preview,
    isDirty,
    isSaving,
    message,
    fieldErrors,
    selectSubject,
    selectSet: (id: string) => confirmDiscard() && loadSet(id || null),
    selectQuestion,
    setSection: (section: string) => updateDraft({ section }),
    setAudioPath: (audioPath: string) => updateDraft({ audioPath }),
    setContentText: (contentText: string) => updateDraft({ contentText }),
    toggleAnswer: (index: number) =>
      setDraft((current) => {
        if (!current) return current;
        const answer = current.answer.includes(index)
          ? current.answer.filter((value) => value !== index)
          : [...current.answer, index].sort((a, b) => a - b);
        return { ...current, answer };
      }),
    reset: () => question && setDraft(toDraft(question)),
    save,
  };
}

export type AdminQuestionsViewModel = ReturnType<typeof useAdminQuestions>;
