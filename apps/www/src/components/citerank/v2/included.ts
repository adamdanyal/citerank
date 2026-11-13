import { CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";

const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));
const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

/**
 * What the money buys, in the words someone would use out loud.
 *
 * Each title has to make sense to a reader who has never seen the product and
 * does not work in search: on its own, with nothing above or beside it. The old
 * titles did not. "4 checks a day" gave a reader no way of knowing four checks
 * of what, and "Unlimited seats, API and MCP" named three things they would
 * have to look up.
 */
export const INCLUDED = [
	{
		title: "You see the whole answer, not a score",
		body: `When an AI app answers a question your customers ask, we keep the full reply: which brands it recommended, and which websites it got that from.`,
	},
	{
		title: "We ask again four times a day",
		body: `Your customers' questions go to ${ENGINE_COUNT} AI apps, ${RUNS_PER_DAY} times a day, so you can tell whether you are being named more often or less.`,
	},
	{
		title: "You get a to-do list, most important first",
		body: "Not a dashboard to interpret. A list: write this page, update that one, get listed on this review site.",
	},
	{
		title: "Unlimited seats, a REST API and an MCP server",
		body: "No per-person charge, and the data reaches your own tools and AI assistants rather than staying locked in a dashboard.",
	},
	{
		title: "Cancel whenever you like",
		body: "No contract, no minimum, and no phone call needed either to start or to stop.",
	},
];
