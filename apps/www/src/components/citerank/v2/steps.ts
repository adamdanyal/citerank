import { CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;
const BASIC_ANSWERS_PER_DAY = PLANS.basic.maxPrompts * PLANS.basic.platformPicks * PLANS.basic.standardRunsPerDay;

/*
 * One source for the three steps, read by the section on the page and by the
 * HowTo schema under it. A crawler and a visitor cannot disagree about them,
 * and the numbers come from the plan catalogue rather than from prose.
 */
export const STEP_SCHEMA = [
	{
		name: "We ask AI your buyers’ questions",
		text: `CiteRank.com puts your buyers’ questions to ${ENGINE_COUNT} AI answer engines four times a day and keeps each answer whole, with the brands it named and the sources it cited. On the entry plan that is up to ${BASIC_ANSWERS_PER_DAY.toLocaleString("en-US")} answers a day.`,
	},
	{
		name: "See where you stand",
		text: "See how often each AI engine names you, how often it names each rival, how it describes you, and which pages it trusts enough to cite.",
	},
	{
		name: "Know what to fix",
		text: "Opportunities ranks the fixes biggest win first: a page to write, a page to update, a review site to get listed on. Do them yourself or hand them to the CiteRank.com agency.",
	},
];
