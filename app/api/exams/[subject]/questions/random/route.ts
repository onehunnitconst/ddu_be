import { NextResponse } from "next/server";
import { handleRoute } from "@/server/http/route-handler";
import { getRandomQuestion } from "@/server/services/exam-service";
import type { RandomQuestionResponse } from "@/types/exam";

/** GET /api/exams/[subject]/questions/random?exclude={직전 문제 id} → 200 { question } (정답 제외) */
export const GET = handleRoute<RouteContext<"/api/exams/[subject]/questions/random">>(
  async (request, { params }) => {
    const { subject } = await params;
    const question = await getRandomQuestion(subject, request.nextUrl.searchParams.get("exclude"));

    return NextResponse.json<RandomQuestionResponse>(
      { question },
      { headers: { "Cache-Control": "no-store" } },
    );
  },
);
