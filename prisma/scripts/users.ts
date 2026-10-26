/**
 * 가입 승인 관리 (관리 화면이 생기기 전까지 쓰는 CLI).
 *
 *   pnpm users:pending              승인 대기 사용자 목록
 *   pnpm users:approve <loginId>    승인 (approved_at = 지금)
 *   pnpm users:revoke <loginId>     승인 취소 (approved_at = null, 리프레시 토큰도 모두 폐기)
 *   pnpm users:admins               관리자 목록
 *   pnpm users:admin <loginId>      관리자로 지정 (/admin 화면과 관리 API 사용)
 *   pnpm users:unadmin <loginId>    관리자 해제
 */
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function listPending() {
  const users = await prisma.user.findMany({
    where: { approvedAt: null },
    orderBy: { id: "asc" }, // UUID v7이라 가입 순서와 같다
    select: { loginId: true, nickname: true },
  });
  if (users.length === 0) return console.log("승인 대기 중인 사용자가 없습니다.");
  for (const user of users) console.log(`${user.loginId}\t${user.nickname}`);
}

async function setApproved(loginId: string | undefined, approved: boolean) {
  if (!loginId) throw new Error("loginId를 입력해 주세요.");
  const now = new Date();
  const user = await prisma.user.update({
    where: { loginId },
    data: {
      approvedAt: approved ? now : null,
      // 승인 취소는 화면·API에서 바로 막히고(getCurrentUser가 승인 여부를 확인), 남은 리프레시 토큰도 폐기한다
      ...(!approved && { refreshTokens: { updateMany: { where: { revokedAt: null }, data: { revokedAt: now } } } }),
    },
    select: { loginId: true, nickname: true },
  });
  console.log(`${approved ? "승인" : "승인 취소"}: ${user.loginId} (${user.nickname})`);
}

async function listAdmins() {
  const users = await prisma.user.findMany({
    where: { isAdmin: true },
    orderBy: { id: "asc" },
    select: { loginId: true, nickname: true },
  });
  if (users.length === 0) return console.log("관리자가 없습니다.");
  for (const user of users) console.log(`${user.loginId}\t${user.nickname}`);
}

async function setAdmin(loginId: string | undefined, isAdmin: boolean) {
  if (!loginId) throw new Error("loginId를 입력해 주세요.");
  // 관리자 여부는 요청마다 DB에서 확인하므로(getCurrentUser) 바로 반영된다
  const user = await prisma.user.update({
    where: { loginId },
    data: { isAdmin },
    select: { loginId: true, nickname: true, approvedAt: true },
  });
  console.log(`${isAdmin ? "관리자 지정" : "관리자 해제"}: ${user.loginId} (${user.nickname})`);
  if (isAdmin && !user.approvedAt) console.log("주의: 아직 승인되지 않은 사용자라 로그인할 수 없습니다.");
}

const [command, loginId] = process.argv.slice(2);
const COMMANDS: Record<string, () => Promise<void>> = {
  pending: listPending,
  approve: () => setApproved(loginId, true),
  revoke: () => setApproved(loginId, false),
  admins: listAdmins,
  admin: () => setAdmin(loginId, true),
  unadmin: () => setAdmin(loginId, false),
};
const run =
  command && command in COMMANDS
    ? COMMANDS[command]()
    : Promise.reject(new Error(`알 수 없는 명령: ${command ?? "(없음)"} (${Object.keys(COMMANDS).join(" | ")})`));

run
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
