import { cloudSignupUrl } from "@workspace/config/referrals";
import { trackEvent } from "@/lib/posthog";
import { BODY, LINK, PANEL, PANEL_PAD_WIDE, Page, PanelHead, SUBHEAD } from "./kit";

const STEPS = [
	{
		title: "We ask AI your buyers’ questions",
		body: "We put your buyers’ questions to every engine and keep each answer whole, with the brands it named and the sources it cited.",
		shot: "step-ask",
		alt: "A saved ChatGPT answer in CiteRank.com: the question asked, the web searches it ran, and the six brands it named with each one’s rank and tone",
	},
	{
		title: "See where you stand",
		body: "How often you are named, how often each rival is, how AI describes you, and which pages it trusts.",
		shot: "step-see",
		alt: "The share of voice leaderboard in CiteRank.com: the tracked brand first with 23% of mentions, then eight rivals with their mentions and share",
	},
	{
		title: "Know what to fix",
		body: "Opportunities ranks the fixes, biggest win first: a page to write, a page to update, a review site to get on.",
		shot: "step-fix",
		alt: "The opportunities page in CiteRank.com: three pages to create, each with the reason AI is not naming the brand yet",
	},
];

/*
 * On a wide screen each capture holds its place while the steps scroll past,
 * and the next one slides over it. That works by letting a capture's grid area
 * run from its own row to the last, which is as far as it may stay stuck. Each
 * sticks a little lower than the one before, so the earlier sheets show above it.
 */
const ROW = ["lg:row-start-1", "lg:row-start-2", "lg:row-start-3"];
const STUCK = ["lg:top-28", "lg:top-32", "lg:top-36"];

export function HowItWorks() {
	return (
		<section id="how-it-works" className={`${PANEL} ${PANEL_PAD_WIDE}`}>
			<Page>
				<PanelHead title="How CiteRank.com works" />

				<ol className="mt-10 space-y-14 [counter-reset:step] lg:mt-16 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16 lg:space-y-0">
					{STEPS.map((step, index) => (
						<li key={step.title} className="lg:contents">
							<div
								className={`border-t border-zinc-200 pt-8 [counter-increment:step] before:block before:font-heading before:text-display-s before:leading-none before:font-bold before:tracking-[-0.03em] before:text-rust before:content-[counter(step)] lg:col-start-1 lg:min-h-[36rem] ${ROW[index]}`}
							>
								<h3 className={`${SUBHEAD} mt-6 text-ink`}>{step.title}</h3>
								<p className={`${BODY} mt-3 max-w-[44ch] text-zinc-600`}>{step.body}</p>
								{index === STEPS.length - 1 ? (
									<p className={`${BODY} mt-6`}>
										<a
											href={cloudSignupUrl("marketing-cta")}
											onClick={() => trackEvent("signup_click", { from: "marketing-how-it-works" })}
											className={`${LINK} font-medium text-ink`}
										>
											Start tracking
										</a>
									</p>
								) : null}
							</div>
							<figure
								data-slot={step.shot}
								data-kind="product"
								className={`mt-8 lg:sticky lg:col-start-2 lg:row-end-4 lg:mt-0 lg:self-start ${ROW[index]} ${STUCK[index]}`}
							>
								<img
									src={`/screens/${step.shot}.webp`}
									srcSet={`/screens/${step.shot}.webp 750w, /screens/${step.shot}-2x.webp 1500w`}
									sizes="(min-width: 1024px) 728px, 100vw"
									width={750}
									height={540}
									alt={step.alt}
									loading="lazy"
									decoding="async"
									className="block h-auto w-full rounded-card bg-paper ring-1 ring-zinc-200"
								/>
							</figure>
						</li>
					))}
				</ol>
			</Page>
		</section>
	);
}
