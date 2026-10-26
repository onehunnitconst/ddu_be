import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { listQuestionSets } from "@/server/services/admin-service";
import { requireAdmin } from "@/server/services/auth-service";
import type { AdminQuestionSet } from "@/types/admin";

/** GET /api/admin/question-sets?subject={slug} → 200 { sets } (관리자 전용) */
export const GET = handleRoute(async (request) => {
  await requireAdmin(getAccessToken(request));
  const sets = await listQuestionSets(request.nextUrl.searchParams.get("subject") ?? "");

  return NextResponse.json<{ sets: AdminQuestionSet[] }>({ sets }, { headers: { "Cache-Control": "no-store" } });
});
