import type { QuestionFormat } from "@/types/question";

/**
 * 자격 종목 목록 (헤더 메뉴·시험 페이지·seed가 공유).
 * DB의 subjects 행은 prisma/seed/seed.ts가 이 목록으로 만든다.
 */
export const SUBJECTS = [
  {
    slug: "saa",
    name: "AWS Solutions Architect Associate",
    format: "AWS_CERT",
    hasQuestions: true,
  },
  {
    slug: "soa",
    name: "AWS CloudOps Engineer Associate",
    format: "AWS_CERT",
    hasQuestions: true,
  },
  {
    slug: "toeic-part2",
    name: "TOEIC Part 2",
    format: "TOEIC_PART2",
    hasQuestions: true,
  },
  {
    slug: "toeic-part5",
    name: "TOEIC Part 5",
    format: "TOEIC_PART5",
    hasQuestions: true,
  },
  {
    slug: "electrical-engineer",
    name: "전기기사 필기",
    format: "KR_TECH_WRITTEN",
    hasQuestions: false,
  },
  {
    slug: "info-comm-engineer",
    name: "정보통신기사 필기",
    format: "KR_TECH_WRITTEN",
    hasQuestions: false,
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  name: string;
  format: QuestionFormat;
  hasQuestions: boolean;
}>;

export type Subject = (typeof SUBJECTS)[number];

export const findSubject = (slug: string): Subject | undefined =>
  SUBJECTS.find((subject) => subject.slug === slug);
