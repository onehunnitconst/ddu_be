/** 개념 카드 한 장. body는 마크다운(GFM + TeX 수식) */
export type ConceptCard = {
  id: string;
  title: string;
  body: string;
};

/** 단원 — 보드의 한 열 */
export type ConceptChapter = {
  id: string;
  title: string;
  cards: ConceptCard[];
};

/** 과목 — 개념 페이지의 탭 하나 (예: 전기기사의 전기자기학). DB에서 읽을 때 id는 slug다 */
export type ConceptCourse = {
  id: string;
  title: string;
  chapters: ConceptChapter[];
};

/** 과목 탭에 필요한 요약 (단원·카드 본문 없이 카드 수만) */
export type ConceptCourseSummary = {
  id: string;
  title: string;
  cardCount: number;
};
