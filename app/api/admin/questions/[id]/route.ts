import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute, readJson } from "@/server/http/route-handler";
import { updateQuestion } from "@/server/services/admin-service";
import { requireAdmin } from "@/server/services/auth-service";
import type { AdminQuestion } from "@/types/admin";

/** PUT /api/admin/questions/[id] — { section, answer, audioPath, content } → 200 { question } (관리자 전용) */
export const PUT = handleRoute<RouteContext<"/api/admin/questions/[id]">>(async (request, { params }) => {
  await requireAdmin(getAccessToken(request));
  const question = await updateQuestion((await params).id, await readJson(request));

  return NextResponse.json<{ question: AdminQuestion }>({ question });
});
