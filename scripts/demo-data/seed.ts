// Seeds the fictional Quaildesk brand the marketing screenshots show: 20 buyer
// questions, 30 days of answers from five AI apps with mentions, sentiment,
// positions, citations and fan-out queries, an Opportunities report, and the
// rollups the dashboard reads. It empties the database first, so it refuses
// anything but a local database whose name ends in _demo.
//
//   DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5437/citerank_demo \
//     pnpm exec tsx scripts/demo-data/seed.ts
//
// Dates are relative to now, so rerun it before capturing new screenshots.
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { join } from "node:path";
import { createDb } from "../../packages/lib/src/db/db";
import {
	type MentionAssessment,
	type RunMentionAssessments,
	subjectFingerprint,
	wholeWordPattern,
} from "../../packages/lib/src/mentions";
import { resolveUnpagedCitations } from "../../packages/lib/src/rollups/citation-pages";
import { markRunsDirty, refreshAllMarked } from "../../packages/lib/src/rollups/dirty";
import { computeSystemTags } from "../../packages/lib/src/tag-utils";
import {
	BRAND,
	BRAND_PRAISE,
	CLOSINGS,
	COMPETITORS,
	type Company,
	DEMO_BRAND,
	DEMO_LOGIN,
	DEMO_ORG,
	type DemoPrompt,
	GENERIC_ADVICE,
	LONG_TAIL,
	OPPORTUNITIES,
	PROMPTS,
	type Sentiment,
	SOURCES,
	type Source,
	type Theme,
} from "./content";

// The e2e package already depends on these; the repo root does not.
const requireFromE2e = createRequire(join(__dirname, "../../e2e/package.json"));
const { hashPassword } = requireFromE2e("@better-auth/utils/password") as {
	hashPassword: (password: string) => Promise<string>;
};

const DATABASE_URL = process.env.DATABASE_URL ?? "";
assertDemoDatabase(DATABASE_URL);

const HOUR = 3_600_000;
const DAYS = 30;
const RUNS_PER_DAY = 2;
const SLOTS = DAYS * RUNS_PER_DAY;
const JUDGE = "demo-seed";

interface ModelProfile {
	model: string;
	provider: string;
	version: string;
	/** Multiplies how often competitors are named. */
	reach: number;
	/** Multiplies how often the brand is named. */
	brandBias: number;
	maxListed: number;
	citations: [number, number];
	queries: [number, number];
	style: Style;
}

type Style = "chatgpt" | "perplexity" | "gemini" | "overview" | "claude";

const MODELS: ModelProfile[] = [
	{
		model: "chatgpt",
		provider: "olostep",
		version: "gpt-6-luna",
		reach: 1,
		brandBias: 1.08,
		maxListed: 6,
		citations: [3, 6],
		queries: [1, 3],
		style: "chatgpt",
	},
	{
		model: "gemini",
		provider: "olostep",
		version: "gemini-2.5-flash",
		reach: 0.96,
		brandBias: 0.94,
		maxListed: 5,
		citations: [3, 6],
		queries: [1, 2],
		style: "gemini",
	},
	{
		model: "perplexity",
		provider: "dataforseo",
		version: "sonar",
		reach: 1.04,
		brandBias: 1.1,
		maxListed: 6,
		citations: [5, 8],
		queries: [2, 4],
		style: "perplexity",
	},
	{
		model: "google-ai-overview",
		provider: "olostep",
		version: "ai-overview",
		reach: 0.86,
		brandBias: 0.84,
		maxListed: 4,
		citations: [3, 6],
		queries: [0, 0],
		style: "overview",
	},
	{
		model: "bing-ai-mode",
		provider: "cloro",
		version: "bing-ai-mode",
		reach: 0.88,
		brandBias: 0.82,
		maxListed: 5,
		citations: [3, 6],
		queries: [0, 0],
		style: "overview",
	},
	{
		model: "claude",
		provider: "anthropic-api",
		version: "claude-haiku-5-5",
		reach: 0.9,
		brandBias: 0.9,
		maxListed: 5,
		citations: [2, 5],
		queries: [1, 2],
		style: "claude",
	},
];

/** Some assistants lean on some vendors more than others. */
const MODEL_TILT: Record<string, Partial<Record<string, number>>> = {
	Queueloft: { gemini: 1.12, "google-ai-overview": 1.16, "bing-ai-mode": 1.14 },
	Northqueue: { claude: 1.18 },
	Lumenreply: { perplexity: 1.12 },
	Brookdesk: { "google-ai-overview": 1.1 },
};

/** `t` runs from 0 (30 days ago) to 1 (now). The brand's visibility is climbing. */
const TRENDS: Record<string, (t: number) => number> = {
	Quaildesk: (t) => 0.84 + 0.3 * t,
	Queueloft: (t) => 1.06 - 0.12 * t,
	Caseorchard: (t) => 0.92 + 0.14 * t,
};

const LEAD_INS = [
	"Here are the tools that come up most often, with what each does best.",
	"These are the options worth shortlisting, based on reviews, pricing and fit.",
];

/** The newest answers, written out so the Responses and prompt history captures show a full ChatGPT answer. */
const FEATURED: { prompt: string; minutesAgo: number; lineup: [string, Sentiment][] }[] = [
	{
		prompt: "Best help desk software for B2B SaaS companies",
		minutesAgo: 32,
		lineup: [
			["Quaildesk", "positive"],
			["Queueloft", "mixed"],
			["Ticketwren", "positive"],
			["Brookdesk", "neutral"],
			["Caseorchard", "positive"],
			["Lumenreply", "positive"],
		],
	},
	{
		prompt: "Help desk software with AI agents that resolve tickets",
		minutesAgo: 38,
		lineup: [
			["Quaildesk", "positive"],
			["Caseorchard", "positive"],
			["Queueloft", "mixed"],
			["Lumenreply", "positive"],
			["Brookdesk", "mixed"],
		],
	},
];

const ALL_COMPANIES = [BRAND, ...COMPETITORS];
const SENTIMENTS: Sentiment[] = ["positive", "neutral", "mixed", "negative"];

const random = mulberry32(20261031);

function mulberry32(seed: number): () => number {
	let state = seed;
	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)];
const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value * 1000) / 1000;

function gaussian(): number {
	const u = 1 - random();
	const v = random();
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function shuffle<T>(items: readonly T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function sample<T>(mix: Record<string, number>): T {
	const entries = Object.entries(mix);
	let roll = random() * entries.reduce((sum, [, weight]) => sum + weight, 0);
	for (const [key, weight] of entries) {
		roll -= weight;
		if (roll <= 0) return key as T;
	}
	return entries[entries.length - 1][0] as T;
}

function assertDemoDatabase(url: string): void {
	const parsed = url ? new URL(url) : null;
	const local = parsed && ["localhost", "127.0.0.1"].includes(parsed.hostname);
	if (!local || !parsed.pathname.endsWith("_demo")) {
		throw new Error("Refusing to seed: DATABASE_URL must name a local database whose name ends in _demo.");
	}
}

/** A smooth day-to-day wobble per company, so trend lines move like real data. */
const wobbles = new Map(
	ALL_COMPANIES.map((company) => {
		const series: number[] = [];
		let value = 0;
		for (let slot = 0; slot < SLOTS; slot++) {
			value = 0.8 * value + gaussian() * 0.05;
			series.push(value);
		}
		return [company.name, series];
	}),
);

const THEMES = new Set<string>(Object.keys(CLOSINGS));

function themesOf(prompt: DemoPrompt): Theme[] {
	return [...new Set([prompt.theme, ...prompt.tags.filter((tag): tag is Theme => THEMES.has(tag))])];
}

function rateFor(company: Company, prompt: DemoPrompt, profile: ModelProfile, slot: number): number {
	const fixed = prompt.rates?.[company.name];
	if (fixed !== undefined) return fixed;
	const boost = themesOf(prompt).reduce((sum, theme) => sum + (company.boosts[theme] ?? 0), 0);
	const t = 1 - slot / (SLOTS - 1);
	const reach = company === BRAND ? profile.brandBias : profile.reach;
	const tilt = MODEL_TILT[company.name]?.[profile.model] ?? 1;
	const trend = TRENDS[company.name]?.(t) ?? 1;
	const wobble = 1 + (wobbles.get(company.name)?.[slot] ?? 0);
	return clamp((company.base + boost) * (prompt.othersScale ?? 1) * reach * tilt * trend * wobble, 0.02, 0.97);
}

const FALLBACK: Record<Sentiment, Sentiment[]> = {
	positive: ["positive", "neutral"],
	neutral: ["neutral", "positive"],
	mixed: ["mixed", "neutral", "positive"],
	negative: ["negative", "mixed", "neutral", "positive"],
};

interface Blurb {
	text: string;
	sentiment: Sentiment;
	/** The question's own praise line, which the judge is surest of. */
	strong?: boolean;
}

/** The blurb that carries a company's sentiment, preferring one written for the question's theme. */
function blurbFor(company: Company, prompt: DemoPrompt, sentiment: Sentiment): Blurb {
	const praise = BRAND_PRAISE[prompt.value];
	if (company === BRAND && sentiment === "positive" && praise && random() < 0.45) {
		return { text: praise, sentiment, strong: true };
	}
	for (const tone of FALLBACK[sentiment]) {
		const byTheme = company.blurbs[tone];
		if (!byTheme) continue;
		const themed = themesOf(prompt).find((theme) => byTheme[theme]?.length);
		const options = themed && random() < 0.75 ? byTheme[themed] : (byTheme.general ?? (themed && byTheme[themed]));
		if (options?.length) return { text: pick(options), sentiment: tone };
	}
	throw new Error(`No blurb for ${company.name}`);
}

interface Entry extends Blurb {
	company: Company;
}

interface Span {
	start: number;
	end: number;
}

class Answer {
	text = "";
	readonly passages = new Map<string, { span: Span; sentiment: Sentiment; strong: boolean }>();

	add(text: string): this {
		this.text += text;
		return this;
	}

	blurb(entry: Entry): this {
		const start = this.text.length;
		this.text += entry.text;
		this.passages.set(entry.company.name, {
			span: { start, end: this.text.length },
			sentiment: entry.sentiment,
			strong: entry.strong === true,
		});
		return this;
	}
}

const firstSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;

function citationMarkers(count: number): string {
	if (count === 0) return "";
	const first = between(1, count);
	const second = between(1, count);
	return first === second ? ` [${first}]` : ` [${Math.min(first, second)}][${Math.max(first, second)}]`;
}

function writeAnswer(prompt: DemoPrompt, profile: ModelProfile, entries: Entry[], citationCount: number): Answer {
	const answer = new Answer();
	const closing = pick(CLOSINGS[prompt.theme]);
	const howTo = prompt.namesVendors !== undefined;
	const advice = GENERIC_ADVICE[prompt.theme] ?? GENERIC_ADVICE.general;

	switch (profile.style) {
		case "chatgpt": {
			answer.add(`# ${prompt.title}\n\n${prompt.intro}\n\n`);
			if (howTo || entries.length === 0) answer.add(`${advice}\n\n`);
			if (entries.length > 0) answer.add(howTo ? "## Tools that help\n\n" : `${pick(LEAD_INS)}\n\n`);
			entries.forEach((entry, i) => {
				answer.add(`## ${i + 1}. ${entry.company.name}\n\n`).blurb(entry);
				answer.add(`\n\n**Best for:** ${entry.company.bestFor}\n\n`);
			});
			answer.add(`**Bottom line:** ${closing}`);
			break;
		}
		case "perplexity": {
			answer.add(`${prompt.intro}${citationMarkers(citationCount)}\n\n`);
			if (howTo || entries.length === 0) answer.add(`${advice}\n\n`);
			if (entries.length > 0) answer.add(howTo ? "## Tools to consider\n\n" : "## Top options\n\n");
			for (const entry of entries) {
				answer.add(`- **${entry.company.name}**: `).blurb(entry);
				answer.add(`${citationMarkers(citationCount)}\n`);
			}
			answer.add(`\n${closing}${citationMarkers(citationCount)}`);
			break;
		}
		case "gemini": {
			answer.add(`${prompt.intro}\n\n`);
			if (howTo || entries.length === 0) answer.add(`${advice}\n\n`);
			if (entries.length > 0) answer.add("Here are the options most often recommended:\n\n");
			for (const entry of entries) {
				answer.add(`* **${entry.company.name}:** `).blurb(entry);
				answer.add(`\n    * **Best for:** ${entry.company.bestFor}\n`);
			}
			answer.add(`\n### Things to consider\n\n${closing}`);
			break;
		}
		case "overview": {
			answer.add(`${firstSentence(prompt.intro)}\n\n`);
			if (entries.length === 0) answer.add(`${advice}\n\n`);
			for (const entry of entries) {
				answer.add(`* **${entry.company.name}:** `).blurb(entry);
				answer.add("\n");
			}
			answer.add(`\n${closing}`);
			break;
		}
		case "claude": {
			answer.add(`${prompt.intro}\n\n`);
			if (howTo || entries.length === 0) answer.add(`${advice}\n\n`);
			for (const entry of entries) {
				answer.add(`**${entry.company.name}**: `).blurb(entry);
				answer.add(` It's a good fit for ${entry.company.bestFor}.\n\n`);
			}
			answer.add(closing);
			break;
		}
	}
	return answer;
}

function chooseEntries(prompt: DemoPrompt, profile: ModelProfile, slot: number): Entry[] {
	if (random() > (prompt.namesVendors ?? 1)) return [];
	return ALL_COMPANIES.map((company) => ({ company, rate: rateFor(company, prompt, profile, slot) }))
		.filter(({ rate }) => random() < rate)
		.map((candidate) => ({ ...candidate, score: candidate.rate + gaussian() * 0.18 }))
		.sort((a, b) => b.score - a.score)
		.slice(0, profile.maxListed)
		.map(({ company }) => {
			const mix = company.sentimentByTheme?.[prompt.theme] ?? company.sentiment;
			const blurb = blurbFor(company, prompt, sample<Sentiment>(mix));
			return { company, ...blurb };
		});
}

function sentenceAround(text: string, index: number): Span {
	const before = text.slice(0, index);
	const start = Math.max(before.lastIndexOf(". ") + 2, before.lastIndexOf("\n") + 1, 0);
	const rest = text.slice(index);
	const stop = rest.search(/[.!?](\s|$)|\n/);
	return { start, end: stop === -1 ? text.length : index + stop + 1 };
}

function assess(
	sentiment: Sentiment,
	passage: Span,
	mentions: number[],
	position: number,
	strong = false,
): MentionAssessment {
	const confidence = strong ? 0.9 + random() * 0.08 : 0.6 + random() * 0.3;
	const rest = SENTIMENTS.filter((s) => s !== sentiment);
	const weights = rest.map(() => random());
	const total = weights.reduce((sum, w) => sum + w, 0);
	const sentimentProbabilities: Record<string, number> = { [sentiment]: round(confidence) };
	rest.forEach((s, i) => {
		sentimentProbabilities[s] = round(((1 - confidence) * weights[i]) / total);
	});
	return {
		mentioned: true,
		probability: round(0.9 + random() * 0.09),
		sentiment,
		sentimentProbabilities,
		passage,
		firstMention: mentions[0],
		mentionCount: mentions.length,
		position,
	};
}

const fingerprints = {
	brand: subjectFingerprint({ name: BRAND.name, aliases: [], domains: [BRAND.domain] }, JUDGE),
	competitors: Object.fromEntries(
		COMPETITORS.map((c) => [c.name, subjectFingerprint({ name: c.name, aliases: [], domains: [c.domain] }, JUDGE)]),
	),
};

/** Mentions come from the finished text, as the judge would read it, so every name in an answer counts. */
function judge(answer: Answer): { brandMentioned: boolean; competitors: string[]; assessments: RunMentionAssessments } {
	const found = ALL_COMPANIES.map((company) => ({
		company,
		mentions: [...answer.text.matchAll(wholeWordPattern(company.name))].map((match) => match.index ?? 0),
	}))
		.filter(({ mentions }) => mentions.length > 0)
		.sort((a, b) => a.mentions[0] - b.mentions[0]);

	const assessments: RunMentionAssessments = { competitors: {}, judged: fingerprints };
	found.forEach(({ company, mentions }, i) => {
		const passage = answer.passages.get(company.name);
		const assessment = passage
			? assess(passage.sentiment, passage.span, mentions, i + 1, passage.strong)
			: assess("neutral", sentenceAround(answer.text, mentions[0]), mentions, i + 1);
		if (company === BRAND) assessments.brand = assessment;
		else assessments.competitors[company.name] = assessment;
	});

	return {
		brandMentioned: assessments.brand !== undefined,
		competitors: found.filter(({ company }) => company !== BRAND).map(({ company }) => company.name),
		assessments,
	};
}

function sourceWeight(source: Source, themes: Theme[]): number {
	const matches = source.themes.filter((theme) => themes.includes(theme)).length;
	if (matches > 0) return 1 + matches;
	return source.themes.includes("general") ? 0.3 : 0;
}

function citationsFor(prompt: DemoPrompt, profile: ModelProfile, entries: Entry[], slot: number): Source[] {
	const count = between(...profile.citations);
	const themes = themesOf(prompt);
	const t = 1 - slot / (SLOTS - 1);
	const listed = new Set(entries.map((entry) => entry.company.name));
	const pool: { source: Source; weight: number }[] = [
		...SOURCES.map((source) => ({ source, weight: sourceWeight(source, themes) })),
		...LONG_TAIL.map((source) => ({ source, weight: sourceWeight(source, themes) * 0.2 })),
	];
	for (const company of ALL_COMPANIES) {
		const named = listed.has(company.name);
		const lift = company === BRAND ? 0.5 + 0.7 * t : 0.8;
		for (const page of company.pages) {
			const weight = sourceWeight(page, themes) * lift * (named ? 1 : 0.15);
			pool.push({ source: page, weight });
		}
	}

	const chosen: Source[] = [];
	const candidates = pool.filter(({ weight }) => weight > 0);
	while (chosen.length < count && candidates.length > 0) {
		let roll = random() * candidates.reduce((sum, { weight }) => sum + weight, 0);
		const index = candidates.findIndex(({ weight }) => {
			roll -= weight;
			return roll <= 0;
		});
		const [taken] = candidates.splice(index === -1 ? candidates.length - 1 : index, 1);
		chosen.push(taken.source);
	}
	return chosen;
}

interface RunRow {
	id: string;
	promptId: string;
	model: string;
	provider: string;
	version: string;
	webQueries: string[];
	text: string;
	citations: Source[];
	mentions: ReturnType<typeof judge>;
	createdAt: Date;
}

function buildRun(
	prompt: DemoPrompt,
	promptId: string,
	profile: ModelProfile,
	slot: number,
	createdAt: Date,
	lineup?: [string, Sentiment][],
): RunRow {
	const entries = lineup
		? lineup.map(([name, sentiment]) => {
				const company = ALL_COMPANIES.find((c) => c.name === name);
				if (!company) throw new Error(`Unknown company ${name}`);
				return { company, ...blurbFor(company, prompt, sentiment) };
			})
		: chooseEntries(prompt, profile, slot);
	const citations = citationsFor(prompt, profile, entries, slot);
	const answer = writeAnswer(prompt, profile, entries, citations.length);
	const queryCount = between(...profile.queries);
	return {
		id: randomUUID(),
		promptId,
		model: profile.model,
		provider: profile.provider,
		version: profile.version,
		webQueries: shuffle(prompt.queries).slice(0, queryCount),
		text: answer.text,
		citations,
		mentions: judge(answer),
		createdAt,
	};
}

function buildRuns(promptIds: Map<string, string>, now: number): RunRow[] {
	const runs: RunRow[] = [];
	PROMPTS.forEach((prompt, promptIndex) => {
		const promptId = promptIds.get(prompt.value) as string;
		const featured = FEATURED.find((f) => f.prompt === prompt.value);
		MODELS.forEach((profile, modelIndex) => {
			for (let slot = 0; slot < SLOTS; slot++) {
				if (featured && slot === 0 && profile.model === "chatgpt") {
					runs.push(buildRun(prompt, promptId, profile, slot, new Date(now - featured.minutesAgo * 60_000), featured.lineup));
					continue;
				}
				const offset = 50 * 60_000 + slot * (24 / RUNS_PER_DAY) * HOUR + promptIndex * 90_000 + modelIndex * 20_000;
				const createdAt = new Date(now - offset - Math.floor(random() * 25 * 60_000));
				runs.push(buildRun(prompt, promptId, profile, slot, createdAt));
			}
		});
	});
	return runs;
}

type Client = ReturnType<typeof createDb>["$client"];

async function insertRows(client: Client, table: string, columns: string[], rows: unknown[][]): Promise<void> {
	const perStatement = Math.floor(60_000 / columns.length);
	for (let i = 0; i < rows.length; i += perStatement) {
		const chunk = rows.slice(i, i + perStatement);
		const values = chunk.map(
			(row, r) => `(${row.map((_, c) => `$${r * columns.length + c + 1}`).join(", ")})`,
		);
		await client.query(`INSERT INTO ${table} (${columns.join(", ")}) VALUES ${values.join(", ")}`, chunk.flat());
	}
}

async function reset(client: Client): Promise<void> {
	await client.query(`TRUNCATE
		brand_opportunities, citations, run_mentions, run_extractions, prompt_runs,
		rollup_prompt_runs, rollup_competitor_mentions, rollup_citation_urls, rollup_citation_pages,
		rollup_web_queries, rollup_sentiment_quotes, rollup_dirty, cited_pages,
		prompts, competitors, brands, member, session, account, "user", organization
		CASCADE`);
}

async function seedAccount(client: Client, now: Date): Promise<void> {
	const userId = randomUUID();
	await client.query("INSERT INTO organization (id, name, slug, created_at) VALUES ($1, $2, $3, $4)", [
		DEMO_ORG.id,
		DEMO_ORG.name,
		DEMO_ORG.slug,
		now,
	]);
	await client.query(
		`INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
		 VALUES ($1, $2, $3, true, $4, $4)`,
		[userId, DEMO_LOGIN.name, DEMO_LOGIN.email, now],
	);
	await client.query(
		`INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
		 VALUES ($1, $2, 'credential', $2, $3, $4, $4)`,
		[randomUUID(), userId, await hashPassword(DEMO_LOGIN.password), now],
	);
	await client.query(
		"INSERT INTO member (id, organization_id, user_id, role, created_at) VALUES ($1, $2, $3, 'owner', $4)",
		[randomUUID(), DEMO_ORG.id, userId, now],
	);
}

async function seedBrand(client: Client, createdAt: Date): Promise<Map<string, string>> {
	await client.query(
		`INSERT INTO brands (id, organization_id, slug, name, website, enabled, onboarded, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, true, true, $6, $6)`,
		[DEMO_BRAND.id, DEMO_ORG.id, DEMO_BRAND.slug, BRAND.name, `https://${BRAND.domain}`, createdAt],
	);
	await insertRows(
		client,
		"competitors",
		["brand_id", "name", "domains", "created_at", "updated_at"],
		COMPETITORS.map((c) => [DEMO_BRAND.id, c.name, [c.domain], createdAt, createdAt]),
	);
	const promptIds = new Map(PROMPTS.map((p) => [p.value, randomUUID()]));
	await insertRows(
		client,
		"prompts",
		["id", "brand_id", "value", "enabled", "tags", "system_tags", "created_at", "updated_at"],
		PROMPTS.map((p) => [
			promptIds.get(p.value),
			DEMO_BRAND.id,
			p.value,
			true,
			p.tags,
			computeSystemTags(p.value, BRAND.name, `https://${BRAND.domain}`),
			createdAt,
			createdAt,
		]),
	);
	return promptIds;
}

async function seedRuns(client: Client, runs: RunRow[]): Promise<number> {
	await insertRows(
		client,
		"prompt_runs",
		["id", "prompt_id", "brand_id", "model", "provider", "version", "web_search_enabled", "raw_output", "web_queries", "created_at"],
		runs.map((run) => [
			run.id,
			run.promptId,
			DEMO_BRAND.id,
			run.model,
			run.provider,
			run.version,
			true,
			JSON.stringify({ response: run.text, sources: run.citations.map((c) => c.url) }),
			run.webQueries,
			run.createdAt,
		]),
	);
	await insertRows(
		client,
		"run_extractions",
		["run_id", "text_content"],
		runs.map((run) => [run.id, run.text]),
	);
	await insertRows(
		client,
		"run_mentions",
		["run_id", "brand_mentioned", "competitors_mentioned", "assessments"],
		runs.map((run) => [
			run.id,
			run.mentions.brandMentioned,
			run.mentions.competitors,
			JSON.stringify(run.mentions.assessments),
		]),
	);
	const citations = runs.flatMap((run) =>
		run.citations.map((source, index) => [
			run.id,
			run.promptId,
			DEMO_BRAND.id,
			run.model,
			source.url,
			new URL(source.url).hostname.replace(/^www\./, ""),
			source.title,
			index,
			run.createdAt,
		]),
	);
	await insertRows(
		client,
		"citations",
		["prompt_run_id", "prompt_id", "brand_id", "model", "url", "domain", "title", "citation_index", "created_at"],
		citations,
	);
	return citations.length;
}

function pageFor(url: string): { title: string; domain: string; url: string } {
	const page = [...ALL_COMPANIES.flatMap((c) => c.pages), ...SOURCES, ...LONG_TAIL].find((p) => p.url === url);
	if (!page) throw new Error(`Unknown page ${url}`);
	return { title: page.title, domain: new URL(url).hostname.replace(/^www\./, ""), url };
}

async function seedOpportunities(client: Client, promptIds: Map<string, string>, createdAt: Date): Promise<void> {
	const report = {
		summary: OPPORTUNITIES.summary,
		risks: OPPORTUNITIES.risks,
		opportunities: OPPORTUNITIES.opportunities.map(({ prompts, pages, ...opportunity }) => ({
			...opportunity,
			relatedPrompts: prompts.map((text) => {
				const promptId = promptIds.get(text);
				if (!promptId) throw new Error(`Unknown prompt ${text}`);
				return { text, promptId };
			}),
			yourCitations: pages.filter((url) => new URL(url).hostname === BRAND.domain).map(pageFor),
			competitorCitations: pages.filter((url) => new URL(url).hostname !== BRAND.domain).map(pageFor),
		})),
	};
	await client.query("INSERT INTO brand_opportunities (brand_id, report, model, created_at) VALUES ($1, $2, $3, $4)", [
		DEMO_BRAND.id,
		JSON.stringify(report),
		"claude-sonnet-5",
		createdAt,
	]);
}

async function main(): Promise<void> {
	const conn = createDb(DATABASE_URL);
	const client = conn.$client;
	const now = Date.now();
	try {
		await reset(client);
		await seedAccount(client, new Date(now - (DAYS + 5) * 24 * HOUR));
		const promptIds = await seedBrand(client, new Date(now - (DAYS + 2) * 24 * HOUR));
		const runs = buildRuns(promptIds, now);
		const citations = await seedRuns(client, runs);
		await seedOpportunities(client, promptIds, new Date(now - 2 * 24 * HOUR - 3 * HOUR));

		await resolveUnpagedCitations(conn);
		await markRunsDirty(conn, null);
		await refreshAllMarked(conn);

		const mentioned = runs.filter((run) => run.mentions.brandMentioned).length;
		console.log(`Seeded ${PROMPTS.length} prompts, ${runs.length} answers and ${citations} citations.`);
		console.log(`${BRAND.name} is named in ${Math.round((mentioned / runs.length) * 100)}% of answers.`);
		console.log(`Sign in as ${DEMO_LOGIN.email} (password in scripts/demo-data/content.ts).`);
	} finally {
		await client.end();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
