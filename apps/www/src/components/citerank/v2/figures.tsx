import { CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";
import { InkGlow, PANEL_INK, PANEL_PAD, Page, SMALL } from "./kit";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;
const SCRAPED_COUNT = Object.values(CLOUD_PLATFORMS).filter((platform) => platform.access === "scraped").length;
const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));
const BASIC_ANSWERS_PER_DAY = PLANS.basic.maxPrompts * PLANS.basic.platformPicks * PLANS.basic.standardRunsPerDay;

/* Every figure here is read off the plan catalogue, so the page cannot drift from what we sell. */
const FIGURES = [
	{ value: String(ENGINE_COUNT), label: "AI apps your buyers ask" },
	{ value: String(SCRAPED_COUNT), label: "of them read in the app, not through an API" },
	{ value: `${RUNS_PER_DAY}×`, label: "a day, so you see the trend and not a snapshot" },
	{
		value: BASIC_ANSWERS_PER_DAY.toLocaleString("en-US"),
		label: "answers a day, even on the entry plan",
	},
];

/* Figures reversed out of the ink, divided by hairlines: the page's one loud moment. */
export function Figures() {
	return (
		<section className={`${PANEL_INK} ${PANEL_PAD}`}>
			<InkGlow />
			<Page className="relative">
				<dl className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
					{FIGURES.map((figure) => (
						<div
							key={figure.label}
							className="border-white/15 sm:border-l sm:pl-8 sm:first:border-l-0 sm:first:pl-0 lg:pl-10 lg:first:pl-0"
						>
							<dt className="font-heading text-[3.5rem] leading-[0.95] font-semibold tracking-[-0.04em] text-paper tabular-nums lg:text-[4rem]">
								{figure.value}
							</dt>
							<dd className={`${SMALL} mt-4 max-w-[22ch] text-zinc-400`}>{figure.label}</dd>
						</div>
					))}
				</dl>
			</Page>
		</section>
	);
}
