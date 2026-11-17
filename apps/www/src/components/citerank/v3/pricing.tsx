import { Link } from "@tanstack/react-router";
import {
	PLAN_KEYS,
	PLANS,
	type PlanDefinition,
	type PlanKey,
	PREMIUM_ADDON_MONTHLY_USD,
	planPlatformBreakdown,
} from "@workspace/config/plans";
import { cloudAppUrl } from "@workspace/config/referrals";
import { Minus, Plus } from "lucide-react";
import { type ReactNode, useState } from "react";
import { trackEvent } from "@/lib/posthog";
import { GROUP_NAMES } from "../pricing/compare";
import { AppLogo, appIconId } from "../v2/app-logo";
import {
	ACTION,
	ACTION_QUIET,
	BODY,
	CARD_SURFACE,
	CheckMark,
	EASE,
	FIGURE,
	FOCUS,
	HEAD_GAP,
	LEAD,
	LINK,
	Page,
	SECTION,
	SectionHead,
	SMALL,
	TEXT,
	TEXT_2,
	TEXT_3,
	TITLE,
} from "./kit";

const RECOMMENDED: PlanKey = "pro";
const RECOMMENDED_LABEL = "Most chosen";

type Billing = "monthly" | "annual";

const BILLING: { value: Billing; label: string }[] = [
	{ value: "monthly", label: "Monthly" },
	{ value: "annual", label: "Yearly, two months free" },
];

const count = (amount: number) => amount.toLocaleString("en-US");
const usd = (amount: number) => `$${count(amount)}`;

/* What differs between plans, one line each, then what every plan shares. A plan with none of something says so, and the three lists stay level. */
const LINES: ((plan: PlanDefinition) => { lead?: string; figure?: string; text: string; shared?: boolean })[] = [
	(plan) => ({ figure: String(plan.maxBrands), text: plan.maxBrands === 1 ? "brand" : "brands" }),
	(plan) => ({ figure: count(plan.maxPrompts), text: "buyer questions tracked" }),
	(plan) => ({
		lead: "Up to",
		figure: count(plan.maxPrompts * plan.platformPicks * plan.standardRunsPerDay),
		text: "answers a day",
	}),
	(plan) =>
		plan.premiumIncluded > 0
			? { figure: String(plan.premiumIncluded), text: "premium prompts, asked daily" }
			: { text: "No premium prompts" },
	() => ({ figure: "Unlimited", text: "team members" }),
	() => ({ text: "API and MCP access", shared: true }),
];

/* A segmented control: the chosen period is the raised card, inside a 10px track with 4px of padding. */
function BillingSwitch({ billing, onChange }: { billing: Billing; onChange: (billing: Billing) => void }) {
	return (
		<fieldset className="inline-flex w-fit max-w-full gap-1 rounded-[10px] bg-(--v3-raised) p-1">
			<legend className="sr-only">Billing period</legend>
			{BILLING.map((option) => (
				<button
					key={option.value}
					type="button"
					aria-pressed={billing === option.value}
					onClick={() => onChange(option.value)}
					className={`h-11 rounded-[6px] px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-150 ${EASE} ${FOCUS} ${
						billing === option.value
							? `bg-(--v3-card) shadow-(--v3-shadow-sm) ring-1 ring-(--v3-line) ${TEXT}`
							: `${TEXT_2} hover:text-(--v3-text)`
					}`}
				>
					{option.label}
				</button>
			))}
		</fieldset>
	);
}

function PlanLine({ children, none = false }: { children: ReactNode; none?: boolean }) {
	return (
		<li className={`flex items-start gap-3 text-[1rem] leading-snug ${none ? TEXT_3 : TEXT_2}`}>
			{none ? (
				<Minus aria-hidden="true" strokeWidth={1.5} className={`mt-px size-[18px] shrink-0 ${TEXT_3}`} />
			) : (
				<CheckMark className="mt-px" />
			)}
			<span>{children}</span>
		</li>
	);
}

/* The AI apps a plan covers, grouped by how each is read and how often: the picks first, then the premium ones that come on top. */
function PlanApps({
	plan,
	open,
	onOpenChange,
}: {
	plan: PlanDefinition;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const breakdown = planPlatformBreakdown(plan);
	const groups = breakdown.premium ? [...breakdown.pickGroups, breakdown.premium] : breakdown.pickGroups;
	return (
		<details className="group" open={open} onToggle={(event) => onOpenChange(event.currentTarget.open)}>
			<summary
				className={`flex cursor-pointer list-none select-none items-center justify-between gap-4 rounded-[4px] text-[1rem] leading-snug font-medium [&::-webkit-details-marker]:hidden ${TEXT} ${FOCUS}`}
			>
				Choose any {plan.platformPicks} AI tools
				<Plus
					aria-hidden="true"
					strokeWidth={1.5}
					className={`size-[18px] shrink-0 transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none ${EASE} ${TEXT_3}`}
				/>
			</summary>
			{groups.map((group) => (
				<div key={group.id} className={group.id === "premium" ? "mt-6 border-t border-(--v3-line) pt-6" : "mt-4"}>
					<p className={`${SMALL} flex items-baseline justify-between gap-4`}>
						<span className={`font-medium ${TEXT}`}>{GROUP_NAMES[group.id]}</span>
						<span className={`shrink-0 ${TEXT_2}`}>{group.runsPerDay}× a day</span>
					</p>
					<ul className="mt-3 space-y-2">
						{group.models.map((member) => (
							<li key={member.model} className={`${SMALL} flex items-center gap-2 ${TEXT_2}`}>
								<AppLogo id={appIconId(member.model)} className="size-4" />
								{member.label}
							</li>
						))}
					</ul>
					{group.id === "premium" && plan.premiumAddonAvailable ? (
						<p className={`${SMALL} mt-3 ${TEXT_2}`}>
							${PREMIUM_ADDON_MONTHLY_USD} a month for each extra premium prompt
						</p>
					) : null}
				</div>
			))}
		</details>
	);
}

/*
 * A plan on a card: a name, a price, its lines and a button. The one to pick
 * stands a head taller under a rust band that says so, and carries the page's
 * primary button.
 */
function PlanTable() {
	const [billing, setBilling] = useState<Billing>("monthly");
	const [appsOpen, setAppsOpen] = useState<PlanKey[]>([]);
	/* Side by side, the cards open together, so no card stands tall beside two empty ones. Stacked, each opens alone. */
	const toggleApps = (key: PlanKey, open: boolean) => {
		if (open === appsOpen.includes(key)) return;
		if (window.matchMedia("(min-width: 48rem)").matches) setAppsOpen(open ? [...PLAN_KEYS] : []);
		else setAppsOpen(open ? [...appsOpen, key] : appsOpen.filter((other) => other !== key));
	};

	return (
		<div>
			<BillingSwitch billing={billing} onChange={setBilling} />

			<div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3 lg:gap-6">
				{PLAN_KEYS.map((key) => {
					const plan = PLANS[key];
					const recommended = key === RECOMMENDED;
					const yearlyPerMonth = Math.round(plan.annualPriceUsd / 12);
					const perMonth = billing === "monthly" ? plan.monthlyPriceUsd : yearlyPerMonth;
					return (
						<article
							key={key}
							className={`${CARD_SURFACE} flex min-w-0 flex-col ${recommended ? "overflow-hidden ring-2 ring-(--v3-rust)" : "ring-(--v3-line) md:mt-10"}`}
						>
							{recommended ? (
								<p className="flex h-10 items-center justify-center bg-(--v3-rust) px-4 text-center text-[0.9375rem] leading-tight font-medium text-(--v3-card)">
									{RECOMMENDED_LABEL}
								</p>
							) : null}
							<div className="flex flex-1 flex-col p-6">
								<h3 className={`${TITLE} ${TEXT}`}>{plan.name}</h3>
								<p className="mt-5 flex flex-wrap items-baseline gap-x-2">
									<span className={`${FIGURE} text-[clamp(2.25rem,1.2vw+1.625rem,2.75rem)] leading-none ${TEXT}`}>
										{usd(perMonth)}
									</span>
									<span className={`${BODY} ${TEXT_2}`}>a month</span>
								</p>
								<p className={`${SMALL} mt-3 ${TEXT_2}`}>
									{billing === "annual"
										? `Billed ${usd(plan.annualPriceUsd)} a year, saves ${usd(plan.monthlyPriceUsd * 12 - plan.annualPriceUsd)}`
										: `Or ${usd(yearlyPerMonth)} a month, billed yearly`}
								</p>
								<ul className="mt-6 space-y-3 border-t border-(--v3-line) pt-6">
									{LINES.map((line) => {
										const { lead, figure, text, shared } = line(plan);
										return (
											<PlanLine key={text} none={!figure && !shared}>
												{lead ? `${lead} ` : null}
												{figure ? <strong className={`font-medium tabular-nums ${TEXT}`}>{figure}</strong> : null}
												{figure ? " " : null}
												{text}
											</PlanLine>
										);
									})}
								</ul>
								<div className="mt-6 flex-1 border-t border-(--v3-line) pt-6">
									<PlanApps plan={plan} open={appsOpen.includes(key)} onOpenChange={(open) => toggleApps(key, open)} />
								</div>
								<div className="mt-8">
									<a
										href={cloudAppUrl(`marketing-plan-${key}`)}
										onClick={() => trackEvent("plan_click", { plan: key, from: "home" })}
										className={`w-full ${recommended ? ACTION : ACTION_QUIET}`}
									>
										Get {plan.name}
									</a>
								</div>
							</div>
						</article>
					);
				})}
			</div>
			<p className={`${SMALL} mt-8 ${TEXT_2}`}>
				Prices in US dollars. Need more?{" "}
				<a href="mailto:team@citerank.com?subject=Custom%20plan" className={`${LINK} ${TEXT}`}>
					Email us
				</a>
				, or{" "}
				<Link to="/pricing" className={`${LINK} ${TEXT}`}>
					compare every plan
				</Link>
				.
			</p>
		</div>
	);
}

export function Pricing() {
	return (
		<section id="pricing" className={SECTION}>
			<Page>
				<SectionHead title="Simple pricing">
					<p className={`${LEAD} ${TEXT_2}`}>Start in minutes. Cancel any time.</p>
				</SectionHead>

				<div className={HEAD_GAP}>
					<PlanTable />
				</div>
			</Page>
		</section>
	);
}
