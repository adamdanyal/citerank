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
import { Plus } from "lucide-react";
import { type ReactNode, useState } from "react";
import { trackEvent } from "@/lib/posthog";
import { GROUP_NAMES } from "../pricing/compare";
import { AppLogo, appIconId } from "./app-logo";
import {
	ACTION,
	ACTION_QUIET,
	BODY,
	FOCUS,
	LEAD,
	LINK,
	PANEL_PAD_WIDE,
	Page,
	PanelHead,
	SMALL,
	SUBHEAD,
	Tick,
} from "./kit";

const DEFAULT_RECOMMENDED: PlanKey = "pro";

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

function BillingSwitch({ billing, onChange }: { billing: Billing; onChange: (billing: Billing) => void }) {
	return (
		<fieldset className="inline-flex w-fit max-w-full rounded-full bg-paper-2 p-1">
			<legend className="sr-only">Billing period</legend>
			{BILLING.map((option) => (
				<button
					key={option.value}
					type="button"
					aria-pressed={billing === option.value}
					onClick={() => onChange(option.value)}
					className={`h-11 rounded-full px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200 sm:px-5 ${FOCUS} ${
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
 * A plan on a card: a name, a price, its lines and a button. The one to pick
 * stands a head taller under a band that says so. Nothing has to be read
 * across, so a visitor can choose from one card alone.
 */
export function PlanCard({
	name,
	price,
	note,
	band,
	action,
	apps,
	children,
}: {
	name: string;
	price: string;
	note: ReactNode;
	/** Set on the plan to pick: the words on the band over it. */
	band?: string;
	action: ReactNode;
	/** The AI apps the plan covers, under its lines. */
	apps?: ReactNode;
	children: ReactNode;
}) {
	return (
		<article
			className={`flex min-w-0 flex-col rounded-card bg-white shadow-lift ${
				band ? "overflow-hidden ring-2 ring-rust" : "ring-1 ring-zinc-200 md:mt-10"
			}`}
		>
			{band ? (
				<p className="flex h-10 items-center justify-center bg-rust px-4 text-center text-[0.9375rem] leading-tight font-medium text-paper">
					{band}
				</p>
			) : null}
			<div className="flex flex-1 flex-col p-6 lg:p-8">
				<h3 className={`${SUBHEAD} text-ink`}>{name}</h3>
				<p className="mt-5 flex flex-wrap items-baseline gap-x-2">
					<span className="font-heading text-[clamp(2.75rem,2vw+2rem,3.75rem)] leading-none font-bold tracking-[-0.03em] text-ink">
						{price}
					</span>
					<span className={`${BODY} text-zinc-600`}>a month</span>
				</p>
				<p className={`${SMALL} mt-3 text-zinc-600`}>{note}</p>
				<ul className={`mt-6 space-y-4 border-t border-zinc-200 pt-6 ${apps ? "" : "flex-1"}`}>{children}</ul>
				{apps ? <div className="mt-6 flex-1 border-t border-zinc-200 pt-6">{apps}</div> : null}
				<div className="mt-8">{action}</div>
			</div>
		</article>
	);
}

/** One line of a plan. A plan with none of something says so with a dash, and the lists stay level. */
export function PlanLine({ children, none = false }: { children: ReactNode; none?: boolean }) {
	return (
		<li className={`flex items-start gap-3 text-[1.0625rem] leading-snug ${none ? "text-zinc-500" : "text-zinc-700"}`}>
			{none ? (
				<span
					aria-hidden="true"
					className="mt-px grid size-6 shrink-0 place-items-center rounded-full bg-paper-2 before:h-0.5 before:w-2.5 before:rounded-full before:bg-zinc-400"
				/>
			) : (
				<Tick tone="quiet" className="mt-px size-6" />
			)}
			<span>{children}</span>
		</li>
	);
}

export const PLAN_GRID = "grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3 lg:gap-8";

/* The AI apps a plan covers, grouped by how each is read and how often: the picks first, then the premium ones that come on top. */
function PlanApps({
	plan,
	folded,
	open = false,
	onOpenChange,
}: {
	plan: PlanDefinition;
	folded: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const breakdown = planPlatformBreakdown(plan);
	const groups = breakdown.premium ? [...breakdown.pickGroups, breakdown.premium] : breakdown.pickGroups;
	const title = `Choose any ${plan.platformPicks} AI tools`;
	const list = groups.map((group) => (
		<div key={group.id} className={group.id === "premium" ? "mt-6 border-t border-zinc-200 pt-6" : "mt-4"}>
			<p className={`${SMALL} flex items-baseline justify-between gap-4`}>
				<span className="font-medium text-ink">{GROUP_NAMES[group.id]}</span>
				<span className="shrink-0 text-zinc-600">{group.runsPerDay}× a day</span>
			</p>
			<ul className="mt-2.5 space-y-2">
				{group.models.map((member) => (
					<li key={member.model} className={`${SMALL} flex items-center gap-2.5 text-zinc-700`}>
						<AppLogo id={appIconId(member.model)} className="size-4" />
						{member.label}
					</li>
				))}
			</ul>
			{group.id === "premium" && plan.premiumAddonAvailable ? (
				<p className={`${SMALL} mt-3 text-zinc-600`}>
					${PREMIUM_ADDON_MONTHLY_USD} a month for each extra premium prompt
				</p>
			) : null}
		</div>
	));
	if (!folded) {
		return (
			<>
				<p className="text-[1rem] leading-snug font-medium text-ink">{title}</p>
				{list}
			</>
		);
	}
	return (
		<details className="group" open={open} onToggle={(event) => onOpenChange?.(event.currentTarget.open)}>
			<summary
				className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-[1rem] leading-snug font-medium text-ink [&::-webkit-details-marker]:hidden ${FOCUS}`}
			>
				{title}
				<Plus
					aria-hidden="true"
					className="size-5 shrink-0 text-zinc-500 transition-transform duration-200 ease-out group-open:rotate-45 motion-reduce:transition-none"
				/>
			</summary>
			{list}
		</details>
	);
}

export function PlanTable({
	from = "home",
	recommended,
	foldApps = false,
	children,
}: {
	from?: string;
	/** Each card's AI apps start closed under their one line. */
	foldApps?: boolean;
	recommended?: { plan: PlanKey; label: string };
	/** More to say in the note under the cards, after the currency. */
	children?: ReactNode;
}) {
	const [billing, setBilling] = useState<Billing>("monthly");
	const [appsOpen, setAppsOpen] = useState<PlanKey[]>([]);
	/* Side by side, the cards open together, so no card stands tall beside two empty ones. Stacked, each opens alone. */
	const toggleApps = (key: PlanKey, open: boolean) => {
		if (open === appsOpen.includes(key)) return;
		if (window.matchMedia("(min-width: 48rem)").matches) setAppsOpen(open ? [...PLAN_KEYS] : []);
		else setAppsOpen(open ? [...appsOpen, key] : appsOpen.filter((other) => other !== key));
	};
	const recommendedKey = recommended?.plan ?? DEFAULT_RECOMMENDED;
	const recommendedLabel = recommended?.label ?? "Most chosen";

	return (
		<div>
			<BillingSwitch billing={billing} onChange={setBilling} />

			<div className={`mt-8 ${PLAN_GRID}`}>
				{PLAN_KEYS.map((key) => {
					const plan = PLANS[key];
					const isRecommended = key === recommendedKey;
					const yearlyPerMonth = Math.round(plan.annualPriceUsd / 12);
					const perMonth = billing === "monthly" ? plan.monthlyPriceUsd : yearlyPerMonth;
					return (
						<PlanCard
							key={key}
							name={plan.name}
							price={usd(perMonth)}
							apps={
								<PlanApps
									plan={plan}
									folded={foldApps}
									open={appsOpen.includes(key)}
									onOpenChange={(open) => toggleApps(key, open)}
								/>
							}
							note={
								billing === "annual"
									? `Billed ${usd(plan.annualPriceUsd)} a year, saves ${usd(plan.monthlyPriceUsd * 12 - plan.annualPriceUsd)}`
									: `Or ${usd(yearlyPerMonth)} a month, billed yearly`
							}
							band={isRecommended ? recommendedLabel : undefined}
							action={
								<a
									href={cloudAppUrl(`marketing-plan-${key}`)}
									onClick={() => trackEvent("plan_click", { plan: key, from })}
									className={`w-full ${isRecommended ? ACTION : ACTION_QUIET}`}
								>
									Get {plan.name}
								</a>
							}
						>
							{LINES.map((line) => {
								const { lead, figure, text, shared } = line(plan);
								return (
									<PlanLine key={text} none={!figure && !shared}>
										{lead ? `${lead} ` : null}
										{figure ? <strong className="font-medium text-ink tabular-nums">{figure}</strong> : null}
										{figure ? " " : null}
										{text}
									</PlanLine>
								);
							})}
						</PlanCard>
					);
				})}
			</div>
			<p className={`${SMALL} mt-8 text-zinc-600`}>Prices in US dollars.{children ? <> {children}</> : null}</p>
		</div>
	);
}

export function Pricing({
	lede = "Start in minutes. Cancel any time.",
	recommended,
	foldApps = false,
}: {
	lede?: ReactNode;
	recommended?: { plan: PlanKey; label: string };
	foldApps?: boolean;
} = {}) {
	return (
		<section id="pricing" className={`relative bg-white ${PANEL_PAD_WIDE}`}>
			<Page>
				<PanelHead title="Simple pricing">
					<p className={`${LEAD} text-zinc-600`}>{lede}</p>
				</PanelHead>

				<div className="mt-8 lg:mt-10">
					<PlanTable recommended={recommended} foldApps={foldApps}>
						Need more?{" "}
						<a href="mailto:team@citerank.com?subject=Custom%20plan" className={`${LINK} text-ink`}>
							Email us
						</a>
						, or{" "}
						<Link to="/pricing" className={`${LINK} text-ink`}>
							compare every plan
						</Link>
						.
					</PlanTable>
				</div>
			</Page>
		</section>
	);
}
