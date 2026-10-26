import "server-only";

import { revalidateTag } from "next/cache";
import { prisma } from "@/server/db";
import { badRequest, notFound } from "@/server/errors";
import { createAudioUrls, uploadImage } from "@/server/storage";
import { conceptCardUpdateSchema, questionUpdateSchema, userUpdateSchema } from "@/server/validators/admin";
import { uuidSchema } from "@/server/validators/exam";
import { parseInput } from "@/server/validators/parse-input";
import type {
  AdminConceptCard,
  AdminConceptCourse,
  AdminQuestion,
  AdminQuestionSet,
  AdminUser,
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

/** 올릴 수 있는 이미지 형식 → 확장자 (Storage images 버킷의 허용 형식과 같다) */
const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** 문제·개념 카드에 넣을 이미지를 올리고 URL을 돌려준다 */
export async function uploadAdminImage(file: FormDataEntryValue | null): Promise<string> {
  if (!(file instanceof File) || file.size === 0) throw badRequest("이미지 파일을 골라 주세요.");
  const extension = IMAGE_TYPES[file.type];
  if (!extension) throw badRequest("PNG, JPEG, WebP, GIF 이미지만 올릴 수 있습니다.");
  if (file.size > MAX_IMAGE_BYTES) throw badRequest("이미지는 5MB 이하만 올릴 수 있습니다.");

  return uploadImage(file, extension);
}

const userNotFound = () => notFound("USER_NOT_FOUND", "존재하지 않는 회원입니다.");

/** UUID v7의 앞 48비트는 생성 시각(ms)이다. users에는 가입 시각 컬럼이 없어 id로 가입 시각을 구한다 */
const uuidV7Time = (id: string) => new Date(parseInt(id.replace(/-/g, "").slice(0, 12), 16));

const adminUserSelect = { id: true, loginId: true, nickname: true, isAdmin: true, approvedAt: true } as const;

/** 회원 목록: 승인 대기를 먼저, 그다음 최근 가입 순 */
export async function listUsers(): Promise<AdminUser[]> {
  const [users, attempts] = await Promise.all([
    prisma.user.findMany({ orderBy: { id: "desc" }, select: adminUserSelect }),
    prisma.questionAttempt.groupBy({ by: ["userId"], _count: { _all: true }, _max: { createdAt: true } }),
  ]);
  const activity = new Map(attempts.map((row) => [row.userId, row]));

  return users
    .map((user) => {
      const row = activity.get(user.id);
      return {
        ...user,
        approvedAt: user.approvedAt?.toISOString() ?? null,
        createdAt: uuidV7Time(user.id).toISOString(),
        attempts: row?._count._all ?? 0,
        lastAttemptAt: row?._max.createdAt?.toISOString() ?? null,
      };
    })
    .sort((a, b) => Number(a.approvedAt !== null) - Number(b.approvedAt !== null));
}

/**
 * 가입을 승인하거나 승인을 취소한다 (pnpm users:approve / users:revoke와 같다).
 * 승인 취소는 화면·API에서 바로 막히고(getCurrentUser가 승인 여부를 확인), 남은 리프레시 토큰도 폐기한다.
 * 관리자 지정·해제는 화면에서 하지 않고 CLI로만 한다
 */
export async function updateUserApproval(userId: string, rawInput: unknown, adminId: string): Promise<AdminUser> {
  assertId(userId, userNotFound);
  const { approved } = parseInput(userUpdateSchema, rawInput);
  if (userId === adminId && !approved) throw badRequest("자기 자신의 승인은 취소할 수 없습니다.");

  const current = await prisma.user.findUnique({ where: { id: userId }, select: { approvedAt: true } });
  if (!current) throw userNotFound();

  const now = new Date();
  await prisma.user.update({
    where: { id: userId },
    data: {
      // 이미 승인된 회원은 처음 승인 시각을 유지한다
      approvedAt: approved ? (current.approvedAt ?? now) : null,
      ...(!approved && { refreshTokens: { updateMany: { where: { revokedAt: null }, data: { revokedAt: now } } } }),
    },
  });

  const user = (await listUsers()).find((item) => item.id === userId);
  if (!user) throw userNotFound();
  return user;
}
