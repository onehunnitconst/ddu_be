import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { listConceptTree } from "@/server/services/admin-service";
import { requireAdmin } from "@/server/services/auth-service";
import type { AdminConceptCourse } from "@/types/admin";

/** GET /api/admin/concepts?subject={slug} → 200 { courses } (과목 > 단원 > 카드, 관리자 전용) */
export const GET = handleRoute(async (request) => {
  await requireAdmin(getAccessToken(request));
  const courses = await listConceptTree(request.nextUrl.searchParams.get("subject") ?? "");

  return NextResponse.json<{ courses: AdminConceptCourse[] }>(
    { courses },
    { headers: { "Cache-Control": "no-store" } },
  );
});
