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

A merge keeps every change below: where Elmo changed the same lines, git stops for you to choose, and nothing is overwritten silently. Then:

1. Resolve conflicts in the files listed below. If `pnpm-lock.yaml` conflicts, take Elmo's version and run `pnpm install`; it adds our font packages back from the `package.json` files.
2. We renamed Elmo's `elmo-icon*` files to `citerank-icon*`. If git says Elmo changed a file we deleted, keep it deleted (`git rm <file>`).
3. Run `node scripts/citerank-brand-check.mjs`. It lists any customer-facing Elmo text the release added; rebrand each one and add the file to the table below.
4. Test, deploy, then add a line to the log.

## Running locally

Everything runs in cloud mode (plans and billing) with no real keys.

- Node 24 lives at `~/.local/node24` (the `~/.local/node` link stays on v22 for other projects). Put `~/.local/node24/bin` first on `PATH` and set `COREPACK_HOME=~/.local/share/corepack`, because `~/.cache` is not writable.
- Postgres: `~/citerank-localdb` runs embedded-postgres on port 5437 (`pnpm start` there). Ports 5433 to 5436 belong to other local projects.
- `.env` and `apps/web/.env` set `DEPLOYMENT_MODE=cloud`, `SCRAPE_TARGETS=stub:stub`, `ONBOARDING_LLM_TARGET=stub:stub`, `TYPESAFE_API_KEY=stub`, `CLOUD_SIGNUP_ALLOWLIST=*`, and placeholder Stripe, Resend and Google values. Nothing real is called.
- Migrations: from `packages/lib`, `pnpm exec drizzle-kit migrate` against the local database only.
- Start `pnpm dev` in `apps/web` (port 3000), `apps/worker` and `apps/www` (port 3001).
- Resend is stubbed, so a new signup never gets its verification email. Set `email_verified = true` on the user row, then add an active `subscription` row for the org to skip the plan picker. The test login is in `~/citerank-localdb/TEST-ACCOUNT.md`.

## Files we have changed

Paths are from the repo root; `settings/` means `apps/web/src/routes/_authed/app/org/$org/settings/`.

| File | Why |
| --- | --- |
| `apps/web/vite.config.ts` | Excludes linkedom from the dev pre-bundle; without it a fresh `pnpm dev` crashes. |
| `packages/config/src/constants.ts` | Product name, icon path, brand colour and font, docs URLs. Crisp ID emptied. |
| `packages/config/src/referrals.ts` | Links go to citerank.com and app.citerank.com. |
| `packages/config/src/legal.ts` | Legal links go to citerank.com. No cookie consent prompt while nothing sets cookies. |
| `packages/config/src/referrals.test.ts`, `packages/config/src/legal.test.ts` | Expect the citerank.com URLs. |
| `apps/web/src/styles.css` | One appended block: Schibsted Grotesk, Inter, JetBrains Mono, and the colour tokens. |
| `apps/web/src/components/logo.tsx` | CiteRank.com mark and wordmark. |
| `apps/web/src/routes/__root.tsx` | Preloads the wordmark font; page title, description and icon paths. |
| `apps/web/src/routes/api/manifest/index.ts`, `apps/web/src/stories/brand-kit.stories.tsx` | Icon paths. |
| `apps/web/public/icons/*`, `apps/www/public/icons/*`, `apps/www/public/favicon.ico`, `apps/www/public/apple-touch-icon.png`, `apps/www/public/brand/icons/citerank-icon-512.png` | CiteRank.com mark from the old site, renamed from `elmo-icon*`. |
| `apps/www/public/site.webmanifest`, `apps/www/src/lib/seo.ts`, `apps/www/src/lib/ai-catalog.ts`, `apps/www/src/routes/__root.tsx` | Name, colours and logo paths. |
| `apps/web/src/components/auth/sales-panel.tsx` | Sign-up pitch rewritten from the brand text. Elmo's customer quote, G2 badge, demo and GitHub links removed; a Book a Call link to /agency added. |
| `apps/web/src/components/nav-app-info.tsx` | Website link goes to citerank.com; Elmo's GitHub and release links removed. |
| `apps/web/src/components/legal-consent-notice.tsx`, `apps/web/src/components/chart-export-preview.tsx`, `apps/web/src/lib/route-head.ts`, `apps/web/src/routes/auth/login.tsx`, `apps/web/src/routes/auth/authorize.tsx`, `apps/web/src/routes/_authed/choose-plan.tsx`, `settings/billing.tsx`, `apps/web/src/routes/_authed/reports/render/$reportId.tsx` | Elmo's name, email address and domain replaced. |
| `apps/web/src/components/app-sidebar.tsx`, `settings/api.tsx` | Elmo's AEO skill and SDK snippets appear in local mode only. |
| `apps/web/src/lib/mcp/server.ts`, `apps/web/src/lib/mcp/tools/analytics.ts` | MCP server name and instructions. |
| `apps/web/src/server/api-keys.ts`, `packages/lib/src/auth/server.ts` | New API keys start with `citerank_`. |
| `packages/deployment/src/email-templates.ts` | Email subjects, text and button colour. |
| `packages/og/src/render.tsx`, `packages/og/src/fonts.ts`, `packages/og/src/vite-plugin.ts`, `packages/og/src/virtual.d.ts` | Share images: mark, wordmark, fonts, colours, tagline. |
| `apps/web/src/server/config.ts`, `apps/web/src/lib/posthog.ts`, `apps/web/src/server.ts`, `apps/www/src/lib/posthog.ts`, `apps/www/src/lib/crisp.ts`, `apps/worker/src/telemetry.ts`, `packages/ui/src/lib/ad-tags.ts` | Elmo's analytics, chat and ad accounts switched off (see below). |
| `packages/ui/src/consent/cookie-consent-banner.tsx` | Banner text. |
| `apps/web/src/server/__tests__/config.test.ts`, `apps/web/src/lib/__tests__/crisp.test.ts` | Expect the new Crisp ID and URLs. |
| `apps/web/package.json`, `apps/www/package.json`, `pnpm-lock.yaml` | Font packages. |
| `scripts/citerank-brand-check.mjs` | New. Lists customer-facing Elmo text left after a merge. |

## Elmo services switched off

Elmo's code reported to Elmo's own accounts, so CiteRank.com visitors and customers would have shown up there. All of these are blank or off:

- Crisp support chat: `CRISP_WEBSITE_ID` in `packages/config/src/constants.ts`.
- PostHog analytics: the dashboard reads `VITE_POSTHOG_KEY`; the marketing site has `POSTHOG_KEY` in `apps/www/src/lib/posthog.ts`; the worker has `POSTHOG_PUBLIC_KEY` in `apps/worker/src/telemetry.ts`.
- Google Ads and Meta pixels: `GOOGLE_ADS_ID` and `META_PIXEL_ID` in `packages/ui/src/lib/ad-tags.ts`.
- Cookie consent: `isElmoHosted` in `packages/config/src/legal.ts` returns false. Restore it when CiteRank.com turns any of the above on.

## Log

| Date | Change |
| --- | --- |
| 2026-10-31 | Started from Elmo v0.7.7 (commit 5e76f422, released 28 October 2026). |
