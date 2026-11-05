import { CLOUD_ENTRY_PRICE_USD, PLANS } from "@workspace/config/plans";
import type { FaqItem } from "@/lib/faqs";
import { type Competitor, type CompetitorCategory, ELMO_FEATURES, type FeatureKey, getFeatureLabel } from "./types";

export const ENTRY_PRICE = `$${CLOUD_ENTRY_PRICE_USD}/mo`;
export const PLAN_RANGE = `$${PLANS.basic.monthlyPriceUsd}/mo (Basic) to $${PLANS.business.monthlyPriceUsd}/mo (Business)`;

// Prose-friendly category nouns (acronyms kept uppercase, descriptive words
// lowercased) so they read naturally mid-sentence — e.g. "an AI visibility
// tracking tool", "a traditional SEO tool".
export const CATEGORY_NOUN: Record<CompetitorCategory, string> = {
	tracking: "AI visibility tracking",
	content: "content generation",
	"api-developer": "developer API",
	ecommerce: "e-commerce",
	"seo-traditional": "traditional SEO",
	"open-source": "open-source",
	other: "AI visibility",
};

export function indefiniteArticle(phrase: string): "a" | "an" {
	return /^[aeiou]/i.test(phrase) ? "an" : "a";
}

export function isOpenSource(competitor: Competitor): boolean {
	return (competitor.features.openSource ?? false) || competitor.category === "open-source";
}

const INTEGRATION_FEATURES = [
	["sentimentAnalysis", "sentiment analysis"],
	["dataExportApi", "API access"],
	["mcpServer", "an MCP server"],
] as const;

function integrationSummary(competitor: Competitor): string {
	const has = INTEGRATION_FEATURES.filter(([key]) => competitor.features[key]).map(([, label]) => label);
	const lacks = INTEGRATION_FEATURES.filter(([key]) => !competitor.features[key]).map(([, label]) => label);
	const list = (items: string[], conjunction: string) =>
		items.length <= 2
			? items.join(` ${conjunction} `)
			: `${items.slice(0, -1).join(", ")}, ${conjunction} ${items[items.length - 1]}`;
	if (lacks.length === 0) return `${competitor.name} offers all three as well.`;
	if (has.length === 0) return `${competitor.name} is not listed as offering ${list(lacks, "or")}.`;
	return `${competitor.name} offers ${list(has, "and")}, but is not listed as offering ${list(lacks, "or")}.`;
}

// Engines in rough order of how much AI search traffic they carry, so the
// soundbite names the gaps a buyer is most likely to care about first.
const SOUNDBITE_ENGINES: FeatureKey[] = [
	"chatgpt",
	"googleAiMode",
	"googleAiOverviews",
	"gemini",
	"perplexity",
	"claude",
	"copilot",
	"grok",
];

const SOUNDBITE_FEATURES: [FeatureKey, string][] = [
	["dataExportApi", "API"],
	["mcpServer", "MCP server"],
	["sentimentAnalysis", "sentiment analysis"],
	["citationAnalytics", "citation tracking"],
];

// Copyleft and source-available licenses carry obligations that MIT doesn't.
const RESTRICTIVE_LICENSES: Record<string, string> = {
	"AGPL-3.0": "AGPL-3.0, so running a modified version as a service means publishing your changes",
	"GPL-3.0": "GPL-3.0, so any modified version you distribute has to be released under the GPL too",
	"FSL-1.1-ALv2": "source-available under the FSL, which bars competing commercial use for two years",
	"BUSL-1.1": "source-available under the BSL, which restricts production use",
};

// Acquired trackers that were absorbed into the buyer's product, the evidence
// behind the acquisition soundbite.
const ABSORBED_EXAMPLES = ["XFunnel", "Hall", "Meridian"];

function joinAnd(items: string[]): string {
	if (items.length <= 2) return items.join(" and ");
	return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function joinOr(items: string[]): string {
	if (items.length <= 2) return items.join(" or ");
	return `${items.slice(0, -1).join(", ")}, or ${items[items.length - 1]}`;
}

/** The soundbite for a tool that shut down, pivoted, or was bought, if it did. */
function fateSoundbite(competitor: Competitor): string | undefined {
	const name = competitor.name;
	if (competitor.status === "defunct" || competitor.status === "shutting-down") {
		return `${name} has shut down. CiteRank.com's API lets you keep a copy of every answer, so your reporting can't disappear the same way.`;
	}
	if (competitor.status === "pivoted") {
		return `${name} has pivoted away from AI visibility. CiteRank.com is built for this one job, and its API lets you keep a copy of every answer.`;
	}
	if (competitor.status === "acquired") {
		if (competitor.fate) {
			return `${name} is gone as a standalone product. ${competitor.fate.summary} CiteRank.com's API lets you keep every answer, so no acquisition can take that away.`;
		}
		const absorbed = ABSORBED_EXAMPLES.filter((example) => example !== name);
		return `${name} has been acquired, and acquired AI visibility tools rarely stay put: ${joinAnd(absorbed)} were all folded into their buyers' products. CiteRank.com's API lets you keep every answer, so no acquisition can take that away.`;
	}
	return undefined;
}

/**
 * The one-line case for Elmo over a tool, shown at the top of its comparison
 * page. Hand-written soundbites win; otherwise it leads with the most decisive
 * fact we hold: the tool is gone, was bought, carries a restrictive license, or
 * is missing engines and features Elmo has.
 */
export function getSoundbite(competitor: Competitor): string {
	if (competitor.soundbite) return competitor.soundbite;
	const name = competitor.name;

	const fate = fateSoundbite(competitor);
	if (fate) return fate;

	const license = competitor.license ? RESTRICTIVE_LICENSES[competitor.license] : undefined;
	if (license) {
		return `${name} is ${license}. CiteRank.com is a hosted tracker, so there is nothing to deploy, and plans start at ${ENTRY_PRICE}.`;
	}

	const tracksAnyEngine = SOUNDBITE_ENGINES.some((key) => competitor.features[key]);
	const missingEngines = tracksAnyEngine
		? SOUNDBITE_ENGINES.filter((key) => ELMO_FEATURES[key] && !competitor.features[key]).map(getFeatureLabel)
		: [];
	const missingFeatures = SOUNDBITE_FEATURES.filter(([key]) => ELMO_FEATURES[key] && !competitor.features[key]).map(
		([, label]) => label,
	);

	const gaps: string[] = [];
	if (missingEngines.length > 0) gaps.push(`doesn't list ${joinOr(missingEngines.slice(0, 3))} among its engines`);
	if (missingFeatures.length > 0) gaps.push(`has no ${joinOr(missingFeatures.slice(0, 2))}`);
	if (gaps.length > 0) {
		return `${name} ${gaps.join(" and ")}. CiteRank.com has all of that, and its plans start at ${ENTRY_PRICE}.`;
	}

	const price = competitor.pricing?.startingPrice;
	if (price && !isOpenSource(competitor)) {
		return `${name} starts at ${price}. CiteRank.com covers the same engines, and its plans start at ${ENTRY_PRICE}, month to month.`;
	}
	if (isOpenSource(competitor)) {
		return `${name} is open source and CiteRank.com is hosted, so it comes down to fit: compare the engines and features below.`;
	}
	return `${name} is closed source, so you can't check how its numbers are made. CiteRank.com keeps the full answer behind every number.`;
}

/**
 * A 40–60 word lead "answer block" for a comparison page, written to be lifted
 * verbatim into an AI answer for "Elmo vs {competitor}" style queries. Branches
 * on whether the competitor is itself open source so the claim stays accurate.
 */
export function getComparisonVerdict(competitor: Competitor): string {
	const name = competitor.name;

	if (isOpenSource(competitor)) {
		return `${name} is an open-source AI visibility tool you can self-host and audit, and CiteRank.com is a hosted AI visibility tracker. CiteRank.com's focus is transparent, verifiable tracking across ChatGPT, Claude, Perplexity, and Google AI Overviews, with a documented methodology behind every number and an AI search agency that does the work.`;
	}

	const noun = CATEGORY_NOUN[competitor.category];
	return `CiteRank.com, an AI visibility tracker and AI search agency, is an alternative to ${name}, ${indefiniteArticle(noun)} ${noun} tool. Both measure how AI answer engines describe your brand, but CiteRank.com keeps every answer in full, covers 12 AI apps, and checks each prompt up to four times a day, so each metric traces back to the words an AI wrote.`;
}

/**
 * Per-competitor FAQ generated from the competitor dataset. The same items are
 * rendered visibly on the page and emitted as FAQPage JSON-LD, so the structured
 * data always matches what a reader (or an AI crawler) sees. Every answer is
 * derived from fields we actually store, so it stays truthful per competitor.
 */
export function getComparisonFaqs(competitor: Competitor): FaqItem[] {
	const name = competitor.name;
	const openSource = isOpenSource(competitor);
	const noun = CATEGORY_NOUN[competitor.category];
	const price = competitor.pricing?.startingPrice;
	const faqs: FaqItem[] = [];

	faqs.push({
		question: `What is the difference between CiteRank.com and ${name}?`,
		answer: openSource
			? `${name} is open source, so you can self-host it and inspect the code, while CiteRank.com is hosted. CiteRank.com focuses specifically on transparent AI visibility tracking across 12 AI apps, with every answer kept in full, an AI search agency that does the work, and a fully documented methodology behind each number.`
			: `CiteRank.com is an AI visibility tracker and AI search agency, while ${name} is ${indefiniteArticle(noun)} ${noun} tool. Both track how AI answer engines describe your brand, but CiteRank.com keeps every answer in full, so you can verify every metric against the words an AI wrote, and its agency can do the work.`,
	});

	faqs.push({
		question: `How much does CiteRank.com cost compared with ${name}?`,
		answer: `CiteRank.com plans run from ${PLAN_RANGE}, and annual billing saves two months. Every plan includes unlimited seats plus API and MCP access, and you can sign up and start tracking without a sales call, then cancel any time. ${price ? `The starting price listed for ${name} is ${price}.` : `No public starting price is listed for ${name}.`}`,
	});

	faqs.push({
		question: `Is ${name} open source?`,
		answer: openSource
			? `Yes, ${name} is open source. CiteRank.com is closed source and hosted, built specifically for verifiable AI visibility tracking, so you can check each metric against the full answer behind it.`
			: `No, ${name} is a closed-source, hosted product, and so is CiteRank.com. CiteRank.com keeps every answer in full, so you can check how each metric is calculated, read the passage behind each sentiment score, and export it all through the API.`,
	});

	faqs.push({
		question: `How do CiteRank.com and ${name} compare on sentiment analysis, API access, and MCP?`,
		answer: `CiteRank.com includes all three: a 0 to 100 sentiment score for every AI answer that mentions you, a REST API on every plan, and an MCP server so assistants like Claude Code and Cursor can query your data. ${integrationSummary(competitor)}`,
	});

	faqs.push({
		question: `Can my team use CiteRank.com instead of ${name}?`,
		answer:
			"Yes. CiteRank.com is designed to be self-serve: sign up and start tracking in minutes, with no sales call. You keep full access to your data and prompts through the API, with no per-seat pricing, so your whole team can log in.",
	});

	return faqs;
}
