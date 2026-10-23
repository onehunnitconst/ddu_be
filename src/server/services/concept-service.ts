import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/server/db";
import type { ConceptCourse, ConceptCourseSummary } from "@/types/concept";

/**
 * 개념 카드 조회. 내용은 자주 바뀌지 않아 모두 캐시하며,
 * DB를 고치면 최대 한 시간 안에 반영된다. 바로 반영하려면 "concepts" 태그를 revalidate한다.
 * 반환하는 id는 모두 slug다 (URL·앵커에 쓰는 값).
 */

/** 종목의 과목 목록 (탭용, 카드 수 포함). 종목이 없거나 과목이 없으면 빈 배열 */
export async function listConceptCourses(subjectSlug: string): Promise<ConceptCourseSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("concepts");

  const courses = await prisma.conceptCourse.findMany({
    where: { subject: { slug: subjectSlug } },
    orderBy: { sortOrder: "asc" },
    select: { id: true, slug: true, title: true },
  });
  const counts = await prisma.conceptCard.groupBy({
    by: ["courseId"],
    where: { courseId: { in: courses.map((course) => course.id) } },
    _count: { _all: true },
  });
  const cardCount = new Map(counts.map((row) => [row.courseId, row._count._all]));

  return courses.map((course) => ({
    id: course.slug,
    title: course.title,
    cardCount: cardCount.get(course.id) ?? 0,
  }));
}

/** 과목 하나의 단원과 카드 전체. 없으면 undefined */
export async function findConceptCourse(subjectSlug: string, courseSlug: string): Promise<ConceptCourse | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("concepts");

  const course = await prisma.conceptCourse.findFirst({
    where: { slug: courseSlug, subject: { slug: subjectSlug } },
    select: {
      slug: true,
      title: true,
      chapters: {
        orderBy: { sortOrder: "asc" },
        select: {
          slug: true,
          title: true,
          cards: { orderBy: { sortOrder: "asc" }, select: { slug: true, title: true, body: true } },
        },
      },
    },
  });
  if (!course) return undefined;

  return {
    id: course.slug,
    title: course.title,
    chapters: course.chapters.map((chapter) => ({
      id: chapter.slug,
      title: chapter.title,
      cards: chapter.cards.map((card) => ({ id: card.slug, title: card.title, body: card.body })),
    })),
  };
}

/** 종목 페이지에서 처음 보여줄 과목: 카드가 있는 첫 과목 (없으면 첫 과목) */
export const findDefaultCourse = (courses: ConceptCourseSummary[]): ConceptCourseSummary | undefined =>
  courses.find((course) => course.cardCount > 0) ?? courses[0];
