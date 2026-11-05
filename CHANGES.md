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

## Before going live

The home page logo strip ("Used by 200+ brands to optimize their AI visibility"), the "Loved by marketers. Recommended by AI." reviews, and the sign-up page quote and G2 stars are Elmo's customers, Elmo's reviews and AI answers about Elmo, shown with our name for the local demo. Swap in CiteRank.com's own logos, count, quotes and AI answers before deploying: `apps/www/src/components/home/logos.tsx`, `apps/www/src/components/home/reviews.tsx`, the copy in `apps/www/src/components/citerank/home/reviews.tsx`, `packages/ui/src/brand/customers.tsx`, `packages/ui/src/brand/g2-rating.tsx`, `apps/www/public/testimonials/` and the three customer logo files in `apps/www/public/`.

Deploy the live demo at `demo.citerank.com` in its own Railway project (see "Live demo"), since the home page links to it.

Have a solicitor check the legal pages (`packages/docs/content/legal/`). Points to raise: whether Danx Digital Limited needs an EU representative to sell into the EU, and whether the Crisp chat, which stores a session identifier as the page loads, needs cookie consent. Make sure Danx Digital Limited has paid the ICO's data protection fee. If Turnstile or Sentry stay off in production, take them out of the cookie policy and the subprocessor list.

Once five agency clients have the founding-client rate, take it off the site: `FoundingRate` and the founding price on each plan card in `apps/www/src/routes/agency.tsx`, and the founding-rate FAQ in `apps/www/src/lib/faqs.ts`.

## Running locally

Everything runs in cloud mode (plans and billing) with no real keys.

- Node 24 lives at `~/.local/node24` (the `~/.local/node` link stays on v22 for other projects). Put `~/.local/node24/bin` first on `PATH` and set `COREPACK_HOME=~/.local/share/corepack`, because `~/.cache` is not writable.
- Postgres: `~/citerank-localdb` runs embedded-postgres on port 5437 (`pnpm start` there). Ports 5433 to 5436 belong to other local projects.
- `.env` and `apps/web/.env` set `DEPLOYMENT_MODE=cloud`, `SCRAPE_TARGETS=stub:stub`, `ONBOARDING_LLM_TARGET=stub:stub`, `TYPESAFE_API_KEY=stub`, `CLOUD_SIGNUP_ALLOWLIST=*`, and placeholder Stripe, Resend and Google values. Nothing real is called.
- Migrations: from `packages/lib`, `pnpm exec drizzle-kit migrate` against the local database only.
- Start `pnpm dev` in `apps/web` (port 3000), `apps/worker` and `apps/www` (port 3001).
- `apps/web/.env.development.local` and `apps/www/.env.development.local` set `VITE_MARKETING_SITE_URL=http://localhost:3001` and `VITE_CLOUD_APP_URL=http://localhost:3000`, so sign-in, sign-up, legal and footer links stay local. Vite reads these files only in dev, so production builds keep citerank.com and app.citerank.com.
- With `SCRAPE_TARGETS=stub:stub` the dashboard stays empty: the stub provider only answers for the model "stub", which no plan picks. Real scraper keys bring real answers.
- Resend is stubbed, so a new signup never gets its verification email. Set `email_verified = true` on the user row, then add an active `subscription` row for the org to skip the plan picker. The test login is in `~/citerank-localdb/TEST-ACCOUNT.md`.

## Marketing screenshots

`apps/www/public/screenshots/*.png` are captures of our dashboard showing a fictional help desk brand, Quaildesk, against eight invented rivals. They come from a separate local database, `citerank_demo`, which `scripts/demo-data/seed.ts` wipes and refills (it refuses any database whose name doesn't end in `_demo`). Retake them after an Elmo release changes the dashboard:

1. Once: create `citerank_demo` on port 5437 and run the migrations against it (`DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5437/citerank_demo pnpm exec drizzle-kit migrate` from `packages/lib`).
2. Seed it: `DATABASE_URL=<that URL> pnpm exec tsx scripts/demo-data/seed.ts`. Dates are relative to now, so seed just before capturing.
3. Build the dashboard and start it on a spare port with `.env` pointing at `citerank_demo`, `DEPLOYMENT_MODE=local`, placeholder provider keys and the five AI apps the captures show: `SCRAPE_TARGETS=chatgpt:olostep:online,gemini:dataforseo:gemini-2.5-flash:online,perplexity:olostep:online,google-ai-overview:olostep:online,claude:anthropic-api:claude-haiku-5-5:online`. In `apps/web`: `pnpm exec vite build`, then `PORT=3100 node --env-file=.env .output/server/index.mjs`. A production build keeps the dev tools button out of the frame.
4. Capture: `DATABASE_URL=<that URL> DASHBOARD_URL=http://localhost:3100 pnpm exec tsx scripts/demo-data/capture.ts` (or name the shots to retake). If Playwright's own browser isn't installed, set `CHROMIUM_PATH` to a cached one in `~/Library/Caches/ms-playwright`. It signs in as the demo user from `scripts/demo-data/content.ts` and draws the fictional companies' logos itself.
5. If the dashboard sidebar moved, update the `y` fractions in `apps/www/src/components/home/product-demo.tsx`; `how-it-works.tsx` crops the left 17.5% of each capture.

## Live demo

The hero's "Try the live demo" link and the screenshot frame under it open `demo.citerank.com`: the dashboard in Elmo's demo mode (`DEPLOYMENT_MODE=demo`) on the Quaildesk database above. `DEPLOYMENT_MODE=local` with `READ_ONLY=true` is also read-only but leaves the chat off. Every visitor is signed in as the demo user from `scripts/demo-data/content.ts`, edits are refused, and Crisp shows its own launcher with the demo next steps. No worker runs against it, so nothing is scraped.

To run it locally, seed `citerank_demo` (steps 1 and 2 above), then in `apps/web` build with `VITE_MARKETING_SITE_URL=http://localhost:3001 VITE_CLOUD_APP_URL=http://localhost:3000 pnpm exec vite build` and start it with `PORT=3100 node --env-file=<demo env> .output/server/index.mjs`. The demo env holds the step 3 values with `DEPLOYMENT_MODE=demo`, `APP_URL` and `VITE_APP_URL` set to `http://127.0.0.1:3100`, and its own `BETTER_AUTH_SECRET` and `ELMO_ENCRYPTION_KEY`. The marketing site's `.env.development.local` sets `VITE_DEMO_SITE_URL=http://127.0.0.1:3100`, so its demo links open it. Use 127.0.0.1 rather than localhost: browsers share localhost cookies across ports, so the demo's sign-in would sign you out of the dashboard on port 3000.

To deploy it, give it its own Railway project and its own Postgres, apart from the main project, so it shares no network, database or variables with the real app. The project holds the web build with the demo env and `demo.citerank.com` as its domain, and a `citerank_demo` database (the seed refuses any other name) with the migrations applied. Give it no real provider keys. The seed's dates are relative to when it runs, so add a daily job in that project that reruns it, or the charts empty out after 30 days. Until it is up, the demo links go nowhere.

## Files we have changed

Paths are from the repo root; `settings/` means `apps/web/src/routes/_authed/app/org/$org/settings/`.

| File | Why |
| --- | --- |
| `apps/web/vite.config.ts` | Excludes linkedom from the dev pre-bundle; without it a fresh `pnpm dev` crashes. |
| `packages/config/src/constants.ts` | Product name, icon path, brand colour and font, docs URLs. CiteRank.com's own Crisp ID. |
| `packages/config/src/referrals.ts` | Links go to citerank.com, app.citerank.com and demo.citerank.com. Demo-booking links go to /agency. Vite builds can point the hosts elsewhere with `VITE_MARKETING_SITE_URL`, `VITE_CLOUD_APP_URL` and `VITE_DEMO_SITE_URL`. |
| `packages/config/src/fanout-support.test.ts` | Drops the check that the providers docs page carries the per-scraper fan-out table; the customer page no longer has it. |
| `packages/config/src/legal.ts` | Legal links go to the marketing site (`MARKETING_SITE_URL`). No cookie consent prompt while nothing sets analytics or ad cookies. |
| `packages/config/src/referrals.test.ts`, `packages/config/src/legal.test.ts` | Expect the citerank.com URLs. |
| `apps/web/src/styles.css` | One appended block: Schibsted Grotesk, Inter, JetBrains Mono, and the colour tokens. |
| `apps/web/src/components/logo.tsx` | CiteRank.com mark and wordmark. |
| `apps/web/src/routes/__root.tsx` | Preloads the wordmark font; page title, description and icon paths. |
| `apps/web/src/routes/api/manifest/index.ts`, `apps/web/src/stories/brand-kit.stories.tsx` | Icon paths. |
| `apps/web/public/icons/*`, `apps/www/public/icons/*`, `apps/www/public/favicon.ico`, `apps/www/public/apple-touch-icon.png`, `apps/www/public/brand/icons/citerank-icon-512.png` | CiteRank.com mark from the old site, renamed from `elmo-icon*`. |
| `apps/www/public/site.webmanifest`, `apps/www/src/lib/seo.ts`, `apps/www/src/lib/ai-catalog.ts`, `apps/www/src/routes/__root.tsx` | Name, colours and logo paths. |
| `apps/web/src/components/auth/sales-panel.tsx` | Elmo's pitch with our name. The demo and GitHub links are gone, and a Book a Call link to /agency replaces the demo link. The customer quote and G2 stars are Elmo's, kept for the local demo (see "Before going live"). |
| `apps/web/src/components/nav-app-info.tsx` | Website link goes to citerank.com; Elmo's GitHub and release links removed. |
| `apps/web/src/components/legal-consent-notice.tsx`, `apps/web/src/components/chart-export-preview.tsx`, `apps/web/src/lib/route-head.ts`, `apps/web/src/routes/auth/login.tsx`, `apps/web/src/routes/auth/authorize.tsx`, `apps/web/src/routes/_authed/choose-plan.tsx`, `settings/billing.tsx`, `apps/web/src/routes/_authed/reports/render/$reportId.tsx` | Elmo's name, email address and domain replaced. |
| `apps/web/src/components/app-sidebar.tsx`, `settings/api.tsx` | Elmo's AEO skill and SDK snippets appear in local mode only. |
| `apps/web/src/lib/mcp/server.ts`, `apps/web/src/lib/mcp/tools/analytics.ts` | MCP server name and instructions. |
| `apps/web/src/server/api-keys.ts`, `packages/lib/src/auth/server.ts` | New API keys start with `citerank_`. |
| `packages/deployment/src/email-templates.ts` | Email subjects, text and button colour. |
| `packages/og/src/render.tsx`, `packages/og/src/fonts.ts`, `packages/og/src/vite-plugin.ts`, `packages/og/src/virtual.d.ts` | Share images: mark, wordmark, fonts, colours, tagline. |
| `apps/web/src/server/config.ts`, `apps/web/src/lib/posthog.ts`, `apps/web/src/server.ts`, `apps/www/src/lib/posthog.ts`, `apps/www/src/lib/crisp.ts`, `apps/worker/src/telemetry.ts`, `packages/ui/src/lib/ad-tags.ts` | Elmo's analytics, chat and ad accounts switched off (see below). |
| `packages/ui/src/consent/cookie-consent-banner.tsx` | Banner text. |
| `apps/web/src/lib/crisp.ts` | The demo's chat greeting names CiteRank.com, and its next steps offer the tracker and the agency instead of Elmo Cloud, self-hosting and a 30-minute walkthrough. |
| `apps/web/src/server/__tests__/config.test.ts`, `apps/web/src/lib/__tests__/crisp.test.ts` | Expect the new Crisp ID and URLs. |
| `apps/web/package.json`, `apps/www/package.json`, `pnpm-lock.yaml` | Font packages. |
| `packages/deployment/scripts/bootstrap-stripe.ts` | Stripe products are named CiteRank.com, since customers see them at checkout and on invoices. |
| `scripts/citerank-brand-check.mjs` | New. Lists customer-facing Elmo text left after a merge. |
| `apps/www/src/styles.css` | One appended block: brand fonts, Tailwind's blue scale remapped to rust and zinc to warm greys (which recolours every component), docs colours. |
| `apps/www/src/lib/seo.ts` | Site URL, name and description; Organization data for Danx Digital Limited; tracker price range. |
| `apps/www/src/routes/__root.tsx` | Fonts, title, theme colour. No Plausible tag, GitHub star fetch or cookie banner. |
| `apps/www/src/components/navbar.tsx`, `apps/www/src/components/footer.tsx`, `apps/www/src/components/logo.tsx` | CiteRank.com navigation, footer with a short "© year CiteRank.com (Registered trademark)" line linking to the UK IPO record, wordmark. The company name, number and address are on the About page. |
| `apps/www/src/routes/index.tsx`, `apps/www/src/components/home/*` (hero, product-demo, how-it-works, why-switch, models, pricing, closing, faq, styles; new agency.tsx), `apps/www/src/data/hero-variants.ts` | Home page copy from the brand text; Elmo's self-hosting and community sections removed. The logo strip and reviews are Elmo's, kept with our name for the local demo (see "Before going live"). |
| `apps/www/src/components/citerank/*` (styles, ui, navbar, home/*), `apps/www/src/routes/redesign.tsx` | New. A redesigned home page and navigation, shown at `/redesign` (not indexed) beside the current home page while the design is decided. Our own files, so Elmo's home page changes never conflict with them. If adopted, `routes/index.tsx` switches to these components and the preview route goes; if not, delete the folder and the route. |
| `apps/web/src/routes/auth/register.tsx` | Accepts `?email=` so the sign-up form on the marketing site carries the address into registration. |
| `packages/ui/src/brand/customers.tsx`, `packages/ui/src/brand/g2-rating.tsx` | Elmo's customer quotes, logos and G2 badge with our name and `?ref=citerank` links, for the local demo (see "Before going live"). |
| `apps/www/src/lib/faqs.ts` | Every FAQ set rewritten; AGENCY_FAQS replaces the off-site AEO FAQs and answers the agency's price, founding-client rate and minimum term. |
| `apps/www/src/routes/agency.tsx`, `apps/www/src/lib/agency-plans.ts` | New. The agency page: three plans (Foundation $1,500, Growth $3,500 and Authority $7,500 a month, three-month minimum), a founding-client rate of 25% off the first six months for the first five clients, and a booking slot (AGENCY_CAL_LINK) waiting for Adam's Cal.com link. |
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
| `packages/docs/content/blog/*.mdx` | All 58 posts reworded as CiteRank.com; findings from Elmo's own tracking attributed neutrally; Elmo's skill, affiliate links and demo callouts removed. `getcito-vs-elmo.mdx` became `getcito-vs-citerank.mdx`. |
| `apps/www/src/data/authors.ts`, `apps/www/src/routes/blog/index.tsx`, `apps/www/src/routes/blog/$.tsx`, `apps/www/src/components/blog-post-layout.tsx`, `apps/www/src/components/provider-cta.tsx` | Byline "CiteRank.com Team" replaces Elmo's founder; titles; Elmo's partner dofollow list and affiliate `sponsored` links removed. |
| `packages/docs/content/docs/**` | Product docs reworded as CiteRank.com; getting-started is a hosted quickstart; providers.mdx describes the AI apps tracked. |
| `packages/api-spec/src/openapi.json` | Title, contact, key prefix and descriptions. The `x-elmo-*` keys stay because code reads them. |
| `packages/docs/content/legal/*.mdx` | Elmo's policies rewritten for Danx Digital Limited under the law of England and Wales: English courts instead of California law and American arbitration, UK GDPR lawful bases and ICO complaints, UK transfer rules, and only the services CiteRank.com runs (no analytics, ad tags or cookie banner). |
| `apps/www/public/screenshots/*.png` | Retaken from our dashboard with the fictional Quaildesk data instead of Elmo's logo, demo org and Nike data (see "Marketing screenshots"). `feature-graphics.tsx` names the tags the prompt filter capture now shows. |
| `scripts/demo-data/` | New. Seeds the demo database behind the screenshots and the live demo, and captures the screenshots. |

## Files we have removed

Keep these deleted when an Elmo merge reports changes to them.

- Elmo-only pages: `apps/www/src/routes/` changelog, roadmap, vision, status, brand, demo, off-site-aeo, off-site-aeo_.book, `og/status[.]png.tsx`, `repo-activity[.]svg.ts`, `api/repo-activity/`.
- Their helpers: `apps/www/src/lib/` github-changelog, github-releases, github-roadmap, github-stars, release-markdown, repo-activity/, status, status-helpers, status-og, redis; `apps/www/src/data/upcoming-features.json`.
- Components only they used: `apps/www/src/components/` off-site-aeo, booking-page, contact-form, newsletter-signup, community, quickstart-block; `apps/www/src/lib/self-host-link.ts`.
- Elmo's self-hosting pitch: `apps/www/src/components/home/self-host.tsx`, `apps/www/public/demo-poster.png`.
- Elmo's brand kit: `apps/www/public/brand/` banners, logos, architecture.svg, `icons/elmo-icon-*`.
- Icons renamed: `apps/web/public/icons/elmo-icon*` and `apps/www/public/icons/elmo-icon*` became `citerank-icon*`.
- Docs: `packages/docs/content/docs/developer-guide/`, `api/sdks.mdx`, `api/skill.mdx`.
- Blog: `packages/docs/content/blog/getcito-vs-elmo.mdx` (renamed), `apps/www/public/authors/jared.png`.
- Open-source tools page: `apps/www/src/routes/ai-visibility-tools/category/open-source.tsx`, with its `open-source` entry in `CATEGORY_SLUGS` (`apps/www/src/lib/competitors/directory.ts`). CiteRank.com is not sold as open source.

## Elmo services switched off

Elmo's code reported to Elmo's own accounts, so CiteRank.com visitors and customers would have shown up there. All of these are blank or off:

- PostHog analytics: the dashboard reads `VITE_POSTHOG_KEY`; the marketing site has `POSTHOG_KEY` in `apps/www/src/lib/posthog.ts`; the worker has `POSTHOG_PUBLIC_KEY` in `apps/worker/src/telemetry.ts`.
- Google Ads and Meta pixels: `GOOGLE_ADS_ID` and `META_PIXEL_ID` in `packages/ui/src/lib/ad-tags.ts`.
- Cookie consent: `isElmoHosted` in `packages/config/src/legal.ts` returns false. Restore it when CiteRank.com turns any of the above on.

Crisp support chat runs on CiteRank.com's own workspace (`CRISP_WEBSITE_ID` in `packages/config/src/constants.ts`). As in Elmo, it loads without the consent prompt.

## Log

| Date | Change |
| --- | --- |
| 2026-10-31 | Started from Elmo v0.7.7 (commit 5e76f422, released 28 October 2026). |
| 2026-10-31 | Local build: rebranded the dashboard, emails, share images, marketing site, docs, blog and legal pages as CiteRank.com; switched off Elmo's chat, analytics and ad accounts. Not deployed. |
| 2026-10-31 | Replaced the marketing site's 11 dashboard screenshots with captures of the CiteRank.com dashboard showing a fictional brand. Not deployed. |
| 2026-10-31 | Put Elmo's wording back inside the app (only the name changed) and resized the rewritten marketing copy to the length of the Elmo text it replaced. Not deployed. |
| 2026-10-31 | Put the marketing site, docs and data back on Elmo's wording, with only untrue claims changed and the owner's writing rules applied, and kept every blog post within 5% of Elmo's length. The header shows only Features and Pricing, and the support page has six cards. Not deployed. |
| 2026-10-31 | Turned on Crisp chat with CiteRank.com's own website ID on the marketing site, the support page and the dashboard. Not deployed. |
| 2026-10-31 | Fitted the navbar logo and Sign Up button, and the hero's "See Pricing" link, on 320px phones. Not deployed. |
| 2026-10-31 | Changed the home page headline to "Track Your Brand in AI Search", sized to hold to two lines down to 320px phones. Not deployed. |
| 2026-10-31 | Stopped the industry pages scrolling sideways on phones, where a long example prompt widened the page. Not deployed. |
| 2026-10-31 | Put the marketing site's buttons and action links in sentence case, as Elmo's site has them ("Sign up", "Start tracking", "Have us do the work"). Not deployed. |
| 2026-11-01 | Added a live demo, the read-only dashboard on the fictional Quaildesk data, linked from the hero and the screenshot frame as on Elmo's site. Runs locally on port 3100. Not deployed. |
| 2026-11-01 | Rewrote the legal pages for Danx Digital Limited under the law of England and Wales, and cut the analytics, advertising and hosting services CiteRank.com doesn't use. Not deployed. |
| 2026-11-01 | Put three agency plans on the agency page (Foundation $1,500, Growth $3,500, Authority $7,500 a month), with a founding-client rate of 25% off the first six months for the first five clients, and FAQs on price, the founding rate and the minimum term. Not deployed. |
| 2026-11-05 | Built a redesigned home page and navigation as a preview at `/redesign`, following the elayadesign landing-page and redesign guides: a floating nav with a full-height phone menu, then (after Adam pointed at Basecamp's homepage) a long-form, plain-English page: a problem section with an example AI answer, three chapters each with one large product screenshot, a tagline band, sections that rise in on scroll, and a recommended tracker plan. The current home page is unchanged. Not deployed. |
