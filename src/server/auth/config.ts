/** 액세스 토큰(JWT, ES256) 유효 시간: 15분 */
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

/** 리프레시 토큰 유효 시간: 14일 */
export const REFRESH_TOKEN_TTL_SECONDS = 14 * 24 * 60 * 60;

export const JWT_ISSUER = "ddu";
export const JWT_AUDIENCE = "ddu-web";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

/** 리프레시 토큰 쿠키는 갱신·로그아웃 API에만 전송되도록 경로를 좁힌다 */
export const REFRESH_TOKEN_COOKIE_PATH = "/api/auth";
