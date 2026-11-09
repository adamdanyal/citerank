import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";

export interface HeroVariant {
	title: string;
	/** Omit to keep the homepage's default lede. */
	lede?: string;
}

/**
 * Homepage hero copy selectable with `/?v=<key>`, so paid-search ads can land
 * on a headline that matches their keywords without a separate page. Only
 * these keys render: free text from the URL would let anyone put their own
 * words on our domain.
 */
export const heroVariants: Record<string, HeroVariant> = {
	"ai-visibility": {
		title: "Track your brand's AI visibility",
		lede: "See how often ChatGPT, Claude, Gemini, Perplexity, and Google AI Overviews mention your brand, how they describe it, and which competitors they recommend instead.",
	},
	chatgpt: {
		title: "Is ChatGPT mentioning you?",
		lede: "CiteRank.com asks ChatGPT and 11 other AI apps the questions your buyers ask, then shows whether you're in the answer, who's there instead, and what to fix.",
	},
	"see-what-ai-says": {
		title: "See what AI says about your brand",
		lede: "Track every answer ChatGPT, Claude, Gemini, and Perplexity give about your brand: whether you're mentioned, how you're described, and which sources they cite.",
	},
	"stop-checking": {
		title: "Stop checking ChatGPT by hand",
		lede: "CiteRank.com runs your buyers' prompts across AI models on a schedule and tracks every answer, so you see trends instead of one-off screenshots.",
	},
	"aeo-tool": {
		title: "The AEO tool that tells you what to fix",
		lede: "CiteRank.com tracks your visibility across AI answer engines and turns it into a ranked list of fixes, from the pages to update to the sources AI trusts.",
	},
	geo: {
		title: "Generative engine optimization, measured",
		lede: "Track how generative AI engines mention and cite your brand, benchmark against competitors, and see which changes move your visibility.",
	},
	"share-of-voice": {
		title: "Own your AI share of voice",
		lede: "See how often AI models recommend you versus your competitors, prompt by prompt and model by model, and track it as it changes.",
	},
	citations: {
		title: "Know which sources AI cites",
		lede: "CiteRank.com shows which pages and domains ChatGPT, Perplexity, and Google AI Overviews cite when they answer your buyers, so you know where to show up.",
	},
	"ai-overviews": {
		title: "Track your brand in AI Overviews",
		lede: "See when Google AI Overviews, AI Mode, ChatGPT, and Perplexity mention your brand, and which sources they pull from when they don't.",
	},
	price: {
		title: `AI visibility tracking from $${CLOUD_ENTRY_PRICE_USD}/mo`,
		lede: "Track how AI models talk about your brand without an enterprise contract. Unlimited seats on every plan, no sales call, and you can start in minutes.",
	},
	"win-ai-search": {
		title: "Win AI search",
	},
	agency: {
		title: "Get your business named in ChatGPT",
		lede: "CiteRank.com's AI search agency writes the pages, gets you onto the lists and publishes the guest articles AI reads when buyers ask it who to choose.",
	},
};

export function getHeroVariant(key: unknown): HeroVariant | undefined {
	return typeof key === "string" && Object.hasOwn(heroVariants, key) ? heroVariants[key] : undefined;
}
