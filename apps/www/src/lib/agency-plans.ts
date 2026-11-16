import { PLANS } from "@workspace/config/plans";

/* The tracker plan the agency's price includes. Its price and limits are part of what that price pays for, so the page says them. */
const TRACKER = PLANS.business;
const ANSWERS_A_DAY = TRACKER.maxPrompts * TRACKER.platformPicks * TRACKER.standardRunsPerDay;

/** Where the agency's price starts. The scope, and so the price above this, is agreed on a call. */
export const AGENCY_FROM_USD = 4995;

/* The kinds of work, once: the short name where they are listed, the title and the sentence where they are explained. */
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
	{
		name: "Schema and entity work",
		title: "Schema and entities",
		body: "We add the structured data that tells AI what your company, products and people are.",
	},
	{
		name: "Technical SEO fixes",
		title: "Technical SEO",
		body: "We fix what makes your pages slow or hard for search engines and AI to read.",
	},
	{
		name: "Digital PR and brand mentions",
		title: "Digital PR and brand mentions",
		body: "We pitch your story to the press and the sites AI reads. They decide whether to mention you.",
	},
];

/* Everything the agency does, as the list beside its price: the work, then the report that shows it worked. */
export const AGENCY_DOES = [...AGENCY_WORK.map((work) => work.name), "Before-and-after report"];

/* The lines that most make a buyer want to book a call, in that order. Where the list is folded, these show first. */
export const AGENCY_DOES_FIRST = [
	"Before-and-after report",
	"Digital PR and brand mentions",
	"Technical SEO fixes",
	"Review site and list pitches",
	"Schema and entity work",
];

/* What comes with it, whatever the scope. */
export const AGENCY_INCLUDES = [
	`$${TRACKER.monthlyPriceUsd} tracker plan included`,
	`${TRACKER.maxPrompts} buyer questions asked ${TRACKER.standardRunsPerDay} times a day`,
	`Up to ${ANSWERS_A_DAY.toLocaleString("en-US")} AI answers read a day`,
	"Work chosen from what the tracker ranks",
];

export function formatUsd(amount: number): string {
	return `$${amount.toLocaleString("en-US")}`;
}
