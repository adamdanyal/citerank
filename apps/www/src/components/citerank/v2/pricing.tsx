import { Link } from "@tanstack/react-router";
import {
	PLAN_KEYS,
	PLANS,
	type PlanDefinition,
	type PlanKey,
	PREMIUM_MODELS,
	premiumModelLabel,
} from "@workspace/config/plans";
import { cloudAppUrl } from "@workspace/config/referrals";
import { type ReactNode, useState } from "react";
import { trackEvent } from "@/lib/posthog";
import { ACTION, ACTION_QUIET, LEAD, LINK, PANEL, PANEL_PAD_WIDE, Page, PanelHead, SMALL, SUBHEAD } from "./kit";

const DEFAULT_RECOMMENDED: PlanKey = "pro";

type Billing = "monthly" | "annual";

const BILLING: { value: Billing; label: string }[] = [
	{ value: "monthly", label: "Monthly" },
	{ value: "annual", label: "Yearly, two months free" },
];

const list = new Intl.ListFormat("en", { type: "conjunction" });

/* Only what differs between plans. What they share is one line under the table and a section of its own. */
const ROWS: { label: string; value: (plan: PlanDefinition) => string }[] = [
	{ label: "Brands", value: (plan) => String(plan.maxBrands) },
	{ label: "Buyer questions tracked", value: (plan) => String(plan.maxPrompts) },
	{
		label: "Answers a day, up to",
		value: (plan) => (plan.maxPrompts * plan.platformPicks * plan.standardRunsPerDay).toLocaleString("en-US"),
	},
	{
		label: "Premium prompts",
		value: (plan) => (plan.premiumIncluded > 0 ? `${plan.premiumIncluded}, asked daily` : "None"),
	},
];

const SHARED = PLANS.basic;

const usd = (amount: number) => `$${amount.toLocaleString("en-US")}`;

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";
const CELL = "border-t border-zinc-200 py-4";

function BillingSwitch({ billing, onChange }: { billing: Billing; onChange: (billing: Billing) => void }) {
	return (
		<fieldset className="inline-flex w-fit rounded-full bg-paper-2 p-1">
			<legend className="sr-only">Billing period</legend>
			{BILLING.map((option) => (
				<button
					key={option.value}
					type="button"
					aria-pressed={billing === option.value}
					onClick={() => onChange(option.value)}
					className={`h-11 rounded-full px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200 ${FOCUS} ${
						billing === option.value ? "bg-ink text-paper" : "text-zinc-700 hover:text-ink"
					}`}
				>
					{option.label}
				</button>
			))}
		</fieldset>
	);
}

/*
 * The plans as one table. Each plan is a column that shares the table's rows,
 * so a figure lines up with the same figure on the next plan. On a phone each
 * plan is its own block and carries its own row labels. The plan to pick is
 * marked by its filled button and one word, never by a different surface.
 */
export function PlanTable({
	from = "home",
	recommended,
}: {
	from?: string;
	recommended?: { plan: PlanKey; label: string };
}) {
	const [billing, setBilling] = useState<Billing>("monthly");
	const recommendedKey = recommended?.plan ?? DEFAULT_RECOMMENDED;
	const recommendedLabel = recommended?.label ?? "Most chosen";
	const span = "md:row-span-6 md:grid md:grid-rows-subgrid";

	return (
		<div>
			<div className="md:hidden">
				<BillingSwitch billing={billing} onChange={setBilling} />
			</div>
			<div className="mt-8 grid gap-10 md:mt-0 md:grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))] md:gap-x-8 md:gap-y-0">
				<div className={`hidden ${span}`}>
					<div className="self-start pb-8">
						<BillingSwitch billing={billing} onChange={setBilling} />
					</div>
					{ROWS.map((row) => (
						<p key={row.label} aria-hidden="true" className={`${CELL} text-[1rem] text-zinc-600`}>
							{row.label}
						</p>
					))}
					<div className="border-t border-zinc-200" />
				</div>

				{PLAN_KEYS.map((key) => {
					const plan = PLANS[key];
					const isRecommended = key === recommendedKey;
					const yearlyPerMonth = Math.round(plan.annualPriceUsd / 12);
					const perMonth = billing === "monthly" ? plan.monthlyPriceUsd : yearlyPerMonth;
					return (
						<article key={key} className={span}>
							<div className="pb-8">
								<h3 className={`${SUBHEAD} flex flex-wrap items-baseline gap-x-3 text-ink`}>
									{plan.name}
									{isRecommended ? (
										<span className="font-sans text-[0.875rem] font-medium tracking-normal text-blue-800">
											{recommendedLabel}
										</span>
									) : null}
								</h3>
								<p className="mt-4 flex items-baseline gap-2">
									<span className="font-heading text-[3rem] leading-none font-bold tracking-[-0.03em] text-ink tabular-nums">
										{usd(perMonth)}
									</span>
									<span className={`${SMALL} text-zinc-600`}>a month</span>
								</p>
								<p className={`${SMALL} mt-2 text-zinc-600`}>
									{billing === "annual"
										? `Billed ${usd(plan.annualPriceUsd)} a year. Saves ${usd(plan.monthlyPriceUsd * 12 - plan.annualPriceUsd)}.`
										: `Or ${usd(yearlyPerMonth)} a month, billed yearly.`}
								</p>
							</div>
							<dl className="md:contents">
								{ROWS.map((row) => (
									<div key={row.label} className={`${CELL} flex items-baseline justify-between gap-4`}>
										<dt className="text-[1rem] text-zinc-600 md:sr-only">{row.label}</dt>
										<dd className="text-[1.0625rem] font-medium text-ink tabular-nums">{row.value(plan)}</dd>
									</div>
								))}
							</dl>
							<div className="border-t border-zinc-200 pt-6">
								<a
									href={cloudAppUrl(`marketing-plan-${key}`)}
									onClick={() => trackEvent("plan_click", { plan: key, from })}
									className={`w-full ${isRecommended ? ACTION : ACTION_QUIET}`}
								>
									Get {plan.name}
								</a>
							</div>
						</article>
					);
				})}
			</div>
			<p className={`${SMALL} mt-8 max-w-[70ch] text-zinc-600`}>
				On every plan a brand tracks any {SHARED.platformPicks} of {SHARED.platformMenu.length} AI apps,{" "}
				{SHARED.standardRunsPerDay} times a day. Premium prompts are asked with web search on, in{" "}
				{list.format(PREMIUM_MODELS.map(premiumModelLabel))}. Prices in US dollars.
			</p>
		</div>
	);
}

export function Pricing({
	lede = "Every plan includes your whole team and API access.",
	recommended,
}: {
	lede?: ReactNode;
	recommended?: { plan: PlanKey; label: string };
} = {}) {
	return (
		<section id="pricing" className={`${PANEL} ${PANEL_PAD_WIDE}`}>
			<Page>
				<PanelHead title="Simple pricing">
					<p className={`${LEAD} text-zinc-600`}>{lede}</p>
				</PanelHead>

				<div className="mt-10 lg:mt-16">
					<PlanTable recommended={recommended} />
				</div>

				<p className={`${SMALL} mt-3 text-zinc-600`}>
					Need more brands, questions or models?{" "}
					<a href="mailto:team@citerank.com?subject=Custom%20plan" className={`${LINK} text-ink`}>
						Email us
					</a>{" "}
					for a custom plan, or{" "}
					<Link to="/pricing" className={`${LINK} text-ink`}>
						compare every plan
					</Link>
					.
				</p>
			</Page>
		</section>
	);
}
