import "server-only";

import { revalidateTag } from "next/cache";
import { prisma } from "@/server/db";
import { badRequest, notFound } from "@/server/errors";
import { createAudioUrls } from "@/server/storage";
import { conceptCardUpdateSchema, questionUpdateSchema } from "@/server/validators/admin";
import { uuidSchema } from "@/server/validators/exam";
import { parseInput } from "@/server/validators/parse-input";
import type {
  AdminConceptCard,
  AdminConceptCourse,
  AdminQuestion,
  AdminQuestionSet,
} from "@/types/admin";
import { getQuestionFormat, parseQuestion, QuestionFormatError } from "@/utils/question-format";
import { findSubject } from "@/utils/subjects";

/**
 * 관리 화면(/admin)용 조회·수정. 호출 전에 라우트에서 requireAdmin으로 관리자인지 확인한다.
 */

function assertSubject(slug: string) {
  if (!findSubject(slug)) throw notFound("SUBJECT_NOT_FOUND", "존재하지 않는 과목입니다.");
}

const assertId = (id: string, notFoundError: () => Error) => {
  if (!uuidSchema.safeParse(id).success) throw notFoundError();
};

const questionNotFound = () => notFound("QUESTION_NOT_FOUND", "존재하지 않는 문제입니다.");
const cardNotFound = () => notFound("CONCEPT_CARD_NOT_FOUND", "존재하지 않는 개념 카드입니다.");

const adminQuestionSelect = {
  id: true,
  number: true,
  format: true,
  section: true,
  content: true,
  answer: true,
  audioPath: true,
} as const;

type AdminQuestionRow = Omit<AdminQuestion, "audioUrl">;

async function withAudioUrls(rows: AdminQuestionRow[]): Promise<AdminQuestion[]> {
  const urls = await createAudioUrls(rows.flatMap((row) => (row.audioPath ? [row.audioPath] : [])));
  return rows.map((row) => ({ ...row, audioUrl: row.audioPath ? (urls.get(row.audioPath) ?? null) : null }));
}

export async function listQuestionSets(subjectSlug: string): Promise<AdminQuestionSet[]> {
  assertSubject(subjectSlug);
  const sets = await prisma.questionSet.findMany({
    where: { subject: { slug: subjectSlug } },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    select: { id: true, title: true, _count: { select: { questions: true } } },
  });
  return sets.map((set) => ({ id: set.id, title: set.title, questionCount: set._count.questions }));
}

export async function listSetQuestions(setId: string): Promise<AdminQuestion[]> {
  const setNotFound = () => notFound("QUESTION_SET_NOT_FOUND", "존재하지 않는 문제 묶음입니다.");
  assertId(setId, setNotFound);
  const set = await prisma.questionSet.findUnique({
    where: { id: setId },
    select: { questions: { orderBy: { number: "asc" }, select: adminQuestionSelect } },
  });
  if (!set) throw setNotFound();

  return withAudioUrls(set.questions);
}

/**
 * 문제의 세부 구분·정답·음원 경로·content를 고친다.
 * content와 정답은 형태 규칙(parseQuestion)으로, 음원 경로는 Storage에 파일이 있는지로 검사한다.
 */
export async function updateQuestion(questionId: string, rawInput: unknown): Promise<AdminQuestion> {
  assertId(questionId, questionNotFound);
  const input = parseInput(questionUpdateSchema, rawInput);

  const current = await prisma.question.findUnique({
    where: { id: questionId },
    select: { id: true, number: true, format: true },
  });
  if (!current) throw questionNotFound();

  const answer = [...input.answer].sort((a, b) => a - b);
  const contentCheck = getQuestionFormat(current.format).contentSchema.safeParse(input.content);
  if (!contentCheck.success) {
    throw badRequest("문제 형식이 올바르지 않습니다.", {
      content: contentCheck.error.issues.map((issue) => `${issue.path.join(".") || "(전체)"}: ${issue.message}`),
    });
  }
  try {
    parseQuestion({ ...current, section: input.section, content: input.content, answer });
  } catch (error) {
    // content는 위에서 확인했으므로 남은 오류는 정답 개수·범위다
    if (error instanceof QuestionFormatError) {
      throw badRequest("정답이 형식 규칙에 맞지 않습니다.", { answer: ["정답 개수나 보기 번호를 확인해 주세요."] });
    }
    throw error;
  }

  if (input.audioPath) {
    const urls = await createAudioUrls([input.audioPath]);
    if (!urls.get(input.audioPath)) {
      throw badRequest("음원 파일을 찾을 수 없습니다.", { audioPath: ["Storage audio 버킷에 없는 경로입니다."] });
    }
  }

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: {
      section: input.section,
      answer,
      audioPath: input.audioPath,
      content: input.content as object,
    },
    select: adminQuestionSelect,
  });
  const [question] = await withAudioUrls([updated]);
  return question;
}

/** 종목의 개념 과목 > 단원 > 카드 전체 (캐시하지 않은 원본) */
export async function listConceptTree(subjectSlug: string): Promise<AdminConceptCourse[]> {
  assertSubject(subjectSlug);
  const courses = await prisma.conceptCourse.findMany({
    where: { subject: { slug: subjectSlug } },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      chapters: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          title: true,
          cards: { orderBy: { sortOrder: "asc" }, select: { id: true, slug: true, title: true, body: true } },
        },
      },
    },
  });
  return courses;
}

/** 개념 카드 제목·본문을 고치고, 개념 페이지 캐시를 바로 무효화한다 */
export async function updateConceptCard(cardId: string, rawInput: unknown): Promise<AdminConceptCard> {
  assertId(cardId, cardNotFound);
  const input = parseInput(conceptCardUpdateSchema, rawInput);

  const exists = await prisma.conceptCard.findUnique({ where: { id: cardId }, select: { id: true } });
  if (!exists) throw cardNotFound();

  const card = await prisma.conceptCard.update({
    where: { id: cardId },
    data: { title: input.title, body: input.body },
    select: { id: true, slug: true, title: true, body: true },
  });
  // 라우트 핸들러에서는 updateTag를 쓸 수 없어, 다음 요청이 바로 새 내용을 읽도록 expire: 0으로 무효화한다
  revalidateTag("concepts", { expire: 0 });
  return card;
}
