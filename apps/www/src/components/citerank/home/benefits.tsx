import { BadgeCheck, ListOrdered, type LucideIcon, MessageSquareText, Plug, Users } from "lucide-react";
import { Container, Eyebrow, Reveal, RevealItem } from "../ui";

interface Benefit {
	icon: LucideIcon;
	title: string;
	body: string;
	wide?: boolean;
}

const BENEFITS: Benefit[] = [
	{
		icon: MessageSquareText,
		title: "See the Actual Answers",
		body: "CiteRank.com asks 12 AI apps the questions your buyers ask, up to 4× a day, and keeps every answer. You see trends, not one screenshot.",
		wide: true,
	},
	{
		icon: ListOrdered,
		title: "Know What to Fix First",
		body: "Opportunities ranked by impact: the pages to write, the pages to update and the sources to get cited by.",
	},
	{
		icon: Users,
		title: "Your Whole Team Included",
		body: "Unlimited seats on every plan, so sales, content and leadership look at the same numbers.",
	},
	{
		icon: Plug,
		title: "Fits Your Stack",
		body: "API and MCP access on every plan, so your agents and reports pull the same data as the dashboard.",
	},
	{
		icon: BadgeCheck,
		title: "Cancel Any Time",
		body: "Pay monthly with no contract and no sales call. Or have our agency do the work for you.",
	},
];

function BenefitCard({ benefit, delay }: { benefit: Benefit; delay: number }) {
	const Icon = benefit.icon;
	return (
		<RevealItem delay={delay} className={`rounded-2xl bg-paper-2 p-6 ${benefit.wide ? "sm:col-span-2" : ""}`}>
			<span className="inline-flex size-10 items-center justify-center rounded-lg bg-white text-blue-700">
				<Icon className="size-5" aria-hidden="true" />
			</span>
			<h3 className="title-1 mt-6 text-zinc-950">{benefit.title}</h3>
			<p className="body-6 mt-2 max-w-[48ch] text-zinc-600">{benefit.body}</p>
		</RevealItem>
	);
}

export function Benefits() {
	return (
		<section className="bg-white">
			<Container className="grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
				<Reveal className="lg:col-span-5">
					<Eyebrow>The Problem</Eyebrow>
					<h2 className="heading-2 mt-4 text-zinc-950">Buyers Ask AI Who to Choose. You Can't See the Answer.</h2>
					<p className="body-7 mt-6 text-zinc-600">
						There is no results page for ChatGPT, Perplexity or Gemini. Each answer names a few brands and cites a few
						sources, and if you are not in it, nothing tells you. Checking by hand shows you one answer on one day.
					</p>
				</Reveal>
				<div className="lg:col-span-7">
					<Eyebrow>What You Get</Eyebrow>
					<ul className="mt-4 grid gap-4 sm:grid-cols-2">
						{BENEFITS.map((benefit, index) => (
							<BenefitCard key={benefit.title} benefit={benefit} delay={index * 80} />
						))}
					</ul>
				</div>
			</Container>
		</section>
	);
}
