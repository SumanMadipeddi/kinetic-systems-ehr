# Practice Fusion EHR (Frontend Assessment)

Practice Fusion EHR frontend clone created for a technical assessment.

## Scope

**Deep implementation**

- Home / Practice dashboard
- Schedule (Appointments, Day, Week, Settings)
- Add Appointment → **With patient** create flow with validation + persistence

**Shallow navigation**

- Tasks, Charts, Messages, Reports, global Settings

## Architecture

- **Next.js App Router** for routing/layouts; interactive EHR UI is client-side
- **Feature modules** under `src/features/{home,schedule}`
- **Zustand + persist middleware → localStorage** for schedule domain state (`ScheduleEntry[]`)
- **React Hook Form + Zod** for the With patient appointment form
- **Custom CSS Grid calendar** (no FullCalendar)
- **Pathname-based `RightPromoRail`** variants (static mock ads only)

Domain model uses `ScheduleEntry` with `kind: "patient" | "block-time" | "block-range"`. Multi-day ranges are rendered via day **segments** derived from `startDate/startTime` + `endDate/endTime`, not a single giant `durationMinutes`.

## Key user journey

1. Open `/schedule` (Day view)
2. Click **Add appointment**
3. Search/select a patient, choose type/provider/date/time/duration
4. Save → entry appears on the calendar immediately
5. Refresh → entry remains (Zustand persist)

## Intentional tradeoffs

- No backend, auth, database, or real EHR integrations
- No advertising infrastructure (static promo content only)
- Block time / Block range tabs are visual; save is implemented for **With patient**
- Focused vertical slice to maximize UI fidelity and interaction quality

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/home`).

## Testing

```bash
npx playwright install
npx playwright test
```

Primary E2E covers create appointment → visible on schedule → survives reload.
