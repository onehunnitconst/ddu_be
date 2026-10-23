import { NextResponse } from "next/server";
import { handleRoute, readJson } from "@/server/http/route-handler";
import { signup } from "@/server/services/auth-service";

/** POST /api/auth/signup — { loginId, password, nickname } → 201 { user } (승인 대기, 로그인 쿠키 없음) */
export const POST = handleRoute(async (request) => {
  const user = await signup(await readJson(request));

  return NextResponse.json({ user }, { status: 201 });
});
