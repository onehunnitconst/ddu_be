import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { getCurrentUser } from "@/server/services/auth-service";
import { getRandomQuestion } from "@/server/services/exam-service";
import type { RandomQuestionResponse } from "@/types/exam";

/**
 * GET /api/exams/[subject]/questions/random?exclude={직전 문제 id}&mode={all|wrong}
 * → 200 { question, poolSize } (정답 제외, 로그인 필요). mode=wrong이면 사용자의 오답 중에서 고른다
 */
export const GET = handleRoute<RouteContext<"/api/exams/[subject]/questions/random">>(
  async (request, { params }) => {
    const user = await getCurrentUser(getAccessToken(request));
    const { subject } = await params;
    const { searchParams } = request.nextUrl;
    const response = await getRandomQuestion(subject, {
      excludeId: searchParams.get("exclude"),
      mode: searchParams.get("mode") === "wrong" ? "wrong" : "all",
      userId: user.id,
    });

    return NextResponse.json<RandomQuestionResponse>(response, {
      headers: { "Cache-Control": "no-store" },
    });
  },
);
