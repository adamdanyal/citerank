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
		<ul className="mt-2 space-y-1">
			{models.map((member) => (
				<li key={member.model} className="flex items-center gap-2 caption-2 text-zinc-700">
					<EngineIcon iconId={member.iconId} className="size-3.5 shrink-0" />
					{member.label}
				</li>
			))}
		</ul>
	);
}

export function Compare() {
	return (
		<section className="bg-paper">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">What Each Plan Checks</h2>
					<p className="body-8 mt-6 text-zinc-700">The AI apps each plan can track, and how often.</p>
				</Reveal>
				<div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
					{PLAN_KEYS.map((key, index) => {
						const plan = PLANS[key];
						const breakdown = planPlatformBreakdown(plan);
						return (
							<Reveal key={key} delay={index * 60} className={`${CARD} p-6`}>
								<p className="title-1 text-zinc-950">{plan.name}</p>
								<p className="caption-2 mt-1 text-zinc-500">{breakdown.pickHeading}</p>
								{breakdown.pickGroups.map((group) => (
									<div key={group.id} className="mt-5">
										<p className="caption-1 text-zinc-950">{GROUP_NAMES[group.id]}</p>
										<p className="caption-2 text-zinc-500">{group.runsPerDay}× a day</p>
										<Models models={group.models} />
									</div>
								))}
								{breakdown.premium ? (
									<div className="mt-5">
										<p className="caption-1 text-zinc-950">{GROUP_NAMES.premium}</p>
										<p className="caption-2 text-zinc-500">{breakdown.premium.runsPerDay}× a day</p>
										<Models models={breakdown.premium.models} />
										<p className="caption-2 mt-2 text-zinc-500">
											{breakdown.premium.includedSlots} premium prompts included, ${PREMIUM_ADDON_MONTHLY_USD} a month
											for each extra.
										</p>
									</div>
								) : null}
							</Reveal>
						);
					})}
				</div>
			</Container>
		</section>
	);
}
