"use client";

import { useEffect, useRef, useState } from "react";
import { UNSAVED_CONFIRM } from "@/features/admin/constants";
import type { AdminConceptCard, AdminConceptCourse } from "@/types/admin";
import { fetchAdminConcepts, updateAdminConceptCard } from "@/utils/admin-api";
import { ApiError } from "@/utils/api-client";
import { SUBJECTS } from "@/utils/subjects";

type Draft = { title: string; body: string };

const DEFAULT_SUBJECT = SUBJECTS[0].slug;

const errorMessage = (error: unknown, fallback: string) => (error instanceof ApiError ? error.message : fallback);

/** 개념 관리: 종목 → 과목 > 단원 > 카드를 골라 제목·본문(마크다운)을 고친다. 저장하면 개념 페이지에 바로 반영된다 */
export function useAdminConcepts() {
  const [subjectSlug, setSubjectSlug] = useState<string>(DEFAULT_SUBJECT);
  const [courses, setCourses] = useState<AdminConceptCourse[] | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // 마지막으로 보낸 목록 요청만 반영한다
  const requestRef = useRef(0);

  const card = findCard(courses, cardId);
  const isDirty = card !== null && draft !== null && (draft.title !== card.title || draft.body !== card.body);

  const confirmDiscard = () => !isDirty || window.confirm(UNSAVED_CONFIRM);

  const showCourses = (request: number) => (next: AdminConceptCourse[]) => {
    if (request === requestRef.current) setCourses(next);
  };
  const showListError = (request: number) => (error: unknown) => {
    if (request === requestRef.current) {
      setMessage({ tone: "error", text: errorMessage(error, "목록을 불러오지 못했습니다.") });
    }
  };

  // 처음 열 때 기본 종목을 불러온다 (응답이 온 뒤에만 상태를 바꾼다)
  useEffect(() => {
    const request = ++requestRef.current;
    fetchAdminConcepts(DEFAULT_SUBJECT).then(showCourses(request), showListError(request));
  }, []);

  const selectSubject = (slug: string) => {
    if (!confirmDiscard()) return;
    const request = ++requestRef.current;
    setSubjectSlug(slug);
    setCourses(null);
    setCardId(null);
    setDraft(null);
    setMessage(null);
    setFieldErrors({});
    fetchAdminConcepts(slug).then(showCourses(request), showListError(request));
  };

  const selectCard = (id: string) => {
    if (id === cardId || !confirmDiscard()) return;
    const next = findCard(courses, id);
    if (!next) return;
    setCardId(id);
    setDraft({ title: next.title, body: next.body });
    setMessage(null);
    setFieldErrors({});
  };

  const save = async () => {
    if (!card || !draft || isSaving) return;
    setIsSaving(true);
    setMessage(null);
    setFieldErrors({});
    try {
      const saved = await updateAdminConceptCard(card.id, draft);
      setCourses((current) => current && replaceCard(current, saved));
      setDraft({ title: saved.title, body: saved.body });
      setMessage({ tone: "success", text: "저장했습니다. 개념 페이지에 바로 반영됩니다." });
    } catch (error) {
      setMessage({ tone: "error", text: errorMessage(error, "저장하지 못했습니다.") });
      if (error instanceof ApiError && error.fields) setFieldErrors(error.fields);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    subjects: SUBJECTS,
    subjectSlug,
    courses,
    card,
    draft,
    isDirty,
    isSaving,
    message,
    fieldErrors,
    selectSubject,
    selectCard,
    setTitle: (title: string) => setDraft((current) => current && { ...current, title }),
    setBody: (body: string) => setDraft((current) => current && { ...current, body }),
    reset: () => card && setDraft({ title: card.title, body: card.body }),
    save,
  };
}

function findCard(courses: AdminConceptCourse[] | null, cardId: string | null): AdminConceptCard | null {
  if (!courses || !cardId) return null;
  for (const course of courses) {
    for (const chapter of course.chapters) {
      const card = chapter.cards.find((item) => item.id === cardId);
      if (card) return card;
    }
  }
  return null;
}

const replaceCard = (courses: AdminConceptCourse[], saved: AdminConceptCard): AdminConceptCourse[] =>
  courses.map((course) => ({
    ...course,
    chapters: course.chapters.map((chapter) => ({
      ...chapter,
      cards: chapter.cards.map((item) => (item.id === saved.id ? saved : item)),
    })),
  }));

export type AdminConceptsViewModel = ReturnType<typeof useAdminConcepts>;
