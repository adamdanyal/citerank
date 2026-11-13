import { Link } from "@tanstack/react-router";
import { PLAN_KEYS, PLANS, type PlanDefinition, type PlanKey } from "@workspace/config/plans";
import { cloudAppUrl } from "@workspace/config/referrals";
import { trackEvent } from "@/lib/posthog";
import { ACTION, ACTION_QUIET, BODY, HEADING, LINK, MONO, Page, SECTION, SMALL, SUBHEAD } from "./kit";

const RECOMMENDED: PlanKey = "pro";

const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));

const INCLUDED = [
	{ title: "Every answer, kept", body: "With the brands it named and the sources it cited." },
	{ title: `${RUNS_PER_DAY} checks a day`, body: "Enough to show the trend, not a snapshot." },
	{ title: "Fixes, ranked", body: "Which page to write, update or get listed on." },
	{ title: "Unlimited seats", body: "API and MCP included." },
	{ title: "Cancel any time", body: "No contract, no sales call." },
];

function planLines(plan: PlanDefinition): { text: string; included: boolean }[] {
	const platforms = plan.platformMenu.length === 1 ? "ChatGPT only" : `Any ${plan.platformPicks} AI platforms`;
	return [
		{ text: `${plan.maxBrands} brand${plan.maxBrands === 1 ? "" : "s"}, ${plan.maxPrompts} prompts`, included: true },
		{ text: platforms, included: true },
		{ text: `Answers checked ${plan.standardRunsPerDay}× daily`, included: true },
		plan.premiumIncluded > 0
			? { text: `${plan.premiumIncluded} premium prompts 1× daily`, included: true }
			: { text: "No premium models", included: false },
	];
}

/* The plans are columns of one table. The rule over each column carries the recommendation. */
function Column({ planKey }: { planKey: PlanKey }) {
	const plan = PLANS[planKey];
	const recommended = planKey === RECOMMENDED;
	return (
		<div className={`flex flex-col border-t-2 pt-7 ${recommended ? "border-rust" : "border-zinc-200"}`}>
			<h3 className={`${SUBHEAD} text-ink`}>{plan.name}</h3>
			<p className={`${MONO} mt-1 ${recommended ? "text-rust" : "invisible"}`}>most chosen</p>
			<p className="mt-4 flex items-baseline gap-1.5">
				<span className="font-heading text-[2.75rem] leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">
					${plan.monthlyPriceUsd}
				</span>
				<span className={SMALL}>/mo</span>
			</p>
			<ul className="mt-7 flex-1 space-y-3 border-t border-zinc-200 pt-6">
				{planLines(plan).map((line) => (
					<li key={line.text} className={`${BODY} ${line.included ? "text-zinc-700" : "text-zinc-400"}`}>
						{line.text}
					</li>
				))}
			</ul>
			<a
				href={cloudAppUrl(`marketing-plan-${planKey}`)}
				onClick={() => trackEvent("plan_click", { plan: planKey, from: "home" })}
				className={`mt-8 ${recommended ? ACTION : ACTION_QUIET}`}
			>
				Get {plan.name}
			</a>
		</div>
	);
}

export function Pricing() {
	return (
		<section id="pricing" className={`${SECTION} bg-white`}>
			<Page>
				<div className="flex flex-wrap items-end justify-between gap-6">
					<h2 className={`${HEADING} text-ink`}>Simple pricing</h2>
					<p className={`${BODY} text-zinc-600`}>Every plan includes your whole team and API access.</p>
				</div>

				<ul className="mt-12 grid gap-8 border-y border-zinc-200 py-8 sm:grid-cols-2 lg:grid-cols-5">
					{INCLUDED.map((item) => (
						<li key={item.title}>
							<p className="font-heading text-[1rem] font-semibold text-ink">{item.title}</p>
							<p className={`${SMALL} mt-1 text-zinc-500`}>{item.body}</p>
						</li>
					))}
				</ul>

				<div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
					{PLAN_KEYS.map((key) => (
						<Column key={key} planKey={key} />
					))}
				</div>

				<div className="mt-16 grid gap-10 border-t border-zinc-200 pt-10 md:grid-cols-2">
					<div>
						<h3 className={`${SUBHEAD} text-ink`}>Our agency</h3>
						<p className={`${BODY} mt-3 max-w-[44ch] text-zinc-600`}>
							We do the work the tracker ranks: new pages, page updates, review sites and forums.
						</p>
						<p className={`${BODY} mt-4`}>
							<Link to="/agency" className={`${LINK} text-ink`}>
								Book an agency call
							</Link>
						</p>
					</div>
					<div>
						<h3 className={`${SUBHEAD} text-ink`}>Custom</h3>
						<p className={`${BODY} mt-3 max-w-[44ch] text-zinc-600`}>
							More brands, custom prompt limits, higher sampling rates, and more models.
						</p>
						<p className={`${BODY} mt-4`}>
							<a href="mailto:team@citerank.com?subject=Custom%20plan" className={`${LINK} text-ink`}>
								Email us
							</a>
						</p>
					</div>
				</div>

				<p className={`${SMALL} mt-10 text-zinc-500`}>
					Pay monthly or yearly by card. Cancel any time from your account.{" "}
					<Link to="/pricing" className={`${LINK} text-ink`}>
						Compare every plan
					</Link>
					.
				</p>
			</Page>
		</section>
	);
}
