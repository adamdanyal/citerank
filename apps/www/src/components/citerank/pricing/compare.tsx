import {
	PLAN_KEYS,
	PLANS,
	type PlanPlatformGroup,
	type PlanPlatformGroupId,
	PREMIUM_ADDON_MONTHLY_USD,
	planPlatformBreakdown,
} from "@workspace/config/plans";
import { EngineIcon } from "@/components/home/engines";
import { BODY, CARD, HEADING, LEAD, SMALL, SUBHEAD } from "../v2/kit";

const GROUP_NAMES: Record<PlanPlatformGroupId, string> = {
	scraped: "Checked as a user sees them",
	api: "Checked through the API",
	premium: "Premium: web search, with citations",
};

function GroupHead({ group, className = "" }: { group: PlanPlatformGroup; className?: string }) {
	return (
		<>
			<h3 className={`${SUBHEAD} text-ink ${className}`}>{GROUP_NAMES[group.id]}</h3>
			<p className={`${SMALL} mt-2 text-zinc-600`}>{group.runsPerDay}× a day</p>
		</>
	);
}

function Models({ group }: { group: PlanPlatformGroup }) {
	return (
		<ul className="space-y-2.5">
			{group.models.map((member) => (
				<li key={member.model} className={`${BODY} flex items-center gap-2.5 font-medium text-ink`}>
					<EngineIcon iconId={member.iconId} className="size-4 shrink-0" />
					{member.label}
				</li>
			))}
		</ul>
	);
}

/*
 * The menu of AI apps is the same on every plan, so it is shown once; only the
 * premium prompts differ by plan. The section's head is the rule itself, set
 * large, because the two wells under it are what the rule is about.
 */
export function Compare() {
	const shared = planPlatformBreakdown(PLANS.business);
	const premiumByPlan = PLAN_KEYS.map((key) => ({
		plan: PLANS[key],
		premium: planPlatformBreakdown(PLANS[key]).premium,
	}));
	const premiumModels = premiumByPlan.find((entry) => entry.premium)?.premium;

	return (
		<div>
			<p className={`${HEADING} max-w-[22ch] text-ink`}>{shared.pickHeading} per brand</p>
			<p className={`${LEAD} mt-5 text-zinc-600`}>Same menu on every plan.</p>
			<div className="mt-10 grid gap-4 lg:mt-16 lg:grid-cols-12 lg:gap-8">
				<div className={`${CARD} grid gap-10 sm:grid-cols-2 sm:gap-8 lg:col-span-6 lg:p-10`}>
					{shared.pickGroups.map((group) => (
						<div key={group.id} className="min-w-0">
							<GroupHead group={group} className="max-w-[16ch]" />
							<div className="mt-5">
								<Models group={group} />
							</div>
						</div>
					))}
				</div>
				{premiumModels ? (
					<div className={`${CARD} lg:col-span-6 lg:p-10`}>
						<GroupHead group={premiumModels} />
						<div className="mt-5 grid gap-8 sm:grid-cols-2">
							<Models group={premiumModels} />
							<div className="min-w-0">
								<dl className="border-b border-zinc-300">
									{premiumByPlan.map(({ plan, premium }) => (
										<div
											key={plan.key}
											className="flex items-baseline justify-between gap-4 border-t border-zinc-300 py-3"
										>
											<dt className={`${BODY} font-medium text-ink`}>{plan.name}</dt>
											<dd className={`${BODY} text-right text-zinc-600`}>
												{premium ? `${premium.includedSlots} prompts included` : "Not included"}
											</dd>
										</div>
									))}
								</dl>
								<p className={`${SMALL} mt-4 text-zinc-600`}>
									${PREMIUM_ADDON_MONTHLY_USD} a month for each extra premium prompt.
								</p>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
}
