<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions

- Package manager: **pnpm** (do not use npm/yarn).
- UI: Tailwind CSS v4 + shadcn/ui (`pnpm dlx shadcn@latest add <component>` → `src/components/ui/`).
- Import alias `@/*` → `src/*`. `app/` (App Router) lives at the repo root and only defines routes/pages.
- App width: `MainLayout` wraps the header and every page in one centered `max-w-6xl` white column on a gray (`bg-muted`) body. Pages don't set their own outer width; full-screen overlays (`fixed inset-x-0`) add `mx-auto w-full max-w-6xl` to stay inside the column.

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
- Accounts need approval: `users.approved_at` (null = pending). Signup creates a pending user and issues no tokens; login of a pending user → 403 `APPROVAL_PENDING`; refresh and `getCurrentUser` only accept approved users. Manage with `pnpm users:pending`, `pnpm users:approve <loginId>`, `pnpm users:revoke <loginId>` (`prisma/scripts/users.ts`).
- Every API except `/api/auth/*` requires an approved login: call `getCurrentUser(getAccessToken(request))` first (no token/expired/unapproved → 401).
- Refresh token: opaque 256-bit random, 14 days, httpOnly cookie `refresh_token` (path `/api/auth`); only its SHA-256 is stored (`refresh_tokens`). Rotated on every refresh; reuse of a revoked token revokes all of that user's refresh tokens.
- Passwords: Argon2id (m=19456, t=2, p=1). Value rules shared with the UI live in `src/utils/user-rules.ts`.
- DB migrations are applied only with the user's explicit approval.
- Client side: session state lives in `SessionProvider` (`src/components/session-provider.tsx`, restores the session via `/api/auth/me` on load); read it with `useSession()` (`src/hooks/use-session.ts`). Call APIs through `apiRequest` (`src/utils/api-client.ts`), which retries once after `/api/auth/refresh` on 401 and throws `ApiError`. Auth calls: `src/utils/auth-api.ts`.
- Login/signup UI: `src/features/auth-dialog` (opened from the header and the login screen). After signup it returns to the login form with an "approval pending" notice.
- Every page requires login: wrap the page body in `RequireLogin` (`src/features/login-gate`), which checks the access token and approval on the server (`getPageUserId`) so gated content is never rendered for guests. Do data fetching inside a child component so it only runs after the check. Guests see a login screen. `SessionProvider.setUser` (login/logout/expiry) calls `router.refresh()`; the gate also refreshes when a client-side token refresh restores the session.

### Questions (exam data)

- Tables: `subjects` → `question_sets` (a 회차 for 기사 필기, a source collection for AWS) → `questions`.
- `questions.format` (`AWS_CERT` | `KR_TECH_WRITTEN` | `TOEIC_PART5`) decides the shape of `questions.content` (JSONB), option labels, and grading. Format-independent values are columns: `number`, `section`, `answer` (0-based option indexes, `smallint[]`).
- Never read `content` directly: go through `src/utils/question-format` (`parseQuestion` → `toQuestionView` / `gradeQuestion`). Each format lives in its own module implementing `QuestionFormatSpec`; to add a format, add an enum value + migration, a module, and register it in `index.ts`.
- Never send `answer`/explanation to the client before the user submits; grade on the server with `gradeQuestion`.
- Source shown on every question: `QuestionView.source` = question set title · section · N번 (built in `toQuestionView`; the service selects `set.title` with the question).
- TOEIC (`toeic-part5`): `TOEIC_PART5` holds only Part 5 single-sentence questions (English stem with a `-------` blank, 4 options (A)–(D), 1 answer, Korean explanation written in our own words: reason + `해석:` + optional `어휘:`). Part 6/7 (several questions per passage) do not fit this format. Sets: one per test (`해커스 토익 700+ 실전모의고사`, section `Part 5`, numbers 101–130) or per book chapter (`해커스 토익 RC Grammar · Ch.NN …` / `RC Vocabulary`, section `Hackers Test Part 5`). Source scans/answer books live in git-ignored `temp/`.
- Seed data: `prisma/seed/data/*.json` (NOT in `public/` — it contains answers). `pnpm db:seed` upserts subjects/sets and inserts missing questions (validated with `parseQuestion`; SOA #210, a hands-on lab, is skipped).
- Subject list shared by header/pages/seed: `src/utils/subjects.ts`.
- Exam APIs: `GET /api/exams/[subject]/questions/random?exclude=`, `POST /api/questions/[id]/attempts` (`{ selected }` | `{ dontKnow: true }`; always recorded), `GET /api/exams/[subject]/history` (login required). Attempts are stored per try in `question_attempts`.
- Exam UI: page `app/exams/[subject]`, features `exam` (tabs shell), `exam-practice` (문제 탭), `exam-history` (풀이 기록 탭).

### Concepts (study notes)

- Pages: `app/concepts/[subject]` (header menu "개념") redirects to `app/concepts/[subject]/[course]` for the first 과목 with cards; each 과목 has its own URL so a page only carries one 과목's content.
- Feature `concept-board`: 과목 tabs (links), and a Notion-style board with one column per 단원 (`ConceptChapter`) and cards with a title and a Markdown body (`ConceptCard`); types in `src/types/concept.ts`. The title, course tabs and view toggle stick under the global header; their bottom edge is published as the `--concept-sticky-bottom` CSS variable (`use-sticky-offset`) for anything that positions below them. Three views, remembered in localStorage (`use-view-mode`; add one by extending `VIEW_MODES` and the `VIEWS` map in `concept-views`): board (columns of fully expanded cards; clicking a card opens a stacked screen below the sticky area, closed with X/Esc — `concept-card-stack`), accordion (`<details>` rows that expand in place) and document (GitBook-style: 단원 sidebar, one 단원 per page with prev/next, on-page TOC with scroll spy). The body Markdown is rendered once on the server (`concept-board-view`) and passed as a node to the client views, so it is not duplicated in the payload.
- Data: tables `concept_courses` → `concept_chapters` → `concept_cards` (hang off `subjects`; slugs are the URL/anchor ids — course slug unique per subject, chapter slug per course, card slug per course because cards are anchors on the course page). Pages read them through `src/server/services/concept-service.ts` (`listConceptCourses` for tabs, `findConceptCourse` for one 과목), cached with `use cache` + `cacheLife("hours")` + tag `concepts`.
- The DB is the source of truth for concept content (the former TS files and their seed were removed). Edits made directly in the DB show up within an hour (or revalidate the `concepts` tag).
- Structure: 과목 follow the textbook (시하끝하 for 전기기사, 이기적 for 정보통신기사; AWS see below). A subject without 과목 shows "준비 중".
- Board mapping per textbook: 시하끝하 (전기기사) [단원] = column, 필수개념 = card; 이기적 (정보통신기사) SECTION = column, numbered sub-heading = card. Practice-question pages are not carded.
- AWS (saa, soa; source: course slide decks in `temp/`): 과목 tab = a domain grouping several slide sections (e.g. 스토리지 = S3, S3 고급, S3 보안, 기타 스토리지), column = slide section, card = one service/topic. Korean explanations with AWS service/feature names and exam keywords kept in English; prices written as `USD 0.01` (a `$` would be parsed as math). Course logistics, hands-on steps and the slides' copyright/watermark text never go into cards.
- Cards summarize the textbook in our own words (no verbatim copying) and must not change its formulas/values or add interpretations it doesn't make. Only certain textbook errors (provable by calculation, or contradicted elsewhere in the same book) are corrected, with a `> 교재에는 … 바로잡음` note on the card; anything ambiguous stays as printed. The textbook PDFs live in git-ignored `temp/` and carry a buyer watermark (name/phone) that must never appear in content.
- Render Markdown with `src/components/markdown.tsx` (react-markdown + remark-gfm + remark-math/rehype-katex + remark-cjk-friendly so `**용어(설명)**은` still renders bold; raw HTML is not rendered). Math: inline `$...$`; display math needs `$$` on its own lines before and after. In TS template strings, write TeX backslashes doubled (`\\frac`).
