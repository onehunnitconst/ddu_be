import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { getCurrentUser } from "@/server/services/auth-service";
import { getQuestionReview } from "@/server/services/exam-service";
import type { QuestionReviewResponse } from "@/types/exam";

/**
 * GET /api/questions/[id] → 200 { question, result(정답·해설), attempts } (로그인 필요).
 * 정답이 담기므로 사용자가 푼 적 있는 문제만 응답하고, 아니면 404
 */
export const GET = handleRoute<RouteContext<"/api/questions/[id]">>(async (request, { params }) => {
  const { id } = await params;
  const user = await getCurrentUser(getAccessToken(request));
  const review = await getQuestionReview(id, user.id);

  return NextResponse.json<QuestionReviewResponse>(review, {
    headers: { "Cache-Control": "no-store" },
  });
});
