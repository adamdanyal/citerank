# CiteRank.com changes on top of Elmo

CiteRank.com runs on Elmo (MIT licence, github.com/elmohq/elmo). This file lists every change we make, so each new Elmo release merges cleanly.

## Rules

- Merge only Elmo's tagged releases (vX.Y.Z), never its main branch.
- Keep our changes to as few files as possible: branding (app name, logo, colours, fonts), plans and prices, and public copy. Prefer environment variables and config over editing Elmo's code.
- Customers never see the name Elmo: not on screens, in emails, page titles, share images or footers. LICENSE.md stays in the repo, as the MIT licence requires.
- Leave Elmo's own CLAUDE.md, AGENTS.md and README.md untouched; edits there conflict on every update.
- GitHub Actions stay switched off for this repo. Elmo's workflows publish Elmo's packages and drafts, not ours.

## Updating to a new Elmo release

```
git fetch upstream --tags
git merge vX.Y.Z
```

Resolve any conflicts in the files listed below, test, deploy, then add a line to the log.

## Running locally

Everything runs in cloud mode (plans and billing) with no real keys.

- Node 24 lives at `~/.local/node24` (the `~/.local/node` link stays on v22 for other projects). Put `~/.local/node24/bin` first on `PATH` and set `COREPACK_HOME=~/.local/share/corepack`, because `~/.cache` is not writable.
- Postgres: `~/citerank-localdb` runs embedded-postgres on port 5437 (`pnpm start` there). Ports 5433 to 5436 belong to other local projects.
- `.env` and `apps/web/.env` set `DEPLOYMENT_MODE=cloud`, `SCRAPE_TARGETS=stub:stub`, `ONBOARDING_LLM_TARGET=stub:stub`, `TYPESAFE_API_KEY=stub`, `CLOUD_SIGNUP_ALLOWLIST=*`, and placeholder Stripe, Resend and Google values. Nothing real is called.
- Migrations: from `packages/lib`, `pnpm exec drizzle-kit migrate` against the local database only.
- Start `pnpm dev` in `apps/web` (port 3000), `apps/worker` and `apps/www` (port 3001).
- Resend is stubbed, so a new signup never gets its verification email. Set `email_verified = true` on the user row, then add an active `subscription` row for the org to skip the plan picker. The test login is in `~/citerank-localdb/TEST-ACCOUNT.md`.

## Files we have changed

| File | Why |
| --- | --- |
| `apps/web/vite.config.ts` | Excludes linkedom from the dev pre-bundle; without it a fresh `pnpm dev` crashes. |

## Log

| Date | Change |
| --- | --- |
| 2026-10-31 | Started from Elmo v0.7.7 (commit 5e76f422, released 28 October 2026). |
