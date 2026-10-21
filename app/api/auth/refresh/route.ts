import { unstable_rethrow } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import {
  clearAuthCookies,
  getRefreshToken,
  setAuthCookies,
} from "@/server/http/auth-cookies";
import { toErrorResponse } from "@/server/http/route-handler";
import { refresh } from "@/server/services/auth-service";

/** POST /api/auth/refresh — 리프레시 토큰 쿠키 → 200 { user } + 새 인증 쿠키 (실패 시 쿠키 삭제) */
export async function POST(request: NextRequest) {
  try {
    const { user, tokens } = await refresh(getRefreshToken(request));

    const response = NextResponse.json({ user });
    setAuthCookies(response, tokens);
    return response;
  } catch (error) {
    unstable_rethrow(error);
    const response = toErrorResponse(error);
    clearAuthCookies(response);
    return response;
  }
}
