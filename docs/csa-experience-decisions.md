# CSA Sierra handoff — experience decisions

Source: Alice showcase review (Aug 2026). Prototype repo: `csa-handoff-prototype` Storybook on port **6008**.

## Product direction

| Decision | Rationale |
|----------|-----------|
| **Handoff lives in CSA, not Finesse** | Advocates work in CSA for the whole call; context must not disappear when they navigate. |
| **Persistent surface, not a modal** | Modal dismisses and context is lost. Need a docked panel or sticky band that survives navigation. |
| **Compare left rail, right rail, and sticky top band** | Alice asked for all three layout options before picking one for production. |
| **Dedicated Storybook for this work** | Separate from `@everkit/design-system` — layout experiments only; DS supplies components/tokens. |

## Authentication (Sierra → CSA)

| Decision | Detail |
|----------|--------|
| **Binary UI states only** | **Authenticated** or **Not authenticated**. Never label “partial authentication”, “partly verified”, or other in-between auth states in UI copy. |
| **Sierra match API inputs** | First name, last name, DOB, and phone are required to run the match call during the Sierra auth flow. |
| **IVR prepopulation** | Whatever Sierra captured prepopulates the verify fields — missing values stay blank for the advocate to complete. |
| **Internal scenario keys** | Payload `authState`: `authenticated`, `failed`, `not_identified`, `not_attempted` (consent declined). Demo presets **1–10** in this prototype. |
| **Factor marks on patient card** | Icons show which fields IVR captured vs verified — not a third auth-state label. |

## Handoff rail content (all layouts)

| Block | Decision |
|-------|----------|
| **Incoming call routing** | **Authenticated** → patient profile + handoff panel. **Not authenticated** → **Patient Search with auto-run results** + **same handoff panel**. Prefill First/Last/Phone/DOB from Sierra; phone is always present. |
| **Not-auth workspace** | Auto-navigate to Patient Search. Form prefilled; **Patients** table shows matches for that query (one row, multiple, or **Member not found**). **Scenario 2** last name is **Carrigo** (no directory match) — advocate edits to **Carrillo** and clicks **Search**. **View** on a patient row marks the call **Authenticated**, opens the profile, and updates Call Summary to that record. **Eligible Members** stays empty until identity is confirmed. Status alert lives in the handoff panel (not duplicated on the page when the rail is open). **No** Patient / Provider / Appointment / Transaction ID tabs on this page (those stay on Home). Form actions: **Search**, then **Reset** to its right. |
| **Multiple matches** | Same Patient Search destination — results table lists every person on that phone. Advocate uses **View** to select. |
| **Auth status alert** | **`HandoffAuthAlert`** — title only (**Authenticated** / **Not authenticated**). **`HandoffConsentAlert`** stacked under it. |
| **IVR script** | Read-only quotation card under consent: first-person Sierra capture (e.g. “I want to schedule a visit for my cold”) with disposition badges (Booking, Billing, …). |
| **Patient summary** | Name, DOB, phone; **mark auth factors** used to verify (icon treatment per factor). Member ID as plain text when present. |
| **Call meta footer** | Three lines, pinned above Clear: **Call ID:** `CAL-88502` · **via Cigna / MD Live** · **TFN 800-400-6354**. |
| **Panel title** | **Call summary** (not “Call handoff”). |
| **Clear** | Neutral-secondary **Call ended** button fixed at the bottom of the panel. Returns the panel to the empty Call ID lookup state. |
| **Empty / lookup state** | Title + **Call ID** `SearchField` (`button="icon"`). Format in FieldNote (`CAL-#####`), no in-field placeholder. |
| **Side rail visibility** | **`shouldShowHandoffSidebar()`** — member and pharmacy-patient handoffs, **authenticated or not**. Exempt provider/pharmacy TFNs never mount the rail. |
| **Side rail collapse** | DS **`Sidebar`** (`collapsible="icon"`) + **`SidebarProvider`** + header chevron toggle + **`SidebarRail`**. Contained in a relative frame per Sidenav stories — not a custom `<aside>`. |
| **Side rail CTA** | Neutral-secondary **Call ended** pinned in `SidebarFooter`. No primary action in the rail. |

## CSA shell (behind the rail)

| Decision | Notes |
|----------|-------|
| **Full-width application layout** | `Header layout="application"`, `PageContainer size="full"` — ops/dense CSA, not 1440px consumer cap. |
| **Home vs profile nav** | **Home** on dashboard; **Patient Search** on not-auth handoff; **no top nav highlight** on authenticated profile. |
| **Profile section nav** | DS **scrollable line tabs** on same row as timezone label. |
| **Internal term** | Engineering may say *screenpop*; UI copy uses **Call summary** / status labels, not “screenpop”. |

## Layout-specific behavior

| Layout | Behavior |
|--------|----------|
| **Right rail** | 360px docked panel; CSA main content reflows. |
| **Left rail** | Rail **hidden when idle**; slides in on an **incoming call** (auth or not-auth). Exempt TFNs stay hidden. |
| **Sticky top band** | Pinned status + patient + reason; expand for full handoff detail. |

## Prototype mapping

| Decision | Implementation |
|----------|----------------|
| Persistent rail | `HandoffRailPanel` → DS `Sidebar` / `SidebarProvider`; `HandoffRail`, `HandoffTopBand` in `src/handoff/` |
| Verified alert | `HandoffStatusAlert` → DS `Alert` with **Authenticated** / **Not authenticated** only |
| Identity verify fields | `VerifyFields` — first, last, DOB, phone prepopulated from IVR |
| Reason for visit | `HandoffIvrScript` — quotation card under consent + disposition badges |
| Call meta footer | `HandoffCallMeta` — Call ID, via affiliation, TFN (three lines) above **Call ended** |
| CSA shell | `CsaShell`, `CsaHeader`, `CsaHomePage`, `CsaPatientProfile` |
| Scenarios | Ten demo presets (1–10) in `src/data/scenarios.ts`; `ScenarioBar` walkthrough. **10** is dropped-call lookup. |
| Call ID lookup | `findHandoffPayloadByCallId()` restores a 1–9 payload into Call Summary |

## Open / production follow-ups

- **Lenin / CSA engineering** — implement chosen layout in production CSA shell after layout pick.
- **Profile tabs** — prototype uses DS `Tabs`; production may use route `NavLink`s.

## Review tooling

- **Scenario bar** collapses to a **chevron-only** strip so advocates see maximum CSA chrome during review.
- Storybook: `npm run dev` → **http://localhost:6008**
