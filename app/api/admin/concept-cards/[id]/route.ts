import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute, readJson } from "@/server/http/route-handler";
import { updateConceptCard } from "@/server/services/admin-service";
import { requireAdmin } from "@/server/services/auth-service";
import type { AdminConceptCard } from "@/types/admin";

/** PUT /api/admin/concept-cards/[id] — { title, body } → 200 { card } (관리자 전용, 개념 페이지에 바로 반영) */
export const PUT = handleRoute<RouteContext<"/api/admin/concept-cards/[id]">>(async (request, { params }) => {
  await requireAdmin(getAccessToken(request));
  const card = await updateConceptCard((await params).id, await readJson(request));

  return NextResponse.json<{ card: AdminConceptCard }>({ card });
});
