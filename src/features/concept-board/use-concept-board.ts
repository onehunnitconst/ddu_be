import type { ConceptCard, ConceptCourse, ConceptCourseSummary } from "@/types/concept";
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
 * 과목 목록을 탭(링크)으로, 현재 과목을 열(단원, 색상 포함)로 바꾼다.
 * 상태가 없어 서버 컴포넌트에서도 호출할 수 있다
 */
export function useConceptBoard(subjectSlug: string, courses: ConceptCourseSummary[], course?: ConceptCourse) {
  const tabs: ConceptCourseTab[] = courses.map((item) => ({
    id: item.id,
    title: item.title,
    href: `/concepts/${subjectSlug}/${item.id}`,
    cardCount: item.cardCount,
    isActive: item.id === course?.id,
  }));

  const columns: ConceptColumn[] = (course?.chapters ?? []).map((chapter, index) => ({
    id: chapter.id,
    title: chapter.title,
    tone: COLUMN_TONES[index % COLUMN_TONES.length],
    cards: chapter.cards,
  }));

  return { tabs, columns };
}
