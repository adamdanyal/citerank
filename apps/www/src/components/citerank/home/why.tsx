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
		title: "Every answer, kept word for word",
		body: "Each AI answer is stored with the brands it named and the sources it cited, so you can read exactly what a buyer was told.",
	},
	{
		icon: RefreshCw,
		title: `Up to ${RUNS_PER_DAY} checks a day`,
		body: "Answers change often. Checking several times a day shows the trend, not one lucky screenshot.",
	},
	{
		icon: LayoutGrid,
		title: "12 AI apps, including Google AI Overviews and AI Mode",
		body: "ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok and more.",
	},
	{
		icon: ListOrdered,
		title: "Fixes ranked by impact",
		body: "Opportunities tells you which page to write, which to update and which sites to get listed on, in order.",
	},
	{
		icon: Users,
		title: "Unlimited seats and API access on every plan",
		body: "Your whole team sees the same numbers, and your own tools can pull them too.",
	},
	{
		icon: BadgeCheck,
		title: "Monthly, cancel any time",
		body: "No contract and no sales call. Pick a plan, pay monthly, stop when you like.",
	},
];

export function Why() {
	return (
		<section className="bg-paper">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">Why CiteRank.com</h2>
					<p className="body-8 mt-6 text-zinc-700">What you get on every plan, in plain terms.</p>
				</Reveal>
				<ul className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
					{REASONS.map((reason, index) => {
						const Icon = reason.icon;
						return (
							<RevealItem key={reason.title} delay={index * 60} className={`${CARD} p-6 lg:p-8`}>
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
