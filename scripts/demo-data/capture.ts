// Captures the dashboard screenshots in apps/www/public/screenshots from a
// dashboard running against the seeded demo database (see seed.ts):
//
//   DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5437/citerank_demo \
//   DASHBOARD_URL=http://localhost:3100 \
//     pnpm exec tsx scripts/demo-data/capture.ts [overview visibility ...]
//
// CHROMIUM_PATH points it at a Chromium of your own when Playwright's pinned
// build isn't installed.
//
// Each capture is 1500×900 at 2x, so 3000×1800, the size the marketing site's
// cursor and crop positions are worked out against.
//
// The crops are a second set: one part of a page, shown on the marketing site
// at the size it was captured, so its text stays readable. Name a crop to
// retake only that one. Their PNGs land in scripts/demo-data/captures.
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import type { Browser, Page } from "@playwright/test";
import { BRAND, DEMO_BRAND, DEMO_LOGIN, DEMO_ORG } from "./content";

const requireFromE2e = createRequire(join(__dirname, "../../e2e/package.json"));
const { chromium } = requireFromE2e("@playwright/test") as typeof import("@playwright/test");
const pg = requireFromE2e("pg") as typeof import("pg");

const DASHBOARD_URL = process.env.DASHBOARD_URL ?? "http://localhost:3100";
const OUT_DIR = join(__dirname, "../../apps/www/public/screenshots");
const CROP_DIR = join(__dirname, "captures");
const BRAND_PATH = `/app/org/${DEMO_ORG.slug}/brand/${DEMO_BRAND.slug}`;

interface Shot {
	name: string;
	path: string | ((promptIds: Map<string, string>) => string);
	prepare?: (page: Page) => Promise<void>;
}

const SHOTS: Shot[] = [
	{ name: "overview", path: "" },
	{ name: "visibility", path: "/visibility" },
	{ name: "share-of-voice", path: "/share-of-voice" },
	{ name: "sentiment", path: "/sentiment" },
	{ name: "responses", path: "/responses" },
	{ name: "query-fan-out", path: "/query-fan-out?tab=words" },
	{ name: "citations", path: "/citations" },
	{ name: "opportunities", path: "/opportunities" },
	{
		name: "prompts",
		path: "/visibility",
		prepare: async (page) => {
			await page.getByRole("button", { name: "Tags" }).click();
			for (const tag of ["automation", "comparison"]) {
				await page.getByRole("button", { name: tag, exact: true }).click();
			}
			await settle(page);
			// Picking a tag scrolls the page and the tag list; frame both from the top.
			await page.evaluate(() => {
				for (const element of document.querySelectorAll("*")) {
					if (element.scrollTop > 0) element.scrollTop = 0;
				}
				window.scrollTo(0, 0);
			});
			await page.mouse.move(100, 650);
		},
	},
	{
		name: "prompt-detail",
		path: (ids) => `/prompts/${ids.get("Help desk software with AI agents that resolve tickets")}?tab=responses`,
	},
	{ name: "prompt-settings", path: "/settings/prompts" },
];

interface Crop {
	name: string;
	path: string;
	/** The dashboard lays out differently at each width, so a crop names the one it was measured at. */
	viewport: { width: number; height: number };
	clip: { x: number; y: number; width: number; height: number };
}

const CROPS: Crop[] = [
	// 813 high so the competitor table ends on a whole row.
	{
		name: "overview-wide",
		path: "",
		viewport: { width: 1280, height: 813 },
		clip: { x: 264, y: 80, width: 1000, height: 673 },
	},
	{
		name: "overview-phone",
		path: "",
		viewport: { width: 390, height: 844 },
		clip: { x: 0, y: 280, width: 390, height: 348 },
	},
	// The three steps. Each is cut inside the dashboard's own card, so the page draws the only outline, and each ends on
	// a whole block. They stack on the page, so no crop may be shorter than the one before it.
	{
		name: "step-ask",
		path: "/responses",
		viewport: { width: 1040, height: 900 },
		clip: { x: 283, y: 459, width: 722, height: 327 },
	},
	{
		name: "step-see",
		path: "/share-of-voice",
		viewport: { width: 1040, height: 900 },
		clip: { x: 283, y: 631, width: 722, height: 477 },
	},
	{
		name: "step-fix",
		path: "/opportunities",
		viewport: { width: 1040, height: 900 },
		clip: { x: 271, y: 617, width: 746, height: 605 },
	},
	{
		name: "step-ask-phone",
		path: "/responses",
		viewport: { width: 390, height: 844 },
		clip: { x: 18, y: 538, width: 354, height: 562 },
	},
	{
		name: "step-see-phone",
		path: "/share-of-voice",
		viewport: { width: 390, height: 844 },
		clip: { x: 18, y: 1169, width: 354, height: 477 },
	},
	{
		name: "step-fix-phone",
		path: "/opportunities",
		viewport: { width: 390, height: 844 },
		clip: { x: 6, y: 840, width: 378, height: 676 },
	},
];

/** Simple marks for the fictional companies, so their rows don't show a blank globe. */
const LOGOS: Record<string, { color: string; glyph: string }> = {
	[BRAND.domain]: {
		color: "#4F46E5",
		glyph: '<path d="M18 22a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v10a8 8 0 0 1-8 8h-6l-8 7v-7a8 8 0 0 1-6-8z" fill="#fff"/><circle cx="38" cy="25" r="3" fill="#4F46E5"/>',
	},
	"queueloft.com": {
		color: "#0F172A",
		glyph: '<rect x="16" y="18" width="32" height="6" rx="3" fill="#fff"/><rect x="16" y="29" width="24" height="6" rx="3" fill="#fff"/><rect x="16" y="40" width="16" height="6" rx="3" fill="#fff"/>',
	},
	"brookdesk.com": {
		color: "#0284C7",
		glyph: '<path d="M14 30c6-6 12-6 18 0s12 6 18 0M14 42c6-6 12-6 18 0s12 6 18 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>',
	},
	"ticketwren.com": {
		color: "#EA580C",
		glyph: '<path d="M14 20h36v8a4 4 0 0 0 0 8v8H14v-8a4 4 0 0 0 0-8z" fill="#fff"/>',
	},
	"northqueue.com": {
		color: "#1E3A8A",
		glyph: '<path d="M32 12l14 34-14-8-14 8z" fill="#fff"/>',
	},
	"caseorchard.com": {
		color: "#15803D",
		glyph: '<path d="M32 14c10 0 16 8 16 16s-7 14-16 14-16-6-16-14 6-16 16-16z" fill="#fff"/><path d="M32 22v28" stroke="#15803D" stroke-width="4"/>',
	},
	"lumenreply.com": {
		color: "#D97706",
		glyph: '<circle cx="32" cy="32" r="9" fill="#fff"/><path d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M42 42l4 4M18 46l4-4M42 22l4-4" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
	},
	"supportpine.com": {
		color: "#047857",
		glyph: '<path d="M32 12l14 20h-8l10 14H16l10-14h-8z" fill="#fff"/>',
	},
	"helpmeadow.com": {
		color: "#65A30D",
		glyph: '<circle cx="32" cy="26" r="7" fill="#fff"/><path d="M32 33v17M22 50c2-8 6-11 10-11s8 3 10 11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>',
	},
};

const logoSvg = ({ color, glyph }: { color: string; glyph: string }) =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${color}"/>${glyph}</svg>`;

async function promptIds(): Promise<Map<string, string>> {
	const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
	await client.connect();
	try {
		const { rows } = await client.query<{ id: string; value: string }>(
			"SELECT id, value FROM prompts WHERE brand_id = $1",
			[DEMO_BRAND.id],
		);
		return new Map(rows.map((row) => [row.value, row.id]));
	} finally {
		await client.end();
	}
}

async function openSession(browser: Browser) {
	const context = await browser.newContext({
		baseURL: DASHBOARD_URL,
		viewport: { width: 1500, height: 900 },
		deviceScaleFactor: 2,
		locale: "en-US",
		timezoneId: "America/New_York",
	});
	await context.route("**/api/site-icon?**", (route) => {
		const domain = new URL(route.request().url()).searchParams.get("domain") ?? "";
		const logo = LOGOS[domain];
		if (!logo) return route.continue();
		return route.fulfill({ contentType: "image/svg+xml", body: logoSvg(logo) });
	});

	const page = await context.newPage();
	await page.goto("/auth/login");
	// Typing before hydration is lost when React takes over the form.
	await page.waitForLoadState("networkidle");
	// A dashboard in demo mode signs itself in, but only once the client has
	// hydrated, so wait for whichever lands first: the form or the redirect.
	await Promise.race([
		page.waitForURL((url) => !url.pathname.startsWith("/auth"), { timeout: 20_000 }).catch(() => null),
		page
			.locator("#email")
			.waitFor({ state: "visible", timeout: 20_000 })
			.catch(() => null),
	]);
	if (new URL(page.url()).pathname.startsWith("/auth")) {
		await page.locator("#email").fill(DEMO_LOGIN.email);
		await page.locator("#password").fill(DEMO_LOGIN.password);
		await page.locator("#password").press("Enter");
		await page.waitForURL((url) => !url.pathname.startsWith("/auth"));
	}
	return { context, page };
}

/** Waits out loading skeletons and chart entry animations. */
async function settle(page: Page): Promise<void> {
	await page.waitForLoadState("networkidle");
	// Cards below the fold stay skeletons until scrolled to, so only what's on screen counts.
	await page.waitForFunction(
		() =>
			[...document.querySelectorAll('[data-slot="skeleton"], .animate-pulse')].every((element) => {
				const box = element.getBoundingClientRect();
				const offscreen = box.bottom <= 0 || box.top >= window.innerHeight;
				return offscreen || !element.checkVisibility({ opacityProperty: true, visibilityProperty: true });
			}),
		null,
		{ timeout: 30_000 },
	);
	await page.waitForTimeout(2_000);
}

async function main(): Promise<void> {
	const only = new Set(process.argv.slice(2));
	const shots = only.size > 0 ? SHOTS.filter((shot) => only.has(shot.name)) : SHOTS;
	const crops = only.size > 0 ? CROPS.filter((crop) => only.has(crop.name)) : CROPS;
	const ids = await promptIds();
	mkdirSync(OUT_DIR, { recursive: true });
	mkdirSync(CROP_DIR, { recursive: true });

	const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
	try {
		const { page } = await openSession(browser);
		for (const shot of shots) {
			const path = typeof shot.path === "function" ? shot.path(ids) : shot.path;
			await page.goto(`${BRAND_PATH}${path}`);
			await settle(page);
			if (shot.prepare) {
				await shot.prepare(page);
				await settle(page);
			}
			await page.screenshot({ path: join(OUT_DIR, `${shot.name}.png`) });
			console.log(`Captured ${shot.name}`);
		}
		for (const crop of crops) {
			await page.setViewportSize(crop.viewport);
			await page.goto(`${BRAND_PATH}${crop.path}`);
			await settle(page);
			await page.screenshot({ path: join(CROP_DIR, `${crop.name}.png`), clip: crop.clip, fullPage: true });
			console.log(`Captured ${crop.name}`);
		}
	} finally {
		await browser.close();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
