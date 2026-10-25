import "server-only";

import { randomInt } from "node:crypto";
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

/** 과목에서 문제 하나를 무작위로 고른다. 직전 문제(excludeId)는 가능하면 제외한다 */
export async function getRandomQuestion(
  subjectSlug: string,
  excludeId: string | null,
): Promise<QuestionView> {
  assertSubject(subjectSlug);

  const base = questionsOfSubject(subjectSlug);
  const exclude = excludeId && uuidSchema.safeParse(excludeId).success ? excludeId : null;

  let where: Prisma.QuestionWhereInput = exclude ? { ...base, id: { not: exclude } } : base;
  let count = await prisma.question.count({ where });
  if (count === 0 && exclude) {
    // 문제가 하나뿐이면 같은 문제라도 다시 낸다
    where = base;
    count = await prisma.question.count({ where });
  }
  if (count === 0) throw notFound("NO_QUESTIONS", "아직 등록된 문제가 없습니다.");

  const row = await prisma.question.findFirstOrThrow({
    where,
    orderBy: { id: "asc" },
    skip: randomInt(count),
    select: questionRecordSelect,
  });
  const view = toQuestionView(parseQuestion(row));
  const audioUrl = row.audioPath ? await createAudioUrl(row.audioPath) : null;
  return { ...view, audioUrl };
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
