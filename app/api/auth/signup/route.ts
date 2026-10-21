import { NextResponse } from "next/server";
import { setAuthCookies } from "@/server/http/auth-cookies";
import { handleRoute, readJson } from "@/server/http/route-handler";
import { signup } from "@/server/services/auth-service";

/** POST /api/auth/signup — { loginId, password, nickname } → 201 { user } + 인증 쿠키 */
export const POST = handleRoute(async (request) => {
  const { user, tokens } = await signup(await readJson(request));

  const response = NextResponse.json({ user }, { status: 201 });
  setAuthCookies(response, tokens);
  return response;
});
