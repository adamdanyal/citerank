// Draws the home page's share image, apps/www/public/og-home.png, from the
// marketing site's own hero: its logo, its headline and its product screen,
// which is HTML. Nothing in the card is a picture of the dashboard, so
// run it again whenever the hero's words or the sample data change:
//
//   SITE_URL=http://localhost:3001 pnpm exec tsx scripts/demo-data/share-card.ts
//
// The marketing site has to be running at SITE_URL. CHROMIUM_PATH points this
// at a Chromium of your own when Playwright's pinned build isn't installed.
import { createRequire } from "node:module";
import { join } from "node:path";

const requireFromE2e = createRequire(join(__dirname, "../../e2e/package.json"));
const { chromium } = requireFromE2e("@playwright/test") as typeof import("@playwright/test");

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3001";
const OUT_FILE = join(__dirname, "../../apps/www/public/og-home.png");
/* The size every link preview asks for. */
const CARD = { width: 1200, height: 630 };

async function main(): Promise<void> {
	const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
	try {
		const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
		await page.goto(SITE_URL);
		await page.waitForLoadState("networkidle");
		await page.evaluate(() => document.fonts.ready);

		await page.evaluate(({ width, height }) => {
			const product = document.querySelector<HTMLElement>('main figure[data-kind="product"]');
			const logo = document.querySelector<HTMLElement>("header nav a span");
			const title = document.querySelector("h1")?.textContent ?? "";
			if (!product || !logo || !title) throw new Error("The home page's hero has changed: no product, logo or headline found.");

			const card = document.createElement("div");
			card.style.cssText = `position:fixed;left:0;top:0;width:${width}px;height:${height}px;z-index:2147483647;overflow:hidden;background:var(--color-ink);color:var(--color-paper);`;

			/* The logo stands level with the top of the screen and the headline with its foot. */
			const text = document.createElement("div");
			text.style.cssText =
				"position:absolute;left:64px;top:68px;bottom:70px;width:500px;display:flex;flex-direction:column;justify-content:space-between;";
			const mark = logo.cloneNode(true) as HTMLElement;
			mark.style.cssText = "font-size:32px;color:var(--color-paper);";
			const head = document.createElement("p");
			head.textContent = title;
			head.style.cssText =
				"font-family:var(--font-display);font-weight:700;font-size:96px;line-height:0.98;letter-spacing:-0.025em;text-wrap:balance;";
			text.append(mark, head);

			/*
			 * The screen at a phone's width lays its four figures out two by two, large
			 * enough to read in a preview. It keeps the figures and the chart and drops
			 * what a card has no room for: the tabs, the table, the note under it, and
			 * the chart's dates, which would go stale in a file.
			 */
			const screen = product.cloneNode(true) as HTMLElement;
			for (const part of screen.querySelectorAll("nav, figcaption, table")) part.remove();
			for (const chart of screen.querySelectorAll('div[data-kind="chart"]')) chart.parentElement?.lastElementChild?.remove();
			screen.style.cssText = "position:absolute;left:624px;top:68px;width:512px;";

			card.append(text, screen);
			document.body.append(card);
		}, CARD);

		await page.waitForTimeout(400);
		await page.screenshot({ path: OUT_FILE, clip: { x: 0, y: 0, ...CARD } });
		console.log(`Wrote ${OUT_FILE}`);
	} finally {
		await browser.close();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
