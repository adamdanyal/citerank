import { Link } from "@tanstack/react-router";
import { PLAN_KEYS, PLANS, type PlanDefinition, type PlanKey } from "@workspace/config/plans";
import { cloudAppUrl } from "@workspace/config/referrals";
import { trackEvent } from "@/lib/posthog";
import {
	ACTION,
	ACTION_QUIET,
	BODY,
	Go,
	LEAD,
	LINK,
	PANEL,
	PANEL_PAD,
	Page,
	PanelHead,
	PILL_RUST,
	SMALL,
	SUBHEAD,
} from "./kit";

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

/* Each plan is a card. The recommended one is the single dark object in a light panel. */
function PlanCard({ planKey }: { planKey: PlanKey }) {
	const plan = PLANS[planKey];
	const recommended = planKey === RECOMMENDED;
	return (
		<div
			className={`flex flex-col rounded-2xl p-7 ${recommended ? "bg-ink ring-1 ring-ink" : "bg-paper-2 ring-1 ring-zinc-200"}`}
		>
			<div className="flex items-center justify-between gap-3">
				<h3 className={`${SUBHEAD} ${recommended ? "text-paper" : "text-ink"}`}>{plan.name}</h3>
				{recommended ? <span className={PILL_RUST}>Most chosen</span> : null}
			</div>
			<p className="mt-5 flex items-baseline gap-1.5">
				<span
					className={`font-heading text-[2.75rem] leading-none font-semibold tracking-[-0.03em] tabular-nums ${recommended ? "text-paper" : "text-ink"}`}
				>
					${plan.monthlyPriceUsd}
				</span>
				<span className={`${SMALL} ${recommended ? "text-zinc-400" : "text-zinc-500"}`}>/mo</span>
			</p>
			<ul className={`mt-7 flex-1 space-y-3 border-t pt-6 ${recommended ? "border-white/15" : "border-zinc-200"}`}>
				{planLines(plan).map((line) => (
					<li
						key={line.text}
						className={`${BODY} ${recommended ? (line.included ? "text-zinc-300" : "text-zinc-500") : line.included ? "text-zinc-700" : "text-zinc-400"}`}
					>
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
				{recommended ? <Go /> : null}
			</a>
		</div>
	);
}

export function Pricing() {
	return (
		<section id="pricing" className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead label="Pricing" title="Simple pricing" className="max-w-[46rem]">
					<p className={`${LEAD} text-zinc-600`}>Every plan includes your whole team and API access.</p>
				</PanelHead>

				<ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
					{INCLUDED.map((item) => (
						<li key={item.title} className="rounded-2xl bg-paper-2 p-5 ring-1 ring-zinc-200">
							<p className="font-heading text-[1rem] font-semibold text-ink">{item.title}</p>
							<p className={`${SMALL} mt-1.5 text-zinc-600`}>{item.body}</p>
						</li>
					))}
				</ul>

				<div className="mt-10 grid gap-5 md:grid-cols-3">
					{PLAN_KEYS.map((key) => (
						<PlanCard key={key} planKey={key} />
					))}
				</div>

				<div className="mt-10 grid gap-5 md:grid-cols-2">
					<div className="rounded-2xl bg-paper-2 p-7 ring-1 ring-zinc-200">
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
					<div className="rounded-2xl bg-paper-2 p-7 ring-1 ring-zinc-200">
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

				<p className={`${SMALL} mt-8 text-zinc-500`}>
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
