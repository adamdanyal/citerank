import type { ReactNode } from "react";
import { ExampleTag } from "@/components/home/ui";
import { Container, Reveal } from "../ui";

function Mark({ children }: { children: ReactNode }) {
	return <mark className="rounded-sm bg-blue-100 px-1 text-zinc-950">{children}</mark>;
}

/* The capture includes the app sidebar (the left 17.5% of the image); the frame shows the page itself. */
function Frame({ src, alt }: { src: string; alt: string }) {
	return (
		<div className="rounded-2xl bg-white p-2 shadow-[0_1px_2px_rgb(26_25_23/0.05),0_40px_80px_-40px_rgb(26_25_23/0.35)]">
			<div aria-hidden="true" className="flex h-6 items-center gap-2 px-2">
				<span className="size-2 rounded-full bg-zinc-200" />
				<span className="size-2 rounded-full bg-zinc-200" />
				<span className="size-2 rounded-full bg-zinc-200" />
			</div>
			<div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-paper-2 sm:aspect-[16/10]">
				<img
					src={src}
					alt={alt}
					width={3000}
					height={1800}
					loading="lazy"
					decoding="async"
					className="absolute left-[-21.2%] top-0 w-[121.2%] max-w-none"
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
		<figure className="rounded-2xl bg-paper-2 p-6 lg:p-8">
			<ExampleTag>A buyer's question and an AI answer, with the demo brands</ExampleTag>
			<p className="title-1 mt-6 text-zinc-950">“{ANSWER.prompt}”</p>
			<div className="mt-6 rounded-xl bg-white p-5">
				<p className="body-6 text-zinc-700">{ANSWER.intro}</p>
				<ol className="mt-4 space-y-3">
					{ANSWER.picks.map((pick, index) => (
						<li key={pick.name} className="flex gap-3 body-6 text-zinc-700">
							<span className="caption-1 font-mono text-zinc-400 tabular-nums">{index + 1}.</span>
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
					Quaildesk, the brand in our demo. Nothing tells its team this happened. CiteRank.com asks this question up to
					four times a day and shows what to change so the answer includes you.
				</p>
			</figcaption>
		</figure>
	);
}

const CHAPTERS = [
	{
		title: "So We Ask the AI for You, Every Day",
		body: [
			{
				id: "p1-1",
				text: (
					<>
						Every question your buyers might type runs against ChatGPT, Claude, Gemini, Perplexity and eight other AI
						apps, <Mark>up to four times a day</Mark>. Each answer is saved word for word, with the brands it named and
						the sources it cited.
					</>
				),
			},
			{
				id: "p1-2",
				text: <>You stop checking by hand, and you see trends instead of one lucky screenshot.</>,
			},
		],
		shot: {
			src: "/screenshots/responses.png",
			alt: "CiteRank.com responses page listing AI answers with each brand's rank and tone",
		},
	},
	{
		title: "Then We Show You Where You Stand",
		body: [
			{
				id: "p2-1",
				text: (
					<>
						How often you are named, how often each competitor is, how AI describes you, and{" "}
						<Mark>which pages it trusts</Mark> when it answers. One dashboard, your whole team on it, no seat limits.
					</>
				),
			},
		],
		shot: {
			src: "/screenshots/share-of-voice.png",
			alt: "CiteRank.com share of voice page comparing how often AI recommends each brand",
		},
	},
	{
		title: "And What to Do About It",
		body: [
			{
				id: "p3-1",
				text: (
					<>
						Opportunities ranks the fixes by impact: the page to write, the page to update, the review site to get
						listed on, the forum thread to answer. <Mark>Do them, and watch the answers change.</Mark>
					</>
				),
			},
		],
		shot: {
			src: "/screenshots/opportunities.png",
			alt: "CiteRank.com opportunities page with recommendations ranked by impact",
		},
	},
];

export function Story() {
	return (
		<>
			<section className="bg-white">
				<Container className="py-20 lg:py-24">
					<Reveal className="max-w-3xl">
						<h2 className="heading-2 text-zinc-950">What a Buyer Sees</h2>
						<p className="body-8 mt-6 text-zinc-700">
							Here is the kind of answer your buyers get. Notice who is in it, and who is not.
						</p>
					</Reveal>
					<Reveal delay={100} className="mt-12 max-w-3xl">
						<AnswerCard />
					</Reveal>
				</Container>
			</section>
			{CHAPTERS.map((chapter, index) => (
				<section key={chapter.title} className={index % 2 === 0 ? "bg-paper" : "bg-white"}>
					<Container className="py-20 lg:py-24">
						<Reveal className="max-w-3xl">
							<h2 className="heading-2 text-zinc-950">{chapter.title}</h2>
							<div className="mt-6 space-y-4">
								{chapter.body.map((paragraph) => (
									<p key={paragraph.id} className="body-8 text-zinc-700">
										{paragraph.text}
									</p>
								))}
							</div>
						</Reveal>
						<Reveal delay={100} className="mx-auto mt-12 max-w-5xl lg:mt-16">
							<Frame {...chapter.shot} />
						</Reveal>
					</Container>
				</section>
			))}
		</>
	);
}
