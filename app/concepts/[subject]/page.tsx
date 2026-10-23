import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ConceptBoardContainer } from "@/features/concept-board/concept-board-container";
import { RequireLogin } from "@/features/login-gate/require-login";
import { findDefaultCourse, listConceptCourses } from "@/server/services/concept-service";
import { findSubject, SUBJECTS } from "@/utils/subjects";

export function generateStaticParams() {
  return SUBJECTS.map((subject) => ({ subject: subject.slug }));
}

export async function generateMetadata({ params }: PageProps<"/concepts/[subject]">): Promise<Metadata> {
  const subject = findSubject((await params).subject);
  return { title: subject ? `${subject.name} 개념 | 뚜비컨티뉴` : "뚜비컨티뉴" };
}

/**
 * 종목 개념 페이지는 기본 과목 페이지로 보낸다 (로그인 확인은 과목 페이지가 한다).
 * 과목이 없는 종목은 로그인한 사용자에게 "준비 중"을 보여준다
 */
export default async function ConceptsPage({ params }: PageProps<"/concepts/[subject]">) {
  const subject = findSubject((await params).subject);
  if (!subject) notFound();

  const course = findDefaultCourse(await listConceptCourses(subject.slug));
  if (course) redirect(`/concepts/${subject.slug}/${course.id}`);

  return (
    <RequireLogin>
      <ConceptBoardContainer subjectSlug={subject.slug} subjectName={subject.name} courses={[]} />
    </RequireLogin>
  );
}
