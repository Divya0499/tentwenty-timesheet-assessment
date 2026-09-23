# Timesheet Management App

A simplified SaaS-style timesheet management dashboard, built for the TenTwenty
front-end developer technical assessment.

## Setup instructions

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local   # then fill in NEXTAUTH_SECRET (see below)
npm run dev
```

The app runs at `http://localhost:3000`. There's no external API or database
to configure — everything runs against an in-memory mock data layer (see
"Assumptions" below).

Generate a secret for `.env.local`:

```bash
openssl rand -base64 32
# or, without openssl:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Demo login

Authentication is a dummy Credentials provider (no real user database):

```
Email:    employee@tentwenty.com
Password: password123
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |

## Frameworks & libraries

- **Next.js 16** (App Router) + **TypeScript**
- **NextAuth v4** (Credentials provider) for auth, session stored as a JWT
- **Tailwind CSS v4** for styling
- **react-hook-form** + **zod** for the Add/Edit form and validation
- **date-fns** for date/week arithmetic
- **lucide-react** for icons

## Project structure

```
src/
  app/
    login/                  Login screen
    dashboard/
      page.tsx              Weeks table (Week #, Date, Status, Actions)
      [weekStart]/          Single week: its logged entries + Add/Edit modal
    api/
      auth/[...nextauth]/   NextAuth route handler
      timesheets/           Internal API routes the client calls (see below)
  components/
    ui/                     Generic, reusable pieces (Button, Modal, StatusBadge, FormField)
    layout/                 Navbar
    auth/                   LoginForm
    timesheet/               WeeksTable, EntriesTable, TimesheetModal
  lib/
    auth.ts                 NextAuth config + dummy credentials check
    db/timesheets.ts        In-memory "database" + CRUD functions
    weeks.ts                Groups entries into week summaries, formats date ranges
    validations/            zod schemas (shared by the form and the API routes)
    api/timesheets.ts       Client-side fetch wrapper for the internal API routes
  types/                    Shared TypeScript types
  proxy.ts                  Route protection (Next 16's renamed "middleware")
```

### API routes

All client-side data fetching goes through these internal routes (no direct
calls to a data layer from components):

- `GET /api/timesheets` — list of week summaries for the dashboard table
- `GET /api/timesheets/:weekStart` — entries logged in one week
- `POST /api/timesheets/:weekStart/entries` — create an entry
- `PUT /api/timesheets/:weekStart/entries/:entryId` — update an entry
- `DELETE /api/timesheets/:weekStart/entries/:entryId` — delete an entry

Every route re-checks the session server-side (`getServerSession`), in
addition to `proxy.ts` protecting the `/dashboard` pages themselves.

## Assumptions & notes

- **No real backend was supplied**, so `src/lib/db/timesheets.ts` is an
  in-memory store standing in for one, seeded with a few weeks of sample
  data. It resets whenever the dev server restarts. Every mutation goes
  through a small set of functions in that one file, so swapping it for a
  real database or API later shouldn't require touching route handlers or
  UI components.
- **Data model**: a "timesheet entry" is one day's logged work (date,
  project, task, description, hours, status). The dashboard's Week #/Date/
  Status/Actions table is *derived* from entries by grouping them into
  ISO (Monday-start) weeks — weeks aren't stored separately, so there's
  only one source of truth. A week's status is `Completed` once all 5
  weekdays have at least one entry, `Incomplete` if some are logged, and
  `Missing` if none are.
- **Projects** are a fixed list (`src/lib/projects.ts`) rather than a
  separate CRUD resource, since the brief didn't specify one.
- **Dummy auth**: a single hardcoded demo account, per the brief's "dummy
  authentication" instruction. Session is a JWT via NextAuth, not
  persisted server-side.
- **Design**: built from the brief's written requirements and table spec
  (Week #, Date, Status, Actions) rather than a pixel-matched Figma
  implementation.
- **Testing**: Vitest + React Testing Library are installed and configured
  as the intended test stack, but no test suite was written given the
  submission window — noted here rather than left unexplained, per the
  brief's "Testing (Optional)" scoring.

## Time spent

_(fill in before submitting)_
