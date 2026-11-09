import { CLOUD_ENTRY_PRICE_USD, PLANS } from "@workspace/config/plans";
import { AGENCY_PLANS } from "./agency-plans";
import { getMarketingOgImage } from "./og";
import { SOCIAL_URLS } from "./socials";

export const SITE_URL = "https://citerank.com";
export const SITE_NAME = "CiteRank.com";
// Fallback description for pages without their own, and the description on the
// WebSite/Organization/SoftwareApplication entities. Spells out "answer engine
// optimization" because answer engines expand the acronym when they search, and
// carries no pricing so it stays true wherever it is reused.
export const SITE_DESCRIPTION =
	"Answer engine optimization (AEO) platform and AI search agency: track how AI answers mention and cite your brand.";
const SITE_LOGO_URL = `${SITE_URL}/brand/icons/citerank-icon-512.png`;

export function canonicalUrl(path: string): string {
	return `${SITE_URL}${path}`;
}

export function ogMeta({
	title,
	description,
	path,
	image,
	type = "website",
	label,
}: {
	title: string;
	description: string;
	path: string;
	image?: string;
	type?: "website" | "article";
	/** Section shown on the generated share image, e.g. "Blog". Ignored when `image` is given. */
	label?: string;
}) {
	const url = canonicalUrl(path);
	const resolvedImage = image ?? getMarketingOgImage({ title, description, label });
	const absoluteImage = resolvedImage.startsWith("http") ? resolvedImage : canonicalUrl(resolvedImage);

	return [
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:url", content: url },
		{ property: "og:site_name", content: SITE_NAME },
		{ property: "og:type", content: type },
		{ property: "og:locale", content: "en_US" },
		{ property: "og:image", content: absoluteImage },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		{ property: "og:image:alt", content: title },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:image", content: absoluteImage },
	];
}

function jsonLd(data: Record<string, unknown>): {
	type: string;
	children: string;
} {
	return {
		type: "application/ld+json",
		children: JSON.stringify({ "@context": "https://schema.org", ...data }),
	};
}

export function websiteJsonLd() {
	return jsonLd({
		"@type": "WebSite",
		name: SITE_NAME,
		url: SITE_URL,
		description: SITE_DESCRIPTION,
	});
}

export function organizationJsonLd() {
	return jsonLd({
		"@type": "Organization",
		name: SITE_NAME,
		alternateName: ["CiteRank"],
		legalName: "Danx Digital Limited",
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		logo: SITE_LOGO_URL,
		email: "team@citerank.com",
		sameAs: SOCIAL_URLS,
		founder: [
			{ "@type": "Person", name: "Adam Danyal", sameAs: ["https://www.linkedin.com/in/adamdanyal/"] },
			{ "@type": "Person", name: "Julia Danyal" },
		],
		address: {
			"@type": "PostalAddress",
			streetAddress: "86-90 Paul Street",
			addressLocality: "London",
			postalCode: "EC2A 4NE",
			addressCountry: "GB",
		},
	});
}

function monthlyOffer(name: string, priceUsd: number, path: string) {
	return {
		"@type": "Offer",
		name,
		price: String(priceUsd),
		priceCurrency: "USD",
		priceSpecification: {
			"@type": "UnitPriceSpecification",
			price: String(priceUsd),
			priceCurrency: "USD",
			billingIncrement: 1,
			unitCode: "MON",
		},
		availability: "https://schema.org/InStock",
		url: canonicalUrl(path),
	};
}

export function softwareApplicationJsonLd() {
	const plans = Object.values(PLANS);
	return jsonLd({
		"@type": "SoftwareApplication",
		name: SITE_NAME,
		alternateName: "CiteRank",
		description: SITE_DESCRIPTION,
		applicationCategory: "BusinessApplication",
		applicationSubCategory: "AI visibility tracker",
		operatingSystem: "Web",
		url: SITE_URL,
		image: SITE_LOGO_URL,
		screenshot: `${SITE_URL}/screenshots/overview.webp`,
		featureList: [
			"Tracks brand mentions in ChatGPT, Claude, Gemini, Perplexity, Google AI Overviews, AI Mode, Copilot, Grok, DeepSeek, Mistral, Qwen and Kimi",
			"Checks every prompt up to 4 times a day and keeps every answer in full",
			"Share of voice, sentiment and position against competitors",
			"Citation analysis: which domains and pages each AI engine cites",
			"Ranked opportunities: which pages to write, update or get listed on",
			"Unlimited seats, REST API and MCP server on every plan",
		],
		offers: {
			"@type": "AggregateOffer",
			lowPrice: String(CLOUD_ENTRY_PRICE_USD),
			highPrice: String(Math.max(...plans.map((plan) => plan.monthlyPriceUsd))),
			priceCurrency: "USD",
			offerCount: plans.length,
			offers: plans.map((plan) => monthlyOffer(`${plan.name} plan`, plan.monthlyPriceUsd, "/pricing")),
		},
		publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
	});
}

/* The agency as a Service, with its three monthly plans as offers. */
export function agencyServiceJsonLd() {
	return jsonLd({
		"@type": "Service",
		name: `${SITE_NAME} AI Search Agency`,
		serviceType: "Answer engine optimization agency",
		description:
			"A monthly service that does the work the CiteRank.com tracker ranks: new and updated pages, review site and best-of list pitches, forum answers, guest articles and crawler fixes, reported with the AI answers before and after.",
		url: canonicalUrl("/agency"),
		provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
		areaServed: "Worldwide",
		offers: AGENCY_PLANS.map((plan) => monthlyOffer(`${plan.name} agency plan`, plan.monthlyPriceUsd, "/agency")),
	});
}

export function articleJsonLd({ title, description, path }: { title: string; description: string; path: string }) {
	return jsonLd({
		"@type": "TechArticle",
		headline: title,
		description,
		url: canonicalUrl(path),
		publisher: {
			"@type": "Organization",
			name: SITE_NAME,
			url: SITE_URL,
		},
	});
}

export function blogPostingJsonLd({
	title,
	description,
	path,
	datePublished,
	dateModified,
	authorName,
}: {
	title: string;
	description: string;
	path: string;
	datePublished: string;
	dateModified?: string;
	/** A real person's name. Omit for AI-generated posts — the org is credited. */
	authorName?: string;
}) {
	return jsonLd({
		"@type": "BlogPosting",
		headline: title,
		description,
		url: canonicalUrl(path),
		datePublished,
		...(dateModified ? { dateModified } : {}),
		author: authorName
			? { "@type": "Person", name: authorName }
			: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
		publisher: {
			"@type": "Organization",
			name: SITE_NAME,
			url: SITE_URL,
			logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
		},
	});
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
	return jsonLd({
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: canonicalUrl(item.path),
		})),
	});
}

/**
 * FAQPage schema — the question/answer pairs an answer engine is most likely to
 * lift verbatim. Pair it with a visibly rendered FAQ (the <Faq> component, or
 * the blog FAQ block) so the markup and the content stay in sync.
 */
export function faqJsonLd(items: { question: string; answer: string }[]) {
	return jsonLd({
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	});
}

/**
 * ItemList schema for roundup/listicle and directory pages. Provide `path` for a
 * site-relative item (canonicalized here) or `url` for an absolute one (e.g. an
 * external vendor); `description` is optional.
 */
export function itemListJsonLd(items: { name: string; path?: string; url?: string; description?: string }[]) {
	return jsonLd({
		"@type": "ItemList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			...(item.path
				? { url: canonicalUrl(item.path) }
				: item.url
					? { url: item.url.startsWith("http") ? item.url : canonicalUrl(item.url) }
					: {}),
			...(item.description ? { description: item.description } : {}),
		})),
	});
}

/** CiteRank.com's entry for a comparison ItemList. */
export const ELMO_LISTING = { name: SITE_NAME, url: SITE_URL };

/**
 * ItemList of the software products weighed on a comparison page, each as a
 * SoftwareApplication. Honest structured data for "X vs Y" and "X vs Y vs Z"
 * pages: it names the tools compared so answer engines can parse the matchup,
 * without asserting prices or ratings we don't have for other vendors. Pair it
 * with softwareApplicationJsonLd() so CiteRank.com's prices are stated explicitly.
 */
export function comparisonJsonLd(tools: { name: string; url?: string }[]) {
	return jsonLd({
		"@type": "ItemList",
		itemListElement: tools.map((tool, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "SoftwareApplication",
				name: tool.name,
				applicationCategory: "BusinessApplication",
				...(tool.url ? { url: tool.url } : {}),
			},
		})),
	});
}

/**
 * DefinedTermSet schema for the glossary. Each term is a DefinedTerm; `url` is
 * an optional "see also" target (canonicalized when site-relative).
 */
export function definedTermSetJsonLd({
	name,
	description,
	path,
	terms,
}: {
	name: string;
	description?: string;
	path?: string;
	terms: { term: string; definition: string; url?: string }[];
}) {
	return jsonLd({
		"@type": "DefinedTermSet",
		name,
		...(description ? { description } : {}),
		...(path ? { url: canonicalUrl(path) } : {}),
		hasDefinedTerm: terms.map((t) => ({
			"@type": "DefinedTerm",
			name: t.term,
			description: t.definition,
			...(t.url ? { url: t.url.startsWith("http") ? t.url : canonicalUrl(t.url) } : {}),
		})),
	});
}

/** HowTo schema for step-by-step guides (e.g. tracking a brand in AI search). */
export function howToJsonLd({
	name,
	description,
	steps,
}: {
	name: string;
	description?: string;
	steps: { name: string; text: string }[];
}) {
	return jsonLd({
		"@type": "HowTo",
		name,
		...(description ? { description } : {}),
		step: steps.map((step, index) => ({
			"@type": "HowToStep",
			position: index + 1,
			name: step.name,
			text: step.text,
		})),
	});
}
