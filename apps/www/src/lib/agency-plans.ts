export interface AgencyPlan {
	name: string;
	monthlyPriceUsd: number;
	/** Set on a plan whose price is where its scope starts, not what it costs. */
	from?: boolean;
	summary: string;
	/** What sets the plan apart, a short line each. What every plan shares is in AGENCY_EVERY_PLAN. */
	lines: string[];
	/** What the plan leaves out, so the lists on the cards stay level. */
	without?: string[];
	recommended?: boolean;
}

export const AGENCY_PLANS: AgencyPlan[] = [
	{
		name: "Growth",
		monthlyPriceUsd: 4995,
		summary: "For brands competing on every buyer question.",
		lines: [
			"1 brand, up to 2 markets",
			"4 new pages, 4 page updates",
			"4 pitches, 8 forum answers",
			"1 guest article",
			"A 30-minute call every month",
		],
		without: ["No named strategist"],
	},
	{
		name: "Authority",
		monthlyPriceUsd: 7995,
		summary: "For several brands or markets.",
		recommended: true,
		lines: [
			"Up to 3 brands or markets",
			"8 new pages, 8 page updates",
			"8 pitches, 16 forum answers",
			"3 guest articles",
			"A call every two weeks",
			"A named strategist",
		],
	},
	{
		name: "Enterprise",
		monthlyPriceUsd: 14995,
		from: true,
		summary: "Custom scope for large brands.",
		lines: [
			"Everything in Authority",
			"Amounts set on a call",
			"Schema and entity work",
			"Technical SEO fixes",
			"Digital PR and brand mentions",
			"A senior strategist",
		],
	},
];

/* What every plan includes, said once beside the cards. */
export const AGENCY_EVERY_PLAN = [
	"Business tracker plan",
	"Work chosen from what the tracker ranks",
	"Ongoing crawler fixes",
	"Monthly before-and-after report",
];

/* The kinds of work, once: the short name on the home page, the title and the sentence on the agency page. */
export const AGENCY_WORK = [
	{
		name: "New pages",
		title: "Pages your site is missing",
		body: "The comparison, alternatives and guide pages buyers ask about, where AI names competitors instead of you.",
	},
	{
		name: "Page updates",
		title: "Pages AI stopped citing",
		body: "We update old pages AI no longer cites, so they answer the questions buyers ask today.",
	},
	{
		name: "Review site and list pitches",
		title: "Review sites and best-of lists",
		body: "We pitch you to the review sites and lists AI cites when it leaves you out. They decide whether to add you.",
	},
	{
		name: "Forum answers",
		title: "Forums and communities",
		body: "We answer buyers’ questions, openly as your brand, in the forums and communities where they ask.",
	},
	{
		name: "Guest articles",
		title: "Guest articles",
		body: "Articles on sites AI already cites, each aimed at a question where a competitor is named instead.",
	},
	{
		name: "Crawler fixes",
		title: "Crawler fixes",
		body: "We fix anything that stops AI crawlers reading your site.",
	},
];

export const FOUNDING_DISCOUNT = 0.25;

export function formatUsd(amount: number): string {
	return `$${amount.toLocaleString("en-US")}`;
}

export function foundingPriceUsd(plan: AgencyPlan): number {
	return Math.round(plan.monthlyPriceUsd * (1 - FOUNDING_DISCOUNT));
}

/** A plan's price as a sentence would say it: a fixed plan's price, or where a scoped plan starts. */
export function planPrice(plan: AgencyPlan): string {
	return `${plan.from ? "from " : ""}${formatUsd(plan.monthlyPriceUsd)}`;
}
