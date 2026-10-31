export interface FaqItem {
	question: string;
	answer: string;
	/** Phrases in `answer` to render as links. The FAQPage JSON-LD keeps the plain text. */
	links?: { text: string; href: string }[];
}

// Homepage FAQ. Rendered visibly on "/" and emitted as FAQPage JSON-LD from the
// same route, so the structured data always matches what a reader (or an AI
// crawler) sees on the page.
export const HOME_FAQS: FaqItem[] = [
	{
		question: "What is CiteRank.com?",
		answer:
			"CiteRank.com is an AI visibility tracker and AI search agency. The AI Visibility Tracker puts your buyers' questions to ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, DeepSeek, Mistral, Qwen, Kimi, Google AI Overviews and Google AI Mode, up to four times a day, and shows how often each one names you against your competitors. About once a week it ranks what to do next. The AI search agency does that work for businesses that would rather hand it over.",
	},
	{
		question: "What is answer engine optimization (AEO)?",
		answer:
			"Answer engine optimization (AEO), also called generative engine optimization (GEO) or AI SEO, is the practice of measuring and improving how of12 AI apps name and cite your business. The goal is to be one of the businesses an AI names in its answer, with your pages among the sources it cites.",
	},
	{
		question: "What is the difference between AEO, GEO and SEO?",
		answer:
			"SEO ranks pages in traditional search results. AEO and GEO are two names for one newer discipline: getting named and cited inside answers from ChatGPT, Perplexity, Google AI Overviews and other AI apps. The two overlap, because AI apps run web searches and cite the pages they find, but AEO is measured by how often and how favorably an AI names your business. CiteRank.com measures the AEO side, including the web searches an AI runs before answering and the sources it cites.",
	},
	{
		question: "Which AI apps does CiteRank.com track?",
		answer:
			"ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, DeepSeek, Mistral, Qwen, Kimi, Google AI Overviews and Google AI Mode. ChatGPT, Gemini, Perplexity, Copilot, Google AI Overviews and Google AI Mode are read from the same interface your buyers use. For each answer, CiteRank.com records whether you are named, which competitors appear with you, and which sources the AI cites.",
	},
	{
		question: "How is AI visibility measured?",
		answer:
			"CiteRank.com asks a fixed set of questions in each AI app on a schedule and scores each question by how often your business appears in the answers, from 0 to 100%. It also calculates share of voice (your share of brand mentions against your competitors), sentiment (whether the answers that name you praise or criticize you, scored 0 to 100) and position (where you rank among the businesses an answer names), and shows which websites and pages the answers cite. AI answers vary from run to run, so CiteRank.com asks each question repeatedly and reports trends.",
	},
	{
		question: "What does the AI search agency do?",
		answer:
			"It does the work the tracker ranks, every month. The agency writes the comparison, alternatives and guide pages your site is missing, updates pages AI has stopped citing, gets you onto the review sites and best-of lists AI cites, answers buyers' questions in forums and communities, publishes guest articles on high-authority sites AI already cites, and fixes anything that stops AI crawlers reading your site. Each month a report lists every piece of work, the question it targets, and the AI answers before and after.",
	},
	{
		question: "How much does CiteRank.com cost?",
		answer:
			"The AI Visibility Tracker costs $29/mo on Starter, $99/mo on Basic, $299/mo on Pro and $649/mo on Business. Yearly billing saves two months. Every plan includes unlimited seats and API and MCP access. The AI search agency is a separate service: book a call to talk it through.",
		links: [{ text: "book a call", href: "/agency" }],
	},
	{
		question: "Do I need to talk to sales?",
		answer:
			"No. The tracker is self-serve: sign up, pick a plan and start tracking. Billing is month to month, and you can cancel any time.",
	},
];

// Pricing page FAQ.
export const PRICING_FAQS: FaqItem[] = [
	{
		question: "Do I need to talk to sales to use the tracker?",
		answer:
			"No. Sign up, pick a plan and start tracking without a demo or sales call. Every plan includes unlimited seats plus API and MCP access, and yearly billing saves two months. Only custom plans go through a conversation.",
	},
	{
		question: "How often does CiteRank.com ask my questions?",
		answer:
			"The Starter plan asks each question once a day. Basic, Pro and Business ask each question up to four times a day in every AI app you choose. Premium models (GPT Search, and Claude and Grok on the web) run once a day.",
	},
	{
		question: "Does CiteRank.com have an API or MCP server?",
		answer:
			"Yes. A REST API covers brands, prompts, competitors, analytics, sentiment, citations, runs and opportunities, and an MCP server lets AI assistants such as Claude Code, Codex, Cursor and VS Code read your visibility data and manage prompts. Both come with every plan. API keys can be read-only or read-write and limited to specific brands.",
	},
	{
		question: "Is the AI search agency included in a plan?",
		answer:
			"No. The agency is a separate service for businesses that want the work done for them every month. Book a call to talk it through.",
		links: [{ text: "Book a call", href: "/agency" }],
	},
	{
		question: "Can I cancel any time?",
		answer:
			"Yes. Plans are billed month to month unless you choose yearly billing, and you can cancel any time from your billing settings.",
	},
	{
		question: "Do you offer custom plans?",
		answer:
			"Yes, for more brands, more prompts or more frequent checks than the listed plans. Email team@citerank.com.",
		links: [{ text: "team@citerank.com", href: "mailto:team@citerank.com" }],
	},
];

// About page FAQ. Company facts answer engines get wrong when a brand leaves
// them unstated: who runs it, where it is, and how it is paid for.
export const ABOUT_FAQS: FaqItem[] = [
	{
		question: "Who founded CiteRank.com?",
		answer:
			"Adam Danyal, who has more than 2 million LinkedIn followers, and Julia Danyal, who has more than 360,000. They also run Chief AI Leader, an exam-based AI certification for leaders, and AI For Leaders, a daily AI newsletter read by more than 50,000 leaders.",
	},
	{
		question: "Who owns CiteRank.com?",
		answer:
			"CiteRank.com is a trading name of Danx Digital Limited, a company registered in the United Kingdom (company number 13275434).",
	},
	{
		question: "Where is CiteRank.com based?",
		answer:
			"In London. Danx Digital Limited, the company behind CiteRank.com, is registered at 86-90 Paul Street, London EC2A 4NE.",
	},
	{
		question: "Does CiteRank.com require an annual contract?",
		answer:
			"No. The tracker is billed month to month and you can cancel any time. Yearly billing is optional and saves two months.",
	},
	{
		question: "Is CiteRank.com an AEO, GEO or AI SEO tool?",
		answer:
			"All three. Answer engine optimization (AEO), generative engine optimization (GEO) and AI SEO are names for the same work: getting your business named and cited in answers from ChatGPT, Perplexity, Google AI Overviews and other AI apps. The CiteRank.com tracker measures that, and its agency does the work.",
	},
	{
		question: "Where does the name CiteRank.com come from?",
		answer:
			"It joins cite, what an AI does when it names a source, with rank, where a business stands against its competitors in those answers.",
	},
];

// AI search agency FAQ. Rendered on "/agency" and emitted as FAQPage JSON-LD
// from the same route.
export const AGENCY_FAQS: FaqItem[] = [
	{
		question: "What does the AI search agency do?",
		answer:
			"Every month it writes the comparison, alternatives and guide pages your site is missing, updates pages AI has stopped citing, gets you onto the review sites and best-of lists AI cites, answers buyers' questions in forums and communities, publishes guest articles on high-authority sites AI already cites, and fixes anything that stops AI crawlers reading your site.",
	},
	{
		question: "How does the agency decide what to work on?",
		answer:
			"It works from what the AI Visibility Tracker ranks about once a week: the questions where competitors are named instead of you, the pages AI no longer cites, and the review sites, lists and forum threads that leave you out. Each guest article is aimed at a question where a competitor is named instead.",
	},
	{
		question: "How do you report on the work?",
		answer:
			"Each month a report lists every piece of work, the question it targets, and the AI answers before and after.",
	},
	{
		question: "Can I use the tracker without the agency?",
		answer:
			"Yes. The tracker shows what AI says about you and ranks what to do next, and many teams do that work themselves. Tracker plans start at $29/mo.",
		links: [{ text: "Tracker plans", href: "/pricing" }],
	},
];

// AI Visibility Tool Directory FAQ.
export const DIRECTORY_FAQS: FaqItem[] = [
	{
		question: "What is an AI visibility tool?",
		answer:
			"An AI visibility tool tracks how AI answer engines like ChatGPT, Perplexity, Gemini and Google AI Overviews mention and cite your brand. It measures how often you appear in AI answers, which competitors show up alongside you, and which sources the models reference.",
	},
	{
		question: "What is answer engine optimization (AEO)?",
		answer:
			"Answer engine optimization (AEO), also called generative engine optimization (GEO), is the practice of improving how often AI answer engines mention and cite your brand. AI visibility tools measure that presence so you can track and improve it over time.",
	},
	{
		question: "How do I choose the best AI visibility tool?",
		answer:
			"The right tool depends on which AI engines you need to track, how often you need answers checked, your budget, and whether you want someone to do the work for you. This directory compares 100+ tools feature by feature. CiteRank.com tracks 12 AI apps up to four times a day from $29/mo, and its AI search agency can do the work the tracker ranks.",
	},
	{
		question: "How does AI visibility tracking work?",
		answer:
			"AI visibility tracking works by running a defined set of prompts across AI engines on a schedule, then recording whether each answer mentions your brand, cites your site, and how it describes you. Sampling over time reveals trends a one-off check would miss.",
	},
	{
		question: "Can you track brand mentions in ChatGPT?",
		answer:
			"Yes. AI visibility software queries ChatGPT with your prompts and records whether it mentions or cites your brand. Because answers vary between runs, tracking a consistent prompt set on a schedule gives a far more reliable read than a single manual check. CiteRank.com does this for ChatGPT on every plan, reading answers from the real ChatGPT app rather than only the API.",
	},
];
