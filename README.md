# CSA Handoff Prototype

Dedicated Storybook for **Sierra → CSA handoff UX** — persistent surfaces inside CSA (not Finesse).

Compare three layout options Alice asked for:

| Story | Pattern |
|-------|---------|
| **Layouts / Right Rail** | Docked 360px panel on the right |
| **Layouts / Left Rail** | Handoff rail **hidden when idle**; **slides in** on call (toggle in story) |
| **Layouts / Sticky Top Band** | Pinned status + reason; expand for detail |

## Quick start

```bash
cd C:\Users\C7R2SK\Documents\csa-handoff-prototype
npm install
npm run dev
```

Open **http://localhost:6008** — use the scenario dropdown (ten demo presets, 1–10). Scenario **10** is a dropped call: Call Summary starts empty so the advocate can look up a Call ID.

## Dependencies

- **@everkit/design-system** — linked from `../mdlive-design-system` (same as AHT dashboard)
- Scenario data copied from everkit `Advocate Transfer Context` stories; this repo owns layout experiments only

## Related specs

- [`docs/csa-experience-decisions.md`](docs/csa-experience-decisions.md) — meeting decisions + prototype mapping
- `tfn-aht-sierra/02-auth-handoff-contract-and-screenpop-content-model.md`
- `tfn-aht-sierra/33-meeting-notes-kr-2-2-and-sierra-syncs.md` (static panel vs pop-up)

## Notes

- Internal term **screenpop** — UI copy uses “Call summary”
- MVP auth scenarios; visit reason is passive capture; auth UI is **Authenticated** / **Not authenticated** only
- Lenin’s CSA engineering tickets should implement chosen layout in production shell
