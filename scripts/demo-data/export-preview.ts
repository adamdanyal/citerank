// Writes the sample data behind the marketing site's product screens, read from
// a dashboard running against the seeded demo database (see seed.ts):
//
//   DASHBOARD_URL=http://127.0.0.1:3100 pnpm exec tsx scripts/demo-data/export-preview.ts
//
// The marketing site shows the product as HTML, not as pictures of it. Those
// screens are built from this one file, so they say what the demo says. The
// address has to be the one the dashboard's APP_URL names, or sign-in fails.
// CHROMIUM_PATH points it at a Chromium of your own when Playwright's pinned
// build isn't installed.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import type { Page, Response } from "@playwright/test";
import { DEMO_BRAND, DEMO_ORG } from "./content";

const requireFromE2e = createRequire(join(__dirname, "../../e2e/package.json"));
const { chromium } = requireFromE2e("@playwright/test") as typeof import("@playwright/test");

const REPO = join(__dirname, "../..");
const DASHBOARD_URL = process.env.DASHBOARD_URL ?? "http://127.0.0.1:3100";
const OUT_FILE = join(REPO, "apps/www/src/data/product-preview.json");
const BRAND_PATH = `/app/org/${DEMO_ORG.slug}/brand/${DEMO_BRAND.slug}`;

const PAGES = [
	"",
	"/visibility",
	"/share-of-voice",
	"/sentiment",
	"/responses",
	"/responses?sentiment=mixed",
	"/responses?sentiment=negative",
	"/responses?sentiment=neutral",
	"/query-fan-out?tab=words",
	"/citations",
	"/opportunities",
];

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Row = Record<string, Json>;
interface Node {
	t: number;
	i?: number;
	s?: Json;
	a?: Node[];
	p?: { k: (string | Node)[]; v: Node[] };
}

/* The dashboard's server functions answer in seroval's node form, strings escaped as it writes them into a script. Only its plain kinds appear in these payloads. */
const CONSTANTS: Json[] = [null, null, true, false, 0, null, null, null];
const ESCAPED: Record<string, string> = {
	n: "\n",
	r: "\r",
	t: "\t",
	b: "\b",
	f: "\f",
	v: "\v",
	"0": "\0",
	x3C: "<",
	u2028: " ",
	u2029: " ",
};
const unescape = (text: string) =>
	text.replace(/\\(x3C|u2028|u2029|[\s\S])/g, (_, code: string) => ESCAPED[code] ?? code);

function decode(node: Node, refs = new Map<number, Json>()): Json {
	switch (node.t) {
		case 1:
			return unescape(String(node.s ?? ""));
		case 0:
		case 5:
			return node.s ?? null;
		case 2:
			return CONSTANTS[node.s as number] ?? null;
		case 4:
			return refs.get(node.i ?? -1) ?? null;
		case 9: {
			const array: Json[] = [];
			if (node.i !== undefined) refs.set(node.i, array);
			for (const item of node.a ?? []) array.push(decode(item, refs));
			return array;
		}
		case 10:
		case 11: {
			const object: Row = {};
			if (node.i !== undefined) refs.set(node.i, object);
			node.p?.k.forEach((key, index) => {
				const name = typeof key === "string" ? unescape(key) : String(decode(key, refs));
				const value = node.p?.v[index];
				if (value) object[name] = decode(value, refs);
			});
			return object;
		}
		default:
			return null;
	}
}

const round = (value: Json, places = 3) => Number(Number(value).toFixed(places));
const rows = (value: Json | undefined) => (Array.isArray(value) ? (value as Row[]) : []);
const row = (value: Json | undefined) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});
const strings = (value: Json | undefined) => (Array.isArray(value) ? value.map(String) : []);
const daysBefore = (later: string, earlier: Json) =>
	Math.max(0, Math.round((Date.parse(`${later}T12:00:00Z`) - Date.parse(String(earlier))) / 86_400_000));
const clock = (iso: Json) =>
	new Date(String(iso)).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		timeZone: "America/New_York",
	});

const METRICS = ["visibility", "share", "sentiment", "position"] as const;
const TONES = ["positive", "neutral", "mixed", "negative"] as const;
const SYSTEM_TAGS = new Set(["branded", "unbranded"]);
const topics = (tags: Json | undefined) => strings(tags).filter((tag) => !SYSTEM_TAGS.has(tag));

/*
 * An answer arrives as markdown, and each AI app writes it its own way: the
 * brands it picked sit under numbered headings, in a bulleted list or in
 * paragraphs that open with the name in bold.
 */
function answerText(markdown: string, brands: Set<string>, own: string) {
	const lines = markdown
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
	const plain = (text: string) =>
		text
			.replace(/\[\d+\]/g, "")
			.replace(/\*\*/g, "")
			.replace(/\s+/g, " ")
			.trim();
	const picks: { rank: number; name: string; line: string }[] = [];
	let intro = "";
	let title = "";
	lines.forEach((line, index) => {
		const heading = line.match(/^##\s+\d+\.\s+(.+)$/);
		const lead = line.match(/^(?:[*-]\s+)?\*\*([^*]+?)(?::\*\*|\*\*:)\s+(.+)$/);
		if (heading && brands.has(heading[1])) {
			picks.push({ rank: picks.length + 1, name: heading[1], line: plain(lines[index + 1] ?? "") });
		} else if (lead && brands.has(lead[1])) {
			picks.push({ rank: picks.length + 1, name: lead[1], line: plain(lead[2]) });
		} else if (line.startsWith("# ")) {
			title = plain(line.slice(2));
		} else if (!intro && picks.length === 0 && !line.startsWith("#")) {
			intro = plain(line);
		}
	});
	/* Three picks are enough to show the answer, as long as the tracked brand's own line is one of them. */
	const shown = picks.slice(0, 3);
	const ownPick = picks.find((pick) => pick.name === own);
	if (ownPick && !shown.includes(ownPick)) shown[shown.length - 1] = ownPick;
	return { title, intro: intro ? [intro] : [], picks: shown };
}

async function collect(page: Page, path: string): Promise<Row[]> {
	const calls: Row[] = [];
	const pending: Promise<void>[] = [];
	const onResponse = (response: Response) => {
		if (!response.url().includes("/_serverFn/")) return;
		pending.push(
			response
				.text()
				.then((text) => {
					const decoded = row(decode(JSON.parse(text) as Node));
					calls.push(row(decoded.result ?? decoded) as Row);
				})
				// A call that carries no data for these screens.
				.catch(() => undefined),
		);
	};
	page.on("response", onResponse);
	await page.goto(`${BRAND_PATH}${path}`);
	await page.waitForLoadState("networkidle");
	await page.waitForTimeout(2_500);
	page.off("response", onResponse);
	await Promise.all(pending);
	return calls;
}

async function main(): Promise<void> {
	const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
	try {
		const context = await browser.newContext({
			baseURL: DASHBOARD_URL,
			viewport: { width: 1280, height: 900 },
			locale: "en-US",
			timezoneId: "America/New_York",
		});
		const page = await context.newPage();
		const calls: Row[] = [];
		for (const path of PAGES) calls.push(...(await collect(page, path)));
		const find = (...keys: string[]) => {
			const hit = calls.find((call) => keys.every((key) => key in call));
			if (!hit) throw new Error(`The dashboard sent no data with ${keys.join(" and ")}. Has its layout changed?`);
			return hit;
		};

		const overview = find("cards", "landscape");
		const landscape = row(overview.landscape);
		const dates = strings(landscape.dates);
		const today = dates[dates.length - 1] ?? new Date().toISOString().slice(0, 10);
		const models = strings(landscape.models);
		const cards = row(overview.cards);

		const companies = rows(landscape.companies).map((company) => ({
			name: String(company.name),
			domain: String(company.domain),
			isBrand: Boolean(company.isBrand),
			totals: Object.fromEntries(METRICS.map((metric) => [metric, round(row(company.totals)[metric], 4)])),
			byModel: Object.fromEntries(
				models.map((model) => [
					model,
					Object.fromEntries(METRICS.map((metric) => [metric, round(row(row(company.byModel)[model])[metric], 4)])),
				]),
			),
			series: Object.fromEntries(
				METRICS.map((metric) => [
					metric,
					(Array.isArray(row(company.series)[metric]) ? (row(company.series)[metric] as Json[]) : []).map((value) =>
						round(value, 2),
					),
				]),
			),
		}));

		const brand = find("trackedTargets");
		const share = find("entries", "brandShare");
		const answers = calls.filter((call) => "matches" in call).flatMap((call) => rows(call.matches));
		const counts = find("positive", "unmentioned", "all");
		const report = row(find("report").report);
		const sentiment = find("praise", "criticism");
		const citations = find("totalCitations", "categoryCounts", "citationTimeSeries");
		const domains = calls
			.filter((call) => rows(call.items).some((item) => "domain" in item && !("url" in item)))
			.sort((a, b) => rows(b.items).length - rows(a.items).length)[0];
		const fanout = find("terms", "topQueries", "wordChanges");
		const visibility = find("currentVisibilityPct", "visibilityTimeSeries");
		const chart = find("chartData", "competitors");
		const promptList = rows(find("prompts", "availableTags").prompts);

		const brandName = companies.find((company) => company.isBrand)?.name ?? DEMO_BRAND.name;
		const tone = row(rows(landscape.companies).find((company) => company.isBrand)?.sentiments);
		const toneTotal = TONES.reduce((sum, key) => sum + Number(tone[key] ?? 0), 0);

		const passages = (list: Json | undefined) =>
			rows(list)
				.slice(0, 3)
				.map((item) => ({
					model: String(item.model),
					passage: String(item.passage),
					prompt: String(item.prompt),
					sentiment: String(item.sentiment),
					daysAgo: daysBefore(today, item.createdAt),
				}));

		const categoryTotals = row(citations.categoryCounts);
		const categories = Object.entries(categoryTotals)
			.map(([key, count]) => ({ key, count: Number(count) }))
			.filter((category) => category.count > 0)
			.sort((a, b) => b.count - a.count);
		const citationDays = rows(citations.citationTimeSeries);

		/* One answer of each kind, so every filter on the responses screen has something to show. */
		const answerOf = new Map<string, Row>();
		for (const match of answers) {
			const kind = match.brandMentioned ? String(row(row(match.mentionAssessments).brand).sentiment) : "unmentioned";
			if (!answerOf.has(kind)) answerOf.set(kind, match);
		}
		const responses = [...TONES, "unmentioned"].flatMap((kind) => {
			const match = answerOf.get(kind);
			if (!match) return [];
			const assessed = row(match.mentionAssessments);
			const named = [
				{ name: brandName, ...row(assessed.brand) } as Row,
				...Object.entries(row(assessed.competitors)).map(([name, value]) => ({ name, ...row(value) }) as Row),
			]
				.filter((item) => item.mentioned)
				.map((item) => ({ name: String(item.name), rank: Number(item.position), sentiment: String(item.sentiment) }))
				.sort((a, b) => a.rank - b.rank);
			return [
				{
					kind,
					prompt: String(match.promptValue),
					model: String(match.model),
					version: String(match.version),
					daysAgo: daysBefore(today, match.createdAt),
					time: clock(match.createdAt),
					webQueries: strings(match.webQueries),
					brands: named,
					...answerText(String(match.textContent), new Set(companies.map((company) => company.name)), brandName),
				},
			];
		});

		const chartRows = rows(chart.chartData);
		const chartDates = [...new Set(chartRows.map((item) => String(item.date)))].sort();
		const promptCharts = [...promptList]
			.filter((prompt) => !strings(prompt.tags).includes("branded"))
			.sort((a, b) => Number(b.brandMentionPct) - Number(a.brandMentionPct))
			.slice(0, 2)
			.map((prompt) => {
				const days = chartRows.filter((item) => item.prompt_id === prompt.id);
				const byDate = new Map(days.map((item) => [String(item.date), item]));
				const rivals = new Map<string, number>();
				for (const day of days) {
					for (const [name, count] of Object.entries(row(day.competitor_counts))) {
						rivals.set(name, (rivals.get(name) ?? 0) + Number(count));
					}
				}
				const names = [...rivals.entries()]
					.sort((a, b) => b[1] - a[1])
					.slice(0, 3)
					.map(([name]) => name);
				const line = (pick: (day: Row) => number) =>
					chartDates.map((date) => {
						const day = byDate.get(date);
						return day ? Math.round((100 * pick(day)) / Math.max(1, Number(day.total_runs))) : null;
					});
				return {
					value: String(prompt.value),
					pct: Number(prompt.brandMentionPct),
					tags: topics(prompt.tags),
					lines: [
						{ name: brandName, series: line((day) => Number(day.brand_mentioned_count)) },
						...names.map((name) => ({
							name,
							series: line((day) => Number(row(day.competitor_counts)[name] ?? 0)),
						})),
					],
				};
			});

		const preview = {
			brand: brandName,
			totals: { prompts: Number(overview.totalPrompts), runs: Number(overview.totalRuns) },
			models,
			days: dates.length,
			cards: Object.fromEntries(
				METRICS.map((metric) => [
					metric,
					{ value: round(row(cards[metric]).value, 4), change: round(row(cards[metric]).change, 4) },
				]),
			),
			companies,
			leaderboard: rows(share.entries).map((entry) => ({
				name: String(entry.name),
				mentions: Number(entry.mentions),
				share: round(entry.share, 4),
				prompts: Number(entry.prompts),
			})),
			responseCounts: Object.fromEntries([...TONES, "unmentioned", "all"].map((key) => [key, Number(counts[key])])),
			responses,
			opportunities: {
				summary: strings(report.summary),
				evaluatedDaysAgo: daysBefore(today, find("report").lastEvaluatedAt),
				items: rows(report.opportunities).map((item) => ({
					category: String(item.category),
					title: String(item.title),
					why: String(item.why),
					prompts: rows(item.relatedPrompts).length,
					yours: rows(item.yourCitations).length,
					theirs: rows(item.competitorCitations).length,
				})),
			},
			sentiment: {
				breakdown: Object.fromEntries(
					TONES.map((key) => [key, Math.round((100 * Number(tone[key] ?? 0)) / Math.max(1, toneTotal))]),
				),
				passages: {
					praise: passages(sentiment.praise),
					mixed: passages(sentiment.mixed),
					criticism: passages(sentiment.criticism),
				},
			},
			citations: {
				total: Number(citations.totalCitations),
				uniqueDomains: Number(citations.uniqueDomains),
				brandSharePct: Number(citationDays[citationDays.length - 1]?.brand ?? 0),
				categories,
				series: Object.fromEntries(
					categories.map((category) => [category.key, citationDays.map((day) => Number(day[category.key] ?? 0))]),
				),
				domains: rows(domains?.items)
					.slice(0, 8)
					.map((item) => ({ domain: String(item.domain), count: Number(item.count), category: String(item.category) })),
			},
			fanout: {
				runs: Number(fanout.totalRuns),
				knownRuns: Number(fanout.fanoutRuns),
				average: Number(fanout.avgQueriesPerFanoutRun),
				availability: rows(brand.trackedTargets).map((target) => ({
					model: String(target.model),
					status: String(row(target.fanout).status),
				})),
				terms: rows(fanout.terms)
					.slice(0, 40)
					.map((item) => ({ term: String(item.term), count: Number(item.count) })),
				topQueries: rows(fanout.topQueries)
					.slice(0, 6)
					.map((item) => ({
						query: String(item.query),
						count: Number(item.count),
						brandPct: Number(item.brandMentionPct),
					})),
				added: rows(row(fanout.wordChanges).added)
					.filter((word) => !word.isStop)
					.slice(0, 5)
					.map((word) => ({ word: String(word.word), count: Number(word.count), sharePct: Number(word.sharePct) })),
			},
			visibility: {
				pct: Number(visibility.currentVisibilityPct),
				citations: Number(visibility.totalCitations),
				prompts: promptCharts,
			},
			prompts: promptList
				.map((prompt) => ({
					value: String(prompt.value),
					branded: strings(prompt.tags).includes("branded"),
					tags: topics(prompt.tags),
					pct: Number(prompt.brandMentionPct),
				}))
				.sort((a, b) => b.pct - a.pct || a.value.localeCompare(b.value))
				.slice(0, 8),
		};

		writeFileSync(OUT_FILE, `${JSON.stringify(preview)}\n`);
		execFileSync("pnpm", ["exec", "biome", "format", "--write", OUT_FILE], { cwd: REPO, stdio: "inherit" });
		console.log(`Wrote ${OUT_FILE}`);
	} finally {
		await browser.close();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
