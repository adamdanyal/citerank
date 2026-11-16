export type StatGroup = "Where AI cites from" | "How engines behave" | "Whether tactics work" | "What the numbers mean";

export interface Stat {
	value: string;
	claim: string;
	source: string;
	slug: string;
	group: StatGroup;
}

export const STAT_GROUPS: StatGroup[] = [
	"Where AI cites from",
	"How engines behave",
	"Whether tactics work",
	"What the numbers mean",
];

export const GROUP_BLURBS: Record<StatGroup, string> = {
	"Where AI cites from": "Which domains answer engines pull from, and how much of it you control.",
	"How engines behave": "How individual engines retrieve, cite and change, and how far apart they sit.",
	"Whether tactics work": "What measurably moves citation, and what has been tested and found not to.",
	"What the numbers mean": "Why published figures disagree, and which measurement choices drive the spread.",
};

export const stats: Stat[] = [
	{
		value: "84%",
		claim:
			"of links AI engines cite point at domains the brand does not own, across 25 million cited links, though the ratio flips on evaluation-stage prompts.",
		source: "Analysis of 25M cited links",
		slug: "where-ai-citations-come-from",
		group: "Where AI cites from",
	},
	{
		value: "61.7%",
		claim: "of brand appearances in AI answers were citations with no brand mention in the text.",
		source: "Semrush and Kevin Indig",
		slug: "ghost-citations",
		group: "Where AI cites from",
	},
	{
		value: "2nd",
		claim:
			"place for LinkedIn among cited domains, behind only Reddit or YouTube. Most citations point at individual profiles, not company pages.",
		source: "Two 2026 studies",
		slug: "linkedin-ai-citations",
		group: "Where AI cites from",
	},
	{
		value: "6",
		claim:
			"published figures put YouTube's share of AI citations anywhere from 0.99% to 23.3%, and each is defensible. The spread is engines and denominators.",
		source: "Six published datasets",
		slug: "youtube-ai-citations",
		group: "Where AI cites from",
	},
	{
		value: "0.3%",
		claim:
			"of AI citations go to paid and advertorial content in one dataset, while a wire-distributed story reaches 9–20% of related answers in another.",
		source: "Two datasets",
		slug: "press-releases-ai-visibility",
		group: "Where AI cites from",
	},
	{
		value: "40%+",
		claim: "of US Google searches now carry an AI Overview, up from 15% a year earlier.",
		source: "Similarweb",
		slug: "ai-overviews-share-of-searches",
		group: "How engines behave",
	},
	{
		value: "48%",
		claim:
			"more ChatGPT citations per page for publishers with OpenAI licensing deals. Google's and Perplexity's licensees get no equivalent home-platform edge.",
		source: "129-million-citation study",
		slug: "openai-licensing-deals-chatgpt-citations",
		group: "How engines behave",
	},
	{
		value: "-86%",
		claim:
			"Reddit's share of ChatGPT Search citations in August 2026. It also barely appears in Google's AI Overviews.",
		source: "AI answer tracking data",
		slug: "reddit-ai-citations",
		group: "How engines behave",
	},
	{
		value: "-90%",
		claim:
			"Reddit's citation share in the ChatGPT UI fell by more than 90%, landing near the level API web search already returned.",
		source: "AI answer tracking data",
		slug: "chatgpt-ui-reddit-citations-api",
		group: "How engines behave",
	},
	{
		value: "10",
		claim:
			"search agents endorsed fabricated brands in 40–50% of exposed runs, and verified suspicious evidence in about 2% of cases.",
		source: "72,000-page benchmark",
		slug: "ai-search-fact-checking",
		group: "How engines behave",
	},
	{
		value: "8 months",
		claim:
			"is the median age of the pages ChatGPT cites, and presence in AI answers builds over weeks rather than days.",
		source: "Three 2026 datasets",
		slug: "how-long-to-get-cited-by-ai",
		group: "How engines behave",
	},
	{
		value: "8.9%",
		claim: "of pages AI search retrieves show signs of GEO optimization (the first published measurement of adoption).",
		source: "CISPA",
		slug: "geo-detection",
		group: "Whether tactics work",
	},
	{
		value: "0 of 10",
		claim: "engines where the classic GEO effect sizes moved citation, when re-measured on modern engines.",
		source: "Validation study",
		slug: "can-content-scores-predict-ai-citations",
		group: "Whether tactics work",
	},
	{
		value: "5",
		claim:
			"rounds of simulated competition, with everyone optimizing for citation, left page quality and answer quality below where they started.",
		source: "CMU and others",
		slug: "citation-wars",
		group: "Whether tactics work",
	},
	{
		value: "80%",
		claim:
			"adoption by competitors leaves fixed GEO tactics scoring worse than no optimization at all, in one of two simulations.",
		source: "Two simulations",
		slug: "do-geo-tactics-stop-working",
		group: "Whether tactics work",
	},
	{
		value: "54%",
		claim:
			"better conversion from AI-referred retail visitors than from everyone else, yet AI accounts for only 0.2% of all sessions.",
		source: "Adobe and Contentsquare",
		slug: "ai-referral-traffic-conversion",
		group: "Whether tactics work",
	},
	{
		value: "37.9%",
		claim:
			"of pages cited in AI Overviews ranked in Google's top 10 in one March 2026 study. Published estimates run from 12% to 93%, which shows that rank is neither necessary nor sufficient.",
		source: "Published estimates",
		slug: "rankings-and-ai-citations",
		group: "What the numbers mean",
	},
	{
		value: "34.7%",
		claim:
			"of Perplexity citations did not support the sentence they were attached to, in one of two audits published the same day.",
		source: "Two independent audits",
		slug: "can-you-trust-ai-citations",
		group: "What the numbers mean",
	},
	{
		value: "13.3%",
		claim:
			"of top sites with a robots.txt block at least one AI search crawler. Published rates run from 9% to 54%, depending on which slice of the web was sampled and whether the bot does search or training.",
		source: "Published blocking rates",
		slug: "how-many-websites-block-ai-crawlers",
		group: "What the numbers mean",
	},
	{
		value: "1/3",
		claim: "The last prompt in an AI conversation carries about a third of everything the user said.",
		source: "Multi-turn research",
		slug: "multi-turn-ai-search",
		group: "What the numbers mean",
	},
	{
		value: "30.9 points",
		claim:
			"swing in an AI visibility score from prompt weighting alone, in one worked example. Two tools can report very different scores for the same brand in the same week without either being broken.",
		source: "Preprint",
		slug: "why-ai-visibility-scores-differ",
		group: "What the numbers mean",
	},
	{
		value: "50%+",
		claim:
			"of the domains AI cites change from one day to the next on most prompts, over 42 days of daily tracking. How much depends on what you ask.",
		source: "AI answer tracking data",
		slug: "citation-volatility",
		group: "What the numbers mean",
	},
];

export const statSlugs = new Set(stats.map((s) => s.slug));

export const supportingPosts: { slug: string; group: StatGroup }[] = [
	{ slug: "ai-citations", group: "Where AI cites from" },
	{ slug: "microsoft-clarity-ai-citations", group: "What the numbers mean" },
	{ slug: "iab-ai-visibility-metrics", group: "What the numbers mean" },
];
