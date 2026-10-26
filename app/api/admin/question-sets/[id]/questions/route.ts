import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { listSetQuestions } from "@/server/services/admin-service";
import { requireAdmin } from "@/server/services/auth-service";
import type { AdminQuestion } from "@/types/admin";

/** GET /api/admin/question-sets/[id]/questions → 200 { questions } (정답·content 원본 포함, 관리자 전용) */
export const GET = handleRoute<RouteContext<"/api/admin/question-sets/[id]/questions">>(
  async (request, { params }) => {
    await requireAdmin(getAccessToken(request));
    const questions = await listSetQuestions((await params).id);

    return NextResponse.json<{ questions: AdminQuestion[] }>(
      { questions },
      { headers: { "Cache-Control": "no-store" } },
    );
  },
);
