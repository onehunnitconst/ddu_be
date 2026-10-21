import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed/seed.ts",
  },
  datasource: {
    // 마이그레이션은 트랜잭션 풀러(pgbouncer, 6543)를 거치면 안 되므로 직접 연결(5432)을 쓴다
    url: env("DIRECT_URL"),
  },
});
