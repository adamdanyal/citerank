import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";
import { AGENCY_PLANS, FOUNDING_DISCOUNT, formatUsd } from "@/lib/agency-plans";

export interface FaqItem {
	question: string;
	answer: string;
	/** Phrases in `answer` to render as links. The FAQPage JSON-LD keeps the plain text. */
	links?: { text: string; href: string }[];
}

/*
 * Every answer is two short sentences of about the same length, 140 to 170
 * characters: the answer itself first, then the one fact that backs it. An
 * answer engine quotes a sentence or two, and a visitor reads a list whose
 * answers are all one size. The detail lives on the page each answer is about.
 */
const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

// Homepage FAQ. Rendered visibly on "/" and emitted as FAQPage JSON-LD from the
// same route, so the structured data always matches what a reader (or an AI
// crawler) sees on the page.
export const HOME_FAQS: FaqItem[] = [
	{
		question: "What is CiteRank.com?",
		answer: `CiteRank.com is an AI visibility tracker and AI search agency. It shows how ChatGPT, Gemini and ${ENGINE_COUNT - 2} other AI apps mention your brand, from $${CLOUD_ENTRY_PRICE_USD}/mo.`,
	},
	{
		question: "What is answer engine optimization (AEO)?",
		answer:
			"Answer engine optimization (AEO) is the work of getting AI answer engines to mention and cite your brand. It is also called GEO or LLM optimization (LLMO).",
	},
	{
		question: "What is the difference between AEO, GEO, and SEO?",
		answer:
			"SEO ranks your pages in search results. AEO and GEO are two names for one newer job: getting your brand named and cited inside AI answers like ChatGPT’s.",
	},
	{
		question: "Which AI models does CiteRank.com track?",
		answer: `CiteRank.com tracks ${ENGINE_COUNT} AI apps: ChatGPT, Google AI Mode, AI Overviews, Bing AI Mode, Gemini, Claude, Perplexity, Grok, Meta, Mistral, DeepSeek, Qwen and Kimi.`,
	},
	{
		question: "How is AI visibility measured?",
		answer:
			"CiteRank.com asks AI your buyers’ questions on a schedule and counts how often the answers name your brand. That share, from 0 to 100%, is your visibility.",
	},
	{
		question: "How do I track my brand in ChatGPT?",
		answer:
			"Add your website to CiteRank.com and it suggests the questions your buyers ask. It then asks ChatGPT on a schedule and records every answer, on every plan.",
	},
	{
		question: "How much does CiteRank.com cost compared to Profound?",
		answer: `CiteRank.com starts at $${CLOUD_ENTRY_PRICE_USD}/mo with public prices and no sales call. Profound’s pricing page lists a free trial and an Enterprise plan quoted by sales.`,
	},
	{
		question: "Is CiteRank.com free?",
		answer: `No. CiteRank.com has no free plan or free trial. Plans start at $${CLOUD_ENTRY_PRICE_USD}/mo with no per-seat charge and no sales call, and you can cancel whenever you like.`,
	},
];

// Pricing page FAQ.
export const PRICING_FAQS: FaqItem[] = [
	{
		question: "Is CiteRank.com free?",
		answer: `No. CiteRank.com has no free plan or free trial. Plans start at $${CLOUD_ENTRY_PRICE_USD}/mo with no per-seat charge and no sales call, and you can cancel whenever you like.`,
	},
	{
		question: "Do you offer custom plans beyond the Business plan?",
		answer: `Yes. If you need more than the ${PLANS.business.maxBrands} brands and ${PLANS.business.maxPrompts} prompts on Business, or more frequent checks, email team@citerank.com and we will price it.`,
		links: [{ text: "team@citerank.com", href: "mailto:team@citerank.com" }],
	},
	{
		question: "Can agencies white-label CiteRank.com?",
		answer: `No. CiteRank.com has no white-label option. Agencies track client brands on one account with unlimited seats: ${PLANS.pro.maxBrands} brands on Pro and ${PLANS.business.maxBrands} on Business.`,
	},
	{
		question: "Can I cancel my CiteRank.com plan any time?",
		answer:
			"Yes. Plans are billed month to month, or yearly to save two months. You can cancel any time from your billing settings, and there is no minimum term.",
	},
	{
		question: "Do I need a credit card to get started?",
		answer:
			"Yes. Every CiteRank.com plan is paid, so you pay by card when you sign up. Then you add your website, choose your AI apps and start tracking.",
	},
	{
		question: "Do I need to talk to sales to sign up for the tracker?",
		answer:
			"No. The tracker is self-serve: you sign up, pick a plan and start tracking without a demo or a sales call. Only a custom plan needs a conversation.",
	},
	{
		question: "How often does CiteRank.com run my prompts?",
		answer:
			"Every plan asks each prompt up to 4 times a day on every AI app you choose. Premium models, which answer with web search on, are asked once a day.",
	},
	{
		question: "Does CiteRank.com have an API or MCP server?",
		answer:
			"Yes. Every plan includes a REST API and an MCP server, so tools like Claude Code, Codex and Cursor can read your visibility data and manage your prompts.",
	},
	{
		question: "Is the AI search agency included in a plan?",
		answer:
			"No. The AI search agency is a separate service that does the work for you every month and reports the AI answers before and after. Book a call to start.",
		links: [{ text: "Book a call", href: "/agency" }],
	},
];

// About page FAQ. Company facts answer engines get wrong when a brand leaves
// them unstated: who runs it, where it is, and how it is paid for.
export const ABOUT_FAQS: FaqItem[] = [
	{
		question: "Who founded CiteRank.com?",
		answer:
			"Adam Danyal, with more than 2 million LinkedIn followers, and Julia Danyal, with more than 360,000. They also run Chief AI Leader and AI For Leaders.",
	},
	{
		question: "Who owns CiteRank.com?",
		answer:
			"CiteRank.com is a trading name of Danx Digital Limited, registered in the United Kingdom as company number 13275434. It runs the tracker and the agency.",
	},
	{
		question: "Where is CiteRank.com based?",
		answer:
			"In London. Danx Digital Limited, the company behind CiteRank.com, is registered at 86-90 Paul Street, London EC2A 4NE. You can use the tracker anywhere.",
	},
	{
		question: "Is CiteRank.com open source?",
		answer:
			"No. CiteRank.com is a hosted product built on Elmo, an open-source AI visibility tracker. There is nothing to self-host: you use it in your browser.",
		links: [{ text: "Elmo", href: "https://github.com/elmohq/elmo" }],
	},
	{
		question: "Does CiteRank.com require an annual contract?",
		answer:
			"No. CiteRank.com is billed month to month and you can cancel any time. Yearly billing is optional and saves two months. Only a custom plan needs a call.",
	},
	{
		question: "Is CiteRank.com an AEO, GEO, or AI SEO tool?",
		answer:
			"All three. AEO, GEO and AI SEO are names for the same work: getting your brand mentioned and cited in AI answers. CiteRank.com measures how often you are.",
	},
	{
		question: "Where does the name CiteRank.com come from?",
		answer:
			"It joins cite, what an AI does when it names a source, with rank, where a brand stands against its competitors in an answer. CiteRank.com tracks both.",
	},
];

// AI search agency FAQ. Rendered on "/agency" and emitted as FAQPage JSON-LD
// from the same route.
const AGENCY_PRICES = new Intl.ListFormat("en-GB", { type: "disjunction" }).format(
	AGENCY_PLANS.map((plan) => formatUsd(plan.monthlyPriceUsd)),
);

export const AGENCY_FAQS: FaqItem[] = [
	{
		question: "What does the AI search agency do?",
		answer:
			"Every month it writes the pages your site is missing, updates the ones AI stopped citing, pitches the review sites AI cites and answers buyers in forums.",
	},
	{
		question: "How much does the AI search agency cost?",
		answer: `Agency plans cost ${AGENCY_PRICES} a month, and each includes a tracker plan. There is a three-month minimum, then it runs month to month.`,
	},
	{
		question: "What is the founding-client rate?",
		answer: `Our first five agency clients get ${FOUNDING_DISCOUNT * 100}% off their first six months. In return we publish a case study of their results, which they approve before it goes live.`,
	},
	{
		question: "Why is there a three-month minimum?",
		answer:
			"AI answer engines take weeks to find new and updated pages and start citing them. A single month of work rarely shows a change in the answers.",
	},
	{
		question: "How does the agency decide what to work on?",
		answer:
			"It works from what the tracker ranks each week: questions where a competitor is named instead of you, pages AI stopped citing, and sites that leave you out.",
	},
	{
		question: "How do you report on the work?",
		answer:
			"Each month a report lists every piece of work, the question it targets, and the AI answers before and after. The two larger plans add a call.",
	},
	{
		question: "Can I use the tracker without the agency?",
		answer: `Yes. The tracker shows what AI says about you and ranks what to do next, and many teams do that work themselves. Tracker plans start at $${CLOUD_ENTRY_PRICE_USD}/mo.`,
		links: [{ text: "Tracker plans", href: "/pricing" }],
	},
];

// AI Visibility Tool Directory FAQ.
export const DIRECTORY_FAQS: FaqItem[] = [
	{
		question: "What is an AI visibility tool?",
		answer:
			"An AI visibility tool tracks how AI answer engines like ChatGPT, Perplexity and Gemini mention and cite your brand, and which competitors appear with you.",
	},
	{
		question: "What is answer engine optimization (AEO)?",
		answer:
			"Answer engine optimization (AEO), also called generative engine optimization (GEO), is the work of getting AI answer engines to mention and cite your brand.",
	},
	{
		question: "How do I choose the best AI visibility tool?",
		answer:
			"Check which AI engines a tool tracks, what it costs, and whether it keeps every answer in full. This directory compares 100+ tools feature by feature.",
	},
	{
		question: "Is there an AI visibility tool with an agency?",
		answer: `Yes. CiteRank.com is an AI visibility tracker with an AI search agency. You can track ${ENGINE_COUNT} AI apps yourself, or have the agency do the work every month.`,
	},
	{
		question: "How does AI visibility tracking work?",
		answer:
			"It runs a fixed set of prompts across AI engines on a schedule and records whether each answer mentions your brand, cites your site and how it describes you.",
	},
	{
		question: "Can you track brand mentions in ChatGPT?",
		answer:
			"Yes. AI visibility software asks ChatGPT your prompts on a schedule and records whether it mentions or cites your brand. CiteRank.com does it on every plan.",
	},
];
