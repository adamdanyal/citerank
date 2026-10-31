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
2. If git says Elmo changed a file we deleted or renamed (see "Files we have removed"), keep it deleted (`git rm <file>`). New Elmo blog posts, docs pages or marketing pages arrive as new files with no conflict, so step 3 is what catches them.
3. Run `node scripts/citerank-brand-check.mjs`. It lists any customer-facing Elmo text the release added; rebrand each one and add the file to the table below.
4. Test, deploy, then add a line to the log.

## Running locally

Everything runs in cloud mode (plans and billing) with no real keys.

- Node 24 lives at `~/.local/node24` (the `~/.local/node` link stays on v22 for other projects). Put `~/.local/node24/bin` first on `PATH` and set `COREPACK_HOME=~/.local/share/corepack`, because `~/.cache` is not writable.
- Postgres: `~/citerank-localdb` runs embedded-postgres on port 5437 (`pnpm start` there). Ports 5433 to 5436 belong to other local projects.
- `.env` and `apps/web/.env` set `DEPLOYMENT_MODE=cloud`, `SCRAPE_TARGETS=stub:stub`, `ONBOARDING_LLM_TARGET=stub:stub`, `TYPESAFE_API_KEY=stub`, `CLOUD_SIGNUP_ALLOWLIST=*`, and placeholder Stripe, Resend and Google values. Nothing real is called.
- Migrations: from `packages/lib`, `pnpm exec drizzle-kit migrate` against the local database only.
- Start `pnpm dev` in `apps/web` (port 3000), `apps/worker` and `apps/www` (port 3001).
- With `SCRAPE_TARGETS=stub:stub` the dashboard stays empty: the stub provider only answers for the model "stub", which no plan picks. Real scraper keys bring real answers.
- Resend is stubbed, so a new signup never gets its verification email. Set `email_verified = true` on the user row, then add an active `subscription` row for the org to skip the plan picker. The test login is in `~/citerank-localdb/TEST-ACCOUNT.md`.

## Files we have changed

Paths are from the repo root; `settings/` means `apps/web/src/routes/_authed/app/org/$org/settings/`.

| File | Why |
| --- | --- |
| `apps/web/vite.config.ts` | Excludes linkedom from the dev pre-bundle; without it a fresh `pnpm dev` crashes. |
| `packages/config/src/constants.ts` | Product name, icon path, brand colour and font, docs URLs. Crisp ID emptied. |
| `packages/config/src/referrals.ts` | Links go to citerank.com and app.citerank.com. Demo-booking links go to /agency, and the demo-instance URL to the app, since CiteRank.com has no public demo. |
| `packages/config/src/fanout-support.test.ts` | Drops the check that the providers docs page carries the per-scraper fan-out table; the customer page no longer has it. |
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
| `apps/www/src/styles.css` | One appended block: brand fonts, Tailwind's blue scale remapped to rust and zinc to warm greys (which recolours every component), docs colours. |
| `apps/www/src/lib/seo.ts` | Site URL, name and description; Organization data for Danx Digital Limited; tracker price range. |
| `apps/www/src/routes/__root.tsx` | Fonts, title, theme colour. No Plausible tag, GitHub star fetch or cookie banner. |
| `apps/www/src/components/navbar.tsx`, `apps/www/src/components/footer.tsx`, `apps/www/src/components/logo.tsx` | CiteRank.com navigation, footer with the Danx Digital Limited legal line, wordmark. |
| `apps/www/src/routes/index.tsx`, `apps/www/src/components/home/*` (hero, product-demo, how-it-works, why-switch, models, pricing, closing, faq, styles; new agency.tsx), `apps/www/src/data/hero-variants.ts` | Home page copy from the brand text; Elmo's customer logos, reviews, self-hosting and community sections removed. |
| `apps/www/src/lib/faqs.ts` | Every FAQ set rewritten; AGENCY_FAQS replaces the off-site AEO FAQs. |
| `apps/www/src/routes/agency.tsx` | New. The agency page, with placeholder tiers and a booking slot (AGENCY_CAL_LINK) waiting for Adam's Cal.com link. |
| `apps/www/src/routes/pricing.tsx`, `apps/www/src/components/pricing.tsx`, `apps/www/src/routes/about.tsx`, `apps/www/src/routes/support.tsx`, `apps/www/src/routes/legal/index.tsx` | Rewritten for CiteRank.com. |
| `apps/www/src/routes/llms[.]txt.ts`, `apps/www/src/routes/sitemap[.]xml.ts`, `apps/www/src/routes/robots[.]txt.ts`, `apps/www/src/lib/ai-catalog.ts`, `apps/www/src/routes/[.]well-known/api-catalog.ts` | Discovery files point at citerank.com. |
| `apps/www/src/server.ts` | CSP allows PostHog's own hosts instead of Elmo's; no Elmo status, licence or agent-skill discovery links. |
| `apps/www/package.json` | Font packages; `dev` and `build` no longer publish Elmo's agent skill. |
| `apps/www/src/lib/openapi/index.ts` | Strips the spec's `x-elmo-*` keys from the docs pages (the app still reads them). |
| `apps/www/src/lib/og.ts`, `apps/www/src/lib/external-link.ts`, `apps/www/src/lib/posthog.ts`, `apps/www/src/components/not-found.tsx`, `apps/www/src/components/ai-referral-banner.tsx`, `apps/www/src/components/feature-graphics.tsx`, `apps/www/src/components/cta.tsx`, `apps/www/src/components/cta-buttons.tsx`, `apps/www/src/components/docs-page-layout.tsx`, `apps/www/src/data/statistics.ts` | Elmo names, links and hosts replaced. |
| `packages/ui/src/lib/cookie-consent.ts` | Consent storage key renamed to match the cookie policy. |
| `apps/www/src/routes/aeo-for/*`, `apps/www/src/routes/features/*`, `apps/www/src/routes/ai-search/*`, `apps/www/src/routes/glossary/*`, `apps/www/src/routes/statistics.tsx`, `apps/www/src/routes/answer-engine-optimization.tsx`, `apps/www/src/routes/generative-engine-optimization.tsx`, `apps/www/src/data/{aeo-verticals,features,ai-search-engines,glossary,pillars}.ts`, `apps/www/src/components/{pillar,features}.tsx` | Industry, feature, AI app and guide pages reworded as CiteRank.com. Findings from Elmo's own tracking are attributed neutrally, never to CiteRank.com. |
| `apps/www/src/routes/ai-visibility-tools/**`, `apps/www/src/lib/competitors/*`, `apps/www/src/components/{competitor-comparison,competitor-directory,directory-shell,tool-list,multi-comparison,pair-comparison,ai-visibility-software-hub}.tsx` | Tool directory with CiteRank.com as the reference listing. Comparison pages live at `/ai-visibility-tools/citerank-vs-<tool>`. |
| `apps/www/src/routeTree.gen.ts` | Regenerated by the router for the added and removed routes. |
| `packages/docs/content/docs/**` | Product docs reworded as CiteRank.com; getting-started is a hosted quickstart; providers.mdx describes the AI apps tracked. |
| `packages/api-spec/src/openapi.json` | Title, contact, key prefix and descriptions. The `x-elmo-*` keys stay because code reads them. |
| `packages/docs/content/legal/*.mdx` | Elmo's policies with CiteRank.com as the company and the open-source passages removed. A placeholder until proper policies exist: governing law and arbitration still name California. |

## Files we have removed

Keep these deleted when an Elmo merge reports changes to them.

- Elmo-only pages: `apps/www/src/routes/` changelog, roadmap, vision, status, brand, demo, off-site-aeo, off-site-aeo_.book, `og/status[.]png.tsx`, `repo-activity[.]svg.ts`, `api/repo-activity/`.
- Their helpers: `apps/www/src/lib/` github-changelog, github-releases, github-roadmap, github-stars, release-markdown, repo-activity/, status, status-helpers, status-og, redis; `apps/www/src/data/upcoming-features.json`.
- Components only they used: `apps/www/src/components/` off-site-aeo, booking-page, contact-form, newsletter-signup, community, quickstart-block; `apps/www/src/lib/self-host-link.ts`.
- Elmo's customers and self-hosting pitch: `apps/www/src/components/home/` logos, reviews, self-host; `packages/ui/src/brand/` customers, g2-rating; `apps/www/public/` testimonials/, recordranks-logo.svg, askhotel-logo.png, aisearch-global-logo.svg, demo-poster.png.
- Elmo's brand kit: `apps/www/public/brand/` banners, logos, architecture.svg, `icons/elmo-icon-*`.
- Icons renamed: `apps/web/public/icons/elmo-icon*` and `apps/www/public/icons/elmo-icon*` became `citerank-icon*`.
- Docs: `packages/docs/content/docs/developer-guide/`, `api/sdks.mdx`, `api/skill.mdx`.

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
