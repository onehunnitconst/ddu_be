import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { listUsers } from "@/server/services/admin-service";
import { requireAdmin } from "@/server/services/auth-service";
import type { AdminUser } from "@/types/admin";

/** GET /api/admin/users → 200 { users } (승인 대기 먼저, 관리자 전용) */
export const GET = handleRoute(async (request) => {
  await requireAdmin(getAccessToken(request));
  const users = await listUsers();

  return NextResponse.json<{ users: AdminUser[] }>({ users }, { headers: { "Cache-Control": "no-store" } });
});
