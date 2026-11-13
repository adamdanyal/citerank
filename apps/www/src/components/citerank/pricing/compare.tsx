import {
	PLAN_KEYS,
	PLANS,
	type PlanPlatformGroupId,
	type PlanPlatformMember,
	PREMIUM_ADDON_MONTHLY_USD,
	planPlatformBreakdown,
} from "@workspace/config/plans";
import { EngineIcon } from "@/components/home/engines";
import { BODY, CARD, MONO, SUBHEAD } from "../v2/kit";

const GROUP_NAMES: Record<PlanPlatformGroupId, string> = {
	scraped: "Checked as a user sees them",
	api: "Checked through the API",
	premium: "Premium: web search, with citations",
};

function Models({ models }: { models: PlanPlatformMember[] }) {
	return (
		<ul className="mt-3 space-y-2">
			{models.map((member) => (
				<li key={member.model} className={`${BODY} flex items-center gap-2 text-ink`}>
					<EngineIcon iconId={member.iconId} className="size-4 shrink-0" />
					{member.label}
				</li>
			))}
		</ul>
	);
}

/* The menu of AI apps is the same on every plan, so it is shown once; only the premium prompts differ by plan. */
export function Compare() {
	const shared = planPlatformBreakdown(PLANS.business);
	const premiumByPlan = PLAN_KEYS.map((key) => ({
		plan: PLANS[key],
		premium: planPlatformBreakdown(PLANS[key]).premium,
	}));
	const premiumModels = premiumByPlan.find((entry) => entry.premium)?.premium;

	return (
		<div>
			<p className={`${BODY} text-zinc-600`}>{shared.pickHeading} per brand. Same menu on every plan.</p>
			<div className="mt-10 grid gap-5 lg:grid-cols-12">
				<div className={`${CARD} grid gap-8 sm:grid-cols-2 lg:col-span-7`}>
					{shared.pickGroups.map((group) => (
						<div key={group.id}>
							<p className={`${SUBHEAD} text-ink`}>{GROUP_NAMES[group.id]}</p>
							<p className={`${MONO} mt-1`}>{group.runsPerDay}× a day</p>
							<Models models={group.models} />
						</div>
					))}
				</div>
				{premiumModels ? (
					<div className={`${CARD} lg:col-span-5`}>
						<p className={`${SUBHEAD} text-ink`}>{GROUP_NAMES.premium}</p>
						<p className={`${MONO} mt-1`}>{premiumModels.runsPerDay}× a day</p>
						<Models models={premiumModels.models} />
						<ul className="mt-6 divide-y divide-zinc-200/80 border-zinc-200/80 border-t">
							{premiumByPlan.map(({ plan, premium }) => (
								<li key={plan.key} className={`${BODY} flex items-center justify-between gap-4 py-3`}>
									<span className="text-ink">{plan.name}</span>
									<span className="text-zinc-600">
										{premium ? `${premium.includedSlots} premium prompts included` : "Not included"}
									</span>
								</li>
							))}
						</ul>
						<p className={`${MONO} mt-4`}>${PREMIUM_ADDON_MONTHLY_USD} a month for each extra premium prompt.</p>
					</div>
				) : null}
			</div>
		</div>
	);
}
