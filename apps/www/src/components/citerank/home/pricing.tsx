import { Link } from "@tanstack/react-router";
import { PLAN_KEYS, PLANS, type PlanDefinition, type PlanKey } from "@workspace/config/plans";
import { cloudAppUrl } from "@workspace/config/referrals";
import { ArrowRight, Check, Minus } from "lucide-react";
import { CARD, Container, LinkArrow, PRIMARY_BUTTON, Reveal, RevealItem, SECONDARY_BUTTON, TEXT_LINK } from "../ui";

const RECOMMENDED: PlanKey = "pro";

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

function Tier({ planKey, delay }: { planKey: PlanKey; delay: number }) {
	const plan = PLANS[planKey];
	const recommended = planKey === RECOMMENDED;
	return (
		<RevealItem delay={delay} className={`${CARD} flex flex-col p-6 ${recommended ? "ring-2 ring-blue-600" : ""}`}>
			<p className="flex items-center justify-between gap-2 title-3 text-zinc-950">
				{plan.name}
				{recommended ? (
					<span className="caption-3 rounded-md bg-blue-600 px-2 py-0.5 text-white">Recommended</span>
				) : null}
			</p>
			<p className="mt-4 flex items-baseline gap-1">
				<span className="font-mono text-4xl font-medium tracking-[-0.02em] text-zinc-950 tabular-nums">
					${plan.monthlyPriceUsd}
				</span>
				<span className="caption-2 text-zinc-500">/mo</span>
			</p>
			<ul className="mt-6 flex-1 space-y-3">
				{planLines(plan).map((line) => (
					<li
						key={line.text}
						className={`flex items-start gap-2 body-6 ${line.included ? "text-zinc-700" : "text-zinc-500"}`}
					>
						{line.included ? (
							<Check className="mt-0.5 size-4 shrink-0 text-blue-600" strokeWidth={2.5} aria-hidden="true" />
						) : (
							<Minus className="mt-0.5 size-4 shrink-0 text-zinc-400" strokeWidth={2.5} aria-hidden="true" />
						)}
						{line.text}
					</li>
				))}
			</ul>
			<a
				href={cloudAppUrl(`marketing-plan-${planKey}`)}
				className={`mt-8 w-full ${recommended ? PRIMARY_BUTTON : SECONDARY_BUTTON}`}
			>
				Get {plan.name}
				<ArrowRight className="size-4" aria-hidden="true" />
			</a>
		</RevealItem>
	);
}

function OtherOption({ name, body, action }: { name: string; body: string; action: React.ReactNode }) {
	return (
		<div className={`${CARD} flex flex-col p-6`}>
			<h3 className="title-3 text-zinc-950">{name}</h3>
			<p className="body-6 mt-2 flex-1 text-zinc-600">{body}</p>
			<div className="-ml-1 mt-4">{action}</div>
		</div>
	);
}

export function Pricing() {
	return (
		<section id="pricing" className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="max-w-3xl">
					<h2 className="heading-2 text-zinc-950">Simple Pricing, No Sales Call</h2>
					<p className="body-7 mt-6 text-zinc-600">Unlimited seats and API/MCP access on every plan.</p>
				</Reveal>

				<ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{PLAN_KEYS.map((key, index) => (
						<Tier key={key} planKey={key} delay={index * 80} />
					))}
				</ul>

				<Reveal className="mt-4 grid gap-4 md:grid-cols-2">
					<OtherOption
						name="Our Agency"
						body="We do the work the tracker ranks: new pages, page updates, review sites and forums."
						action={
							<Link to="/agency" className={TEXT_LINK}>
								Book an agency call
								<LinkArrow />
							</Link>
						}
					/>
					<OtherOption
						name="Custom"
						body="More brands, custom prompt limits, higher sampling rates, and more models."
						action={
							<a href="mailto:team@citerank.com?subject=Custom%20plan" className={TEXT_LINK}>
								Email us
								<LinkArrow />
							</a>
						}
					/>
				</Reveal>

				<p className="mt-10 flex justify-center">
					<Link to="/pricing" className={TEXT_LINK}>
						Compare every plan
						<LinkArrow />
					</Link>
				</p>
			</Container>
		</section>
	);
}
