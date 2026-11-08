import { PLANS } from "@workspace/config/plans";
import { BadgeCheck, ListOrdered, type LucideIcon, MessageSquareText, RefreshCw, Users } from "lucide-react";
import { EngineIcon } from "@/components/home/engines";
import { Container, Reveal, RevealItem } from "../ui";

const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));

const INCLUDED: { icon: LucideIcon; title: string; body: string }[] = [
	{ icon: MessageSquareText, title: "Every Answer, Kept", body: "With the brands it named and the sources it cited." },
	{ icon: RefreshCw, title: `${RUNS_PER_DAY} Checks a Day`, body: "Enough to show the trend, not a snapshot." },
	{ icon: ListOrdered, title: "Fixes, Ranked", body: "Which page to write, update or get listed on." },
	{ icon: Users, title: "Unlimited Seats", body: "API and MCP included." },
	{ icon: BadgeCheck, title: "Cancel Any Time", body: "No contract, no sales call." },
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

/* Two quiet sections: one row of what every plan includes, then the 12 answer engines as plain pills. */
export function Why() {
	return (
		<>
			<section className="bg-paper">
				<Container className="py-16 lg:py-20">
					<Reveal className="mx-auto max-w-3xl text-center">
						<h2 className="heading-2 text-zinc-950">What Every Plan Includes</h2>
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
			<section className="bg-white">
				<Container className="py-16 lg:py-20">
					<Reveal className="mx-auto max-w-3xl text-center">
						<h2 className="heading-2 text-zinc-950">{ENGINES.length} Answer Engines Your Buyers Use</h2>
						<p className="body-8 mt-6 text-zinc-700">
							Pick any four per brand. Six are checked the way a real user sees them, six through each company's API.
						</p>
					</Reveal>
					<ul className="mt-10 flex flex-wrap justify-center gap-3" aria-label="AI engines CiteRank.com tracks">
						{ENGINES.map((engine, index) => (
							<RevealItem
								key={engine.name}
								delay={index * 40}
								className="inline-flex items-center gap-2 rounded-full bg-paper-2 py-2 pr-4 pl-3 title-4 text-zinc-900"
							>
								<EngineIcon iconId={engine.iconId} className="size-4" />
								{engine.name}
							</RevealItem>
						))}
					</ul>
				</Container>
			</section>
		</>
	);
}
