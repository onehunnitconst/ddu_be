import { NextResponse } from "next/server";
import { setAuthCookies } from "@/server/http/auth-cookies";
import { handleRoute, readJson } from "@/server/http/route-handler";
import { login } from "@/server/services/auth-service";

/** POST /api/auth/login — { loginId, password } → 200 { user } + 인증 쿠키 */
export const POST = handleRoute(async (request) => {
  const { user, tokens } = await login(await readJson(request));

  const response = NextResponse.json({ user });
  setAuthCookies(response, tokens);
  return response;
});
