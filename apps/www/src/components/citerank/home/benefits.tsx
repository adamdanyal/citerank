import { Container, Reveal } from "../ui";

const BENEFITS = [
	{
		title: "See the Actual Answers",
		body: "CiteRank.com asks 12 AI apps the questions your buyers ask, up to 4× a day, and keeps every answer. You see trends, not one screenshot.",
	},
	{
		title: "Know What to Fix First",
		body: "Opportunities ranked by impact: the pages to write, the pages to update and the sources to get cited by.",
	},
	{
		title: "Your Whole Team Included",
		body: "Unlimited seats on every plan, so sales, content and leadership look at the same numbers.",
	},
	{
		title: "Fits Your Stack",
		body: "API and MCP access on every plan, so your agents and reports pull the same data as the dashboard.",
	},
	{
		title: "Cancel Any Time",
		body: "Pay monthly with no contract and no sales call. Or have our agency do the work for you.",
	},
];

export function Benefits() {
	return (
		<section className="bg-white">
			<Container className="grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
				<Reveal className="lg:col-span-5">
					<h2 className="heading-2 text-zinc-950">Buyers Ask AI Who to Choose. You Can't See the Answer.</h2>
					<p className="body-7 mt-6 text-zinc-600">
						There is no results page for ChatGPT, Perplexity or Gemini. Each answer names a few brands and cites a few
						sources, and if you are not in it, nothing tells you. Checking by hand shows you one answer on one day.
					</p>
				</Reveal>
				<Reveal delay={100} className="lg:col-span-7 lg:pt-2">
					<ul className="grid gap-10 sm:grid-cols-2">
						{BENEFITS.map((benefit) => (
							<li key={benefit.title}>
								<h3 className="title-1 text-zinc-950">{benefit.title}</h3>
								<p className="body-6 mt-2 max-w-[44ch] text-zinc-600">{benefit.body}</p>
							</li>
						))}
					</ul>
				</Reveal>
			</Container>
		</section>
	);
}
