import { PLANS } from "@workspace/config/plans";

const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));

/** What the money buys. Named in the hero, explained once under it, and not repeated at the plans. */
export const INCLUDED = [
	{ title: "Every answer, kept", body: "With the brands it named and the sources it cited." },
	{ title: `${RUNS_PER_DAY} checks a day`, body: "Enough to show the trend, not a snapshot." },
	{ title: "Fixes, ranked", body: "Which page to write, update or get listed on." },
	{ title: "Unlimited seats", body: "API and MCP included." },
	{ title: "Cancel any time", body: "No contract, no sales call." },
];
