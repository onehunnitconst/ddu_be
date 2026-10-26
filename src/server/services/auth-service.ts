import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { signAccessToken, verifyAccessToken } from "@/server/auth/jwt";
import {
  hashPassword,
  verifyDummyPassword,
  verifyPassword,
} from "@/server/auth/password";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "@/server/auth/refresh-token";
import { prisma } from "@/server/db";
import { conflict, forbidden, unauthorized } from "@/server/errors";
import { loginSchema, signupSchema } from "@/server/validators/auth";
import { parseInput } from "@/server/validators/parse-input";
import type { AuthUser } from "@/types/auth";

export type { AuthUser };

export type AuthTokens = {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
};

export type AuthResult = {
  user: AuthUser;
  tokens: AuthTokens;
};

const authUserSelect = { id: true, loginId: true, nickname: true, isAdmin: true } as const;

type Db = Prisma.TransactionClient | typeof prisma;

/** 액세스 토큰을 서명하고, 리프레시 토큰을 새로 발급해 해시를 저장한다 */
async function issueTokens(db: Db, userId: string): Promise<AuthTokens> {
  const refresh = generateRefreshToken();
  await db.refreshToken.create({
    data: {
      userId,
      tokenHash: hashRefreshToken(refresh.token),
      expiresAt: refresh.expiresAt,
    },
  });
  const access = await signAccessToken(userId);

  return {
    accessToken: access.token,
    accessTokenExpiresAt: access.expiresAt,
    refreshToken: refresh.token,
    refreshTokenExpiresAt: refresh.expiresAt,
  };
}

const invalidRefreshToken = () =>
  unauthorized("INVALID_REFRESH_TOKEN", "로그인이 만료되었습니다. 다시 로그인해 주세요.");

/**
 * 승인 대기(approvedAt = null) 상태로 가입시킨다. 관리자가 승인하기 전에는 로그인할 수 없으므로
 * 토큰은 발급하지 않는다 (승인: pnpm users:approve <loginId>)
 */
export async function signup(rawInput: unknown): Promise<AuthUser> {
  const input = parseInput(signupSchema, rawInput);

  const [loginIdTaken, nicknameTaken] = await Promise.all([
    prisma.user.findUnique({ where: { loginId: input.loginId }, select: { id: true } }),
    prisma.user.findUnique({ where: { nickname: input.nickname }, select: { id: true } }),
  ]);
  if (loginIdTaken) throw conflict("LOGIN_ID_TAKEN", "이미 사용 중인 아이디입니다.");
  if (nicknameTaken) throw conflict("NICKNAME_TAKEN", "이미 사용 중인 닉네임입니다.");

  const passwordHash = await hashPassword(input.password);

  try {
    return await prisma.user.create({
      data: { loginId: input.loginId, passwordHash, nickname: input.nickname },
      select: authUserSelect,
    });
  } catch (error) {
    // 위 중복 확인과 생성 사이에 같은 값으로 가입한 경우
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw conflict("DUPLICATE_USER", "이미 사용 중인 아이디 또는 닉네임입니다.");
    }
    throw error;
  }
}

export async function login(rawInput: unknown): Promise<AuthResult> {
  const input = parseInput(loginSchema, rawInput);

  const user = await prisma.user.findUnique({
    where: { loginId: input.loginId },
    select: { ...authUserSelect, passwordHash: true, approvedAt: true },
  });

  const valid = user
    ? await verifyPassword(user.passwordHash, input.password)
    : await verifyDummyPassword(input.password);
  if (!user || !valid) {
    throw unauthorized("INVALID_CREDENTIALS", "아이디 또는 비밀번호가 올바르지 않습니다.");
  }
  // 비밀번호가 맞는 경우에만 알려 준다 (다른 사람이 승인 여부를 알아낼 수 없게)
  if (!user.approvedAt) {
    throw forbidden("APPROVAL_PENDING", "관리자 승인 후 로그인할 수 있습니다.");
  }

  return {
    user: { id: user.id, loginId: user.loginId, nickname: user.nickname, isAdmin: user.isAdmin },
    tokens: await issueTokens(prisma, user.id),
  };
}

/**
 * 리프레시 토큰을 폐기하고 새 토큰 쌍을 발급한다(rotation).
 * 이미 폐기된 토큰이 다시 쓰이면 탈취로 간주해 그 사용자의 모든 리프레시 토큰을 폐기한다.
 */
export async function refresh(refreshToken: string | undefined): Promise<AuthResult> {
  if (!refreshToken) throw invalidRefreshToken();

  const tokenHash = hashRefreshToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expiresAt: true, revokedAt: true },
  });
  if (!stored) throw invalidRefreshToken();

  const now = new Date();
  if (stored.revokedAt) {
    await revokeAllRefreshTokens(stored.userId, now);
    throw invalidRefreshToken();
  }
  if (stored.expiresAt <= now) throw invalidRefreshToken();

  const result = await prisma.$transaction(async (tx) => {
    // 동시에 같은 토큰으로 갱신하는 경우 한 요청만 폐기에 성공한다
    const { count } = await tx.refreshToken.updateMany({
      where: { id: stored.id, revokedAt: null },
      data: { revokedAt: now },
    });
    if (count === 0) return null;

    // 승인이 취소된 사용자는 갱신할 수 없다
    const user = await tx.user.findUnique({
      where: { id: stored.userId, approvedAt: { not: null } },
      select: authUserSelect,
    });
    if (!user) return null;

    return { user, tokens: await issueTokens(tx, user.id) };
  });

  if (!result) {
    await revokeAllRefreshTokens(stored.userId, now);
    throw invalidRefreshToken();
  }
  return result;
}

/** 전달된 리프레시 토큰을 폐기한다. 토큰이 없거나 이미 무효여도 성공으로 처리한다 */
export async function logout(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;

  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashRefreshToken(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/** 액세스 토큰으로 현재 사용자(승인된 사용자만)를 조회한다. 없거나 만료·무효·미승인이면 401 */
export async function getCurrentUser(accessToken: string | undefined): Promise<AuthUser> {
  const userId = accessToken ? await verifyAccessToken(accessToken) : null;
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId, approvedAt: { not: null } },
        select: authUserSelect,
      })
    : null;
  if (!user) throw unauthorized("UNAUTHORIZED", "로그인이 필요합니다.");

  return user;
}

/** getCurrentUser + 관리자 확인. 관리자가 아니면 403 */
export async function requireAdmin(accessToken: string | undefined): Promise<AuthUser> {
  const user = await getCurrentUser(accessToken);
  if (!user.isAdmin) throw forbidden("ADMIN_REQUIRED", "관리자만 사용할 수 있습니다.");

  return user;
}

async function revokeAllRefreshTokens(userId: string, now: Date) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: now },
  });
}
