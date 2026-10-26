import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute, readJson } from "@/server/http/route-handler";
import { updateUserApproval } from "@/server/services/admin-service";
import { requireAdmin } from "@/server/services/auth-service";
import type { AdminUser } from "@/types/admin";

/** PATCH /api/admin/users/[id] — { approved } → 200 { user } (승인·승인 취소, 관리자 전용) */
export const PATCH = handleRoute<RouteContext<"/api/admin/users/[id]">>(async (request, { params }) => {
  const admin = await requireAdmin(getAccessToken(request));
  const user = await updateUserApproval((await params).id, await readJson(request), admin.id);

  return NextResponse.json<{ user: AdminUser }>({ user });
});
