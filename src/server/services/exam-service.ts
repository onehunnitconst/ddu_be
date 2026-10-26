import "server-only";

import { randomInt } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/db";
import { badRequest, notFound } from "@/server/errors";
import { createAudioUrl } from "@/server/storage";
import { parseInput } from "@/server/validators/parse-input";
import { attemptSchema, uuidSchema } from "@/server/validators/exam";
import type {
  AttemptOutcome,
  AttemptResponse,
  HistoryItem,
  HistoryResponse,
  PracticeMode,
  QuestionReviewResponse,
  RandomQuestionResponse,
} from "@/types/exam";
import type { LocalizedText, QuestionView } from "@/types/question";
import {
  gradeQuestion,
  parseQuestion,
  toQuestionView,
} from "@/utils/question-format";
import { findSubject } from "@/utils/subjects";

const questionRecordSelect = {
  id: true,
  number: true,
  format: true,
  section: true,
  content: true,
  answer: true,
  audioPath: true,
  set: { select: { title: true } },
} as const satisfies Prisma.QuestionSelect;

const STEM_PREVIEW_LENGTH = 140;

function assertSubject(slug: string) {
  const subject = findSubject(slug);
  if (!subject) throw notFound("SUBJECT_NOT_FOUND", "존재하지 않는 과목입니다.");
  return subject;
}

const questionsOfSubject = (slug: string): Prisma.QuestionWhereInput => ({
  set: { subject: { slug } },
});

type QuestionRow = Prisma.QuestionGetPayload<{ select: typeof questionRecordSelect }>;

/** 풀이 화면용 문제에 음원 재생 URL을 붙인다 */
async function toQuestionViewWithAudio(row: QuestionRow): Promise<QuestionView> {
  const view = toQuestionView(parseQuestion(row));
  const audioUrl = row.audioPath ? await createAudioUrl(row.audioPath) : null;
  return { ...view, audioUrl };
}

/** 사용자가 과목에서 마지막으로 틀렸거나 모른다고 한 문제 (다시 풀어 맞히면 빠진다) */
async function findWrongQuestionIds(subjectSlug: string, userId: string): Promise<string[]> {
  const latest = await prisma.questionAttempt.findMany({
    where: { userId, question: questionsOfSubject(subjectSlug) },
    orderBy: { createdAt: "desc" },
    distinct: ["questionId"],
    select: { questionId: true, result: true },
  });
  return latest.filter((attempt) => attempt.result !== "CORRECT").map((attempt) => attempt.questionId);
}

/**
 * 과목에서 문제 하나를 무작위로 고른다. 직전 문제(excludeId)는 가능하면 제외한다.
 * mode가 "wrong"이면 사용자의 오답 중에서만 고른다.
 */
export async function getRandomQuestion(
  subjectSlug: string,
  { excludeId, mode, userId }: { excludeId: string | null; mode: PracticeMode; userId: string },
): Promise<RandomQuestionResponse> {
  assertSubject(subjectSlug);

  const base: Prisma.QuestionWhereInput =
    mode === "wrong"
      ? { id: { in: await findWrongQuestionIds(subjectSlug, userId) } }
      : questionsOfSubject(subjectSlug);
  const exclude = excludeId && uuidSchema.safeParse(excludeId).success ? excludeId : null;

  const poolSize = await prisma.question.count({ where: base });
  if (poolSize === 0) {
    throw mode === "wrong"
      ? notFound("NO_WRONG_QUESTIONS", "다시 풀 오답이 없습니다. 문제 탭에서 더 풀어 보세요.")
      : notFound("NO_QUESTIONS", "아직 등록된 문제가 없습니다.");
  }

  let where: Prisma.QuestionWhereInput = exclude ? { AND: [base, { id: { not: exclude } }] } : base;
  let count = exclude ? await prisma.question.count({ where }) : poolSize;
  if (count === 0) {
    // 문제가 하나뿐이면 같은 문제라도 다시 낸다
    where = base;
    count = poolSize;
  }

  const row = await prisma.question.findFirstOrThrow({
    where,
    orderBy: { id: "asc" },
    skip: randomInt(count),
    select: questionRecordSelect,
  });
  return { question: await toQuestionViewWithAudio(row), poolSize };
}

/**
 * 풀이 기록 다시 보기: 문제·정답·해설과 사용자의 풀이 기록.
 * 정답이 담기므로 사용자가 한 번이라도 푼 문제만 돌려준다.
 */
export async function getQuestionReview(questionId: string, userId: string): Promise<QuestionReviewResponse> {
  const notSolved = () => notFound("QUESTION_NOT_FOUND", "풀이 기록이 있는 문제만 볼 수 있습니다.");
  if (!uuidSchema.safeParse(questionId).success) throw notSolved();

  const [row, attempts] = await Promise.all([
    prisma.question.findUnique({ where: { id: questionId }, select: questionRecordSelect }),
    prisma.questionAttempt.findMany({
      where: { userId, questionId },
      orderBy: { createdAt: "desc" },
      select: { result: true, selected: true, createdAt: true },
    }),
  ]);
  if (!row || attempts.length === 0) throw notSolved();

  const parsed = parseQuestion(row);
  return {
    question: await toQuestionViewWithAudio(row),
    result: gradeQuestion(parsed, attempts[0].selected),
    attempts: attempts.map((attempt) => ({
      outcome: attempt.result,
      selected: attempt.selected,
      attemptedAt: attempt.createdAt.toISOString(),
    })),
  };
}

/**
 * 답을 채점하고 정답·해설을 돌려주며, 풀이 기록에 남긴다.
 * 정답은 이 응답에서만 내려간다.
 */
export async function submitAttempt(
  questionId: string,
  rawInput: unknown,
  userId: string,
): Promise<AttemptResponse> {
  if (!uuidSchema.safeParse(questionId).success) {
    throw notFound("QUESTION_NOT_FOUND", "존재하지 않는 문제입니다.");
  }
  const input = parseInput(attemptSchema, rawInput);

  const row = await prisma.question.findUnique({
    where: { id: questionId },
    select: questionRecordSelect,
  });
  if (!row) throw notFound("QUESTION_NOT_FOUND", "존재하지 않는 문제입니다.");

  const parsed = parseQuestion(row);
  const selected = "selected" in input ? [...new Set(input.selected)] : [];

  if ("selected" in input) {
    const { selection, options } = toQuestionView(parsed);
    const required = selection.mode === "multiple" ? selection.count : 1;
    if (selected.length !== required) {
      throw badRequest(`보기를 ${required}개 골라 주세요.`);
    }
    if (selected.some((index) => index >= options.length)) {
      throw badRequest("고른 보기가 올바르지 않습니다.");
    }
  }

  const result = gradeQuestion(parsed, selected);
  const outcome: AttemptOutcome =
    "dontKnow" in input ? "DONT_KNOW" : result.correct ? "CORRECT" : "INCORRECT";

  await prisma.questionAttempt.create({
    data: { userId, questionId, result: outcome, selected },
  });

  return {
    outcome,
    result: { ...result, correct: outcome === "CORRECT" },
    recorded: true,
  };
}

const preview = (text: LocalizedText): LocalizedText => {
  const cut = (value: string | null) =>
    value && value.length > STEM_PREVIEW_LENGTH ? `${value.slice(0, STEM_PREVIEW_LENGTH)}…` : value;
  return { ko: cut(text.ko), en: cut(text.en) };
};

/** 과목별로 사용자가 푼 문제와 문제별 풀이 횟수·결과를 모은다 (최근에 푼 순) */
export async function getHistory(subjectSlug: string, userId: string): Promise<HistoryResponse> {
  assertSubject(subjectSlug);
  const inSubject = questionsOfSubject(subjectSlug);

  const [totalQuestions, attempts] = await Promise.all([
    prisma.question.count({ where: inSubject }),
    prisma.questionAttempt.findMany({
      where: { userId, question: inSubject },
      orderBy: { createdAt: "desc" },
      select: { questionId: true, result: true, createdAt: true },
    }),
  ]);

  // 최근 순으로 훑으므로 문제별 첫 행이 마지막 풀이다
  const byQuestion = new Map<string, Omit<HistoryItem, "number" | "stemPreview">>();
  for (const attempt of attempts) {
    let item = byQuestion.get(attempt.questionId);
    if (!item) {
      item = {
        questionId: attempt.questionId,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        dontKnow: 0,
        lastOutcome: attempt.result,
        lastAttemptedAt: attempt.createdAt.toISOString(),
      };
      byQuestion.set(attempt.questionId, item);
    }
    item.attempts += 1;
    if (attempt.result === "CORRECT") item.correct += 1;
    else if (attempt.result === "INCORRECT") item.incorrect += 1;
    else item.dontKnow += 1;
  }

  const questions = await prisma.question.findMany({
    where: { id: { in: [...byQuestion.keys()] } },
    select: questionRecordSelect,
  });
  const questionById = new Map(questions.map((question) => [question.id, question]));

  const items: HistoryItem[] = [];
  for (const item of byQuestion.values()) {
    const question = questionById.get(item.questionId);
    if (!question) continue;
    const { content } = parseQuestion(question);
    items.push({
      ...item,
      number: question.number,
      stemPreview: preview(content.preview ?? content.stem),
    });
  }

  return {
    summary: {
      totalQuestions,
      solvedQuestions: items.length,
      totalAttempts: attempts.length,
      correctAttempts: attempts.filter((attempt) => attempt.result === "CORRECT").length,
    },
    items,
  };
  
}

/** 종목별 문제 수 (메인 화면용). 문제는 가져오기로만 늘어나므로 한 시간 캐시한다 (태그 "questions") */
export async function countQuestionsBySubject(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("hours");
  cacheTag("questions");

  const subjects = await prisma.subject.findMany({
    select: { slug: true, questionSets: { select: { _count: { select: { questions: true } } } } },
  });
  return Object.fromEntries(
    subjects.map((subject) => [
      subject.slug,
      subject.questionSets.reduce((sum, set) => sum + set._count.questions, 0),
    ]),
  );
}
