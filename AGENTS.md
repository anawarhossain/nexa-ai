# Agent Instructions — Nexa AI

## Repo structure

Two independent packages in one repo. Each has its own `package.json`, `node_modules`, and lockfile.

- `client/` — Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/UI
- `server/` — Express 5 + TypeScript 7 + Mongoose 9 + Better Auth + Gemini AI

Project plan and phase tracking: `plan.md` (Phases 0–3 done, 4–9 pending).

## Dev commands

```bash
# Client (port 3000)
cd client && npm run dev

# Server (port 5000, requires .env)
cd server && npm run dev

# Seed data
cd server && npm run seed:demo   # pre-seeded demo user
cd server && npm run seed:items  # sample items
```

There is **no test framework** configured in either package. `npm run test` on server is a stub.

## Lint / typecheck

```bash
cd client && npm run lint   # eslint (eslint-config-next core-web-vitals + typescript)
# No separate typecheck script; next build does type checking
cd client && npm run build
```

Server has no lint or test scripts. Typecheck via `cd server && npx tsc --noEmit`.

## Env setup

Both packages require env files (see `.env.example` in each):

- `server/.env` — `MONGO_URI` (Atlas), `PORT`, `BETTER_AUTH_SECRET`, `GEMINI_API_KEY`, Google OAuth creds, `CLIENT_URL`
- `client/.env.local` — `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_APP_URL`

**Never commit `.env` or `.env.local`.**

## Critical version quirks

### Next.js 16
The installed Next.js (16.2.10) has breaking changes from earlier versions. Check `node_modules/next/dist/docs/` before writing new Next.js code.

### Express 5
Server uses Express 5. Wildcard routes use `{*any}` syntax, not `*`. See `server/src/app.ts:25`.

### Better Auth mount order
The Better Auth handler (`app.all("/api/auth/{*any}", ...)`) **must** be mounted before `express.json()` middleware — otherwise body parsing breaks. Do not reorder middleware in `server/src/app.ts`.

## Server architecture

Entry: `server/src/server.ts` → `bootstrap()` → connectDB → initAuth → createApp.

Module pattern (`server/src/modules/<name>/`):
- `<name>.routes.ts` — Express Router
- `<name>.controller.ts` — request handlers
- `<name>.service.ts` — business logic
- `<name>.model.ts` — Mongoose schema
- `prompts/` — AI prompt templates (content-generator only)

Core shared code: `server/src/core/` (auth, middleware, config, users).

AI layer: `server/src/ai/` (provider interface + Gemini provider + agent engine).

New modules go under `server/src/modules/` and `client/app/dashboard/<module>/`.

## Client architecture

- Path alias: `@/*` maps to project root
- App Router with route groups: `(marketing)`, `(auth)`, `dashboard/`
- TanStack Query via `QueryProvider` wrapper in root layout
- Auth handled client-side via Better Auth client + TanStack Query cache
- shadcn components in `components/ui/`, layout components in `components/layout/`

## Adding a new module

Follow the plan.md checklist: create routes/controller/service/model on server, add page under `client/app/dashboard/`, register route in `server/src/app.ts`, add sidebar entry. Core auth/DB/shell never needs changes.
