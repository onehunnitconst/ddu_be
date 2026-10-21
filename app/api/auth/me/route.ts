import { NextResponse } from "next/server";
import { getAccessToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { getCurrentUser } from "@/server/services/auth-service";

/** GET /api/auth/me — 액세스 토큰 쿠키 → 200 { user } (없거나 만료 시 401) */
export const GET = handleRoute(async (request) => {
  const user = await getCurrentUser(getAccessToken(request));

  return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
});
