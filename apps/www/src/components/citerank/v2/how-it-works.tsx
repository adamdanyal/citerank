import { CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/posthog";
import { screenshotSet } from "@/lib/screenshots";
import { ACTION, BODY, PANEL, PANEL_PAD_WIDE, Page, PanelHead, PILL_RUST, SUBHEAD } from "./kit";

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
				We put your buyers&apos; questions to every engine and keep{" "}
				<Figure>the answer whole, with the brands it named and the sources it cited</Figure>. Nothing is sampled or
				summarised away.
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
				Opportunities ranks the fixes, <Figure>biggest win first</Figure>: a page to write, a page to update, a review
				site to get on.
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
		<section className={`${PANEL} ${PANEL_PAD_WIDE}`}>
			<Page>
				<PanelHead title="How CiteRank.com works" className="max-w-[46rem]" />

				<div className="mt-12 space-y-5">
					{STEPS.map((step, index) => (
						<article key={step.title} className="rounded-2xl bg-paper-2 p-5 sm:p-7">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
								<p className="shrink-0">
									<span className={PILL_RUST}>Step {index + 1}</span>
								</p>
								<div>
									<h3 className={`${SUBHEAD} text-ink`}>{step.title}</h3>
									<p className={`${BODY} mt-3 max-w-[62ch] text-zinc-600`}>{step.body}</p>
								</div>
							</div>
							<img
								{...screenshotSet(step.shot.src)}
								alt={step.shot.alt}
								loading="lazy"
								decoding="async"
								sizes="(min-width: 1180px) 1010px, 100vw"
								className="mt-6 w-full rounded-xl bg-paper ring-1 ring-zinc-200"
							/>
						</article>
					))}
				</div>

				<p className="mt-10">
					<a
						href={cloudSignupUrl("marketing-cta")}
						onClick={() => trackEvent("signup_click", { from: "marketing-how-it-works" })}
						className={ACTION}
					>
						Start tracking
					</a>
				</p>
			</Page>
		</section>
	);
}
