import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE_PATH,
} from "@/server/auth/config";
import type { AuthTokens } from "@/server/services/auth-service";

/** JS에서 읽을 수 없고(httpOnly), 교차 사이트 POST에는 실리지 않는(SameSite=Lax) 쿠키 */
const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
} as const;

export function setAuthCookies(response: NextResponse, tokens: AuthTokens) {
  // JWT 자체는 15분이면 만료되지만 쿠키는 리프레시 토큰만큼 남겨 둔다.
  // 만료된 토큰이 전달되면 서버가 401을 돌려줘 클라이언트가 갱신하므로,
  // "로그인했지만 토큰이 만료된 사용자"를 비로그인 사용자로 오인하지 않는다.
  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseCookie,
    path: "/",
    expires: tokens.refreshTokenExpiresAt,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseCookie,
    path: REFRESH_TOKEN_COOKIE_PATH,
    expires: tokens.refreshTokenExpiresAt,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", { ...baseCookie, path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    ...baseCookie,
    path: REFRESH_TOKEN_COOKIE_PATH,
    maxAge: 0,
  });
}

export const getAccessToken = (request: NextRequest) =>
  request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

export const getRefreshToken = (request: NextRequest) =>
  request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
