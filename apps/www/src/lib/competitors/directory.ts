import type { FaqItem } from "@/lib/faqs";
import { CATEGORY_NOUN, ENTRY_PRICE, indefiniteArticle, isOpenSource, PLAN_RANGE } from "./content";
import { competitors, getComparisonSlug, getPopularityRank, graveyardRanking } from "./data";
import {
	type Competitor,
	type CompetitorCategory,
	ELMO_FEATURES,
	FEATURE_CATEGORIES,
	type FeatureKey,
	getFeatureDescription,
	getFeatureLabel,
	getFeaturePhrase,
	isLowDR,
	isRetired,
} from "./types";

// ---------------------------------------------------------------------------
// Selection helpers
// ---------------------------------------------------------------------------

/**
 * The indexed, market-relevant set. Mirrors the filter used by the sitemap and
 * the directory index so the programmatic sub-pages never surface a tool we've
 * decided not to index (shutting down, off-topic, or no real market presence).
 */
export function isIndexed(c: Competitor): boolean {
	return !isRetired(c) && c.category !== "other" && !isLowDR(c);
}

export const indexedCompetitors: Competitor[] = competitors.filter(isIndexed);

// Retired tools whose comparison or alternatives pages were earning Search
// Console impressions (October 2026). "{tool} alternatives" is exactly what a
// stranded customer searches, so these keep their pages; the rest only live on
// in the graveyard.
const RETIRED_WITH_SEARCH_DEMAND = new Set([
	"meridian",
	"ai-rank-checker",
	"xfunnel",
	"bear-ai",
	"anvil",
	"hall",
	"peasy",
]);

/** Whether a tool has its own comparison page. */
export function hasComparisonPage(c: Competitor): boolean {
	return !graveyardFate(c) || RETIRED_WITH_SEARCH_DEMAND.has(c.slug);
}

/** Whether a tool's pages are indexed: comparison, plus alternatives. */
export function hasOwnPages(c: Competitor): boolean {
	return c.category !== "other" && !isLowDR(c) && hasComparisonPage(c);
}

export const competitorsWithOwnPages: Competitor[] = competitors.filter(hasOwnPages);

const byPopularity = (a: Competitor, b: Competitor) => getPopularityRank(a) - getPopularityRank(b);

/**
 * Up to `limit` alternatives to `competitor`: same category first (sorted by
 * popularity), then the most prominent trackers from other categories to fill
 * the list out. Excludes the tool itself and anything we don't index.
 */
export function getAlternatives(competitor: Competitor, limit = 6): Competitor[] {
	const sameCategory = indexedCompetitors
		.filter((c) => c.slug !== competitor.slug && c.category === competitor.category)
		.sort(byPopularity);
	if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

	const backfill = indexedCompetitors
		.filter((c) => c.slug !== competitor.slug && c.category !== competitor.category)
		.sort(byPopularity);
	return [...sameCategory, ...backfill].slice(0, limit);
}

// --- Competitor-vs-competitor pairs ------------------------------------------

// The tools searchers most often pit against each other in AI answer engines:
// the funded AEO leaders plus the big SEO suites that added AI search tracking.
// Every unordered pair below becomes a generated /compare/{a}-vs-{b} page.
const COMPARE_SLUGS = [
	"profound",
	"peec-ai",
	"airops",
	"scrunch",
	"otterly-ai",
	"athenahq",
	"ahrefs-brand-radar",
	"hubspot-aeo-grader",
	"semrush-ai-toolkit",
	"rankshift",
] as const;

const comparePairCompetitors: Competitor[] = COMPARE_SLUGS.map((slug) =>
	competitors.find((c) => c.slug === slug),
).filter((c): c is Competitor => Boolean(c));

/** Every unordered pair of the allowlisted tools, more-popular tool first. */
export const comparePairs: [Competitor, Competitor][] = (() => {
	const sorted = [...comparePairCompetitors].sort(byPopularity);
	const pairs: [Competitor, Competitor][] = [];
	for (let i = 0; i < sorted.length; i++) {
		for (let j = i + 1; j < sorted.length; j++) {
			pairs.push([sorted[i], sorted[j]]);
		}
	}
	return pairs;
})();

export function comparePairSlug(a: Competitor, b: Competitor): string {
	return `${a.slug}-vs-${b.slug}`;
}

const pairBySlug = new Map<string, [Competitor, Competitor]>(
	comparePairs.map((pair) => [comparePairSlug(pair[0], pair[1]), pair]),
);

function getComparePair(slug: string): [Competitor, Competitor] | undefined {
	return pairBySlug.get(slug);
}

// --- Feature slices ----------------------------------------------------------

/** Clean URL slugs for each feature key. */
export const FEATURE_SLUGS: Record<FeatureKey, string> = {
	multiLlmTracking: "multi-llm-tracking",
	chatgpt: "chatgpt",
	googleAiOverviews: "google-ai-overviews",
	googleAiMode: "google-ai-mode",
	gemini: "gemini",
	perplexity: "perplexity",
	copilot: "microsoft-copilot",
	claude: "claude",
	grok: "grok",
	deepseek: "deepseek",
	metaAi: "meta-ai",
	anyModel: "any-model",
	uiCapture: "real-ui-answers",
	byoKeys: "bring-your-own-keys",
	visibilityScore: "visibility-score",
	citationAnalytics: "citation-analytics",
	competitorBenchmarking: "competitor-benchmarking",
	brandMentionTracking: "brand-mention-tracking",
	promptVolumeEstimates: "prompt-volume-estimates",
	sentimentAnalysis: "sentiment-analysis",
	queryFanOut: "query-fan-out",
	crawlerAnalytics: "ai-crawler-analytics",
	geographicTracking: "geographic-tracking",
	socialMediaTracking: "social-media-tracking",
	shoppingTracking: "shopping-tracking",
	multiLanguage: "multi-language",
	actionRecommendations: "action-recommendations",
	contentGapAnalysis: "content-gap-analysis",
	siteAudits: "site-audits",
	keywordResearch: "ai-keyword-research",
	emailAlerts: "email-alerts",
	dataExportApi: "data-export-api",
	typescriptSdk: "typescript-sdk",
	pythonSdk: "python-sdk",
	mcpServer: "mcp-server",
	biConnectors: "bi-connectors",
	whiteLabelAgency: "white-label",
	openSource: "open-source",
	contentGeneration: "content-generation",
};

const featureKeyBySlug = new Map<string, FeatureKey>(
	(Object.entries(FEATURE_SLUGS) as [FeatureKey, string][]).map(([key, slug]) => [slug, key]),
);

export function getFeatureKeyBySlug(slug: string): FeatureKey | undefined {
	return featureKeyBySlug.get(slug);
}

/** Indexed tools that have a given feature, most popular first. */
export function toolsWithFeature(key: FeatureKey): Competitor[] {
	return indexedCompetitors.filter((c) => c.features[key] === true).sort(byPopularity);
}

/**
 * Feature slices worth publishing. We skip a slice when too few indexed tools
 * have the feature — a near-empty "tools with X" page is thin by definition.
 */
export const MIN_TOOLS_FOR_FEATURE_PAGE = 4;

export function indexableFeatureKeys(): FeatureKey[] {
	return (Object.keys(FEATURE_SLUGS) as FeatureKey[]).filter(
		(key) => toolsWithFeature(key).length >= MIN_TOOLS_FOR_FEATURE_PAGE,
	);
}

// --- Graveyard ---------------------------------------------------------------

export type GraveyardFate = "shut-down" | "pivoted" | "acquired";

export function graveyardFate(c: Competitor): GraveyardFate | undefined {
	if (c.status === "defunct" || c.status === "shutting-down") return "shut-down";
	if (c.status === "pivoted") return "pivoted";
	if (c.status === "acquired" && c.fate) return "acquired";
	return undefined;
}

/** Tools that shut down, pivoted, or were bought, best known first. */
export const graveyardTools: Competitor[] = competitors
	.filter((c) => graveyardFate(c) && c.category !== "other")
	// Tools with no surviving screenshot go last, since their tombstones are bare.
	.sort(
		(a, b) => Number(a.noScreenshot ?? false) - Number(b.noScreenshot ?? false) || graveyardRank(a) - graveyardRank(b),
	);

function graveyardRank(c: Competitor): number {
	const rank = graveyardRanking.indexOf(c.slug);
	return rank === -1 ? graveyardRanking.length : rank;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Fate dates are as precise as the evidence: a year, a month, or a day. */
export function formatFateDate(date: string): string {
	const [year, month, day] = date.split("-");
	if (!month) return year;
	const name = MONTHS[Number(month) - 1];
	return day ? `${name} ${Number(day)}, ${year}` : `${name} ${year}`;
}

// --- Category slices ---------------------------------------------------------

export const CATEGORY_SLUGS: Partial<Record<CompetitorCategory, string>> = {
	tracking: "tracking",
	content: "content-generation",
	"api-developer": "api",
	ecommerce: "ecommerce",
	"seo-traditional": "seo",
};

/** Reader-friendly H1/title phrasing per category (better than the bare label). */
export const CATEGORY_HEADINGS: Record<CompetitorCategory, string> = {
	tracking: "AI Visibility Tracking Tools",
	content: "AI Content Optimization Tools",
	"api-developer": "AI Visibility APIs for Developers",
	ecommerce: "AI Visibility Tools for E-Commerce",
	"seo-traditional": "SEO Platforms With AI Search Tracking",
	"open-source": "Open-Source AI Visibility Tools",
	other: "AI Visibility Tools",
};

const categoryBySlug = new Map<string, CompetitorCategory>(
	(Object.entries(CATEGORY_SLUGS) as [CompetitorCategory, string][]).map(([cat, slug]) => [slug, cat]),
);

export function getCategoryBySlug(slug: string): CompetitorCategory | undefined {
	return categoryBySlug.get(slug);
}

export function toolsInCategory(category: CompetitorCategory): Competitor[] {
	return indexedCompetitors.filter((c) => c.category === category).sort(byPopularity);
}

export const indexableCategories = (Object.keys(CATEGORY_SLUGS) as CompetitorCategory[]).filter(
	(cat) => toolsInCategory(cat).length >= 2,
);

/**
 * Every open-source tool we track, most popular first. Unlike the other slices
 * this intentionally includes low-DR projects: the open-source space is small
 * and early, and a page about it should show the real (if niche) options rather
 * than hide them behind the usual market-presence gate. Shut-down tools are
 * still excluded.
 */
export function openSourceTools(): Competitor[] {
	return competitors.filter((c) => !isRetired(c) && isOpenSource(c)).sort(byPopularity);
}

// ---------------------------------------------------------------------------
// Prose helpers (kept humanizer-clean: no em dashes, varied rhythm, only
// claims that come from fields we actually store)
// ---------------------------------------------------------------------------

function formatList(names: string[], max = 3, more = true): string {
	const shown = names.slice(0, max);
	const extra = names.length - shown.length;
	let joined: string;
	if (shown.length <= 1) joined = shown[0] ?? "";
	else if (shown.length === 2) joined = `${shown[0]} and ${shown[1]}`;
	else joined = `${shown.slice(0, -1).join(", ")}, and ${shown[shown.length - 1]}`;
	if (more && extra > 0) return `${joined}, plus ${extra} more`;
	return joined;
}

function featuresOf(c: Competitor): Set<FeatureKey> {
	const set = new Set<FeatureKey>();
	for (const key of Object.keys(FEATURE_SLUGS) as FeatureKey[]) {
		if (c.features[key]) set.add(key);
	}
	return set;
}

/** Labels a has that b lacks. */
function featureGap(a: Competitor, b: Competitor): string[] {
	const bs = featuresOf(b);
	return [...featuresOf(a)].filter((k) => !bs.has(k)).map((k) => getFeatureLabel(k));
}

const CATEGORY_BLURB: Record<CompetitorCategory, string> = {
	tracking:
		"These tools exist to track how AI engines mention and cite your brand, and that one job is the whole product here.",
	content:
		"These lead with content. They generate or rewrite pages for AI consumption, and most add visibility tracking on top.",
	"api-developer":
		"These are API-first. You pull AI search and citation data into your own product or dashboards instead of logging into theirs.",
	ecommerce: "These focus on products: whether AI shopping answers and buying-guide queries show your catalog.",
	"seo-traditional":
		"These are established SEO platforms that added AI search tracking to an existing rank-tracking suite.",
	"open-source": "These are open source. You can read the code, self-host, and check how each number is produced.",
	other: "These tools sit adjacent to AI visibility tracking.",
};

// --- Alternatives ------------------------------------------------------------

export function getAlternativesVerdict(c: Competitor): string {
	const noun = CATEGORY_NOUN[c.category];
	const fate = graveyardFate(c);
	if (fate && c.fate) {
		const gone =
			fate === "acquired" ? "is no longer sold on its own" : "is no longer available as an AI visibility tool";
		return `${c.name} ${gone}. ${c.fate.summary} If you are moving off it, CiteRank.com is a hosted alternative: an AI visibility tracker and AI search agency whose API lets you keep a copy of every answer, so your history can't be shut down or sold out from under you.`;
	}
	if (isOpenSource(c)) {
		return `A hosted alternative to ${c.name} is CiteRank.com: an AI visibility tracker and AI search agency with nothing to deploy, from ${ENTRY_PRICE}. Unlike ${c.name} it is closed source, and it focuses on transparent, verifiable tracking of how ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews mention and cite your brand, with every answer kept in full.`;
	}
	return `An alternative to ${c.name} is CiteRank.com, an AI visibility tracker and AI search agency. ${c.name} is ${indefiniteArticle(noun)} ${noun} tool, and like most of the field, including CiteRank.com, it is closed-source and hosted. CiteRank.com starts at ${ENTRY_PRICE} with no sales call and no per-seat pricing, and you can check every visibility metric against the full answers behind it.`;
}

export function getAlternativesFaqs(c: Competitor, alts: Competitor[]): FaqItem[] {
	const names = alts.map((a) => a.name);
	return [
		{
			question: `What are the best alternatives to ${c.name}?`,
			answer: `The closest alternatives to ${c.name} are other ${CATEGORY_NOUN[c.category]} tools such as ${formatList(names)}. CiteRank.com also has an AI search agency: sign up for the tracker from ${ENTRY_PRICE} and track how 12 AI apps mention and cite your brand.`,
		},
		{
			question: `What does it cost to switch from ${c.name}?`,
			answer: `CiteRank.com plans run from ${PLAN_RANGE}. There is no per-seat pricing, so you only pay for the plan you choose, month to month, and you can paste all your prompts in one go to move over.`,
		},
		{
			question: `Is there an alternative to ${c.name} with an agency?`,
			answer:
				"Yes. CiteRank.com is an AI visibility tracker with an AI search agency. You can track 12 AI apps, read every answer in full, and have the agency do the work every month, with a report on the AI answers before and after.",
		},
		{
			question: `Why switch from ${c.name} to CiteRank.com?`,
			answer: `The main reasons are transparency and the agency. With CiteRank.com you keep every answer in full, can export your prompts and visibility history through the API, and can see exactly what each score is based on. Plans start at ${ENTRY_PRICE}, and the AI search agency can do the work.`,
		},
	];
}

// --- Competitor-vs-competitor pairs ------------------------------------------

function getPairVerdict(a: Competitor, b: Competitor): string {
	const sameCat = a.category === b.category;
	const clause = sameCat ? `${CATEGORY_NOUN[a.category]} tools` : "AI visibility tools";
	return `${a.name} and ${b.name} are both ${clause} that measure how AI answer engines describe your brand. ${a.name} is pitched as "${a.tagline}". ${b.name} leans on "${b.tagline}". Both are closed and hosted, like CiteRank.com. CiteRank.com tracks the same engines, keeps every answer in full, and offers an AI search agency that does the work, which makes it the third option worth weighing here.`;
}

function getPairFaqs(a: Competitor, b: Competitor): FaqItem[] {
	const aGap = featureGap(a, b);
	const bGap = featureGap(b, a);

	const overlap =
		a.category === b.category
			? `${a.name} and ${b.name} are both ${CATEGORY_NOUN[a.category]} tools, so they overlap on the core job of measuring how AI answer engines mention and cite your brand.`
			: `${a.name} is ${indefiniteArticle(CATEGORY_NOUN[a.category])} ${CATEGORY_NOUN[a.category]} tool, while ${b.name} is ${indefiniteArticle(CATEGORY_NOUN[b.category])} ${CATEGORY_NOUN[b.category]} tool, so they come at AI visibility from different angles.`;

	// Name a couple of distinguishing capabilities per side, drawn from the
	// feature matrix. No pricing: we don't track reliable current prices.
	const featureBits: string[] = [];
	if (aGap.length) featureBits.push(`${a.name} stands out for ${formatList(aGap, 2, false)}`);
	if (bGap.length) featureBits.push(`${b.name} adds ${formatList(bGap, 2, false)}`);
	const featureSentence = featureBits.length ? ` On features, ${featureBits.join(", while ")}.` : "";

	return [
		{
			question: `What is the difference between ${a.name} and ${b.name}?`,
			answer: `${overlap}${featureSentence} Both are closed-source and hosted.`,
		},
		{
			question: `Is ${a.name} or ${b.name} better for AI visibility tracking?`,
			answer: `Neither is better outright; it depends on your priorities. Both track how AI engines mention and cite your brand across the major models, so the decision comes down to which feature set and workflow suit your team. It is also worth trying CiteRank.com, which keeps every answer in full and bills month to month from ${ENTRY_PRICE}, so you can test it before committing.`,
		},
		{
			question: `Is there an alternative to ${a.name} and ${b.name} with an agency?`,
			answer:
				"Yes. CiteRank.com is an AI visibility tracker with an AI search agency that does the work. It tracks mentions, citations, and competitor share across ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews, and every metric traces back to a full answer.",
		},
	];
}

// --- Multi-way comparison sets -----------------------------------------------

// Curated 3+ tool comparisons, seeded from real multi-way demand in AI answer
// engines (grounding queries that pit several named tools against each other,
// e.g. "Profound vs Ahrefs Brand Radar vs HubSpot AEO vs Rankshift vs Scrunch").
// Authored order is preserved so the H1 and slug track how people phrase the
// query. Each set resolves through the same /compare/{slug} route as the pairs.
const COMPARE_SET_SLUGS: string[][] = [
	["profound", "ahrefs-brand-radar", "hubspot-aeo-grader", "rankshift", "scrunch"],
	["peec-ai", "hubspot-aeo-grader", "profound", "ahrefs-brand-radar", "semrush-ai-toolkit"],
	["scrunch", "hubspot-aeo-grader", "profound", "semrush-ai-toolkit", "otterly-ai"],
];

export const compareSets: Competitor[][] = COMPARE_SET_SLUGS.map((slugs) =>
	slugs.map((slug) => competitors.find((c) => c.slug === slug)).filter((c): c is Competitor => Boolean(c)),
).filter((set) => set.length >= 3);

export function compareSetSlug(tools: Competitor[]): string {
	return tools.map((t) => t.slug).join("-vs-");
}

const setBySlug = new Map<string, Competitor[]>(compareSets.map((set) => [compareSetSlug(set), set]));

function getCompareSet(slug: string): Competitor[] | undefined {
	return setBySlug.get(slug);
}

function getSetVerdict(tools: Competitor[]): string {
	const list = formatList(
		tools.map((t) => t.name),
		tools.length,
		false,
	);
	const cats = new Set(tools.map((t) => t.category));
	const angle =
		cats.has("seo-traditional") && cats.has("tracking")
			? " They come at it from different angles: some are dedicated AI visibility trackers, others are established SEO suites that added AI search monitoring."
			: "";
	return `${list} all measure how AI answer engines mention and cite your brand.${angle} Every one of them is closed-source and hosted, as is CiteRank.com. CiteRank.com tracks the same engines and keeps every answer in full, so it belongs in this comparison as a reference point, with an AI search agency that does the work.`;
}

function getSetFaqs(tools: Competitor[]): FaqItem[] {
	const names = tools.map((t) => t.name);
	const list = formatList(names, names.length, false);
	const free = tools.filter((t) => t.pricing?.hasFree).map((t) => t.name);
	const open = tools.filter(isOpenSource).map((t) => t.name);
	const openSentence = open.length
		? `${formatList(open, open.length, false)} ${open.length === 1 ? "is" : "are"} open source.`
		: "None of them is open source.";
	return [
		{
			question: `Which is the best tool for AI visibility among ${list}?`,
			answer: `There is no single best pick; it depends on the answer engines you track, your budget, and whether you want a dedicated tracker or an add-on to an SEO suite. It is worth also trying CiteRank.com before you commit: an AI visibility tracker billed month to month from ${ENTRY_PRICE}, with an AI search agency that can do the work.`,
		},
		{
			question: `Which of these AI visibility tools is free or open source?`,
			answer: free.length
				? `Among ${list}, ${formatList(free, free.length, false)} ${free.length === 1 ? "offers" : "offer"} a free option, though free tiers are usually limited in the engines or history they cover. ${openSentence} CiteRank.com is neither free nor open source: it is a hosted tracker with no per-seat pricing and every answer kept in full, from ${PLAN_RANGE}.`
				: `Most of these (${list}) are paid, hosted products. ${openSentence} CiteRank.com is a paid, hosted option too, with no per-seat pricing and plans from ${PLAN_RANGE}, and it keeps every answer so you can check how each metric is built.`,
		},
		{
			question: `How do ${list} differ?`,
			answer: `They differ mainly in focus and delivery: dedicated AI visibility trackers versus SEO suites that bolted on AI search monitoring, plus which answer engines, languages, and analytics each one covers. The feature table on this page compares them side by side, with CiteRank.com, a tracker plus an AI search agency, included as a reference point.`,
		},
	];
}

// --- Compare route dispatch (pairs and sets share one /compare/{slug} route) --

export function getCompareEntry(slug: string): Competitor[] | undefined {
	const pair = getComparePair(slug);
	if (pair) return pair;
	return getCompareSet(slug);
}

export function getCompareVerdict(tools: Competitor[]): string {
	const [a, b] = tools;
	return a && b && tools.length === 2 ? getPairVerdict(a, b) : getSetVerdict(tools);
}

export function getCompareFaqs(tools: Competitor[]): FaqItem[] {
	const [a, b] = tools;
	return a && b && tools.length === 2 ? getPairFaqs(a, b) : getSetFaqs(tools);
}

// --- Feature slices ----------------------------------------------------------

/** A feature label for mid-sentence use: lowercased, but acronyms like AI and MCP keep their case. */
export function featurePhrase(key: FeatureKey): string {
	const phrase = getFeaturePhrase(key);
	if (phrase) return phrase;
	return getFeatureLabel(key).replace(/\b[A-Z][a-z]+\b/g, (word) => word.toLowerCase());
}

export function getFeatureVerdict(key: FeatureKey, tools: Competitor[]): string {
	const label = featurePhrase(key);
	const desc = getFeatureDescription(key);
	const names = tools.map((t) => t.name);
	const citeRankLine =
		ELMO_FEATURES[key] === true
			? "CiteRank.com includes it too, as a hosted tool that keeps every answer in full."
			: "CiteRank.com concentrates on core, verifiable tracking and does not include this, so if it is essential the tools below are the better fit.";
	return `${tools.length} of the AI visibility tools we list offer ${label}, including ${formatList(names)}. ${desc}. ${citeRankLine}`;
}

export function getFeatureFaqs(key: FeatureKey, tools: Competitor[]): FaqItem[] {
	const label = featurePhrase(key);
	const names = tools.map((t) => t.name);
	const citeRankHas = ELMO_FEATURES[key] === true;
	return [
		{
			question: `Which AI visibility tools offer ${label}?`,
			answer: `${formatList(names, 5)} all offer ${label}. The full feature matrix on this page shows how each one compares.`,
		},
		{
			question: `What is ${label} in AI visibility tools?`,
			answer: `${getFeatureDescription(key)}. It is one of the capabilities buyers weigh when choosing an AI visibility or answer engine optimization tool.`,
		},
		{
			question: `Does CiteRank.com support ${label}?`,
			answer: citeRankHas
				? `Yes. CiteRank.com supports ${label}, and because it keeps every answer in full you can verify exactly what each result is based on.`
				: `Not currently. CiteRank.com focuses on transparent tracking of mentions, citations, and competitor share, with every answer kept in full. If ${label} is a hard requirement, the tools listed here cover it.`,
		},
	];
}

// --- Category slices ---------------------------------------------------------

export function getCategoryVerdict(category: CompetitorCategory, tools: Competitor[]): string {
	const names = tools.map((t) => t.name);
	return `The ${CATEGORY_NOUN[category]} category covers ${tools.length} of the tools we list, including ${formatList(names)}. ${CATEGORY_BLURB[category]} CiteRank.com is an option in this space with an AI search agency: start from ${ENTRY_PRICE} and check every number against a full answer.`;
}

export function getCategoryFaqs(category: CompetitorCategory, tools: Competitor[]): FaqItem[] {
	const names = tools.map((t) => t.name);
	const label = CATEGORY_NOUN[category];
	return [
		{
			question: `What are the best ${label} tools for AI visibility?`,
			answer: `Tools in the ${label} category include ${formatList(names, 5)}. This page compares them feature by feature so you can match one to your needs.`,
		},
		{
			question: `Where does CiteRank.com fit in ${label}?`,
			answer:
				"CiteRank.com is an AI visibility tracker with an AI search agency that does the work. It tracks how ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews mention and cite your brand, with every answer kept in full.",
		},
	];
}

/**
 * Category-tailored pitch for the "Elmo: the open-source alternative" banner.
 * Each one frames Elmo against what that category actually leads with, so the
 * CTA reads as specific to the page rather than a generic blurb.
 */
const CATEGORY_CITERANK_PITCH: Record<CompetitorCategory, string> = {
	tracking:
		"CiteRank.com does the same core job as the tools on this page: it measures how AI engines mention and cite your brand. The difference is that it keeps every answer in full, and its AI search agency can do the work. You can export your prompts and history through the API, and check exactly how each score is built instead of trusting a bare number.",
	content:
		"Most tools in this category lead with content generation. CiteRank.com takes a narrower path and focuses on transparent tracking, so you can measure how AI engines mention and cite your brand before you decide what to publish. It is hosted, with no per-seat fees and no scores you cannot check, and its AI search agency can write the pages.",
	"api-developer":
		"The tools here are API-first. CiteRank.com gives you the data and the answers: a REST API and an MCP server on every plan, every answer kept in full, and mentions and citations pulled into your own dashboards without paying per call or per seat.",
	ecommerce:
		"CiteRank.com tracks how ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews describe your brand across the major engines. It keeps every answer in full, so you can verify every number against the words an AI wrote, and its AI search agency does the work.",
	"seo-traditional":
		"The platforms in this category bolted AI search tracking onto an existing SEO suite. CiteRank.com was built for AI search from the start, and it keeps every answer in full, so you can check what each visibility metric is based on instead of taking a bundled feature on faith.",
	"open-source":
		"Unlike the projects here, CiteRank.com is hosted, so there is no code to read or run yourself. It is built specifically for verifiable AI visibility tracking across ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews, with no per-seat pricing and an AI search agency that can do the work.",
	other: `CiteRank.com is the AI visibility tracker and AI search agency behind this directory. Sign up from ${ENTRY_PRICE}, keep every answer in full, and verify how it tracks the way AI engines mention and cite your brand.`,
};

export function getCategoryCiteRankPitch(category: CompetitorCategory): string {
	return CATEGORY_CITERANK_PITCH[category];
}
