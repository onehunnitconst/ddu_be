import { NextResponse } from "next/server";
import { clearAuthCookies, getRefreshToken } from "@/server/http/auth-cookies";
import { handleRoute } from "@/server/http/route-handler";
import { logout } from "@/server/services/auth-service";

/** POST /api/auth/logout — 리프레시 토큰 폐기 + 인증 쿠키 삭제 → 204 */
export const POST = handleRoute(async (request) => {
  await logout(getRefreshToken(request));

  const response = new NextResponse(null, { status: 204 });
  clearAuthCookies(response);
  return response;
});
