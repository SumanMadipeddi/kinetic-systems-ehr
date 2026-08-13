# Practice Fusion EHR Clone

Frontend clone of Practice Fusion’s clinician EHR shell, focused on a realistic Home dashboard and Schedule workflow. State is client-side only (Zustand + localStorage) with deterministic mock data—no backend or auth.

## Live Demo

`https://kineticsystems.atimuss.com`

## What I Built

**Core / deep**

- Home / practice dashboard (setup progress, completable cards)
- Practice information editing (RHF + Zod, persisted)
- Users invite flow + user profile editing (persisted)
- Schedule Day / Week / Appointments views
- Add Appointment → With patient (search, validation, save, persist)
- Add Appointment → Block time (validation, save, persist)
- Schedule filter rail (facility/provider/type/status → calendar)
- Custom CSS Grid calendar with day-segment rendering

**Supporting / shallow**

- Tasks, Charts, Messages, Reports, global Settings navigation surfaces
- Knowledge Center / promo rail (static UI)

## Core User Journey

1. Open `/schedule` (Day view — opens on **today’s local date**; seed appointments are anchored to that day)
2. **Add appointment** → search/select patient → set type, provider, facility, date, time, duration
3. Invalid Save (e.g. missing patient) keeps the dialog open and shows field errors
4. Valid Save → entry appears on the calendar immediately
5. Reload → appointment remains (Zustand persist)
6. Optional: **Block time** tab → save a blocked interval; it renders and persists the same way
7. Filter rail: uncheck an appointment type (e.g. Follow-Up) → matching entries hide; recheck → they return

## Architecture

```
Next.js App Router
  └─ (ehr) layout: Sidebar + TopNav + main + RightPromoRail
       └─ features/{home,schedule,messages,tasks}/…  UI modules
       └─ store/*  Zustand domain state + persist → localStorage
       └─ mocks/*  deterministic facilities/providers/patients/entries
       └─ forms: React Hook Form + Zod (zodResolver)
       └─ schedule calendar: custom CSS Grid + day segments
```

## Project Structure

```
src/
  app/                 route composition (App Router)
  components/
    layout/            shared shell (sidebar, top nav, promo, toast)
    ui/                reusable UI primitives
  features/
    home/              dashboard, practice info, users
    schedule/          calendar views, appointment modal, filters
    messages/ tasks/   shallow supporting surfaces
  store/               persisted client/domain state
  mocks/               deterministic fake EHR data
  types/               domain types (ScheduleEntry, …)
```

## Engineering Decisions

### Why Next.js
App Router layout composition and straightforward Vercel deployment for a frontend-only screen.

### Why Zustand
Lightweight client state with persist middleware—enough for realistic EHR interactions without inventing a backend.

### Why custom CSS Grid calendar
Precise Day/Week layout control without fighting a general calendar library.

### Why deterministic mock data
Repeatable demos and Playwright/Vitest runs without auth, PHI, or network flakiness.

### Why ScheduleEntry
One domain object represents patient visits and blocked time (`kind`), with multi-day ranges expressed as start/end and rendered as per-day segments.

## Validation and Persistence

```
React Hook Form + zodResolver(Zod schema)
  → validated values
  → Zustand action (addPatientAppointment / addBlockTime / savePractice / …)
  → persist middleware
  → localStorage
```

## Testing

```bash
npm test              # Vitest unit tests
npm run test:e2e      # Playwright (headless)
npx playwright test --headed
npm run typecheck
npm run lint
npm run build
npm run check         # typecheck + lint + unit + build
```

**Vitest (calendar math)**

1. Appointment positioning (`segmentToPosition`)
2. Multi-day segmentation (`getVisibleSegmentsForDay`)
3. Clipping to business hours (`clipSegmentToHourWindow`)

**Playwright**

- Create patient appointment → visible → survives reload
- Save without patient → dialog stays open + validation message
- Follow-Up type filter hides/restores a seeded entry
- Practice Info edit → Home card updates → survives reload
- Block time create → visible → survives reload
- Provider All off → empty state; Just me restores provider
- Lock → unlock with demo password → Log out → login → Home

## Intentional Tradeoffs

- No authentication
- No backend / database
- No external EHR integrations (labs, eRx, imaging, eligibility networks)
- No real advertising infrastructure (static promo content)
- Block **range** UI is present; save is implemented for With patient + Block time
- Schedule opens on the device’s local **today**; seed appointments are anchored to that date
- Focus on frontend fidelity and realistic core journeys over breadth

## Demo session shell

Lock / Unlock and Login / Logout are **client-only** interactions (sessionStorage). They intentionally do not represent production authentication.

After Log out, sign back in with:

- Email: `suman@example.com`
- Password: `password@128`

Fresh visits open the EHR without requiring login.

## Data / Privacy

All patient and practice data is deterministic fictional mock data. No real PHI is used.

## Deploy (Vercel)

1. Import the GitHub repo into Vercel (Next.js preset)
2. Build command: `npm run build`
3. Output: Next.js default (no env vars required)
4. Update the Live Demo URL above after deploy

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/home`).
