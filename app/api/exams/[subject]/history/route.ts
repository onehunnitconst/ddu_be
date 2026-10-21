import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { getCurrentUser } from "@/server/services/auth-service";
import { getHistory } from "@/server/services/exam-service";
import type { HistoryResponse } from "@/types/exam";

/** GET /api/exams/[subject]/history → 200 { summary, items } (로그인 필요) */
export const GET = handleRoute<RouteContext<"/api/exams/[subject]/history">>(
  async (request, { params }) => {
    const { subject } = await params;
    const user = await getCurrentUser(getAccessToken(request));
    const history = await getHistory(subject, user.id);

    return NextResponse.json<HistoryResponse>(history, {
      headers: { "Cache-Control": "no-store" },
    });
  },
);
