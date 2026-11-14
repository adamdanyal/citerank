export interface AgencyPlan {
	name: string;
	monthlyPriceUsd: number;
	summary: string;
	includes: string[];
	recommended?: boolean;
}

export const AGENCY_PLANS: AgencyPlan[] = [
	{
		name: "Foundation",
		monthlyPriceUsd: 1500,
		summary: "For one brand starting on AI search.",
		includes: [
			"Pro tracker plan included",
			"1 brand or market",
			"2 new pages a month",
			"2 page updates a month",
			"2 review site and list pitches a month",
			"4 forum answers a month",
			"Crawler fixes in the first month, then as found",
			"Monthly before-and-after report",
		],
	},
	{
		name: "Growth",
		monthlyPriceUsd: 3500,
		summary: "For brands competing on every buyer question.",
		recommended: true,
		includes: [
			"Business tracker plan included",
			"1 brand, up to 2 markets",
			"4 new pages a month",
			"4 page updates a month",
			"4 review site and list pitches a month",
			"8 forum answers a month",
			"1 guest article a month",
			"Ongoing crawler fixes",
			"Monthly report and a 30-minute call",
		],
	},
	{
		name: "Authority",
		monthlyPriceUsd: 7500,
		summary: "For several brands or markets.",
		includes: [
			"Business tracker plan included",
			"Up to 3 brands or markets",
			"8 new pages a month",
			"8 page updates a month",
			"8 review site and list pitches a month",
			"16 forum answers a month",
			"3 guest articles a month",
			"Ongoing crawler fixes",
			"Monthly report, a call every two weeks and a named strategist",
		],
	},
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
