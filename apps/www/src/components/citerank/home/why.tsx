import { PLANS } from "@workspace/config/plans";
import { BadgeCheck, ListOrdered, type LucideIcon, MessageSquareText, RefreshCw, Users } from "lucide-react";
import { Container, Reveal, RevealItem } from "../ui";

const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));

const INCLUDED: { icon: LucideIcon; title: string; body: string }[] = [
	{ icon: MessageSquareText, title: "Every answer, kept", body: "With the brands it named and the sources it cited." },
	{ icon: RefreshCw, title: `${RUNS_PER_DAY} checks a day`, body: "Enough to show the trend, not a snapshot." },
	{ icon: ListOrdered, title: "Fixes, ranked", body: "Which page to write, update or get listed on." },
	{ icon: Users, title: "Unlimited seats", body: "API and MCP included." },
	{ icon: BadgeCheck, title: "Cancel any time", body: "No contract, no sales call." },
];

/* One quiet row of what every plan includes. */
export function Why() {
	return (
		<section className="bg-paper">
			<Container className="py-16 lg:py-20">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">What every plan includes</h2>
				</Reveal>
				<ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5 lg:gap-6">
					{INCLUDED.map((item, index) => {
						const Icon = item.icon;
						return (
							<RevealItem key={item.title} delay={index * 60} className="flex flex-col items-center text-center">
								<Icon className="size-5 text-blue-700" aria-hidden="true" />
								<h3 className="title-3 mt-3 text-zinc-950">{item.title}</h3>
								<p className="caption-2 mt-1 text-zinc-600">{item.body}</p>
							</RevealItem>
						);
					})}
				</ul>
			</Container>
		</section>
	);
}
