import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute, readJson } from "@/server/http/route-handler";
import { resolveOptionalUserId } from "@/server/services/auth-service";
import { submitAttempt } from "@/server/services/exam-service";
import type { AttemptResponse } from "@/types/exam";

/**
 * POST /api/questions/[id]/attempts — { selected: number[] } | { dontKnow: true }
 * → 200 { outcome, result(정답·해설), recorded } (로그인 상태면 풀이 기록에 저장)
 */
export const POST = handleRoute<RouteContext<"/api/questions/[id]/attempts">>(
  async (request, { params }) => {
    const { id } = await params;
    const userId = await resolveOptionalUserId(getAccessToken(request));
    const response = await submitAttempt(id, await readJson(request), userId);

    return NextResponse.json<AttemptResponse>(response);
  },
);
