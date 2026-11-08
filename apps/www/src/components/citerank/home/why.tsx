import { PLANS } from "@workspace/config/plans";
import { BadgeCheck, ListOrdered, type LucideIcon, MessageSquareText, RefreshCw, Users } from "lucide-react";
import { EngineIcon } from "@/components/home/engines";
import { CARD, Container, ICON_BOX, Reveal, RevealItem } from "../ui";

const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));

const INCLUDED: { icon: LucideIcon; title: string; body: string }[] = [
	{
		icon: MessageSquareText,
		title: "Every Answer, Kept",
		body: "Each answer is stored with the brands it named and the sources it cited.",
	},
	{
		icon: RefreshCw,
		title: `${RUNS_PER_DAY} Checks a Day`,
		body: "Answers change often. Several checks a day show the trend.",
	},
	{
		icon: ListOrdered,
		title: "Fixes, Ranked",
		body: "Which page to write, which to update, which sites to get listed on.",
	},
	{
		icon: Users,
		title: "Unlimited Seats",
		body: "Your whole team sees the same numbers. API and MCP included.",
	},
	{
		icon: BadgeCheck,
		title: "Cancel Any Time",
		body: "No contract, no sales call. Pay monthly, stop when you like.",
	},
];

const ENGINES = [
	{ name: "ChatGPT", iconId: "openai" },
	{ name: "Claude", iconId: "anthropic" },
	{ name: "Gemini", iconId: "gemini" },
	{ name: "Perplexity", iconId: "perplexity" },
	{ name: "AI Overviews", iconId: "google" },
	{ name: "AI Mode", iconId: "google" },
	{ name: "Copilot", iconId: "microsoft" },
	{ name: "Grok", iconId: "x" },
	{ name: "DeepSeek", iconId: "deepseek" },
	{ name: "Mistral", iconId: "mistral" },
	{ name: "Qwen", iconId: "qwen" },
	{ name: "Kimi", iconId: "moonshotai" },
];

/* What is in every plan, beside the 12 answer engines it can track. */
export function Why() {
	return (
		<section className="bg-paper">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">What Every Plan Includes</h2>
				</Reveal>
				<div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
					<ul className="space-y-8 lg:col-span-5">
						{INCLUDED.map((item, index) => {
							const Icon = item.icon;
							return (
								<RevealItem key={item.title} delay={index * 60} className="flex gap-4">
									<span className={ICON_BOX}>
										<Icon className="size-5" aria-hidden="true" />
									</span>
									<div>
										<h3 className="title-2 text-zinc-950">{item.title}</h3>
										<p className="body-6 mt-1 text-zinc-600">{item.body}</p>
									</div>
								</RevealItem>
							);
						})}
					</ul>
					<div className="lg:col-span-7">
						<Reveal>
							<h3 className="title-2 text-zinc-950">{ENGINES.length} Answer Engines Your Buyers Use</h3>
							<p className="body-6 mt-2 text-zinc-600">
								Six are checked the way a real user sees them, and six directly through each company's API. Pick any
								four per brand.
							</p>
						</Reveal>
						<ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="AI engines CiteRank.com tracks">
							{ENGINES.map((engine, index) => (
								<RevealItem
									key={engine.name}
									delay={index * 40}
									className={`${CARD} flex items-center gap-3 py-3 pr-4 pl-3 title-4 text-zinc-900`}
								>
									<span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-paper-2">
										<EngineIcon iconId={engine.iconId} className="size-4" />
									</span>
									<span className="truncate">{engine.name}</span>
								</RevealItem>
							))}
						</ul>
					</div>
				</div>
			</Container>
		</section>
	);
}
