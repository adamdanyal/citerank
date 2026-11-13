import { CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";
import type { ReactNode } from "react";
import { ExampleTag } from "@/components/home/ui";
import { screenshotSet } from "@/lib/screenshots";
import { CARD, Container, Reveal, WINDOW_FRAME, WindowBar } from "../ui";

const BASIC_ANSWERS_PER_DAY = PLANS.basic.maxPrompts * PLANS.basic.platformPicks * PLANS.basic.standardRunsPerDay;
const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

function Mark({ children }: { children: ReactNode }) {
	return <mark className="rounded-sm bg-blue-100 px-1 text-zinc-950">{children}</mark>;
}

/* The capture includes the app sidebar (the left 17.5% of the image); the frame shows the page itself. */
function Frame({ src, alt }: { src: string; alt: string }) {
	const shot = screenshotSet(src);
	return (
		<div className={WINDOW_FRAME}>
			<WindowBar />
			<div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper-2 sm:aspect-[16/10]">
				<img
					src={shot.src}
					srcSet={shot.srcSet}
					sizes="(min-width: 1024px) 58vw, 100vw"
					alt={alt}
					width={shot.width}
					height={shot.height}
					loading="lazy"
					decoding="async"
					className="absolute top-0 left-[-21.2%] w-[121.2%] max-w-none"
				/>
			</div>
		</div>
	);
}

const ANSWER = {
	prompt: "Most affordable help desk software for a team of 10 agents?",
	intro: "For a ten-person support team, three options stand out:",
	picks: [
		{ name: "Queueloft", why: "simple setup and a free tier for small teams." },
		{ name: "Brookdesk", why: "a strong knowledge base and multilingual support." },
		{ name: "Caseorchard", why: "the lowest price per agent on annual plans." },
	],
	sources: "Sources it cited: two review sites, a Reddit thread and a comparison blog.",
};

function AnswerCard() {
	return (
		<figure className={`${CARD} p-6 lg:p-8`}>
			<ExampleTag>A buyer's question and an AI answer, with the demo brands</ExampleTag>
			<p className="title-1 mt-6 text-zinc-950">“{ANSWER.prompt}”</p>
			<div className="mt-6 rounded-xl bg-paper-2 p-4">
				<p className="body-6 text-zinc-700">{ANSWER.intro}</p>
				<ol className="mt-4 space-y-3">
					{ANSWER.picks.map((pick, index) => (
						<li key={pick.name} className="flex gap-3 body-6 text-zinc-700">
							<span className="caption-1 font-mono text-zinc-500 tabular-nums">{index + 1}.</span>
							<span>
								<span className="body-5 text-zinc-950">{pick.name}</span>: {pick.why}
							</span>
						</li>
					))}
				</ol>
				<p className="caption-2 mt-4 text-zinc-500">{ANSWER.sources}</p>
			</div>
			<figcaption className="mt-4 flex flex-col gap-3 rounded-xl bg-blue-50 p-5 sm:flex-row sm:items-start sm:gap-4">
				<span className="caption-3 shrink-0 rounded-md bg-blue-600 px-2 py-1 text-white">Not in the answer</span>
				<p className="body-6 text-blue-900">
					Quaildesk, our demo brand, and nothing told its team. CiteRank.com asks this question up to four times a day
					and shows what to change.
				</p>
			</figcaption>
		</figure>
	);
}

const STEPS = [
	{
		title: "We ask AI your buyers' questions",
		body: (
			<>
				{ENGINE_COUNT} AI apps, up to four times a day. Every answer is saved with the brands it named and the sources
				it cited. On the Basic plan that is{" "}
				<Mark>up to {BASIC_ANSWERS_PER_DAY.toLocaleString("en-US")} answers a day</Mark>.
			</>
		),
		shot: {
			src: "/screenshots/responses.webp",
			alt: "CiteRank.com responses page listing AI answers with each brand's rank and tone",
		},
	},
	{
		title: "See where you stand",
		body: (
			<>
				How often you are named, how often each rival is, how AI describes you, and <Mark>which pages it trusts</Mark>.
			</>
		),
		shot: {
			src: "/screenshots/share-of-voice.webp",
			alt: "CiteRank.com share of voice page comparing how often AI recommends each brand",
		},
	},
	{
		title: "Know what to fix",
		body: (
			<>
				Opportunities ranks the fixes, biggest win first: a page to write, a page to update, a review site to get on.{" "}
				<Mark>Do them yourself, or hand them to our agency.</Mark>
			</>
		),
		shot: {
			src: "/screenshots/opportunities.webp",
			alt: "CiteRank.com opportunities page with recommendations ranked by impact",
		},
	},
];

export function Story() {
	return (
		<section className="bg-paper-2">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">What a buyer sees</h2>
					<p className="body-8 mt-6 text-zinc-700">Here is the kind of answer your buyers get.</p>
				</Reveal>
				<Reveal delay={100} className="mx-auto mt-12 max-w-3xl">
					<AnswerCard />
				</Reveal>
			</Container>
		</section>
	);
}

/* Three steps as alternating rows, so the whole flow fits in a couple of screens. */
export function HowItWorks() {
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">How CiteRank.com works</h2>
					<p className="body-8 mt-6 text-zinc-700">Three steps, every day.</p>
				</Reveal>
				<ol className="mt-12 space-y-16 lg:mt-20 lg:space-y-24">
					{STEPS.map((step, index) => {
						const flipped = index % 2 === 1;
						return (
							<li key={step.title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
								<Reveal className={`lg:col-span-5 ${flipped ? "lg:order-2" : ""}`}>
									<p className="caption-1 text-blue-700">Step {index + 1}</p>
									<h3 className="heading-3 mt-3 text-zinc-950">{step.title}</h3>
									<p className="body-7 mt-4 text-zinc-700">{step.body}</p>
								</Reveal>
								<Reveal delay={100} className={`lg:col-span-7 ${flipped ? "lg:order-1" : ""}`}>
									<Frame {...step.shot} />
								</Reveal>
							</li>
						);
					})}
				</ol>
			</Container>
		</section>
	);
}
