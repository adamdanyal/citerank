import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";
import { AGENCY_PLANS, FOUNDING_DISCOUNT, formatUsd, foundingPriceUsd, planPrice } from "@/lib/agency-plans";

export interface FaqItem {
	question: string;
	answer: string;
	/** Phrases in `answer` to render as links. The FAQPage JSON-LD keeps the plain text. */
	links?: { text: string; href: string }[];
}

/*
 * Every answer is three short sentences of about the same length, 205 to 232
 * characters: the answer itself first, then two facts that back it. An answer
 * engine lifts a passage of about forty words, and a visitor reads a list
 * whose answers are all one size. The detail lives on the page each answer is about.
 */
const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

const FREE = `No. CiteRank.com has no free plan or free trial, and no per-seat pricing either. Plans start at $${CLOUD_ENTRY_PRICE_USD}/mo with no sales call, and you can cancel any time from your billing settings. The AI search agency can do the work for you.`;

// Homepage FAQ. Rendered visibly on "/" and emitted as FAQPage JSON-LD from the
// same route, so the structured data always matches what a reader (or an AI
// crawler) sees on the page.
export const HOME_FAQS: FaqItem[] = [
	{
		question: "What is CiteRank.com?",
		answer: `CiteRank.com is an AI visibility tracker and AI search agency. It shows how ChatGPT, Gemini and ${ENGINE_COUNT - 2} other AI apps mention your brand, which competitors they name and which sources they cite. Plans start at $${CLOUD_ENTRY_PRICE_USD}/mo.`,
	},
	{
		question: "What is answer engine optimization (AEO)?",
		answer:
			"Answer engine optimization (AEO) is the work of getting AI answer engines to mention and cite your brand. It is also called GEO or LLM optimization (LLMO). The goal is to be the source an AI quotes in its answer.",
	},
	{
		question: "What is the difference between AEO, GEO, and SEO?",
		answer:
			"SEO ranks your pages in search results. AEO and GEO are two names for one newer job: getting your brand named and cited inside AI answers like ChatGPT’s. They overlap, because AI engines search the web and cite the pages they find.",
	},
	{
		question: "Which AI models does CiteRank.com track?",
		answer: `CiteRank.com tracks ${ENGINE_COUNT} AI apps. They are ChatGPT, Google AI Mode, AI Overviews, Bing AI Mode, Gemini, Claude, Perplexity, Grok, Meta, Mistral, DeepSeek, Qwen and Kimi. ChatGPT is read from the real app, as your customers see it.`,
	},
	{
		question: "How is AI visibility measured?",
		answer:
			"CiteRank.com asks AI your buyers’ questions on a schedule and counts how often the answers name your brand. That share, from 0 to 100%, is your visibility. It also reports share of voice, sentiment and position.",
	},
	{
		question: "How do I track my brand in ChatGPT?",
		answer:
			"Add your website to CiteRank.com and it suggests the questions your buyers ask. It then asks ChatGPT on a schedule and records every answer. You see whether you were named, which competitors were, and which sources were cited.",
	},
	{
		question: "How much does CiteRank.com cost compared to Profound?",
		answer: `CiteRank.com starts at $${CLOUD_ENTRY_PRICE_USD}/mo with public prices and no sales call. Profound’s pricing page lists a free trial and an Enterprise plan quoted by sales. Pro costs $${PLANS.pro.monthlyPriceUsd}/mo and Business $${PLANS.business.monthlyPriceUsd}/mo, each with more brands and prompts.`,
	},
	{
		question: "Is CiteRank.com free?",
		answer: FREE,
	},
];

// Pricing page FAQ.
export const PRICING_FAQS: FaqItem[] = [
	{
		question: "Is CiteRank.com free?",
		answer: FREE,
	},
	{
		question: "Do you offer custom plans beyond the Business plan?",
		answer: `Yes. If you need more than the ${PLANS.business.maxBrands} brands and ${PLANS.business.maxPrompts} prompts on Business, or more frequent checks, we can price a custom plan. Business checks each prompt up to ${PLANS.business.standardRunsPerDay} times a day. Email team@citerank.com to talk it through.`,
		links: [{ text: "team@citerank.com", href: "mailto:team@citerank.com" }],
	},
	{
		question: "Can agencies white-label CiteRank.com?",
		answer: `No. CiteRank.com has no white-label option. Agencies track client brands on one account with unlimited seats: ${PLANS.pro.maxBrands} brands on Pro and ${PLANS.business.maxBrands} on Business. If you manage more brands than that, get in touch about a custom plan.`,
	},
	{
		question: "Can I cancel my CiteRank.com plan any time?",
		answer:
			"Yes. Plans are billed month to month, or yearly to save two months. You can cancel any time from your billing settings, and there is no minimum term. You never need a sales call, whether to start or to stop a plan.",
	},
	{
		question: "Do I need a credit card to get started?",
		answer:
			"Yes. Every CiteRank.com plan is paid, so you pay by card when you sign up. Then you add your website, choose your AI apps and start tracking. There is no free plan or free trial, and you can cancel any time.",
	},
	{
		question: "Do I need to talk to sales to sign up for the tracker?",
		answer:
			"No. The tracker is self-serve: you sign up, pick a plan and start tracking without a demo or a sales call. Every plan includes unlimited seats, the API and the MCP server. Only a custom plan needs a conversation.",
	},
	{
		question: "How often does CiteRank.com run my prompts?",
		answer: `Every plan asks each prompt up to ${PLANS.basic.standardRunsPerDay} times a day on every AI app you choose. Premium models such as GPT Search, and Claude and Grok on the web, answer with web search on and are asked once a day. A custom plan can ask more often.`,
	},
	{
		question: "Does CiteRank.com have an API or MCP server?",
		answer:
			"Yes. Every plan includes a REST API and an MCP server. Tools like Claude Code, Codex and Cursor can read your visibility data and manage your prompts. API keys can be read-only or read-write, and limited to specific brands.",
	},
	{
		question: "Is the AI search agency included in a plan?",
		answer:
			"No. The AI search agency is a separate service that does the work for you every month. It writes the pages your site is missing and reports the AI answers before and after. Book a call to talk it through with us.",
		links: [{ text: "Book a call", href: "/agency" }],
	},
];

// About page FAQ. Company facts answer engines get wrong when a brand leaves
// them unstated: who runs it, where it is, and how it is paid for.
export const ABOUT_FAQS: FaqItem[] = [
	{
		question: "Who founded CiteRank.com?",
		answer:
			"Adam Danyal and Julia Danyal founded CiteRank.com. Adam has more than 2 million LinkedIn followers and Julia more than 360,000. They also run Chief AI Leader, an AI certification for leaders, and the AI For Leaders newsletter.",
	},
	{
		question: "Who owns CiteRank.com?",
		answer:
			"CiteRank.com is a trading name of Danx Digital Limited. The company is registered in the United Kingdom under company number 13275434. It runs both the AI Visibility Tracker and the AI search agency from London.",
	},
	{
		question: "Where is CiteRank.com based?",
		answer:
			"CiteRank.com is based in London, in the United Kingdom. Danx Digital Limited, the company behind it, is registered at 86-90 Paul Street, London EC2A 4NE. The tracker is a hosted web app, so you can use it from anywhere.",
	},
	{
		question: "Is CiteRank.com open source?",
		answer:
			"No. CiteRank.com is a hosted product built on Elmo, an open-source AI visibility tracker. The CiteRank.com service itself is not open source, and there is nothing to self-host. You sign up and use it in your browser.",
		links: [{ text: "Elmo", href: "https://github.com/elmohq/elmo" }],
	},
	{
		question: "Does CiteRank.com require an annual contract?",
		answer:
			"No. CiteRank.com is billed month to month, and you can cancel any time. Yearly billing is optional and saves two months. Only a custom plan, for more brands or checks than the listed plans, goes through a conversation.",
	},
	{
		question: "Is CiteRank.com an AEO, GEO, or AI SEO tool?",
		answer:
			"All three. AEO, GEO and AI SEO are names for the same work. That work is getting your brand mentioned and cited in AI answers from ChatGPT, Perplexity and AI Overviews. CiteRank.com measures that visibility so you can improve it.",
	},
	{
		question: "Where does the name CiteRank.com come from?",
		answer:
			"The name joins cite and rank. Cite is what an AI does when it names a source, and rank is where a brand stands against its competitors in an answer. CiteRank.com tracks both: the sources AI cites and where you rank.",
	},
];

// AI search agency FAQ. Rendered on "/agency" and emitted as FAQPage JSON-LD
// from the same route.
const AGENCY_PRICES = new Intl.ListFormat("en-GB", { type: "disjunction" }).format(AGENCY_PLANS.map(planPrice));
const [ENTRY, , TOP] = AGENCY_PLANS;

export const AGENCY_FAQS: FaqItem[] = [
	{
		question: "What does the AI search agency do?",
		answer:
			"Every month the agency writes the pages your site is missing and updates those AI stopped citing. It pitches the review sites and lists AI cites, and answers buyers in forums. It also fixes what stops AI crawlers reading your site.",
	},
	{
		question: "How much does the AI search agency cost?",
		answer: `Agency plans cost ${AGENCY_PRICES} a month. The price depends on how much work you want each month and how many markets it covers for your brand. Each plan includes a tracker plan and has a three-month minimum.`,
	},
	{
		question: "What is the founding-client rate?",
		answer: `The founding-client rate is ${FOUNDING_DISCOUNT * 100}% off the first six months, for our first five agency clients. ${ENTRY.name} then costs ${formatUsd(foundingPriceUsd(ENTRY))} a month for those six months. In return we publish a case study of the results, once the client approves it.`,
	},
	{
		question: "Why is there a three-month minimum?",
		answer:
			"AI answer engines take weeks to find new and updated pages and start citing them. A single month of work rarely shows a change in the answers. After the first three months, every agency plan runs month to month.",
	},
	{
		question: "How does the agency decide what to work on?",
		answer:
			"The agency works from what the tracker ranks each week. That list covers questions where a competitor is named instead of you, pages AI stopped citing and sites that leave you out. Each guest article targets one such question.",
	},
	{
		question: "How do you report on the work?",
		answer: `Each month a report lists every piece of work and the question it targets. It shows the AI answers before and after, so you can see what changed. Every plan includes a call to go through it, monthly or more often.`,
	},
	{
		question: "Can I use the tracker without the agency?",
		answer: `Yes. You can use the tracker on its own. It shows what AI says about you and ranks what to do next, and many teams do that work themselves. Tracker plans start at $${CLOUD_ENTRY_PRICE_USD}/mo and include your whole team and the API.`,
		links: [{ text: "Tracker plans", href: "/pricing" }],
	},
];

// AI Visibility Tool Directory FAQ.
export const DIRECTORY_FAQS: FaqItem[] = [
	{
		question: "What is an AI visibility tool?",
		answer:
			"An AI visibility tool tracks how AI answer engines like ChatGPT and Gemini mention and cite your brand. It measures how often you appear in AI answers. It also shows which competitors appear and which sources the models cite.",
	},
	{
		question: "What is answer engine optimization (AEO)?",
		answer:
			"Answer engine optimization (AEO), also called generative engine optimization (GEO), is the work of getting AI to mention and cite your brand. AI visibility tools measure that presence. You can then track and improve it over time.",
	},
	{
		question: "How do I choose the best AI visibility tool?",
		answer: `The right tool depends on which AI engines you need to track, your budget, and whether you want an agency or a white-label option. This directory compares 100+ tools feature by feature. CiteRank.com starts at $${CLOUD_ENTRY_PRICE_USD}/mo.`,
	},
	{
		question: "Is there an AI visibility tool with an agency?",
		answer: `Yes. CiteRank.com is an AI visibility tracker with an AI search agency. You can track ${ENGINE_COUNT} AI apps yourself and read every answer in full. The agency can do the work every month, from new pages to review-site listings.`,
	},
	{
		question: "How does AI visibility tracking work?",
		answer:
			"AI visibility tracking runs a fixed set of prompts across AI engines on a schedule. It records whether each answer mentions your brand, cites your site and how it describes you. Sampling over time shows trends one check would miss.",
	},
	{
		question: "Can you track brand mentions in ChatGPT?",
		answer:
			"Yes. AI visibility software asks ChatGPT your prompts on a schedule and records whether it mentions or cites your brand. Answers vary between runs, so one manual check is unreliable. CiteRank.com does this on every plan.",
	},
];
