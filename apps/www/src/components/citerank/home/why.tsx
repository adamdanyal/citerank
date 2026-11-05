import { PLANS } from "@workspace/config/plans";
import {
	BadgeCheck,
	LayoutGrid,
	ListOrdered,
	type LucideIcon,
	MessageSquareText,
	RefreshCw,
	Users,
} from "lucide-react";
import { CARD, Container, ICON_BOX, Reveal, RevealItem } from "../ui";

const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));

const REASONS: { icon: LucideIcon; title: string; body: string }[] = [
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
		icon: LayoutGrid,
		title: "12 AI Apps",
		body: "ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok and more.",
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

export function Why() {
	return (
		<section className="bg-paper">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">Why CiteRank.com</h2>
					<p className="body-8 mt-6 text-zinc-700">What every plan includes.</p>
				</Reveal>
				<ul className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
					{REASONS.map((reason, index) => {
						const Icon = reason.icon;
						return (
							<RevealItem key={reason.title} delay={index * 60} className={`${CARD} p-6`}>
								<span className={ICON_BOX}>
									<Icon className="size-5" aria-hidden="true" />
								</span>
								<h3 className="title-1 mt-6 text-zinc-950">{reason.title}</h3>
								<p className="body-6 mt-2 text-zinc-600">{reason.body}</p>
							</RevealItem>
						);
					})}
				</ul>
			</Container>
		</section>
	);
}
