import { PLANS } from "@workspace/config/plans";
import { Container, Reveal } from "../ui";

const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));

const REASONS = [
	{
		title: "Every answer, kept word for word",
		body: "Each AI answer is stored with the brands it named and the sources it cited, so you can read exactly what a buyer was told.",
	},
	{
		title: `Up to ${RUNS_PER_DAY} checks a day`,
		body: "Answers change often. Checking several times a day shows the trend, not one lucky screenshot.",
	},
	{
		title: "12 AI apps, including Google AI Overviews and AI Mode",
		body: "ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok and more, scraped as real users see them or called through their APIs.",
	},
	{
		title: "Fixes ranked by impact",
		body: "Opportunities tells you which page to write, which to update and which sources to earn, in order.",
	},
	{
		title: "Unlimited seats and API access on every plan",
		body: "Sales, content and leadership see the same numbers, and your agents and reports can pull them over the API or MCP.",
	},
	{
		title: "Monthly, cancel any time",
		body: "No contract and no sales call. Pick a plan, pay monthly, stop when you like.",
	},
];

export function Why() {
	return (
		<section className="bg-paper">
			<Container className="py-20 lg:py-24">
				<Reveal className="max-w-3xl">
					<h2 className="heading-2 text-zinc-950">Why CiteRank.com</h2>
					<p className="body-8 mt-6 text-zinc-700">What you get on every plan, in plain terms.</p>
				</Reveal>
				<ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:mt-16">
					{REASONS.map((reason) => (
						<li key={reason.title}>
							<h3 className="title-1 text-zinc-950">{reason.title}</h3>
							<p className="body-7 mt-2 max-w-[52ch] text-zinc-600">{reason.body}</p>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
