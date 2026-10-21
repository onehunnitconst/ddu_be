<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions

- Package manager: **pnpm** (do not use npm/yarn).
- UI: Tailwind CSS v4 + shadcn/ui (`pnpm dlx shadcn@latest add <component>` → `src/components/ui/`).
- Import alias `@/*` → `src/*`. `app/` (App Router) lives at the repo root and only defines routes/pages.

### Screen pattern: MVVM + Container-Presentational

| Role      | File                | Responsibility                                                      |
| --------- | ------------------- | ------------------------------------------------------------------- |
| Container | `*-container.tsx`   | Calls the ViewModel hook, branches on state, passes data/callbacks to the View |
| View      | `*-view.tsx`        | Receives data/callbacks via props, pure UI rendering                |
| ViewModel | `use-*.ts`          | Data loading/API calls, business logic, state management, data shaping |

### Directory layout

```
├── app/                        # App Router routes and pages
├── public/
│   └── images/soa/             # SOA question/option images (referenced as /images/soa/...)
├── src/
│   ├── features/               # Feature blocks (Container + View + ViewModel)
│   │   └── [feature]/
│   │       ├── [feature]-container.tsx
│   │       ├── [feature]-view.tsx
│   │       ├── use-[feature].ts      # ViewModel (custom hook)
│   │       ├── constants.ts          # feature-only constants
│   │       ├── components/           # feature-only components
│   │       ├── hooks/                # (when needed) hooks used only inside this screen — parts the ViewModel composes
│   │       ├── utils/                # (when needed) pure functions/data structures that know neither React nor canvas
│   │       └── render/               # (when needed) canvas drawing functions and their color/font tables
│   ├── components/             # Globally reusable UI components (shadcn in components/ui)
│   ├── layouts/                # Layouts
│   ├── hooks/                  # Global custom hooks
│   ├── server/                 # Server-only code (every module imports "server-only")
│   │   ├── services/           # Business logic (e.g. auth-service.ts) — throws AppError, knows nothing about HTTP
│   │   ├── auth/               # Token/password primitives (ES256 JWT, Argon2, refresh token)
│   │   ├── validators/         # zod input schemas (+ parseInput → 400 AppError)
│   │   ├── http/               # Helpers for app/api only (cookies, handleRoute/toErrorResponse, readJson)
│   │   ├── db.ts               # Shared Prisma client
│   │   └── errors.ts           # AppError (status + code)
│   ├── types/                  # Global type definitions
│   └── utils/                  # Utilities (cn.ts is the shadcn `utils` alias)
```

### Database (Prisma 7 + Supabase PostgreSQL)

- Schema: `prisma/schema.prisma`. CLI config (connection URL, migrations path): `prisma.config.ts`.
- Generated client: `src/generated/prisma` (git-ignored, regenerated on `pnpm install` / `pnpm db:generate`). Import types from `@/generated/prisma/client`.
- Use the shared client only: `import { prisma } from "@/server/db"` (guarded by `server-only`).
- `DATABASE_URL` = Supabase transaction pooler (6543, runtime via `@prisma/adapter-pg`); `DIRECT_URL` = session/direct connection (5432, used by migrations).
- Scripts: `pnpm db:migrate` (dev migration), `pnpm db:deploy`, `pnpm db:generate`, `pnpm db:studio`.
- Keep `prisma`, `@prisma/client`, `@prisma/adapter-pg` on the same version.

### API layering

- `app/api/**/route.ts` handles HTTP only: read body/cookies → call a service → build the response (status, JSON, cookies). No business logic or DB access there.
- Error response shape: `{ "error": { "code": string, "message": string, "fields"?: Record<string, string[]> } }`.

### Auth

- Endpoints: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `GET /api/auth/me`.
- Access token: JWT signed with ES256 (`JWT_PRIVATE_JWK` env, EC P-256 private JWK), 15 min, httpOnly cookie `access_token` (path `/`). The cookie lives as long as the refresh token so an expired JWT still reaches the server → 401 → client refreshes (a missing cookie means "guest").
- Optional-auth endpoints use `resolveOptionalUserId` (no token → guest, invalid token → 401).
- Refresh token: opaque 256-bit random, 14 days, httpOnly cookie `refresh_token` (path `/api/auth`); only its SHA-256 is stored (`refresh_tokens`). Rotated on every refresh; reuse of a revoked token revokes all of that user's refresh tokens.
- Passwords: Argon2id (m=19456, t=2, p=1). Value rules shared with the UI live in `src/utils/user-rules.ts`.
- DB migrations are applied only with the user's explicit approval.
- Client side: session state lives in `SessionProvider` (`src/components/session-provider.tsx`, restores the session via `/api/auth/me` on load); read it with `useSession()` (`src/hooks/use-session.ts`). Call APIs through `apiRequest` (`src/utils/api-client.ts`), which retries once after `/api/auth/refresh` on 401 and throws `ApiError`. Auth calls: `src/utils/auth-api.ts`.
- Login/signup UI: `src/features/auth-dialog` (opened from the header).

### Questions (exam data)

- Tables: `subjects` → `question_sets` (a 회차 for 기사 필기, a source collection for AWS) → `questions`.
- `questions.format` (`AWS_CERT` | `KR_TECH_WRITTEN`) decides the shape of `questions.content` (JSONB), option labels, and grading. Format-independent values are columns: `number`, `section`, `answer` (0-based option indexes, `smallint[]`).
- Never read `content` directly: go through `src/utils/question-format` (`parseQuestion` → `toQuestionView` / `gradeQuestion`). Each format lives in its own module implementing `QuestionFormatSpec`; to add a format, add an enum value + migration, a module, and register it in `index.ts`.
- Never send `answer`/explanation to the client before the user submits; grade on the server with `gradeQuestion`.
- Seed data: `prisma/seed/data/*.json` (NOT in `public/` — it contains answers). `pnpm db:seed` upserts subjects/sets and inserts missing questions (validated with `parseQuestion`; SOA #210, a hands-on lab, is skipped).
- Subject list shared by header/pages/seed: `src/utils/subjects.ts`.
- Exam APIs: `GET /api/exams/[subject]/questions/random?exclude=`, `POST /api/questions/[id]/attempts` (`{ selected }` | `{ dontKnow: true }`; records only when logged in), `GET /api/exams/[subject]/history` (login required). Attempts are stored per try in `question_attempts`.
- Exam UI: page `app/exams/[subject]`, features `exam` (tabs shell), `exam-practice` (문제 탭), `exam-history` (풀이 기록 탭).
