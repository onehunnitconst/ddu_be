import type { ConceptCard, ConceptCourse } from "@/types/concept";
import { COLUMN_TONES, type ColumnTone } from "./constants";

export type ConceptColumn = {
  id: string;
  title: string;
  tone: ColumnTone;
  cards: ConceptCard[];
};

/** 과목 탭 — 과목마다 주소가 따로 있다 (/concepts/[subject]/[course]) */
export type ConceptCourseTab = {
  id: string;
  title: string;
  href: string;
  cardCount: number;
  isActive: boolean;
};

/**
 * 과목 목록을 탭(링크)과 현재 과목의 열(단원, 색상 포함)로 바꾼다.
 * 상태가 없어 서버 컴포넌트에서도 호출할 수 있다
 */
export function useConceptBoard(subjectSlug: string, courses: ConceptCourse[], courseId: string) {
  const tabs: ConceptCourseTab[] = courses.map((course) => ({
    id: course.id,
    title: course.title,
    href: `/concepts/${subjectSlug}/${course.id}`,
    cardCount: course.chapters.reduce((sum, chapter) => sum + chapter.cards.length, 0),
    isActive: course.id === courseId,
  }));

  const columns: ConceptColumn[] = (courses.find((course) => course.id === courseId)?.chapters ?? []).map(
    (chapter, index) => ({
      id: chapter.id,
      title: chapter.title,
      tone: COLUMN_TONES[index % COLUMN_TONES.length],
      cards: chapter.cards,
    }),
  );

  return { tabs, columns };
}
