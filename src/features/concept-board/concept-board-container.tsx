import type { ConceptCourse, ConceptCourseSummary } from "@/types/concept";
import { ConceptBoardView } from "./concept-board-view";
import { useConceptBoard } from "./use-concept-board";

type ConceptBoardContainerProps = {
  subjectSlug: string;
  subjectName: string;
  /** 탭으로 보여줄 과목 목록 */
  courses: ConceptCourseSummary[];
  /** 현재 과목 (과목이 없는 종목이면 undefined) */
  course?: ConceptCourse;
};

export function ConceptBoardContainer({ subjectSlug, subjectName, courses, course }: ConceptBoardContainerProps) {
  const { tabs, columns } = useConceptBoard(subjectSlug, courses, course);

  return <ConceptBoardView title={subjectName} tabs={tabs} columns={columns} />;
}
