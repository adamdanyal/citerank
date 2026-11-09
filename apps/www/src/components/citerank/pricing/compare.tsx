import {
	PLAN_KEYS,
	PLANS,
	type PlanPlatformGroupId,
	type PlanPlatformMember,
	PREMIUM_ADDON_MONTHLY_USD,
	planPlatformBreakdown,
} from "@workspace/config/plans";
import { EngineIcon } from "@/components/home/engines";
import { CARD, Container, Reveal } from "../ui";

const GROUP_NAMES: Record<PlanPlatformGroupId, string> = {
	scraped: "Checked as a user sees them",
	api: "Checked through the API",
	premium: "Premium: web search, with citations",
};

function Models({ models }: { models: PlanPlatformMember[] }) {
	return (
		<ul className="mt-3 space-y-2">
			{models.map((member) => (
				<li key={member.model} className="flex items-center gap-2 body-6 text-zinc-800">
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
		<section className="bg-paper">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">What every plan checks</h2>
					<p className="body-8 mt-6 text-zinc-700">{shared.pickHeading} per brand. Same menu on every plan.</p>
				</Reveal>
				<div className="mt-12 grid gap-5 lg:grid-cols-12">
					<Reveal className={`${CARD} grid gap-8 p-6 sm:grid-cols-2 lg:col-span-7 lg:p-8`}>
						{shared.pickGroups.map((group) => (
							<div key={group.id}>
								<p className="title-3 text-zinc-950">{GROUP_NAMES[group.id]}</p>
								<p className="caption-2 mt-1 text-zinc-500">{group.runsPerDay}× a day</p>
								<Models models={group.models} />
							</div>
						))}
					</Reveal>
					{premiumModels ? (
						<Reveal delay={60} className={`${CARD} p-6 lg:col-span-5 lg:p-8`}>
							<p className="title-3 text-zinc-950">{GROUP_NAMES.premium}</p>
							<p className="caption-2 mt-1 text-zinc-500">{premiumModels.runsPerDay}× a day</p>
							<Models models={premiumModels.models} />
							<ul className="mt-6 divide-y divide-zinc-200/80 border-zinc-200/80 border-t">
								{premiumByPlan.map(({ plan, premium }) => (
									<li key={plan.key} className="flex items-center justify-between gap-4 py-3 body-6">
										<span className="text-zinc-950">{plan.name}</span>
										<span className="text-zinc-600">
											{premium ? `${premium.includedSlots} premium prompts included` : "Not included"}
										</span>
									</li>
								))}
							</ul>
							<p className="caption-2 mt-4 text-zinc-500">
								${PREMIUM_ADDON_MONTHLY_USD} a month for each extra premium prompt.
							</p>
						</Reveal>
					) : null}
				</div>
			</Container>
		</section>
	);
}
