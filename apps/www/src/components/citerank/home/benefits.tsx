import { Container, Reveal, RevealItem } from "../ui";

interface Benefit {
	title: string;
	body: string;
	shot?: { src: string; alt: string };
	span: string;
}

const BENEFITS: Benefit[] = [
	{
		title: "See the Actual Answers",
		body: "CiteRank.com asks 12 AI apps the questions your buyers ask, up to 4× a day, and keeps every answer. You see trends, not one screenshot.",
		shot: {
			src: "/screenshots/responses.png",
			alt: "CiteRank.com responses page listing AI answers with each brand's rank and tone",
		},
		span: "md:col-span-2 lg:col-span-7",
	},
	{
		title: "Know What to Fix First",
		body: "Opportunities ranked by impact: the pages to write, the pages to update and the sources to get cited by.",
		shot: {
			src: "/screenshots/opportunities.png",
			alt: "CiteRank.com opportunities page with recommendations ranked by impact",
		},
		span: "lg:col-span-5",
	},
	{
		title: "Unlimited Seats",
		body: "Your whole team on every plan, so sales, content and leadership look at the same numbers.",
		span: "lg:col-span-4",
	},
	{
		title: "API and MCP",
		body: "On every plan, so your agents and reports pull the same data as the dashboard.",
		span: "lg:col-span-4",
	},
	{
		title: "Cancel Any Time",
		body: "Pay monthly with no contract and no sales call. Or have our agency do the work.",
		span: "lg:col-span-4",
	},
];

/* The capture includes the app sidebar (the left 17.5% of the image), which is shifted out of view. */
function Shot({ src, alt }: { src: string; alt: string }) {
	return (
		<div className="relative ml-6 mt-6 h-56 sm:h-64 lg:ml-8">
			<div className="absolute inset-0 overflow-hidden rounded-tl-xl bg-white shadow-[0_1px_2px_rgb(26_25_23/0.05),0_16px_40px_-20px_rgb(26_25_23/0.3)]">
				<img
					src={src}
					alt={alt}
					width={3000}
					height={1800}
					loading="lazy"
					decoding="async"
					className="absolute left-[-29.75%] top-[-1.5%] w-[170%] max-w-none"
				/>
			</div>
		</div>
	);
}

export function Benefits() {
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="max-w-3xl">
					<h2 className="heading-2 text-zinc-950">Buyers Ask AI Who to Choose. You Can't See the Answer.</h2>
					<p className="body-7 mt-6 max-w-[60ch] text-zinc-600">
						There is no results page for ChatGPT, Perplexity or Gemini. Each answer names a few brands and cites a few
						sources, and if you are not in it, nothing tells you. CiteRank.com watches those answers for you and tells
						you what to change.
					</p>
				</Reveal>
				<ul className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-12">
					{BENEFITS.map((benefit, index) => (
						<RevealItem
							key={benefit.title}
							delay={index * 80}
							className={`flex flex-col overflow-hidden rounded-2xl bg-paper-2 ${benefit.span}`}
						>
							<div className="p-6 lg:p-8">
								<h3 className={`${benefit.shot ? "title-1" : "heading-5"} text-zinc-950`}>{benefit.title}</h3>
								<p className="body-6 mt-2 max-w-[44ch] text-zinc-600">{benefit.body}</p>
							</div>
							{benefit.shot ? <Shot {...benefit.shot} /> : null}
						</RevealItem>
					))}
				</ul>
			</Container>
		</section>
	);
}
