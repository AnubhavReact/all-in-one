# All In One

Document, career and tax tools in one place: PDF tools, a job search, a resume
builder, an ATS check, an AI chat and an income tax calculator.

## What works today

The five PDF tools. They run entirely in the browser — no file is uploaded, so
they work offline and there is nothing stored to delete afterwards.

| Tool | Does |
| --- | --- |
| `/pdf/merge` | Join PDFs into one, in any order |
| `/pdf/split` | Take out a page range, or one file per page |
| `/pdf/organise` | Rotate pages and drop the ones you don't want |
| `/pdf/to-images` | Every page as a PNG, in one zip |
| `/pdf/from-images` | Photos and scans into one PDF |

Everything else has a page that says plainly what it will do and what the
honest catch is. Nothing pretends to work.

## Getting started

```sh
npm install
npm run dev:web      # website on http://localhost:3000
npm test             # the PDF logic, tested against real PDFs
```

The database is only needed for the parts that are not built yet, so you can
run and work on the PDF tools without setting up Supabase at all.

## The design

The interface follows a design handoff: *dusk*, a dim slate rather than black,
with one warm marigold accent marking the next step on each view. Light is the
alternative theme and the toggle remembers the choice.

`apps/web/src/styles/` holds it:

- `tokens.css` — every colour, space, radius and font stack, for both themes.
  Copied from the handoff and not edited.
- `components.css` — every `aio-` component class. Also copied as it came.
- `app.css` — what the handoff left to us: the page compositions and the
  breakpoints (1024 the sidebar becomes a drawer, 768 grids go to two columns,
  480 to one). Page-level classes are prefixed `aio-p-` so they cannot collide.

Rules worth keeping: never hard-code a hex value, use `var(--token)`; one
marigold primary button per view; category colours tint icon tiles only; and a
tool that is not built shows *Coming soon* and is not a link.

There is no Tailwind. The handoff ships complete CSS, and its reset fought the
component classes.

### Looking at it

A passing build says nothing about whether a menu's rows overlap. With the dev
server running:

```sh
npm run shots --workspace=@aio/web
```

It drives the Chrome already on the machine, saves every page at 390, 768 and
1440 into `apps/web/.shots/`, and fails if a page scrolls sideways or logs a
console error.

## How this is laid out

```
apps/
  web/        Next.js — the website AND the backend
  mobile/     Expo — the Android and iOS app
packages/
  core/       plain TypeScript shared by web and mobile
  db/         the database schema
```

### Why the folders are split this way

**`apps/web` is both the website and the backend.** There is no separate server
to run or deploy. Anything under `apps/web/src/app/api/` is a backend endpoint,
and the mobile app calls those same URLs. If traffic ever outgrows this, that
code can move to its own service without the rest changing.

**`packages/core` is the code written once and used twice.** The tax
calculation, the ATS scoring and the list of tools all live here, so the
website and the mobile app can never disagree about them. It must stay plain
TypeScript with no DOM and no React Native, because both sides have to be able
to import it.

Screens are *not* shared. React Native has no `<div>`, so `apps/web` and
`apps/mobile` each build their own interface on top of the same `core`.

**`packages/db` holds the schema.** One file, `prisma/schema.prisma`, describes
every table. Prisma reads it and generates typed code, so a mistyped column
name is a build error rather than a 2am bug.

## The database

PostgreSQL, hosted on [Supabase](https://supabase.com) — their free tier is
enough to start, and it includes login and file storage, which would otherwise
be weeks of work.

Set it up once:

1. Create a project at supabase.com.
2. Copy `.env.example` to `.env` and fill in the four values from
   **Project Settings → Database** and **→ API**.
3. `npm run db:push` — creates every table from the schema.

Two connection strings, because they do different jobs:

- `DATABASE_URL` is pooled. The app uses this at runtime, because a web app
  opens and closes connections constantly.
- `DIRECT_URL` is a plain connection. Only the Prisma CLI uses it, because
  changing the schema does not work through a pooler.

### Changing the schema

Edit `packages/db/prisma/schema.prisma`, then:

```sh
npm run db:push      # while developing: push the change straight up
npm run db:studio    # browse and edit rows in the browser
```

## The admin panel

For now, Supabase's own **Table Editor** is the admin panel. It is a real
interface over every table, free, and already built — you can read and edit any
row in the browser without writing a line of code.

A custom `apps/admin` comes later, when there is something to do that a table
editor cannot: approving job listings, suspending an account, watching usage.
`Profile.role` is already in the schema (`USER` or `ADMIN`) so that app has
something to check when it arrives.

## What is deliberately not here

- **Scraping LinkedIn or Naukri.** Both forbid it. Jobs will come from feeds
  that allow it, such as Adzuna and RemoteOK.
- **Embedding ChatGPT or Gemini in a frame.** They block it and it breaks their
  terms. The AI chat will use their APIs with the user's own key instead.
- **Filing a tax return for someone.** That needs an ERI licence from the
  Income Tax Department. This calculates and explains; filing happens on the
  government portal.
