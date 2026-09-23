# Timesheet Management App

Timesheet management app built for the TenTwenty frontend assessment.

## Setup instructions

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000

You need a `NEXTAUTH_SECRET` in `.env.local` for login to work. You can generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Login with:

```
Email: employee@tentwenty.com
Password: password123
```

## Frameworks/libraries used

- Next.js (App Router) + TypeScript
- next-auth for login
- Tailwind CSS
- react-hook-form + zod for the add/edit form and validation
- date-fns for date stuff
- lucide-react for icons

## Any assumptions or notes

- There's no real backend/database for this, so I used an in-memory mock data store (`src/lib/db/timesheets.ts`) instead. All the data resets if the server restarts. Every API route goes through this file instead of components calling it directly, like the brief asked for.
- A timesheet entry is one task on a specific day - project, type of work, description, hours. The dashboard table (Week #, Date, Status, Actions) is calculated from these entries grouped by week, not stored separately. A week counts as Completed once all 5 weekdays have an entry, Incomplete if only some do, Missing if none do.
- Projects and "type of work" are just fixed dropdown lists since there was no API for these.
- Assumed 40 hrs/week as the target for the progress bar on the week page, wasn't specified anywhere.
- The Date Range filter on the dashboard is a simple preset (last 4/8/12 weeks) instead of a full calendar picker to keep it simple.
- Login is dummy auth with one hardcoded account like the brief says. "Remember me" checkbox is just there visually, doesn't actually do anything yet.
- Tried to match the Figma screens as closely as I could.
- Didn't get to writing tests given the time - testing was marked optional in the brief.

