import type { ConceptCourse } from "@/types/concept";
import { ELECTRICAL_ENGINEER_COURSES } from "./electrical-engineer";
import { INFO_COMM_ENGINEER_COURSES } from "./info-comm-engineer";

/** 종목 slug(src/utils/subjects.ts) → 과목별 개념 카드 */
const CONCEPTS: Record<string, ConceptCourse[]> = {
  "electrical-engineer": ELECTRICAL_ENGINEER_COURSES,
  "info-comm-engineer": INFO_COMM_ENGINEER_COURSES,
};

export const findConcepts = (subjectSlug: string): ConceptCourse[] =>
  CONCEPTS[subjectSlug] ?? [];

/** 종목 페이지에서 처음 보여줄 과목: 카드가 있는 첫 과목 (없으면 첫 과목) */
export const findDefaultCourse = (courses: ConceptCourse[]): ConceptCourse | undefined =>
  courses.find((course) => course.chapters.some((chapter) => chapter.cards.length > 0)) ?? courses[0];
