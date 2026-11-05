import { Container, Eyebrow, Reveal, RevealItem } from "../ui";

interface Step {
	title: string;
	body: string;
	src: string;
	alt: string;
}

const STEPS: Step[] = [
	{
		title: "Add Your Brand",
		body: "Point CiteRank.com at your site. It suggests the prompts your buyers ask and the competitors to track against.",
		src: "/screenshots/prompt-settings.png",
		alt: "CiteRank.com prompts settings listing the buyer prompts tracked for a demo brand, each tagged by topic",
	},
	{
		title: "See Where You Stand",
		body: "Visibility, share of voice, and the sources AI cites, sampled up to 4× daily from the real apps.",
		src: "/screenshots/visibility.png",
		alt: "CiteRank.com visibility page showing per-prompt visibility over time against competitors",
	},
	{
		title: "Know What to Fix",
		body: "Opportunities ranked by impact. CiteRank.com keeps you updated, so you always know what to do next.",
		src: "/screenshots/opportunities.png",
		alt: "CiteRank.com opportunities page with prioritized recommendations for content and sources",
	},
];

/* The capture includes the app sidebar (the left 17.5% of the image), which is shifted out of view. */
function Shot({ src, alt }: { src: string; alt: string }) {
	return (
		<div className="rounded-2xl bg-white p-2 shadow-[0_1px_2px_rgb(26_25_23/0.05),0_24px_48px_-24px_rgb(26_25_23/0.2)]">
			<div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-paper-2">
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

export function HowItWorks() {
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="max-w-[42.5rem]">
					<Eyebrow>How It Works</Eyebrow>
					<h2 className="heading-2 mt-4 text-zinc-950">From Zero to a Plan in One Afternoon</h2>
					<p className="body-7 mt-6 text-zinc-600">
						No sales call, no bloat. CiteRank.com sets up your tracking and tells you what to change.
					</p>
				</Reveal>
				<ol className="mt-16 space-y-16 lg:mt-20 lg:space-y-24">
					{STEPS.map((step, index) => {
						const flipped = index % 2 === 1;
						return (
							<RevealItem key={step.title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
								<div className={`lg:col-span-7 ${flipped ? "lg:order-2" : ""}`}>
									<Shot src={step.src} alt={step.alt} />
								</div>
								<div className={`lg:col-span-5 ${flipped ? "lg:order-1" : ""}`}>
									<span className="inline-flex size-8 items-center justify-center rounded-lg bg-blue-600 font-mono text-sm font-medium text-white tabular-nums">
										{index + 1}
									</span>
									<h3 className="heading-4 mt-6 text-zinc-950">{step.title}</h3>
									<p className="body-7 mt-4 max-w-[36rem] text-zinc-600">{step.body}</p>
								</div>
							</RevealItem>
						);
					})}
				</ol>
			</Container>
		</section>
	);
}
