import type { ConceptCourse } from "@/types/concept";
import { CIRCUIT_AND_CONTROL_CHAPTERS } from "./circuit-and-control";
import { ELECTRIC_MACHINES_CHAPTERS } from "./electric-machines";
import { ELECTRICAL_INSTALLATION_STANDARDS_CHAPTERS } from "./electrical-installation-standards";
import { ELECTROMAGNETICS_CHAPTERS } from "./electromagnetics";
import { POWER_ENGINEERING_CHAPTERS } from "./power-engineering";

/** 전기기사 필기 과목 (시하끝하 교재 구성) */
export const ELECTRICAL_ENGINEER_COURSES: ConceptCourse[] = [
  { id: "circuit-and-control", title: "회로이론 및 제어공학", chapters: CIRCUIT_AND_CONTROL_CHAPTERS },
  { id: "electromagnetics", title: "전기자기학", chapters: ELECTROMAGNETICS_CHAPTERS },
  { id: "electric-machines", title: "전기기기", chapters: ELECTRIC_MACHINES_CHAPTERS },
  { id: "power-engineering", title: "전력공학", chapters: POWER_ENGINEERING_CHAPTERS },
  {
    id: "electrical-installation-standards",
    title: "전기설비기술기준",
    chapters: ELECTRICAL_INSTALLATION_STANDARDS_CHAPTERS,
  },
];
