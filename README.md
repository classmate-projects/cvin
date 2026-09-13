# CViN

**AI-powered candidate intake and talent intelligence platform.**

CViN turns a messy inbox and folder of CVs into a searchable, ranked talent
pool. Recruiters drop in a resume (or let it arrive by email), Google
Gemini reads and structures it, a human confirms the extracted profile,
and from there it's instantly searchable, filterable, and rankable across
the whole team.

> This repository is the **frontend + production backend**: a Next.js app
> whose API routes talk directly to Supabase (Postgres + file storage). It
> is an independent Git repository from [`cvin-api`](../cvin-api), which
> is a separate ASP.NET Core service used only for local development
> against a local Postgres database — production never touches it.

---

## What it does

| Stage | Feature |
|---|---|
| **Intake** | Manual upload (PDF/DOCX) or automatic email inbox sync via IMAP |
| **Understanding** | Gemini extracts candidate name, contact info, job title, experience, visa status, education, and specialization straight out of the document |
| **Verification** | A human reviews and edits the AI-extracted profile before it goes live |
| **Discovery** | Full-text search plus filters (job title, visa status, experience range, location, education, specialization) with sorting and pagination |
| **Ranking** | Talent Pool view auto-groups candidates by job title, ranked by experience |
| **Insight** | Dashboard with KPIs, a 7-day intake trend, review pipeline breakdown, top categories, and file-format mix |
| **Access control** | Admin / Recruiter / Viewer roles, enforced per-endpoint |
| **Team management** | Admins invite and revoke teammate access |

## Features by area

- **Dashboard** — live KPIs (total resumes, recent activity, department
  spread), a weekly intake trend chart, review-pipeline status, top job
  categories, and file-format breakdown.
- **Upload & AI Review** — drag-in a PDF/DOCX, Gemini pre-fills the
  candidate profile (with automatic fallback across several Gemini
  models), and the recruiter confirms/edits before it's saved.
- **Email Inbox (IMAP sync)** — pulls unseen messages with PDF/DOCX
  attachments from a configured mailbox, runs each one through the same
  AI extraction pipeline, and queues them as *Pending* for review —
  capped at 20 pending items at a time so the queue stays manageable.
- **Talent Discovery (Find Resume)** — searchable, filterable, paginated
  table of every approved candidate, with resume preview and (role-gated)
  delete.
- **Talent Pool** — candidates grouped by job title/designation, top 10
  per group, ranked by experience.
- **Team & Access (Invite Team)** — Admin-only screen to provision new
  teammates with a role and revoke access later.
- **Authentication** — cookie-based sessions, login, change password, and
  forgot-password flow.
- **Configurable taxonomy** — job titles, visa statuses, education levels,
  and specializations driving the dropdowns/suggestions across the app are
  data-driven (`app_config`), not hardcoded.
- **Light/dark theme**, responsive layout throughout.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19
- **Styling:** Tailwind CSS 4
- **Backend/data:** Supabase (Postgres + Storage), accessed via the Next.js
  Route Handlers under `src/app/api/**`
- **AI:** Google Gemini (`@google/generative-ai`) for resume parsing
- **Email:** `imap-simple` + `mailparser` for inbox sync
- **Document parsing:** `mammoth` (DOCX), `pdf-parse` (PDF)
- **UI:** `react-icons`, `react-toastify`, `next-themes`

## Project structure

```
src/
  app/
    page.jsx                 Dashboard
    login/, forgot-password/ Auth screens
    upload/                  Manual CV upload + AI review
    email-inbox/             IMAP sync + pending CV review
    find-resume/             Search, filter, and manage candidates
    talent-pool/             Top candidates grouped by job title
    invite-team/             Admin-only team management
    profile/                 Account settings
    api/                     Route Handlers (Supabase-backed, the production API)
  components/                Shared UI (navbar, sidebar, review modal, etc.)
  lib/                       Supabase client, Gemini analyzer, small helpers
  middleware.js              Auth-gated route protection
```

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase/Gemini/email credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). See `.env.local.example`
for every environment variable this app reads and which ones are required.

### Local development against Postgres instead of Supabase

For local development only, `next.config.mjs` can transparently proxy the
core CRUD routes (auth, users, resumes, upload, talent-pool, stats, config)
to a companion [`cvin-api`](../cvin-api) ASP.NET Core service backed by a
local Postgres database, so you can develop without live Supabase
credentials for those routes. Run `cvin-api` alongside `next dev` (see its
README) — this only applies when `NODE_ENV=development`; production always
talks to Supabase directly. Email sync, AI analysis, and the AI status
check have no local equivalent and always use Supabase/Gemini, in every
environment.

## Roles

| Role | Can view talent pool / search | Upload / sync | Delete | Manage team |
|---|---|---|---|---|
| Viewer | Yes | No | No | No |
| Recruiter | Yes | Yes | Yes | No |
| Admin | Yes | Yes | Yes | Yes |

## Deployment

Deploy the same way as any Next.js app (e.g. [Vercel](https://vercel.com/new)).
Set the Supabase and Gemini environment variables in your hosting provider
— production only ever uses Supabase, regardless of what's configured for
local development.
