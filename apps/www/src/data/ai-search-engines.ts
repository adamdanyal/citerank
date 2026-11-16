export interface AiSearchEngine {
	slug: string;
	name: string;
	/** One-sentence summary: the page's lede, its meta description and its JSON-LD. */
	short: string;
	/** One short line for the index. */
	line: string;
	/** What it is and how it chooses sources, one entry per paragraph. */
	intro: string[];
	/** Steps to improve your odds of appearing. Emitted as HowTo JSON-LD. */
	steps: { name: string; text: string }[];
	/** How Elmo tracks this engine. */
	tracking: string;
	related?: string[];
}

export const aiSearchEngines: AiSearchEngine[] = [
	{
		slug: "chatgpt",
		name: "ChatGPT",
		short:
			"Get your brand mentioned and cited in OpenAI's ChatGPT, across both its base model and its live web search.",
		line: "Get named and cited in ChatGPT.",
		intro: [
			"ChatGPT answers from what it learned in training and from pages it finds on the web, so you need both: mentions on sites it trusts, and clear, current pages of your own.",
		],
		steps: [
			{
				name: "Be a clear source on your topic",
				text: "Publish content that answers the questions in your category directly and in plain language, so a model can lift a clean, correct statement about you.",
			},
			{
				name: "Earn mentions on sources ChatGPT trusts",
				text: "Coverage, reviews, and references on reputable third-party sites shape how the trained model describes your brand. Independent corroboration matters more than your own claims.",
			},
			{
				name: "Put short answers near the top",
				text: "Use descriptive headings, short direct answers near the top, and schema markup so the key facts are easy to parse and quote.",
			},
			{
				name: "Keep important pages current",
				text: "Browsing favors fresh, accurate pages. Stale prices, dates, or feature lists invite wrong answers, so keep your core pages up to date.",
			},
			{
				name: "Track both modes over time",
				text: "Check how ChatGPT describes you with and without browsing, on a consistent set of prompts, because answers vary between runs.",
			},
		],
		tracking:
			"CiteRank.com runs your prompts through ChatGPT on a schedule and records whether it mentions your brand, cites your site, and how it describes you. Tracking the same prompts repeatedly turns noisy one-off answers into a trend you can act on.",
		related: ["perplexity", "google-ai-overviews", "claude"],
	},
	{
		slug: "perplexity",
		name: "Perplexity",
		short: "Become a cited source in Perplexity, the AI search engine that shows its citations on every answer.",
		line: "Get cited by the engine that shows its sources.",
		intro: [
			"Perplexity searches the web for every question and links the pages it used, which makes it the easiest place to see whether you are getting cited.",
		],
		steps: [
			{
				name: "Answer the specific question",
				text: "Perplexity rewards pages that address a precise query head-on. Match the questions your buyers ask and answer them in the first paragraph.",
			},
			{
				name: "Lead with the answer",
				text: "Lead with the direct answer, then expand. Clear headings, short paragraphs, and lists give the engine a clean span to quote.",
			},
			{
				name: "Build domain trust",
				text: "Citations skew toward sources the engine considers authoritative. Depth on your topic and references from respected sites both help.",
			},
			{
				name: "Keep content fresh",
				text: "Perplexity leans current. Updating cornerstone pages and publishing on live topics improves your odds of being pulled in.",
			},
			{
				name: "Measure which prompts cite you",
				text: "Track a consistent prompt set and watch which queries cite you and which cite a competitor. The queries where a competitor wins are where to focus.",
			},
		],
		tracking:
			"CiteRank.com queries Perplexity with your prompts and logs every citation and mention, so you can see exactly which pages get pulled into answers and where rivals are winning the citation instead.",
		related: ["chatgpt", "claude", "google-ai-overviews"],
	},
	{
		slug: "google-ai-overviews",
		name: "Google AI Overviews",
		short: "Appear in the AI-generated summaries Google shows above its search results for many queries.",
		line: "Appear in the AI summary above Google's results.",
		intro: [
			"AI Overviews are the AI summaries Google shows above many of its results, and each one links to a few of the pages it used.",
		],
		steps: [
			{
				name: "Answer the query directly",
				text: "Put a clear, self-contained answer near the top of the page. Overviews favor content that resolves the question without hedging.",
			},
			{
				name: "Earn topical authority",
				text: "Google still leans on its existing ranking factors. Depth across a topic and a trusted domain make you a likelier source for the summary.",
			},
			{
				name: "Add structured data",
				text: "Schema for FAQs, articles, products, and your organization helps Google extract and trust the facts on your page.",
			},
			{
				name: "Keep technical SEO sound",
				text: "If Google cannot crawl, render, or index a page well, it cannot summarize it, so the basics still come first.",
			},
			{
				name: "Refresh on a cadence",
				text: "Overviews favor current information. Revisit cornerstone pages so prices, dates, and claims stay accurate.",
			},
		],
		tracking:
			"CiteRank.com tracks whether your brand appears in Google AI Overviews for your prompts, which sources are cited alongside or instead of you, and how that changes over time.",
		related: ["gemini", "chatgpt", "perplexity"],
	},
	{
		slug: "gemini",
		name: "Google Gemini",
		short: "Show up in Google's Gemini app and AI Mode, the conversational products powered by its Gemini models.",
		line: "Show up in the Gemini app and Google's AI Mode.",
		intro: [
			"Gemini powers the Gemini app, Google's AI Mode and AI Overviews, and each one can answer the same question differently.",
		],
		steps: [
			{
				name: "Get the SEO foundation right",
				text: "Crawlable, well-structured pages with clear topical focus are the base. Gemini products lean on the ranking factors Google already uses.",
			},
			{
				name: "Provide direct, quotable answers",
				text: "Lead each page with a concise answer to the question it targets, then add the supporting depth beneath it.",
			},
			{
				name: "Demonstrate authority and depth",
				text: "Cover your topic thoroughly and earn references from trusted sources, so the model is confident citing you.",
			},
			{
				name: "Keep content current",
				text: "Conversational search pulls in fresh information. Maintain your cornerstone pages so answers about you stay accurate.",
			},
			{
				name: "Track across products",
				text: "Monitor the Gemini app, AI Mode, and AI Overviews separately, since the same query can return different answers on each.",
			},
		],
		tracking:
			"CiteRank.com runs your prompts through Google's Gemini-powered products and records how your brand is mentioned and cited, so you can tell where you appear and where you are missing.",
		related: ["google-ai-overviews", "chatgpt"],
	},
	{
		slug: "claude",
		name: "Claude",
		short: "Track how Claude describes and cites your brand, including when it searches the web for an answer.",
		line: "See how Claude describes and cites you.",
		intro: [
			"Claude answers from what it learned in training and can also search the web, and it favors careful, well-sourced pages.",
		],
		steps: [
			{
				name: "Publish accurate, specific content",
				text: "Claude leans toward well-supported statements. Precise, correct pages about your brand and category give it a reliable basis to quote.",
			},
			{
				name: "Make your facts easy to quote",
				text: "Descriptive headings, direct answers, and schema make the important facts easy to lift without ambiguity.",
			},
			{
				name: "Earn trusted third-party mentions",
				text: "Corroboration on reputable sources shapes how Claude characterizes you, the same way it does with other models.",
			},
			{
				name: "Keep key pages current",
				text: "When Claude searches, fresh and accurate pages are likelier to be used and cited. Avoid stale facts on cornerstone pages.",
			},
			{
				name: "Monitor how it describes you",
				text: "Track Claude on a consistent prompt set to catch inaccurate or out-of-date descriptions before buyers see them.",
			},
		],
		tracking:
			"CiteRank.com queries Claude with your prompts and records its mentions, citations, and sentiment toward your brand, so an inaccurate or stale description does not go unnoticed.",
		related: ["chatgpt", "perplexity"],
	},
	{
		slug: "bing-ai-mode",
		name: "Bing AI Mode",
		short: "Get cited in the AI answer Bing writes above its results, the Microsoft surface anyone can see signed out.",
		line: "Get cited in the AI answer at the top of Bing.",
		intro: [
			"Bing AI Mode is the AI answer at the top of Bing, built only from pages in Bing's own index, so a page Bing has not indexed cannot be cited.",
		],
		steps: [
			{
				name: "Get indexed in Bing, not only Google",
				text: "Verify your site in Bing Webmaster Tools and check that your important pages are actually indexed there. Bing keeps its own index, and a page missing from it cannot be quoted.",
			},
			{
				name: "Tell Bing when a page changes",
				text: "Bing reads IndexNow, so submitting a URL when you publish or update it puts the new version in front of the crawler instead of waiting for the next visit.",
			},
			{
				name: "Answer in the first lines",
				text: "The answer is assembled from short, self-contained passages. Put a direct answer under a heading that matches the question, then the supporting detail beneath it.",
			},
			{
				name: "Mark up the facts",
				text: "Schema markup helps Bing read prices, availability, ratings and company details correctly, and those are the facts that end up quoted.",
			},
			{
				name: "Read the sources it cites",
				text: "Track the questions your buyers ask and look at which pages Bing picks. The cited set shows where to publish next, and whether your Bing-side fixes paid off.",
			},
		],
		tracking:
			"CiteRank.com asks your prompts in Bing's own interface and keeps each answer in full, with every source it cited. You see how often Bing AI Mode names your brand, which competitors it names instead, and which pages it draws on. It is one of the AI tools you can pick on every plan.",
		related: ["copilot", "google-ai-overviews", "chatgpt"],
	},
	{
		slug: "copilot",
		name: "Microsoft Copilot",
		short: "Appear in Microsoft Copilot, which pairs OpenAI models with Bing's web index to answer and cite.",
		line: "Appear in Copilot, which answers from Bing.",
		intro: [
			"Copilot is Microsoft's assistant, and it answers from Bing's search results, so being well indexed in Bing is what counts.",
		],
		steps: [
			{
				name: "Make sure Bing indexes you well",
				text: "Verify your site in Bing Webmaster Tools and confirm your important pages are crawled and indexed, since Copilot retrieves from Bing.",
			},
			{
				name: "Answer questions directly",
				text: "Lead with a clear answer to the query, then add support. Copilot favors extractable, self-contained responses.",
			},
			{
				name: "Add structured data",
				text: "Schema markup helps Bing and Copilot parse and trust the facts on your page.",
			},
			{
				name: "Build authority and freshness",
				text: "Depth on your topic and current content improve both your Bing ranking and your odds of being cited in Copilot.",
			},
			{
				name: "Track Microsoft's AI answers",
				text: "Monitor how Bing AI Mode mentions and cites your brand on a consistent set of prompts to find weak spots.",
			},
		],
		tracking:
			"The Copilot app now asks visitors to sign in, so CiteRank.com tracks Bing AI Mode instead: Microsoft's AI answer in Bing, built on the same index. You see how it mentions and cites your brand across your prompts, and the payoff from Bing-side improvements over time.",
		related: ["bing-ai-mode", "chatgpt", "google-ai-overviews"],
	},
	{
		slug: "grok",
		name: "Grok",
		short: "Track your brand in Grok, xAI's assistant integrated with X and tuned for real-time information.",
		line: "Track your brand in the assistant built into X.",
		intro: [
			"Grok is the assistant built into X, so what people say about you on X shapes its answers more than on other engines.",
		],
		steps: [
			{
				name: "Maintain an active, accurate presence on X",
				text: "Because Grok leans on X, an up-to-date profile and accurate conversation about your brand there feed directly into its answers.",
			},
			{
				name: "Publish clear, current web content",
				text: "Grok favors real-time information. Keep your cornerstone pages accurate and lead with direct answers.",
			},
			{
				name: "Earn trusted mentions",
				text: "References on reputable sources and credible discussion shape how Grok characterizes your brand.",
			},
			{
				name: "Make your facts easy to quote",
				text: "Headings, concise answers, and schema make your facts easy to quote correctly.",
			},
			{
				name: "Monitor for accuracy",
				text: "Real-time engines can amplify whatever is loudest. Track Grok so you can correct an inaccurate take quickly.",
			},
		],
		tracking:
			"CiteRank.com runs your prompts through Grok and records its mentions, citations, and sentiment, so you can monitor a fast-moving, social-driven engine alongside the rest.",
		related: ["chatgpt", "perplexity"],
	},
];

export function getAiSearchEngine(slug: string): AiSearchEngine | undefined {
	return aiSearchEngines.find((e) => e.slug === slug);
}
