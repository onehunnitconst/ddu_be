import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConceptBoardContainer } from "@/features/concept-board/concept-board-container";
import { RequireLogin } from "@/features/login-gate/require-login";
import { findConceptCourse, listConceptCourses } from "@/server/services/concept-service";
import { findSubject, SUBJECTS } from "@/utils/subjects";

export async function generateStaticParams() {
  const params = await Promise.all(
    SUBJECTS.map(async (subject) =>
      (await listConceptCourses(subject.slug)).map((course) => ({ subject: subject.slug, course: course.id })),
    ),
  );
  return params.flat();
}

const findPage = async (params: PageProps<"/concepts/[subject]/[course]">["params"]) => {
  const { subject: subjectSlug, course: courseSlug } = await params;
  const subject = findSubject(subjectSlug);
  const course = subject && (await findConceptCourse(subject.slug, courseSlug));
  return subject && course ? { subject, course } : undefined;
};

export async function generateMetadata({ params }: PageProps<"/concepts/[subject]/[course]">): Promise<Metadata> {
  const page = await findPage(params);
  return { title: page ? `${page.course.title} - ${page.subject.name} 개념 | 뚜비컨티뉴` : "뚜비컨티뉴" };
}

export default function ConceptCoursePage({ params }: PageProps<"/concepts/[subject]/[course]">) {
  return (
    <RequireLogin>
      <ConceptCourseContent params={params} />
    </RequireLogin>
  );
}

async function ConceptCourseContent({ params }: Pick<PageProps<"/concepts/[subject]/[course]">, "params">) {
  const page = await findPage(params);
  if (!page) notFound();

  return (
    <ConceptBoardContainer
      subjectSlug={page.subject.slug}
      subjectName={page.subject.name}
      courses={await listConceptCourses(page.subject.slug)}
      course={page.course}
    />
  );
}
