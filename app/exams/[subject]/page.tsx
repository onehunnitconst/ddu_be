import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamContainer } from "@/features/exam/exam-container";
import { findSubject, SUBJECTS } from "@/utils/subjects";

export function generateStaticParams() {
  return SUBJECTS.map((subject) => ({ subject: subject.slug }));
}

export async function generateMetadata({ params }: PageProps<"/exams/[subject]">): Promise<Metadata> {
  const subject = findSubject((await params).subject);
  return { title: subject ? `${subject.name} 기출 | 뚜비컨티뉴` : "뚜비컨티뉴" };
}

export default async function ExamPage({ params }: PageProps<"/exams/[subject]">) {
  const subject = findSubject((await params).subject);
  if (!subject) notFound();

  return (
    <ExamContainer
      subjectSlug={subject.slug}
      subjectName={subject.name}
      hasQuestions={subject.hasQuestions}
    />
  );
}
