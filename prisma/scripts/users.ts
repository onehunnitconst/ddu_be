/**
 * 가입 승인 관리 (관리 화면이 생기기 전까지 쓰는 CLI).
 *
 *   pnpm users:pending              승인 대기 사용자 목록
 *   pnpm users:approve <loginId>    승인 (approved_at = 지금)
 *   pnpm users:revoke <loginId>     승인 취소 (approved_at = null, 리프레시 토큰도 모두 폐기)
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

const [command, loginId] = process.argv.slice(2);
const run =
  command === "pending"
    ? listPending()
    : command === "approve" || command === "revoke"
      ? setApproved(loginId, command === "approve")
      : Promise.reject(new Error(`알 수 없는 명령: ${command ?? "(없음)"} (pending | approve | revoke)`));

run
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
