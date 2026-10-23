import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findConcepts } from "@/content/concepts";
import { ConceptBoardContainer } from "@/features/concept-board/concept-board-container";
import { findSubject, SUBJECTS } from "@/utils/subjects";

export function generateStaticParams() {
  return SUBJECTS.flatMap((subject) =>
    findConcepts(subject.slug).map((course) => ({ subject: subject.slug, course: course.id })),
  );
}

const findPage = async (params: PageProps<"/concepts/[subject]/[course]">["params"]) => {
  const { subject: subjectSlug, course: courseId } = await params;
  const subject = findSubject(subjectSlug);
  const courses = subject ? findConcepts(subject.slug) : [];
  const course = courses.find((item) => item.id === courseId);
  return subject && course ? { subject, courses, course } : undefined;
};

export async function generateMetadata({ params }: PageProps<"/concepts/[subject]/[course]">): Promise<Metadata> {
  const page = await findPage(params);
  return { title: page ? `${page.course.title} - ${page.subject.name} 개념 | 뚜비컨티뉴` : "뚜비컨티뉴" };
}

export default async function ConceptCoursePage({ params }: PageProps<"/concepts/[subject]/[course]">) {
  const page = await findPage(params);
  if (!page) notFound();

  return (
    <ConceptBoardContainer
      subjectSlug={page.subject.slug}
      subjectName={page.subject.name}
      courses={page.courses}
      courseId={page.course.id}
    />
  );
}
