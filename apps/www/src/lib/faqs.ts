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
			"Answer engine optimization (AEO), also called generative engine optimization (GEO) or LLM optimization (LLMO), is the practice of measuring and improving how often AI answer engines mention and cite your brand. Instead of ranking in a list of blue links, the goal is to be the source an AI quotes in its answer. (Cite and rank are also where CiteRank.com gets its name.)",
	},
	{
		question: "What is the difference between AEO, GEO and SEO?",
		answer:
			"SEO is about ranking pages in traditional search results, while AEO and GEO are two names for the same newer discipline: getting mentioned and cited inside AI-generated answers from tools like ChatGPT, Perplexity, and Google AI Overviews. The two overlap, because AI engines run web searches and cite the pages they find, but success is measured differently: by how often and how favorably an AI names your brand, not by your position on a results page. CiteRank.com measures the AEO side, including the web searches AI engines fan a prompt out into and the sources they cite.",
	},
	{
		question: "Which AI apps does CiteRank.com track?",
		answer:
			"CiteRank.com tracks ChatGPT, Google AI Mode, Google AI Overviews, Gemini, Perplexity, Copilot, and Claude, plus models like Grok, Mistral, DeepSeek, Qwen, and Kimi. Consumer products like ChatGPT and Google AI Mode are scraped from the real interface your customers see, not approximated through an API. For each answer, CiteRank.com records whether your brand appears, which competitors show up alongside it, and which sources the model cites.",
	},
	{
		question: "How is AI visibility measured?",
		answer:
			"CiteRank.com asks a fixed set of questions in each AI app on a schedule and scores each question by how often your business appears in the answers, from 0 to 100%. It also calculates share of voice (your share of brand mentions against your competitors), sentiment (whether the answers that name you praise or criticize you, scored 0 to 100) and position (where you rank among the businesses an answer names), and shows which websites and pages the answers cite. AI answers vary from run to run, so CiteRank.com asks each question repeatedly and reports trends.",
	},
	{
		question: "How do I track my brand in ChatGPT?",
		answer:
			"Add your website to CiteRank.com and its Prompt Wizard generates the questions your buyers are likely to ask ChatGPT, based on your products, competitors, and personas. CiteRank.com then runs those prompts in ChatGPT on a schedule and records every answer: whether your brand was mentioned, which competitors were named, and which sources were cited. Every CiteRank.com plan includes ChatGPT, starting with the $29/mo Starter plan.",
	},
	{
		question: "How much does CiteRank.com cost compared to Profound?",
		answer:
			"CiteRank.com is cheaper and simpler to buy. Profound's pricing page lists a free trial and an Enterprise plan quoted by sales, while CiteRank.com is self-serve with public prices, starting at $29/mo for the Starter plan. From the $99/mo Basic plan, every prompt is checked 4× a day, where Profound checks daily. Pro ($299/mo) and Business ($649/mo) add more brands, more prompts, and premium grounded models. The AI search agency is a separate service: book a call to talk it through.",
		links: [{ text: "book a call", href: "/agency" }],
	},
	{
		question: "Do I need a sales call?",
		answer:
			"No. The tracker is fully self-serve: you sign up, pick a plan, and start tracking without a demo or sales call. Billing is month to month, you can cancel any time, and yearly billing saves two months. Only custom plans (more brands, more prompts, or more frequent checks) go through a conversation.",
	},
];

// Pricing page FAQ.
export const PRICING_FAQS: FaqItem[] = [
	{
		question: "Do I need to talk to sales to sign up for the tracker?",
		answer:
			"No. The tracker is fully self-serve: you sign up, pick a plan, and start tracking without a demo or sales call. Every plan includes unlimited seats plus API and MCP access, and yearly billing saves two months. Only custom contracts (higher sampling rates, more brands, or custom limits) go through a conversation.",
	},
	{
		question: "How often does CiteRank.com run my prompts?",
		answer:
			"On CiteRank.com, the Starter plan runs each prompt once a day, and the Basic, Pro, and Business plans run each prompt up to 4 times a day on every platform you choose. Premium grounded models (GPT Search, and Claude and Grok on the web) run once a day, and custom plans can sample more often.",
	},
	{
		question: "Does CiteRank.com have an API or MCP server?",
		answer:
			"Yes. CiteRank.com has a REST API for brands, prompts, competitors, analytics, sentiment, citations, runs, and opportunities, and an MCP server so AI assistants like Claude Code, Codex, Cursor, and VS Code can query your visibility data and manage prompts directly. Both are included on every CiteRank.com plan, from Starter to Business. API keys are issued from Settings, can be read-only or read-write, and can be limited to specific brands.",
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
			"Adam Danyal (more than 2 million LinkedIn followers) and Julia Danyal (more than 360,000), who run Chief AI Leader, an exam-based AI certification for leaders, and AI For Leaders, a daily AI newsletter read by more than 50,000 leaders.",
	},
	{
		question: "Who owns CiteRank.com?",
		answer:
			"CiteRank.com is a trading name of Danx Digital Limited, a company registered in the United Kingdom (company number 13275434). It provides the AI Visibility Tracker and the AI search agency.",
	},
	{
		question: "Where is CiteRank.com based?",
		answer:
			"In London. Danx Digital Limited, the company behind CiteRank.com, is registered at 86-90 Paul Street, London EC2A 4NE. The tracker is a hosted web app, so you can use it from anywhere.",
	},
	{
		question: "Does CiteRank.com require an annual contract?",
		answer:
			"No. The tracker is billed month to month and you can cancel any time. Yearly billing is optional and saves two months. Only custom plans go through a conversation.",
	},
	{
		question: "Is CiteRank.com an AEO, GEO or AI SEO tool?",
		answer:
			"All three. Answer engine optimization (AEO), generative engine optimization (GEO) and AI SEO are names for the same work: getting your business named and cited in answers from ChatGPT, Perplexity, Google AI Overviews and other AI apps. The CiteRank.com tracker measures that, and its agency does the work.",
	},
	{
		question: "Where does the name CiteRank.com come from?",
		answer:
			"It joins cite, what an AI does when it names a source, with rank, where a business stands against its competitors in those answers. CiteRank.com tracks both: which sources each AI cites, and where you rank among the brands it names.",
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
