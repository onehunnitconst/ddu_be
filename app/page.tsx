import { HomeView } from "@/features/home/home-view";
import { RequireLogin } from "@/features/login-gate/require-login";
import { listConceptCourses } from "@/server/services/concept-service";
import { countQuestionsBySubject } from "@/server/services/exam-service";
import { SUBJECTS } from "@/utils/subjects";

export default function Home() {
  return (
    <RequireLogin>
      <HomeContent />
    </RequireLogin>
  );
}

/** 종목별 개념 카드 수·문제 수를 모아 메인 격자를 그린다 (둘 다 캐시된 조회) */
async function HomeContent() {
  const [questionCounts, conceptCourses] = await Promise.all([
    countQuestionsBySubject(),
    Promise.all(SUBJECTS.map((subject) => listConceptCourses(subject.slug))),
  ]);

  return (
    <HomeView
      subjects={SUBJECTS.map((subject, index) => ({
        slug: subject.slug,
        name: subject.name,
        conceptCards: conceptCourses[index].reduce((sum, course) => sum + course.cardCount, 0),
        questions: subject.hasQuestions ? (questionCounts[subject.slug] ?? 0) : 0,
      }))}
    />
  );
}
