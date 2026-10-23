import type { ConceptCourse } from "@/types/concept";
import { COMPUTER_AND_FACILITY_STANDARDS_CHAPTERS } from "./computer-and-facility-standards";
import { EQUIPMENT_CHAPTERS } from "./equipment";
import { NETWORK_CHAPTERS } from "./network";
import { SYSTEM_OPERATION_CHAPTERS } from "./system-operation";
import { TRANSMISSION_CHAPTERS } from "./transmission";

/** 정보통신기사 필기 과목 (이기적 교재 구성) */
export const INFO_COMM_ENGINEER_COURSES: ConceptCourse[] = [
  { id: "transmission", title: "정보전송일반", chapters: TRANSMISSION_CHAPTERS },
  { id: "equipment", title: "정보통신기기", chapters: EQUIPMENT_CHAPTERS },
  { id: "network", title: "정보통신네트워크", chapters: NETWORK_CHAPTERS },
  { id: "system-operation", title: "정보시스템운용", chapters: SYSTEM_OPERATION_CHAPTERS },
  {
    id: "computer-and-facility-standards",
    title: "컴퓨터일반 및 정보설비기준",
    chapters: COMPUTER_AND_FACILITY_STANDARDS_CHAPTERS,
  },
];
