import { Container, Reveal, RevealItem } from "../ui";

const STEPS = [
	{
		title: "Add Your Brand",
		body: "Point CiteRank.com at your site. It suggests the prompts your buyers ask and the competitors to track against.",
	},
	{
		title: "See Where You Stand",
		body: "Visibility, share of voice, and the sources AI cites, sampled up to 4× daily from the real apps.",
	},
	{
		title: "Know What to Fix",
		body: "Opportunities ranked by impact. CiteRank.com keeps you updated, so you always know what to do next.",
	},
];

export function HowItWorks() {
	return (
		<section className="bg-paper-2">
			<Container className="py-20 lg:py-24">
				<Reveal className="max-w-[42.5rem]">
					<h2 className="heading-2 text-zinc-950">From Zero to a Plan in One Afternoon</h2>
					<p className="body-7 mt-6 text-zinc-600">
						No sales call, no bloat. CiteRank.com sets up your tracking and tells you what to change.
					</p>
				</Reveal>
				<ol className="mt-12 grid gap-10 md:grid-cols-3 lg:mt-16">
					{STEPS.map((step, index) => (
						<RevealItem key={step.title} delay={index * 80}>
							<p className="caption-1 font-mono text-blue-700 tabular-nums">0{index + 1}</p>
							<h3 className="title-1 mt-4 text-zinc-950">{step.title}</h3>
							<p className="body-6 mt-2 max-w-[40ch] text-zinc-600">{step.body}</p>
						</RevealItem>
					))}
				</ol>
			</Container>
		</section>
	);
}
