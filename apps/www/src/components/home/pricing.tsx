import { Link } from "@tanstack/react-router";
import { PLAN_KEYS, PLANS, type PlanDefinition, type PlanKey } from "@workspace/config/plans";
import { cloudAppUrl } from "@workspace/config/referrals";
import { ArrowRight, Check, Minus } from "lucide-react";
import { CARD, SectionHeading } from "./ui";

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

/** The whole card is the link, so any click on a tier starts sign-up. */
function TierCard({ planKey, badge }: { planKey: PlanKey; badge?: string }) {
	const plan = PLANS[planKey];
	return (
		<a
			href={cloudAppUrl(`marketing-plan-${planKey}`)}
			className={`group relative flex flex-col p-6 transition hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${CARD} ${badge ? "ring-2 ring-blue-600" : ""}`}
		>
			{badge ? (
				<span className="absolute -top-3 left-6 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white">
					{badge}
				</span>
			) : null}
			<span className="flex items-center justify-between text-base font-semibold text-zinc-950">
				{plan.name}
				<ArrowRight
					className="size-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600"
					aria-hidden="true"
				/>
			</span>
			<span className="mt-2 flex items-baseline gap-1">
				<span className="text-4xl font-semibold tracking-[-0.035em] text-zinc-950 tabular-nums">
					${plan.monthlyPriceUsd}
				</span>
				<span className="text-sm text-zinc-500">/mo</span>
			</span>
			<ul className="mt-5 space-y-2.5 text-sm">
				{planLines(plan).map((line) => (
					<li key={line.text} className={`flex items-start gap-2 ${line.included ? "text-zinc-700" : "text-zinc-500"}`}>
						{line.included ? (
							<Check className="mt-0.5 size-4 shrink-0 text-blue-600" strokeWidth={2.5} aria-hidden="true" />
						) : (
							<Minus className="mt-0.5 size-4 shrink-0 text-zinc-300" strokeWidth={2.5} aria-hidden="true" />
						)}
						{line.text}
					</li>
				))}
			</ul>
		</a>
	);
}

const LINK = "group inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700";

function OtherOption({ name, body, action }: { name: string; body: string; action: React.ReactNode }) {
	return (
		<div className="flex flex-col rounded-2xl bg-zinc-50/80 p-6 ring-1 ring-zinc-200/80">
			<h3 className="text-base font-semibold text-zinc-950">{name}</h3>
			<p className="mt-2 flex-1 text-pretty text-sm/6 text-zinc-600">{body}</p>
			<div className="mt-4">{action}</div>
		</div>
	);
}

/** The two ways to buy beyond a self-serve tier: the agency, and a custom plan. */
export function OtherPlans({ className = "" }: { className?: string }) {
	return (
		<div className={`grid gap-4 md:grid-cols-2 ${className}`}>
			<OtherOption
				name="Our agency"
				body="We do the work the tracker ranks: new pages, page updates, review sites and forums."
				action={
					<Link to="/agency" className={LINK}>
						Book an agency call
						<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
					</Link>
				}
			/>
			<OtherOption
				name="Custom"
				body="More brands, custom prompt limits, higher sampling rates, and more models."
				action={
					<a href="mailto:team@citerank.com?subject=Custom%20plan" className={LINK}>
						Email us
						<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
					</a>
				}
			/>
		</div>
	);
}

/** `recommended` marks the tier that fits a landing page's audience, so the table doesn't leave them to guess. */
export function Pricing({
	lede = "Unlimited seats and API/MCP access on every plan.",
	recommended,
}: {
	lede?: string;
	recommended?: { plan: PlanKey; label: string };
} = {}) {
	return (
		<section id="pricing" className="border-t border-zinc-200/80 bg-white">
			<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 lg:py-28">
				<SectionHeading align="center" title="Simple, self-serve pricing." lede={lede} />

				<div className="mt-12 grid gap-4 md:grid-cols-3">
					{PLAN_KEYS.map((key) => (
						<TierCard key={key} planKey={key} badge={recommended?.plan === key ? recommended.label : undefined} />
					))}
				</div>

				<OtherPlans className="mt-4" />

				<div className="mt-10 flex justify-center">
					<Link to="/pricing" className={LINK}>
						Compare every plan
						<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
					</Link>
				</div>
			</div>
		</section>
	);
}
