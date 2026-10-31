import { PLANS } from "@workspace/config/plans";
import type { FeatureKey } from "@/lib/competitors";
import type { FaqItem } from "@/lib/faqs";

/** Which product visual sits beside a feature; mapped to a component in components/features.tsx. */
export type FeatureGraphicKey =
	| "overview"
	| "visibility"
	| "share-of-voice"
	| "sentiment"
	| "citations"
	| "query-fan-out"
	| "prompts"
	| "responses"
	| "opportunities"
	| "trend"
	| "api"
	| "engines";

export interface FeatureLink {
	title: string;
	href: string;
	/** Shown above the title, e.g. "Docs" or "Blog". */
	kind: "Docs" | "Blog" | "Glossary" | "Guide" | "Tool directory";
}

export interface ProductFeature {
	slug: string;
	/** Short name for cards, breadcrumbs, and related-feature links. */
	name: string;
	/** H1. Written in the phrasing people search with. */
	title: string;
	metaTitle: string;
	metaDescription: string;
	/** Hero paragraph: a self-contained answer to "what does this do". */
	lede: string;
	/** One or two sentences for the index card. */
	summary: string;
	graphic: FeatureGraphicKey;
	/** A second visual shown beside "What you can do". */
	secondaryGraphic?: FeatureGraphicKey;
	/** "What you can do": three numbered steps. */
	steps: { name: string; text: string }[];
	/** "Data you can act on": the measures the feature reports. */
	metrics: { term: string; definition: string }[];
	useCases: string[];
	why: { name: string; text: string }[];
	/** The docs page that documents the feature in the product. */
	docs: { title: string; href: string };
	guides: FeatureLink[];
	/** Matching tool-directory slices; only the ones with an indexed page are linked. */
	directoryFeatures?: FeatureKey[];
	related: string[];
	faqs: FaqItem[];
}

export const productFeatures: ProductFeature[] = [
	{
		slug: "ai-visibility-tracking",
		name: "AI Visibility Tracking",
		title: "AI Visibility Tracking",
		metaTitle: "AI Visibility Tracking: Monitor Your Brand in ChatGPT & AI Search · CiteRank.com",
		metaDescription:
			"Track how often ChatGPT, Google AI Overviews, Perplexity, Gemini, and other AI engines mention your brand, per prompt and per model, and how that changes over time.",
		lede: "CiteRank.com runs the questions your buyers ask through every AI engine you track, on a schedule, and measures how often the answers mention your brand. See your visibility per prompt and per model, and watch how it moves over weeks and months against your competitors.",
		summary:
			"How often AI answers mention your brand, per prompt and per model, with trends over time against every competitor.",
		graphic: "visibility",
		secondaryGraphic: "trend",
		steps: [
			{
				name: "Track the Prompts That Matter",
				text: "Add the questions your buyers ask AI, or let CiteRank.com suggest them from your website. Each prompt runs against every engine you track, on a schedule.",
			},
			{
				name: "See Where You Show Up",
				text: "Filter by AI model, tags, and time range to see your visibility score for every prompt, with trend lines comparing your brand against competitors.",
			},
			{
				name: "Watch the Trend",
				text: "Look back a week, a month, a year, or over all time to spot the impact of content changes and market shifts.",
			},
		],
		metrics: [
			{
				term: "AI Visibility",
				definition: "The share of AI answers to your prompts that mention your brand.",
			},
			{
				term: "Share of Voice",
				definition: "Your brand's share of every mention of you and your tracked competitors.",
			},
			{
				term: "Sentiment",
				definition: "How favorably AI talks about your brand when it mentions you, from 0 to 100. 50 is neutral.",
			},
			{
				term: "Position",
				definition:
					"Where your brand comes among the tracked companies an answer names, on average. 1 means named first.",
			},
			{
				term: "Per-Prompt Visibility",
				definition: "Each prompt's score and trend, so you can see which questions you win and which you lose.",
			},
			{
				term: "Visibility by Model",
				definition: "You and every tracked competitor, side by side for each AI engine.",
			},
		],
		useCases: [
			"Get a baseline of how visible your brand is in AI answers before you change anything.",
			"Find the prompts and engines where competitors appear and you don't, then focus content work there.",
			"Show whether visibility is improving month over month, on numbers you can trace back to individual answers.",
		],
		why: [
			{
				name: "Scraped From the Real Apps",
				text: "ChatGPT, Google AI Overviews, AI Mode, Gemini, Perplexity, and Copilot are scraped from the interfaces your customers use, with direct APIs for everything else.",
			},
			{
				name: "Documented Methodology",
				text: "How a mention is counted is documented, so you can check every number yourself.",
			},
			{
				name: "Every Answer Behind the Number",
				text: "Click through from any score to the exact responses it was built from.",
			},
		],
		docs: { title: "Visibility tracking docs", href: "/docs/user-guide/visibility" },
		guides: [
			{ kind: "Blog", title: "What metrics matter for AI search visibility?", href: "/blog/iab-ai-visibility-metrics" },
			{
				kind: "Blog",
				title: "Why do two AI visibility tools give your brand different scores?",
				href: "/blog/why-ai-visibility-scores-differ",
			},
			{ kind: "Blog", title: "How often should you run AEO prompt tracking?", href: "/blog/ai-prompt-tracking" },
			{ kind: "Glossary", title: "Visibility score", href: "/glossary/visibility-score" },
		],
		directoryFeatures: ["visibilityScore", "multiLlmTracking"],
		related: ["share-of-voice", "multi-engine-tracking", "prompt-tracking"],
		faqs: [
			{
				question: "How does CiteRank.com measure AI visibility?",
				answer:
					"CiteRank.com runs each of your prompts against the AI engines you track and records every answer. Your visibility is the share of those answers that mention your brand, counting each prompt's latest answers, so the overview's cards, chart, and table always agree.",
			},
			{
				question: "How does CiteRank.com decide whether an answer mentions my brand?",
				answer:
					"CiteRank.com finds every place an answer uses your brand's name, an alias, or one of its domains, then has a language model built for judging text confirm the answer is really about your brand. A name that means something else, or a different company with the same name, isn't counted.",
			},
			{
				question: "Why does my visibility change from day to day?",
				answer:
					"AI answers vary from run to run, even for the same prompt. Running the same prompts repeatedly turns noisy one-off answers into a trend, which is why CiteRank.com tracks on a schedule rather than checking once.",
			},
			{
				question: "How often does CiteRank.com check my prompts?",
				answer: `Prompts run ${PLANS.starter.standardRunsPerDay}× a day on the ${PLANS.starter.name} plan and up to ${PLANS.basic.standardRunsPerDay}× a day on the others.`,
			},
		],
	},
	{
		slug: "share-of-voice",
		name: "Share of Voice",
		title: "AI Share of Voice and Competitor Tracking",
		metaTitle: "AI Share of Voice & Competitor Analysis for AI Search · CiteRank.com",
		metaDescription:
			"See how often AI engines mention you versus your competitors. CiteRank.com ranks every tracked company by share of voice, per model and over time.",
		lede: "Share of voice is your brand's share of every mention of you and your tracked competitors in AI answers. CiteRank.com ranks every company on a live leaderboard, charts your top competitors over time, and compares you with each of them on every AI engine you track.",
		summary: "Your share of AI mentions against every tracked competitor, on a leaderboard, per model, and over time.",
		graphic: "share-of-voice",
		steps: [
			{
				name: "Add Your Competitors",
				text: "CiteRank.com suggests competitors from your website when you set up a brand. Add or edit them, with their own domains and aliases, any time.",
			},
			{
				name: "See Who AI Names Most",
				text: "The leaderboard ranks your brand against every competitor by mentions, prompts, and share, for any model, tag, or time range.",
			},
			{
				name: "Track the Race Over Time",
				text: "Share of voice trends chart you against your top competitors, so you can see who is gaining ground and when it started.",
			},
		],
		metrics: [
			{
				term: "Share of Voice",
				definition: "Your brand's share of every mention of you and your tracked competitors.",
			},
			{
				term: "Mentions",
				definition: "How many AI answers named each company in the selected period.",
			},
			{
				term: "Prompts",
				definition: "How many distinct prompts each company appeared in.",
			},
			{
				term: "Share of Voice Trends",
				definition: "You and your top competitors over time, ending on today's figure.",
			},
			{
				term: "Competitors by Model",
				definition: "Visibility, share of voice, sentiment, and position for every tracked company on each AI engine.",
			},
		],
		useCases: [
			"Find out which competitor AI recommends most in your category, and on which engines.",
			"Spot a competitor gaining share early, before it shows up in pipeline.",
			"Benchmark against the brands you lose deals to, not a generic industry average.",
		],
		why: [
			{
				name: "Competitors Judged Like You",
				text: "Competitor mentions go through the same name, alias, and domain matching and the same judging as yours, so the comparison is fair.",
			},
			{
				name: "Edits Apply to the Past",
				text: "Add a competitor or change its aliases and CiteRank.com re-judges recent responses for that company in the background, so history stays comparable.",
			},
			{
				name: "Every Engine Separately",
				text: "Share of voice in ChatGPT and in Google AI Overviews can tell very different stories. CiteRank.com shows both.",
			},
		],
		docs: { title: "Competitor settings docs", href: "/docs/user-guide/settings" },
		guides: [
			{
				kind: "Blog",
				title: "AI share of voice: measuring brand presence in AI search",
				href: "/blog/ai-share-of-voice",
			},
			{ kind: "Blog", title: "Competitor analysis for AI search", href: "/blog/ai-competitor-analysis" },
			{
				kind: "Blog",
				title: "Do AI engines favor big brands over smaller ones?",
				href: "/blog/do-ai-engines-favor-big-brands",
			},
			{ kind: "Glossary", title: "Share of voice", href: "/glossary/share-of-voice" },
		],
		directoryFeatures: ["competitorBenchmarking"],
		related: ["ai-visibility-tracking", "citation-tracking", "sentiment-analysis"],
		faqs: [
			{
				question: "What is AI share of voice?",
				answer:
					"AI share of voice is your brand's share of all the mentions of you and your tracked competitors in AI answers. If AI answers mention your brand 30 times and your competitors 70 times in total, your share of voice is 30%.",
			},
			{
				question: "How is share of voice different from visibility?",
				answer:
					"Visibility is the share of answers that mention you at all. Share of voice compares you with your competitors: it can fall even while your visibility holds steady, if competitors are mentioned more often.",
			},
			{
				question: "How many competitors can I track?",
				answer:
					"Up to 500 per brand. Because a raw share depends on how many competitors you track, CiteRank.com grades your share of voice by your rank among them rather than by the percentage alone.",
			},
		],
	},
	{
		slug: "sentiment-analysis",
		name: "Sentiment Analysis",
		title: "AI Sentiment Analysis and Brand Mention Tracking",
		metaTitle: "AI Sentiment Analysis & Brand Mention Tracking · CiteRank.com",
		metaDescription:
			"See how ChatGPT and other AI engines describe your brand. CiteRank.com scores the sentiment of every answer that mentions you, beside each competitor, with the passages behind the score.",
		lede: "Being mentioned is half the story; how AI describes you is the other half. CiteRank.com reads every answer that names your brand for praise or criticism, scores it from 0 to 100 beside each competitor and per model, and shows you the exact passages behind the score.",
		summary:
			"Every answer that names you, read for praise or criticism and scored 0 to 100, with the passages behind it.",
		graphic: "sentiment",
		secondaryGraphic: "responses",
		steps: [
			{
				name: "Catch Every Real Mention",
				text: "CiteRank.com matches your brand's name, aliases, and domains, then confirms each answer is really about your brand, not a word that means something else.",
			},
			{
				name: "See How AI Describes You",
				text: "Each answer that names you is classed as positive, neutral, mixed, or negative, and scored beside your competitors and per AI engine.",
			},
			{
				name: "Read the Passages",
				text: "Open the clearest praise and criticism, linked to the prompt they came from, or filter every response down to just the negative ones.",
			},
		],
		metrics: [
			{
				term: "Sentiment Score",
				definition:
					"0 to 100. Positive answers count 100, neutral and mixed 50, negative 0. Above 50, praise outweighs criticism.",
			},
			{
				term: "Sentiment Split",
				definition: "How the answers that mention you divide into positive, neutral, mixed, and negative.",
			},
			{
				term: "Sentiment Trends",
				definition: "Your score over time beside your top competitors'.",
			},
			{
				term: "Sentiment by Model",
				definition: "The score for you and each tracked competitor, per AI engine.",
			},
			{
				term: "What AI Says About You",
				definition: "The passages behind the clearest praise and criticism, one per prompt.",
			},
			{
				term: "Sentiment by Prompt",
				definition: "Each prompt's score over the period, with links to its positive and negative answers.",
			},
		],
		useCases: [
			"Find the prompts where AI repeats an outdated complaint or a wrong fact about your product.",
			"Compare how AI describes you with how it describes competitors on the same questions.",
			"Check whether a launch, a fix, or a PR push changed how AI talks about you.",
		],
		why: [
			{
				name: "Neutral Isn't Negative",
				text: "Most answers state facts rather than opinions. A factual mention scores 50, so it never counts against you.",
			},
			{
				name: "The Passage Behind Every Score",
				text: "Click a company's badge on any response to highlight the passage its sentiment was read from.",
			},
			{
				name: "Every Mention Checked",
				text: "A language model built for judging text confirms each mention, so 'an apple a day' doesn't count for a brand called Apple.",
			},
		],
		docs: { title: "Sentiment docs", href: "/docs/user-guide/sentiment" },
		guides: [
			{ kind: "Blog", title: "AI sentiment analysis for brands", href: "/blog/ai-brand-sentiment" },
			{
				kind: "Blog",
				title: "Do AI search engines fact-check what they read about your brand?",
				href: "/blog/ai-search-fact-checking",
			},
			{ kind: "Blog", title: "Ghost citations: when AI cites you without naming you", href: "/blog/ghost-citations" },
			{ kind: "Glossary", title: "AI brand sentiment", href: "/glossary/ai-brand-sentiment" },
		],
		directoryFeatures: ["sentimentAnalysis", "brandMentionTracking"],
		related: ["ai-visibility-tracking", "prompt-tracking", "share-of-voice"],
		faqs: [
			{
				question: "How does CiteRank.com score AI sentiment?",
				answer:
					"Each answer that names your brand is read for its sentiment toward you: positive, neutral, mixed, or negative. Positive answers count 100, neutral and mixed ones 50, and negative ones 0, and the score is the average. Answers that don't mention you aren't counted.",
			},
			{
				question: "What does a sentiment score of 50 mean?",
				answer:
					"50 means AI is neutral about you on balance. Above 50, praise outweighs criticism; below it, criticism outweighs praise.",
			},
			{
				question: "Does CiteRank.com track sentiment for competitors too?",
				answer:
					"Yes. Every tracked competitor gets the same sentiment reading, so you can compare scores side by side, overall and per AI engine.",
			},
			{
				question: "What counts as a brand mention?",
				answer:
					"An answer that talks about your brand, or cites a link containing your brand's name or domain. An answer that uses the name to mean something else, refers to a different company with the same name, or says it has no information about you isn't counted.",
			},
		],
	},
	{
		slug: "citation-tracking",
		name: "Citation Tracking",
		title: "AI Citation Tracking",
		metaTitle: "AI Citation Tracking: See Which Sources AI Engines Cite · CiteRank.com",
		metaDescription:
			"See which domains and URLs ChatGPT, Perplexity, and Google AI cite for your prompts, which of your own pages get cited, and how sources shift over time.",
		lede: "AI answers are built from sources. CiteRank.com records every URL the engines cite for your prompts, so you can see which domains and pages they trust in your category, which of your own pages get cited, where competitors are cited and you aren't, and how the sources shift over time.",
		summary:
			"Which domains and pages AI cites for your prompts, including your own, broken down by category and tracked over time.",
		graphic: "citations",
		steps: [
			{
				name: "See What AI Trusts",
				text: "Rank the domains and URLs AI engines cite most for your prompts, filtered by model, tags, and time range.",
			},
			{
				name: "Find Your Own Pages",
				text: "See your brand's share of all citations and exactly which of your pages are cited, and for which prompts.",
			},
			{
				name: "Catch the Shifts",
				text: "Track new and dropped pages and domains, and the prompts where competitors are cited but your brand isn't.",
			},
		],
		metrics: [
			{
				term: "Brand Citation Share",
				definition: "The percentage of all citations that link to your brand's domains.",
			},
			{
				term: "Top Domains and URLs",
				definition: "The sources AI engines cite most for your prompts, with each page's title and type.",
			},
			{
				term: "Source Categories",
				definition:
					"Citations grouped as brand, competitor, editorial, reviews, e-commerce, social, developer, PR, reference, and institutional.",
			},
			{
				term: "Page Types",
				definition:
					"Whether cited pages are articles, listicles, comparisons, reviews, how-tos, docs, forums, videos, and more.",
			},
			{
				term: "Recent Changes",
				definition: "New and dropped pages, and new and dropped domains.",
			},
			{
				term: "Content Gaps",
				definition: "Prompts where competitors are cited but your brand isn't.",
			},
			{
				term: "Reddit and Google Shopping",
				definition: "Which subreddits get cited, and the products Google AI Mode surfaces from Shopping.",
			},
		],
		useCases: [
			"Build an outreach list from the third-party pages AI cites in your category.",
			"See which of your own pages earn citations, and which never do.",
			"Find the prompts where a competitor's page is the source and yours isn't, then write the page that should be.",
		],
		why: [
			{
				name: "Categorized for You",
				text: "Every cited domain is sorted into a category from a maintained list, so you see the shape of your sources without tagging them by hand.",
			},
			{
				name: "Counted Once per Answer",
				text: "A page an answer cites twice counts once, and each prompt citing a page counts once, so popular pages don't inflate the totals.",
			},
			{
				name: "From the Real Interfaces",
				text: "Citations come from the scraped consumer apps where possible, which can cite differently from the same model's API.",
			},
		],
		docs: { title: "Citation analysis docs", href: "/docs/user-guide/citations" },
		guides: [
			{ kind: "Blog", title: "AI citations: what they are and how to earn them", href: "/blog/ai-citations" },
			{ kind: "Blog", title: "Where AI citations come from", href: "/blog/where-ai-citations-come-from" },
			{
				kind: "Blog",
				title: "Citation volatility: how much do the sources AI cites change?",
				href: "/blog/citation-volatility",
			},
			{
				kind: "Blog",
				title: "Do AI engines cite the same sources?",
				href: "/blog/do-ai-engines-cite-the-same-sources",
			},
		],
		directoryFeatures: ["citationAnalytics", "contentGapAnalysis"],
		related: ["query-fan-out", "aeo-recommendations", "share-of-voice"],
		faqs: [
			{
				question: "What is AI citation tracking?",
				answer:
					"AI citation tracking records the sources AI engines link to when they answer a question. It shows which websites shape the answers in your category, and whether your own pages are among them.",
			},
			{
				question: "Can I see which of my own pages AI engines cite?",
				answer:
					"Yes. Citations to your brand's domains are grouped as brand citations, and the top URLs list shows each of your cited pages and the prompts that cited them. Add extra domains, like a blog subdomain, in your brand settings.",
			},
			{
				question: "Which engines return citations?",
				answer:
					"Engines that search the web, like ChatGPT with search, Perplexity, Google AI Overviews, and AI Mode, cite their sources. A model called through an API without web search returns no citations.",
			},
		],
	},
	{
		slug: "query-fan-out",
		name: "Query Fan-Out",
		title: "Query Fan-Out Tracking",
		metaTitle: "Query Fan-Out Tracking: See the Searches Behind AI Answers · CiteRank.com",
		metaDescription:
			"AI engines turn one prompt into several web searches. CiteRank.com tracks the exact fan-out queries ChatGPT and other engines run for your prompts, and how they rewrite your wording.",
		lede: "When an AI engine with web search answers a prompt, it often runs several web searches first. CiteRank.com records those fan-out queries for every prompt, so you can see what the engines actually search for, which searches recur across your category, and how they rewrite your wording.",
		summary: "The web searches AI engines run behind each answer, and the words they add to or drop from your prompts.",
		graphic: "query-fan-out",
		steps: [
			{
				name: "See Every Search",
				text: "Open any prompt to see the web searches each engine ran while answering it, and how often each one recurred.",
			},
			{
				name: "Find the Recurring Queries",
				text: "Top queries surface the searches that come up again and again across all your prompts.",
			},
			{
				name: "Learn How Engines Rewrite You",
				text: "Query words show which words from your prompt engines keep, which they drop, and which they add, like 'best', a year, or 'vs'.",
			},
		],
		metrics: [
			{ term: "Queries", definition: "The distinct web searches engines ran for your prompts." },
			{
				term: "Average Fan-Out",
				definition: "Average searches per run, counting runs that issued at least one web search.",
			},
			{
				term: "Search Prompt Runs",
				definition: "How many times your prompts ran on engines configured with web search.",
			},
			{
				term: "Runs With Known and Unknown Queries",
				definition:
					"Search runs that exposed their queries, and those where the engine didn't search or didn't reveal what it searched.",
			},
			{
				term: "Added, Preserved, and Dropped Words",
				definition: "How engines rewrite your prompt wording on the way to a search.",
			},
		],
		useCases: [
			"Find the search phrasing to target, based on what the engines actually search for rather than what you guess.",
			"See the qualifiers engines add, like the current year or 'vs', and cover them in your content.",
			"Check whether your pages rank for the searches behind the prompts you're losing.",
		],
		why: [
			{
				name: "Straight From the Runs",
				text: "Every figure comes from the searches recorded on real prompt runs, the same way for every provider.",
			},
			{
				name: "Honest About Gaps",
				text: "Some engines don't reveal their searches. CiteRank.com counts those runs separately instead of guessing what they searched for.",
			},
			{
				name: "Only Real Rewrites",
				text: "A search that just repeats your prompt says nothing about how it was rewritten, so the page leaves those out.",
			},
		],
		docs: { title: "Provider docs", href: "/docs/user-guide/providers" },
		guides: [
			{
				kind: "Blog",
				title: "ChatGPT UI now cites Reddit the same amount as the OpenAI API",
				href: "/blog/chatgpt-ui-reddit-citations-api",
			},
			{
				kind: "Blog",
				title: "Does ranking in Google's top 10 get you cited by AI?",
				href: "/blog/rankings-and-ai-citations",
			},
			{ kind: "Blog", title: "Multi-turn AI search: what prompt tracking misses", href: "/blog/multi-turn-ai-search" },
		],
		directoryFeatures: ["queryFanOut"],
		related: ["citation-tracking", "prompt-tracking", "aeo-recommendations"],
		faqs: [
			{
				question: "What is query fan-out?",
				answer:
					"Query fan-out is an AI engine breaking one question into several web searches, retrieving results for each, and writing a single answer from what it found. The searches it runs decide which pages it can cite.",
			},
			{
				question: "Which AI engines show their fan-out queries?",
				answer:
					"It depends on the engine and on the provider used to reach it. CiteRank.com shows the queries wherever they're exposed, and counts runs where an engine searched without revealing its queries separately.",
			},
			{
				question: "How do I use fan-out queries?",
				answer:
					"Treat them as the searches your content has to rank for. If an engine searches for 'best CRM for startups 2026' when answering your prompt, the pages that rank for that search are the ones it can cite.",
			},
		],
	},
	{
		slug: "prompt-tracking",
		name: "Prompt Tracking",
		title: "AI Prompt Tracking",
		metaTitle: "AI Prompt Tracking: Monitor the Questions Buyers Ask AI · CiteRank.com",
		metaDescription:
			"Track the prompts your buyers ask ChatGPT and other AI engines. CiteRank.com suggests prompts from your website, tags them, and keeps every answer for you to search and inspect.",
		lede: "Prompts are the questions CiteRank.com asks AI engines on your behalf. CiteRank.com suggests them from your website, tags each one as branded or unbranded, lets you organize them with your own tags, and keeps every answer so you can search it, filter it, and see exactly what each engine said.",
		summary:
			"Suggested from your website, tagged and organized, with every AI answer kept for you to search and inspect.",
		graphic: "prompts",
		secondaryGraphic: "responses",
		steps: [
			{
				name: "Start From Your Website",
				text: "Paste your site and CiteRank.com suggests products, competitors, aliases, and tagged starter prompts. Ask for more suggestions any time; it skips what you already track.",
			},
			{
				name: "Organize With Tags",
				text: "Tag prompts by topic, product, or persona, then filter every page in CiteRank.com by tag. Prompts that name your brand are marked branded automatically.",
			},
			{
				name: "Inspect Every Answer",
				text: "Open any prompt to see each engine's response, the brands it named and where, the searches it ran, and the sources it cited.",
			},
		],
		metrics: [
			{
				term: "Per-Prompt Visibility",
				definition: "How often answers to each prompt mention your brand, and the trend.",
			},
			{
				term: "Branded and Unbranded",
				definition: "Whether a prompt names your brand, set automatically and overridable with a tag.",
			},
			{
				term: "Brands Mentioned",
				definition: "Each company an answer names, with its position and the answer's sentiment toward it.",
			},
			{
				term: "Responses",
				definition:
					"Every AI answer to your prompts, searchable by its text and filterable by prompt, model, and sentiment.",
			},
			{
				term: "Prompt History",
				definition: "Each prompt's mentions, web queries, citations, and responses over time, and when it runs next.",
			},
		],
		useCases: [
			"Separate branded prompts (people already asking about you) from unbranded category prompts where you have to earn the mention.",
			"Group prompts by product line or audience and compare visibility between them.",
			"Read exactly what ChatGPT said about you last Tuesday, and how that compares with today.",
		],
		why: [
			{
				name: "Prompts You Can See and Edit",
				text: "Every prompt is plain text you control: add them one at a time or paste several at once, and pause or remove any of them.",
			},
			{
				name: "Nothing Summarized Away",
				text: "Every response is stored and shown in full, so any score can be traced back to the answers behind it.",
			},
			{
				name: "Same Data Over API and MCP",
				text: "Create and update prompts, and read runs, from the API or an AI assistant connected over MCP.",
			},
		],
		docs: { title: "Prompt docs", href: "/docs/user-guide/prompt-wizard" },
		guides: [
			{ kind: "Blog", title: "How often should you run AEO prompt tracking?", href: "/blog/ai-prompt-tracking" },
			{ kind: "Blog", title: "Multi-turn AI search: what prompt tracking misses", href: "/blog/multi-turn-ai-search" },
			{ kind: "Glossary", title: "Prompt tracking", href: "/glossary/prompt-tracking" },
			{ kind: "Glossary", title: "Prompt volume", href: "/glossary/prompt-volume" },
		],
		directoryFeatures: ["multiLlmTracking"],
		related: ["ai-visibility-tracking", "query-fan-out", "sentiment-analysis"],
		faqs: [
			{
				question: "What is AI prompt tracking?",
				answer:
					"AI prompt tracking means asking AI engines the same set of questions on a schedule and recording how they answer: whether they mention your brand, how they describe it, and which sources they cite.",
			},
			{
				question: "Where do the prompts come from?",
				answer:
					"When you add a brand, CiteRank.com analyzes your website and suggests starter prompts with tags. You can edit them, write your own, paste several at once, or ask for fresh suggestions later.",
			},
			{
				question: "How many prompts can I track?",
				answer: `CiteRank.com plans include ${PLANS.starter.maxPrompts} to ${PLANS.business.maxPrompts} prompts, depending on the plan.`,
			},
			{
				question: "What's the difference between branded and unbranded prompts?",
				answer:
					"A branded prompt names your brand, like 'Is Acme good for small teams?'. An unbranded prompt is a category question, like 'best CRM for small teams', where AI chooses which brands to mention. CiteRank.com tags each prompt automatically, and you can override it.",
			},
		],
	},
	{
		slug: "aeo-recommendations",
		name: "Opportunities",
		title: "AEO Recommendations",
		metaTitle: "AEO Recommendations: What to Do Next to Get Cited by AI · CiteRank.com",
		metaDescription:
			"CiteRank.com turns your tracked AI visibility and citation data into concrete opportunities: content to create, pages to refresh, sites to pitch, and communities to join.",
		lede: "CiteRank.com's Opportunities page turns your tracked answers and citations into a short list of things to do: content to create, existing pages to refresh, third-party sites to pitch, and community conversations to join. Each one explains why, and links to the prompts and cited pages behind it.",
		summary:
			"Content to create, pages to refresh, and sources to pitch, generated from your own visibility and citation data.",
		graphic: "opportunities",
		steps: [
			{
				name: "Read the Summary",
				text: "A few plain bullets on where you stand: what's working, what's slipping, and where competitors lead.",
			},
			{
				name: "Pick an Opportunity",
				text: "Recommendations are grouped into creation, existing content, outreach, and social, each with a plain-language reason.",
			},
			{
				name: "Check the Evidence",
				text: "Every opportunity links to the prompts it's about, your pages cited for them, and the competitor pages cited instead.",
			},
		],
		metrics: [
			{
				term: "Creation",
				definition:
					"Net-new content to publish or earn, like comparisons, guides, and 'best of' angles for topics you're absent on.",
			},
			{
				term: "Existing Content",
				definition: "Pages already getting cited that are slipping, or could win the mention with a refresh.",
			},
			{
				term: "Outreach",
				definition: "Placements on the third-party review sites and editorial roundups AI engines cite.",
			},
			{
				term: "Social",
				definition: "The Reddit, YouTube, and forum conversations AI engines pull from.",
			},
			{
				term: "Reality Check",
				definition: "The risks and limits to keep in mind before acting.",
			},
		],
		useCases: [
			"Turn a month of tracking data into a content and outreach plan for the next sprint.",
			"Find the review sites and roundups to pitch, based on what AI actually cites for your prompts.",
			"Hand an agent or a writer a specific brief with the prompts and competitor pages attached.",
			"Have CiteRank.com's AI search agency do the work each month, with a report on the AI answers before and after.",
		],
		why: [
			{
				name: "Built on Your Data",
				text: "Opportunities come from your own per-prompt visibility, competitor standings, and citations over the last 30 days, not generic best practices.",
			},
			{
				name: "Evidence Attached",
				text: "Each recommendation shows the prompts and cited pages behind it, so you can judge it before acting.",
			},
			{
				name: "Refreshed Weekly",
				text: "The list is regenerated about once a week as new data comes in, and shows when it was last evaluated.",
			},
		],
		docs: { title: "Using citation data", href: "/docs/user-guide/citations" },
		guides: [
			{ kind: "Guide", title: "What the AI search agency does", href: "/agency" },
			{ kind: "Blog", title: "How long does it take to get cited by AI?", href: "/blog/how-long-to-get-cited-by-ai" },
			{
				kind: "Blog",
				title: "Do self-promotional 'best of' listicles help AI visibility?",
				href: "/blog/self-promotional-listicles-ai-visibility",
			},
			{
				kind: "Blog",
				title: "Do press releases get your brand into AI answers?",
				href: "/blog/press-releases-ai-visibility",
			},
		],
		directoryFeatures: ["actionRecommendations", "contentGapAnalysis"],
		related: ["citation-tracking", "query-fan-out", "ai-visibility-reporting"],
		faqs: [
			{
				question: "How does CiteRank.com generate AEO recommendations?",
				answer:
					"CiteRank.com assembles a digest of your tracked data, including visibility per platform, each prompt's standing against the leading competitor over 7 and 30 days, and the sites cited for your prompts, and asks a language model to turn it into categorized opportunities. The prompts and cited pages behind each one are attached from your data.",
			},
			{
				question: "How often are opportunities updated?",
				answer: "About once a week. The page shows when the current list was generated.",
			},
			{
				question: "Should I act on every recommendation?",
				answer:
					"No. They're generated by AI from your citation data and are a starting point. Each one shows its evidence so you can apply your own judgment first.",
			},
			{
				question: "Can CiteRank.com do the work for me?",
				answer:
					"Yes. CiteRank.com's AI search agency does the work every month for businesses that want it done: it writes the pages a site is missing, updates pages AI has stopped citing, and gets you onto the review sites and best-of lists AI cites. Each month's report lists the work and the AI answers before and after.",
			},
		],
	},
	{
		slug: "ai-visibility-reporting",
		name: "Reporting",
		title: "AI Visibility Reporting and Dashboards",
		metaTitle: "AI Visibility Reporting & Dashboards for AI Search · CiteRank.com",
		metaDescription:
			"Report AI search performance with CiteRank.com's overview dashboard, PNG chart exports, and an API for your own BI tools.",
		lede: "CiteRank.com's overview puts visibility, share of voice, sentiment, and position on one screen, with every competitor ranked beside you. Export any prompt chart as a PNG for a deck, or pull the numbers into your own dashboards through the API.",
		summary: "An overview dashboard, PNG chart exports, and an API for your own BI tools.",
		graphic: "overview",
		steps: [
			{
				name: "Start From the Overview",
				text: "Four headline cards, how they changed, and a comparison of you and your competitors on every AI engine.",
			},
			{
				name: "Export for Your Deck",
				text: "Download prompt charts as PNGs, sized for slides and reports.",
			},
			{
				name: "Send It Where You Report",
				text: "Pull analytics into a spreadsheet or BI tool through the REST API.",
			},
		],
		metrics: [
			{ term: "Headline Cards", definition: "Visibility, share of voice, sentiment, and position, with their change." },
			{
				term: "Competitors by Model",
				definition: "Every tracked company on every AI engine, sortable by any model or by the overall figure.",
			},
			{ term: "Prompts Tracked and Evaluations", definition: "How much tracking is behind the numbers." },
			{
				term: "Chart Exports",
				definition: "Any prompt's visibility chart as a PNG, ready for a slide or a report.",
			},
		],
		useCases: [
			"Answer 'why is organic traffic down?' with numbers on how AI answers mention you instead.",
			"Drop charts into a monthly client or leadership report.",
			"Combine AI visibility with your other marketing data in your own BI tool.",
		],
		why: [
			{
				name: "Numbers You Can Defend",
				text: "Every figure traces back to stored answers, and the methodology is documented.",
			},
			{
				name: "Your Data, Your Tools",
				text: "Everything on the dashboard is available through the REST API and the MCP server.",
			},
			{
				name: "A Monthly Report From the Agency",
				text: "Businesses that hire CiteRank.com's AI search agency get a report each month listing every piece of work, the question it targets, and the AI answers before and after.",
			},
		],
		docs: { title: "Dashboard docs", href: "/docs/user-guide/dashboard" },
		guides: [
			{
				kind: "Blog",
				title: "AI visibility reporting: what to show clients when organic traffic drops",
				href: "/blog/ai-visibility-client-reporting",
			},
			{
				kind: "Blog",
				title: "Who should own AI visibility: a dedicated hire or your SEO team?",
				href: "/blog/who-should-own-ai-visibility",
			},
			{
				kind: "Blog",
				title: "Can Google Search Console measure your AI visibility?",
				href: "/blog/search-console-ai-visibility",
			},
		],
		directoryFeatures: ["dataExportApi"],
		related: ["ai-visibility-tracking", "api-and-mcp", "aeo-recommendations"],
		faqs: [
			{
				question: "Can I export CiteRank.com data into my own dashboards?",
				answer:
					"Yes. The REST API returns visibility, share of voice, citations, per-model, prompt, and query fan-out metrics.",
			},
			{
				question: "Can I export charts?",
				answer: "Yes. Prompt charts download as PNGs, sized for slides and reports.",
			},
			{
				question: "Does the AI search agency report on its work?",
				answer:
					"Yes. Each month a report lists every piece of work, the question it targets, and the AI answers before and after.",
			},
		],
	},
	{
		slug: "api-and-mcp",
		name: "API and MCP",
		title: "AI Visibility API and MCP Server",
		metaTitle: "AI Visibility API & MCP Server · CiteRank.com",
		metaDescription:
			"CiteRank.com's REST API and MCP server give your code and AI assistants the same AI visibility data as the dashboard.",
		lede: "Everything in CiteRank.com is available outside the dashboard. A REST API covers brands, prompts, competitors, analytics, citations, query fan-out, runs, and opportunities, and an MCP server lets Claude Code, Codex, Cursor, VS Code, or OpenCode read your data and manage prompts directly.",
		summary: "A REST API and an MCP server, so your code and AI assistants get the same data as the dashboard.",
		graphic: "api",
		steps: [
			{
				name: "Issue a Key, or Sign In",
				text: "Create an organization API key, read-only or read-write, optionally limited to some brands and given an expiry. MCP clients can also just sign in from a browser.",
			},
			{
				name: "Call It From Code",
				text: "Send your key as a bearer token to list brands, pull analytics, or create prompts.",
			},
			{
				name: "Ask Your Assistant",
				text: "Connect over MCP and ask 'What are some AEO opportunities for my brand?'",
			},
		],
		metrics: [
			{
				term: "Analytics",
				definition:
					"Visibility, share of voice, sentiment, position, citations, per-model, prompt, and query fan-out metrics.",
			},
			{ term: "Runs", definition: "Every prompt evaluation, with the full response and its mention assessments." },
			{
				term: "Prompts, Competitors, and Brands",
				definition: "Manage the setup behind your tracking programmatically.",
			},
			{ term: "Opportunities", definition: "The latest generated recommendations for a brand." },
			{
				term: "MCP Tools",
				definition:
					"Read tools like get_analytics, get_citations, and get_query_fanout, and write tools for creating and updating prompts.",
			},
		],
		useCases: [
			"Pipe AI visibility into a warehouse or BI tool alongside SEO and revenue data.",
			"Let a coding agent audit why a prompt lost visibility and draft the fix, using your real data.",
			"Keep prompts and competitors in sync across many brands from a script.",
		],
		why: [
			{
				name: "Included on Every Plan",
				text: "API and MCP access come with every CiteRank.com plan.",
			},
			{
				name: "Scoped Access",
				text: "An MCP client is only offered the tools its key allows, and no MCP tool deletes data or changes billing.",
			},
			{
				name: "Described by an OpenAPI Spec",
				text: "The API serves its own OpenAPI spec, so you can generate a client in the language you work in.",
			},
		],
		docs: { title: "API reference", href: "/docs/api" },
		guides: [{ kind: "Docs", title: "MCP server", href: "/docs/api/mcp" }],
		directoryFeatures: ["dataExportApi", "mcpServer"],
		related: ["ai-visibility-reporting", "prompt-tracking", "aeo-recommendations"],
		faqs: [
			{
				question: "Does CiteRank.com have an API?",
				answer:
					"Yes. CiteRank.com serves a REST API at https://app.citerank.com/api/v1, with Bearer-token authentication and an OpenAPI spec at /api/v1/openapi.json.",
			},
			{
				question: "Which AI clients work with CiteRank.com's MCP server?",
				answer:
					"Claude Code, Codex, Cursor, VS Code, and OpenCode have documented setup, and other clients that support remote MCP servers over HTTP work the same way. Sign in from the client, or send an API key as a bearer token.",
			},
		],
	},
	{
		slug: "multi-engine-tracking",
		name: "AI Engines",
		title: "Track Your Brand Across Ten AI Apps",
		metaTitle: "Multi-Engine AI Visibility Tracking: ChatGPT, AI Overviews, Gemini & More · CiteRank.com",
		metaDescription:
			"Track your brand in ChatGPT, Google AI Overviews, AI Mode, Gemini, Perplexity, and Copilot from the real apps, plus Claude, Grok, DeepSeek, and Mistral.",
		lede: "Most AI search happens in ChatGPT and Google, and neither offers a public API for its consumer answers. CiteRank.com scrapes ChatGPT, Google AI Overviews, AI Mode, Gemini, Perplexity, and Copilot from the interfaces your customers use, and calls Claude, Grok, DeepSeek, and Mistral directly.",
		summary:
			"ChatGPT, Google AI Overviews, AI Mode, Gemini, Perplexity, and Copilot from the real apps, plus Claude, Grok, DeepSeek, and Mistral by API.",
		graphic: "engines",
		steps: [
			{
				name: "Pick Your Engines",
				text: "Choose the engines that matter for your buyers. Your plan sets how many each brand can track at once.",
			},
			{
				name: "Run the Same Prompts Everywhere",
				text: "Every prompt runs on every engine you track, so the results are directly comparable.",
			},
			{
				name: "Compare Engine by Engine",
				text: "Filter any page by model, and compare yourself with competitors on each engine side by side.",
			},
		],
		metrics: [
			{
				term: "Scraped From the Real Interface",
				definition: "ChatGPT, Google AI Overviews, Google AI Mode, Gemini, Perplexity, and Copilot.",
			},
			{
				term: "Direct Model APIs",
				definition: "Claude, Grok, DeepSeek, and Mistral, called through their APIs.",
			},
		],
		useCases: [
			"Compare how ChatGPT and Google AI Overviews treat your brand, since they often disagree.",
			"Add an engine your audience uses, like Copilot for enterprise buyers, without switching tools.",
			"Check whether a gain in one AI app holds in the others.",
		],
		why: [
			{
				name: "What Customers Actually See",
				text: "A model's API isn't the consumer product. Scraping the real ChatGPT and Google surfaces is closer to the answers your buyers get.",
			},
			{
				name: "Ten AI Apps in One Place",
				text: "ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, DeepSeek, Mistral, Google AI Overviews, and Google AI Mode, from one account and one set of prompts.",
			},
			{
				name: "Every Answer Kept",
				text: "Each answer is stored in full, so a number for any AI app traces back to the words it wrote.",
			},
		],
		docs: { title: "Provider docs", href: "/docs/user-guide/providers" },
		guides: [
			{ kind: "Guide", title: "How to show up in each AI search engine", href: "/ai-search" },
			{ kind: "Blog", title: "The best LLM scraping APIs, compared", href: "/blog/best-llm-scraping-apis" },
			{
				kind: "Blog",
				title: "Do AI engines cite the same sources?",
				href: "/blog/do-ai-engines-cite-the-same-sources",
			},
		],
		directoryFeatures: ["multiLlmTracking"],
		related: ["ai-visibility-tracking", "query-fan-out", "citation-tracking"],
		faqs: [
			{
				question: "Which AI engines does CiteRank.com track?",
				answer:
					"ChatGPT, Google AI Overviews, Google AI Mode, Gemini, Perplexity, and Copilot are scraped from their real interfaces. Claude, Grok, DeepSeek, and Mistral are called through their APIs.",
			},
			{
				question: "Why scrape instead of using the API?",
				answer:
					"ChatGPT and Google AI Mode drive most AI search traffic and neither exposes a public API for its consumer answers. Calling the underlying model with web search approximates them, but it isn't what your customers see.",
			},
		],
	},
];

export function getProductFeature(slug: string): ProductFeature | undefined {
	return productFeatures.find((f) => f.slug === slug);
}
