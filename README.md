# MiCA Design Review Room

**Legal from Day One** — a pre-launch design-and-review workspace for token
teams that want to hand a clean, structured package to a legal reviewer
*before* they ship.

Built during **ETHSilesia 2026** on the ETHLegal & Finance track.

> A working link to the demo / pitch video will be added here before
> submission: **TODO — demo video link**.

---

## The problem

MiCA (Markets in Crypto-Assets Regulation) is in force, but most builders
still hand their lawyers a whitepaper, a Notion doc and a call. Reviewers
end up re-typing the same questions every time, and builders learn about
blockers *after* launch. That's expensive and, in some cases, fatal.

## What this project does

An MVP two-seat workspace:

1. **Builder view** — a structured form for the token design: role,
   issuer, holder scale, redemption, KYC, safeguards, data
   architecture / controller. A side panel shows a deterministic
   MiCA-readiness score in real time (global score, four category
   scores, top risks).
2. **Legal review view** — receives the design plus a checklist of
   critical review points, each pre-filled with a *design-aware* hint
   (e.g. *"Stablecoin without full 1:1 redemption is almost certainly
   a MiCA blocker"*). The reviewer sets `Approve / Needs change /
   Blocker`, adds comments, locks the review and generates a plain
   markdown Design Review Report — including a "Residual risks if
   launched as-is" section and a licensed-counsel disclaimer.

Everything is **deterministic** — no LLM calls, no hidden network
requests. The whole thing is a static SPA.

## Why this is useful

- Builders see the likely regulatory risks while they still hold the pen.
- Reviewers start from a structured, pre-annotated checklist instead of
  a blank page, which saves billable hours.
- The generated report is a single artefact both sides can refer to.

## Tech stack

- Vite + React 18 + TypeScript
- TailwindCSS + shadcn/ui
- Zustand-style store via React Context (`src/lib/store.tsx`)
- Domain logic is pure TypeScript in `src/lib/`:
  - `scoring.ts` — rule-based `evaluateDesign(design)`
  - `reviewTemplate.ts` — `createInitialReview(design, score)`
  - `report.ts` — `generateTextReport(design, score, review)`
  - `types.ts` — canonical `DesignSpec`, `LegalReview`, `ReviewPoint`

## Running locally

Requires Node ≥ 18.

```bash
npm install
npm run dev         # start the app on http://localhost:5173
npm run build       # production build into dist/
npm test            # vitest
npx tsc --noEmit -p tsconfig.app.json   # typecheck
```

## Project structure

```
src/
  components/
    AnalysisSnapshot.tsx   # live readiness meter + key risks
    DesignForm.tsx         # the six-section builder form
    TopBar.tsx, ui-bits.tsx, ui/...
  views/
    BuilderView.tsx        # builder workspace
    LegalReviewView.tsx    # reviewer workspace + report modal
  lib/
    scoring.ts             # deterministic scoring engine
    reviewTemplate.ts      # design-aware review point generator
    report.ts              # markdown report generator
    store.tsx              # shared state (design, legal review, view)
    types.ts, defaults.ts
```

## Team

<!-- TODO: replace with real names / roles / contact before submission -->
- TODO — full name · role · github
- TODO — full name · role · github

## License

Released under **GPL-3.0** — see [`LICENSE`](./LICENSE).

## Hackathon attribution

See [`SOURCE.md`](./SOURCE.md).
