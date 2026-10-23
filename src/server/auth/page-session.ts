import "server-only";

import { cookies } from "next/headers";
import { AppError } from "@/server/errors";
import { getCurrentUser } from "@/server/services/auth-service";
import { ACCESS_TOKEN_COOKIE } from "./config";

/**
 * 페이지(서버 컴포넌트)용: 승인된 사용자의 유효한 액세스 토큰이면 사용자 ID, 아니면 null.
 * 만료된 경우의 갱신은 클라이언트(SessionProvider)가 맡고, 끝나면 페이지를 다시 요청한다
 */
export async function getPageUserId(): Promise<string | null> {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  try {
    return (await getCurrentUser(token)).id;
  } catch (error) {
    if (error instanceof AppError) return null;
    throw error;
  }
}
