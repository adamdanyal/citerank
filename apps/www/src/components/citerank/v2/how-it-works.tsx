import { CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";
import type { ReactNode } from "react";
import { screenshotSet } from "@/lib/screenshots";
import { BODY, HEADING, MONO, Page, SECTION, SUBHEAD } from "./kit";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;
const BASIC_ANSWERS_PER_DAY = PLANS.basic.maxPrompts * PLANS.basic.platformPicks * PLANS.basic.standardRunsPerDay;

/** The figure a sentence turns on, set apart so the eye lands on it. */
function Figure({ children }: { children: ReactNode }) {
	return <span className="text-ink underline decoration-rust decoration-2 underline-offset-4">{children}</span>;
}

const STEPS = [
	{
		title: "We ask AI your buyers' questions",
		body: (
			<>
				{ENGINE_COUNT} AI apps, up to four times a day. Every answer is saved with the brands it named and the sources
				it cited. On the Basic plan that is{" "}
				<Figure>up to {BASIC_ANSWERS_PER_DAY.toLocaleString("en-US")} answers a day</Figure>.
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
				How often you are named, how often each rival is, how AI describes you, and{" "}
				<Figure>which pages it trusts</Figure>.
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
				<Figure>Do them yourself, or hand them to our agency.</Figure>
			</>
		),
		shot: {
			src: "/screenshots/opportunities.webp",
			alt: "CiteRank.com opportunities page with recommendations ranked by impact",
		},
	},
];

export function HowItWorks() {
	return (
		<section className={`${SECTION} bg-paper-2`}>
			<Page>
				<h2 className={`${HEADING} max-w-[16ch] text-ink`}>How CiteRank.com works</h2>
				<div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
					{STEPS.map((step, index) => (
						<article key={step.title} className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
							<div className={`md:col-span-4 ${index % 2 === 1 ? "md:order-2" : ""}`}>
								<p className={MONO}>{String(index + 1).padStart(2, "0")}</p>
								<h3 className={`${SUBHEAD} mt-4 text-ink`}>{step.title}</h3>
								<p className={`${BODY} mt-4 text-zinc-600`}>{step.body}</p>
							</div>
							<div className={`md:col-span-8 ${index % 2 === 1 ? "md:order-1" : ""}`}>
								<img
									{...screenshotSet(step.shot.src)}
									alt={step.shot.alt}
									loading="lazy"
									decoding="async"
									sizes="(min-width: 768px) 62vw, 100vw"
									className="w-full rounded-xl ring-1 ring-zinc-200"
								/>
							</div>
						</article>
					))}
				</div>
			</Page>
		</section>
	);
}
