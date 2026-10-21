import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { REFRESH_TOKEN_TTL_SECONDS } from "./config";

/** 추측 불가능한 256비트 불투명 토큰. 원문은 쿠키로만 전달한다 */
export function generateRefreshToken() {
  return {
    token: randomBytes(32).toString("base64url"),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
  };
}

/** DB에는 원문 대신 이 해시(SHA-256 hex)를 저장·조회한다 */
export function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
