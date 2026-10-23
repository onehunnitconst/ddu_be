import type { ConceptCourse } from "@/types/concept";
import { ConceptBoardView } from "./concept-board-view";
import { useConceptBoard } from "./use-concept-board";

type ConceptBoardContainerProps = {
  subjectSlug: string;
  subjectName: string;
  courses: ConceptCourse[];
  /** 현재 과목 id (courses가 비어 있으면 무시) */
  courseId: string;
};

export function ConceptBoardContainer({ subjectSlug, subjectName, courses, courseId }: ConceptBoardContainerProps) {
  const { tabs, columns } = useConceptBoard(subjectSlug, courses, courseId);

  return <ConceptBoardView title={subjectName} tabs={tabs} columns={columns} />;
}
