# Nexa AI — Agentic AI Productivity Platform

**Nexa AI** is a modular, multi-feature AI productivity platform built as a **modular monolith**. It starts with an **AI Content Generator** as the flagship agentic feature, alongside an **Items Marketplace** for CRUD-based listing and management. The architecture is designed for extensibility — new AI modules (Career Coach, Health Companion, Travel Planner, Learning Assistant) can be added without touching core infrastructure.

> **Live Demo:** [nexa-ai.vercel.app](https://nexa-ai.vercel.app)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Seeding Data](#seeding-data)
  - [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Development Guide](#development-guide)
  - [Adding a New Module](#adding-a-new-module)
  - [Code Style & Conventions](#code-style--conventions)
- [Deployment](#deployment)
- [Project Status](#project-status)
- [License](#license)

---

## Tech Stack

### Frontend (`client/`)

| Package | Version |
|---|---|
| **Next.js** | 16.2.10 (App Router) |
| **React** | 19.2.4 |
| **TypeScript** | ^5.x |
| **Tailwind CSS** | ^4.x |
| **shadcn/ui** | Radix primitives + CVA |
| **TanStack Query (React Query)** | ^5.101.2 |
| **Recharts** | ^3.9.2 |
| **Axios** | ^1.18.1 |
| **Better Auth (client)** | ^1.6.23 |
| **React Hook Form** | ^7.81.0 |
| **Zod** | ^4.4.3 |
| **react-icons** | ^5.7.0 |
| **ESLint** | ^9.x (flat config) |

### Backend (`server/`)

| Package | Version |
|---|---|
| **Express** | ^5.2.1 |
| **TypeScript** | ~5.9.3 |
| **Mongoose** | ^9.7.4 |
| **MongoDB (Atlas)** | ^7.5.0 |
| **Better Auth** | ^1.6.23 |
| **Google Generative AI (Gemini)** | ^0.24.1 |
| **dotenv** | ^17.4.2 |
| **cors** | ^2.8.6 |
| **cookie-parser** | ^1.4.7 |
| **tsx** (dev runner) | ^4.23.1 |

---

## Architecture

The project is a **two-package monorepo** — each package has its own `package.json`, `node_modules`, and lockfile. They are **not** linked via a workspace manager.

```
nexa-ai/
├── client/          # Next.js 16 frontend (port 3000)
├── server/          # Express 5 backend (port 5000)
├── AGENTS.md        # AI assistant instructions for this codebase
├── plan.md          # Master plan with phase tracking
└── README.md
```

### Server Architecture (Modular Pattern)

Each feature module lives in `server/src/modules/<name>/` and follows a consistent structure:

- `<name>.routes.ts` — Express Router (route definitions)
- `<name>.controller.ts` — Request handlers
- `<name>.service.ts` — Business logic
- `<name>.model.ts` — Mongoose schema
- `prompts/` — AI prompt templates (content-generator only)

Shared core code lives in `server/src/core/`:

- `auth/` — Better Auth configuration (email/password + Google OAuth)
- `users/` — User profile model
- `middleware/` — `authGuard`, `errorHandler`, `validation` (XSS sanitization, rate limiting)
- `config/` — Environment variable loading, MongoDB connection

The AI layer lives in `server/src/ai/`:

- `providers/provider.interface.ts` — Abstract `AIProvider` interface (swappable backends)
- `providers/gemini.provider.ts` — Gemini 3.5 Flash integration with retry logic
- `agent-engine.ts` — 4-step agentic pipeline (Analyse → Build Prompt → Call AI → Structure Output)

### Client Architecture

- **Next.js 16 App Router** with route groups: `(marketing)/`, `(auth)/`, `dashboard/`, `items/`
- **Path alias** `@/*` maps to the project root
- **Auth state** managed via Better Auth client + TanStack Query cache invalidation
- **API calls** centralized in `lib/api.ts` with typed interfaces and Axios
- **shadcn components** in `components/ui/`, layout in `components/layout/`
- **Design system** — custom "agentic" CSS tokens: `--signal` (teal), `--ember` (amber), `--pulse` (violet)

---

## Features

### ✅ Authentication (Completed)

- Email/password registration and login via Better Auth
- Google OAuth social login
- Session/cookie-based auth with `authGuard` middleware
- Demo login with pre-seeded credentials (`demo@nexa-ai.example.com` / `Demo@12345`)
- Auth UI with Zod + react-hook-form validation
- Protected routes redirect to `/login`

### ✅ Landing Page (Completed)

- Hero section with CTA
- How It Works, Modules Showcase, Capabilities sections
- Stats counter, Testimonials carousel
- FAQ accordion, Newsletter CTA
- Fully responsive, custom "agentic" design system

### ✅ Marketing Pages (Completed)

- About, Blog, Contact, Help, Privacy, Terms — all with real content

### ✅ Items Marketplace (CRUD Module)

- **Explore Page** (`/items`) — search, filter by category/priority, sort, paginate
- **Detail Page** (`/items/[id]`) — full info with related items
- **Add Item** (`/items/add`, protected) — form with Zod validation
- **Manage Items** (`/items/manage`, protected) — view/edit/delete own items
- Categories: Prompt, Tutorial, Tool, Template, Resource
- MongoDB text search index on title, shortDescription, tags

### ✅ AI Content Generator (Flagship Feature)

- 4-step agentic pipeline visible in the UI: Analysing Request → Building Prompt → Calling AI Model → Structuring Output
- 4 content types: Blog Post, Product Description, Documentation, Social Post
- 5 tones: Professional, Casual, Creative, Technical, Persuasive
- 3 lengths: Short (~300 words), Medium (~600 words), Long (~1000 words)
- Temperature mapping per tone (0.3 for Technical, 0.9 for Creative)
- Regenerate button with temperature jitter (±0.1) for meaningful variation
- Generation history with pagination
- Copy/Download output
- Rate limiting (10 generations/minute/user, in-memory)
- XSS sanitization on all body inputs
- Retry logic (3 attempts with exponential backoff)

### ✅ Dashboard & Analytics

- Sidebar with module switcher (Content Generator live, others show "Coming Soon" badges)
- Analytics: stat cards, generation trend area chart, content type breakdown bar chart
- Quick action links

### ✅ Vercel Deployment

- Frontend deployed to Vercel
- Backend wrapped as Vercel serverless function

---

## Project Structure

```
nexa-ai/
├── client/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── (marketing)/              # Landing page, About, Blog, Contact, etc.
│   │   ├── (auth)/                   # Login, Register
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Sidebar shell
│   │   │   ├── page.tsx              # Analytics
│   │   │   └── content-generator/    # Generator + History
│   │   ├── items/                    # Explore, Detail, Add, Manage
│   │   └── ...
│   ├── components/
│   │   ├── ui/                       # Button, etc. (shadcn-style)
│   │   ├── layout/                   # Navbar, Footer, DashboardSidebar
│   │   ├── marketing/                # Landing page sections
│   │   ├── auth/                     # LoginForm, RegisterForm, GoogleButton
│   │   └── shared/                   # ItemCard, SkeletonCard, ConfirmDialog
│   ├── hooks/                        # useItems, useContentGenerator
│   ├── lib/                          # api.ts, auth-client.ts, utils.ts
│   ├── .env.example
│   ├── next.config.ts
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   ├── server.ts                 # Bootstrap entry
│   │   ├── app.ts                    # Express app setup
│   │   ├── core/
│   │   │   ├── config/               # env.ts, db.ts
│   │   │   ├── auth/auth.ts          # Better Auth config
│   │   │   ├── users/user.model.ts
│   │   │   └── middleware/           # authGuard, errorHandler, validation
│   │   ├── modules/
│   │   │   ├── items/                # CRUD marketplace module
│   │   │   └── content-generator/    # AI generation module
│   │   ├── ai/
│   │   │   ├── providers/            # Provider interface + Gemini
│   │   │   └── agent-engine.ts       # 4-step pipeline
│   │   └── scripts/                  # seed-demo-user, seed-items
│   ├── api/index.js                  # Vercel serverless entry
│   ├── .env.example
│   └── vercel.json
│
├── AGENTS.md
├── plan.md
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** (latest LTS — v20 or v22 recommended)
- **MongoDB Atlas** account (free tier — [sign up](https://www.mongodb.com/atlas))
- **Gemini API key** — free from [aistudio.google.com](https://aistudio.google.com/)
- **Google OAuth credentials** (optional — for social login)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd nexa-ai

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

### Environment Variables

#### Server (`server/.env`)

Create `server/.env` from the example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
PORT=5000
NODE_ENV=development
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GEMINI_API_KEY=<your-gemini-api-key>
CLIENT_URL=http://localhost:3000
DATABASE_NAME=nexa-ai
```

#### Client (`client/.env.local`)

Create `client/.env.local` from the example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Nexa AI
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **⚠️ Never commit `.env` or `.env.local` files.**

### Seeding Data (Optional but Recommended)

```bash
cd server

# Create demo user account
npm run seed:demo
# Credentials: demo@nexa-ai.example.com / Demo@12345

# Create sample items under the demo user
npm run seed:items
```

### Running the Project

```bash
# Terminal 1 — Server (port 5000)
cd server
npm run dev

# Terminal 2 — Client (port 3000)
cd client
npm run dev
```

Visit **http://localhost:3000** to see the app.

---

## Available Scripts

| Command | Location | Description |
|---|---|---|
| `npm run dev` | Both | Start development server with hot reload |
| `npm run build` | Both | Production build |
| `npm run start` | Both | Start production server |
| `npm run lint` | `client/` | ESLint (flat config + eslint-config-next) |
| `npx tsc --noEmit` | `server/` | TypeScript type-checking |
| `npm run seed:demo` | `server/` | Seed demo user account |
| `npm run seed:items` | `server/` | Seed sample items |

> The client does not have a separate typecheck script — `next build` performs type checking during the build.

---

## API Overview

### Authentication (`/api/auth/*`)

Handled entirely by Better Auth. Endpoints are mounted **before** `express.json()` middleware.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/sign-up` | Register with email/password |
| POST | `/api/auth/sign-in` | Login with email/password |
| GET | `/api/auth/session` | Get current session |
| POST | `/api/auth/sign-out` | Logout |
| GET | `/api/auth/oauth2/callback/google` | Google OAuth callback |

### Items (`/api/items`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/items` | — | List items (search, filter, sort, paginate) |
| GET | `/api/items/:id` | — | Get item by ID |
| GET | `/api/items/mine` | Required | Get current user's items |
| POST | `/api/items` | Required | Create a new item |
| PUT | `/api/items/:id` | Required | Update own item |
| DELETE | `/api/items/:id` | Required | Delete own item |

### Content Generator (`/api/content-generator`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/content-generator/generate` | Required | Generate content (topic, type, tone, length) |
| POST | `/api/content-generator/regenerate/:id` | Required | Regenerate existing content with temperature jitter |
| GET | `/api/content-generator/history` | Required | List generation history (paginated) |
| GET | `/api/content-generator/history/:id` | Required | Get specific generation |

---

## Development Guide

### Adding a New Module

The architecture is designed so that new modules (e.g., AI Career Coach) require no changes to core infrastructure. Follow this checklist:

1. **Server**: Create `server/src/modules/<name>/` with routes, controller, service, model, and (if AI-powered) prompt templates
2. **AI**: Implement a new provider in `server/src/ai/providers/` if needed, or reuse the existing provider interface
3. **Client**: Create `client/app/dashboard/<name>/` with page components
4. **Register**: Add the route in `server/src/app.ts` and add a sidebar entry in the dashboard layout
5. **Gate**: Use the `subscribedModules` field on `UserProfile` if module access control is needed

### Code Style & Conventions

- **Server**: Module pattern (`routes.ts`, `controller.ts`, `service.ts`, `model.ts`)
- **Client**: App Router with route groups, TanStack Query hooks, shadcn components
- **TypeScript**: Strict mode, ES2022 target on server
- **CSS**: Tailwind v4 with custom CSS properties for the "agentic" design system
- **Import alias**: `@/*` on client maps to the project root

### Critical Implementation Notes

- **Express 5 wildcard routes** use `{*any}` syntax (not `*`). See `server/src/app.ts:25`.
- **Better Auth** must be mounted **before** `express.json()` — do not reorder middleware in `server/src/app.ts`.
- **Next.js 16** has breaking changes from earlier versions. Check `node_modules/next/dist/docs/` before writing new Next.js code.
- **MongoDB + Better Auth** share the same `MongoClient` — no separate connection for auth.

---

## Deployment

Both packages are configured for **Vercel** deployment.

### Frontend

1. Import the repository into Vercel
2. Set root directory to `client`
3. Configure environment variables in the Vercel dashboard
4. Deploy

### Backend

The Express app is wrapped as a Vercel serverless function via `server/api/index.js`:

1. Import the repository into Vercel (same or separate project)
2. Set root directory to `server`
3. Build command: `npx tsc --noEmit && node build-api.js`
4. Configure environment variables
5. Update CORS and Better Auth callback URLs to production domains

> For heavy AI workloads, consider deploying the backend on **Render** or **Railway** instead of Vercel's serverless infrastructure.

---

## Phase Status

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Environment setup, repo init, tooling | ✅ |
| Phase 1 | Backend core: DB, Auth, User model | ✅ |
| Phase 2 | Frontend shell: Landing page + Navbar/Footer | ✅ |
| Phase 3 | Auth UI: Login/Register + Social + Demo login | ✅ |
| Phase 4 | Items module: Listing, Details, Add, Manage | ✅ |
| Phase 5 | AI Content Generator module | ✅ |
| Phase 6 | Dashboard shell + polish + responsiveness | ✅ |
| Phase 7 | Testing, error handling, env cleanup | ⬜ |
| Phase 8 | Vercel deployment | ✅ |
| Phase 9 | Post-deploy QA + docs + module scaffolding | ⬜ |

---

## License

This project is for demonstration and educational purposes.


## 👨‍💻 Author
**Md Anawar Hossain**
- **GitHub:** [@anawarhossain](https://github.com/anawarhossain)
- **Facebook:** [Anawar Hossain](https://web.facebook.com/AnawarHossain55)
- **LinkeIn:** [Anawar Hossain](https://www.linkedin.com/in/anawarhossain/)
- **X(Twitter):** [Anawar Hossain](https://x.com/MDANAWAR22)
- **WhatsApp:** [Anawar Hossain](https://wa.me/+8801701020694)
- **Role:** Junior Developer


## Live Link

- [Live Link](https://anawarhossain-nexa-ai.vercel.app/)

## Project Screenshot

<p align="center">
  <img src="public/preview.png" alt="Project Preview" width=" ">
</p>
