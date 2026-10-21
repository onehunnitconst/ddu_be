# AWS 기출문제

AWS SAA-C03 / SOA-C03 기출문제 풀이 웹앱 (Next.js 16, Tailwind CSS v4, shadcn/ui).

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build
pnpm lint
pnpm db:seed  # 과목·기출문제 데이터 삽입
```

- 문제 데이터: `prisma/seed/data/aws_saa.json` (683문제), `aws_soa.json` (398문제) → `pnpm db:seed`로 DB에 삽입
- 이미지: `public/images/soa/`
- 구조와 코딩 규칙: [AGENTS.md](AGENTS.md)
