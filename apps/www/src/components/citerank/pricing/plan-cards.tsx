import { PLAN_KEYS, PLANS, type PlanDefinition, type PlanKey, planPlatformBreakdown } from "@workspace/config/plans";
import { cloudAppUrl } from "@workspace/config/referrals";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/posthog";
import { CARD, EASE_CLASS, PRIMARY_BUTTON, RevealItem, SECONDARY_BUTTON } from "../ui";

type Billing = "monthly" | "annual";

const RECOMMENDED: PlanKey = "pro";

const FOR: Record<PlanKey, string> = {
	basic: "One brand on four AI apps.",
	pro: "Two brands, with premium models.",
	business: "Five brands, the full set.",
};

function includes(plan: PlanDefinition): string[] {
	const breakdown = planPlatformBreakdown(plan);
	const apps =
		plan.platformPicks === 1 && plan.platformMenu.length === 1
			? "ChatGPT only"
			: `Any ${plan.platformPicks} of ${plan.platformMenu.length} AI apps`;
	return [
		`${plan.maxBrands} brand${plan.maxBrands === 1 ? "" : "s"}`,
		`${plan.maxPrompts} tracked prompts`,
		apps,
		`Checked ${plan.standardRunsPerDay}× a day`,
		...(breakdown.premium ? [`${breakdown.premium.includedSlots} premium prompts, answered daily`] : []),
		"Unlimited seats",
		"API and MCP access",
		"Cancel any time",
	];
}

function PlanCard({ plan, billing, delay }: { plan: PlanDefinition; billing: Billing; delay: number }) {
	const recommended = plan.key === RECOMMENDED;
	const yearlyPerMonth = Math.round(plan.annualPriceUsd / 12);
	const perMonth = billing === "monthly" ? plan.monthlyPriceUsd : yearlyPerMonth;
	return (
		<RevealItem delay={delay} className={`${CARD} flex flex-col p-6 ${recommended ? "ring-2 ring-blue-600" : ""}`}>
			<p className="flex items-center justify-between gap-2 title-1 text-zinc-950">
				{plan.name}
				{recommended ? (
					<span className="caption-3 rounded-md bg-blue-600 px-2 py-0.5 text-white">Recommended</span>
				) : null}
			</p>
			<p className="body-6 mt-1 text-zinc-600">{FOR[plan.key]}</p>
			<p className="mt-6 flex items-baseline gap-2">
				<span className="font-mono text-4xl font-medium tracking-[-0.02em] text-zinc-950 tabular-nums">
					${perMonth.toLocaleString("en-US")}
				</span>
				<span className="caption-2 text-zinc-500">a month</span>
			</p>
			<p className="caption-2 mt-1 text-zinc-500">
				{billing === "annual"
					? `Billed $${plan.annualPriceUsd.toLocaleString("en-US")} a year. Saves $${(plan.monthlyPriceUsd * 12 - plan.annualPriceUsd).toLocaleString("en-US")}.`
					: `Or $${yearlyPerMonth.toLocaleString("en-US")} a month, billed yearly`}
			</p>
			<a
				href={cloudAppUrl(`marketing-pricing-${plan.key}`)}
				onClick={() => trackEvent("plan_click", { plan: plan.key, from: "pricing" })}
				className={`mt-6 w-full ${recommended ? PRIMARY_BUTTON : SECONDARY_BUTTON}`}
			>
				Get {plan.name}
				<ArrowRight className="size-4" aria-hidden="true" />
			</a>
			<p className="caption-1 mt-6 text-zinc-950">Includes</p>
			<ul className="mt-3 space-y-2">
				{includes(plan).map((line) => (
					<li key={line} className="flex items-start gap-2 body-6 text-zinc-700">
						<Check className="mt-0.5 size-4 shrink-0 text-blue-600" strokeWidth={2.5} aria-hidden="true" />
						{line}
					</li>
				))}
			</ul>
		</RevealItem>
	);
}

export function PlanCards() {
	const [billing, setBilling] = useState<Billing>("annual");
	const options: { value: Billing; label: string }[] = [
		{ value: "monthly", label: "Monthly" },
		{ value: "annual", label: "Yearly, two months free" },
	];
	return (
		<div>
			<fieldset className="mx-auto flex w-fit rounded-lg bg-paper-2 p-1">
				<legend className="sr-only">Billing period</legend>
				{options.map((option) => (
					<button
						key={option.value}
						type="button"
						aria-pressed={billing === option.value}
						onClick={() => setBilling(option.value)}
						className={`rounded-md px-4 py-2 button-sm transition-colors duration-300 ${EASE_CLASS} ${
							billing === option.value ? "bg-white text-zinc-950 shadow-card" : "text-zinc-600 hover:text-zinc-950"
						}`}
					>
						{option.label}
					</button>
				))}
			</fieldset>
			<ul className="mt-10 grid gap-5 md:grid-cols-3">
				{PLAN_KEYS.map((key, index) => (
					<PlanCard key={key} plan={PLANS[key]} billing={billing} delay={index * 60} />
				))}
			</ul>
			<p className="caption-2 mt-6 text-center text-zinc-600">
				Prices in US dollars. Yearly plans are billed once a year.
			</p>
		</div>
	);
}
