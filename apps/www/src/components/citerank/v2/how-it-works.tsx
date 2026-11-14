import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { Product, type ScreenId } from "../product/product";
import { BODY, LINK, PANEL, PANEL_PAD_WIDE, Page, PanelHead, SUBHEAD } from "./kit";

/* Each step shows the screen it describes: the product's own, with the demo's sample data. */
const STEPS: { title: string; body: string; screen: ScreenId }[] = [
	{
		title: "We ask AI your buyers’ questions",
		body: "We put your buyers’ questions to every engine and keep each answer whole, with the brands it named and the sources it cited.",
		screen: "responses",
	},
	{
		title: "See where you stand",
		body: "How often you are named, how often each rival is, how AI describes you, and which pages it trusts.",
		screen: "share-of-voice",
	},
	{
		title: "Know what to fix",
		body: "Opportunities ranks the fixes, biggest win first: a page to write, a page to update, a review site to get on.",
		screen: "opportunities",
	},
];

/*
 * On a wide screen each screen holds its place while the steps scroll past,
 * and the next one slides over it. That works by letting a screen's grid area
 * run from its own row to the last, which is as far as it may stay stuck. Each
 * sticks a little lower than the one before, so the earlier sheets show above
 * it.
 */
const ROW = ["lg:row-start-1", "lg:row-start-2", "lg:row-start-3"];
const STUCK = ["lg:top-28", "lg:top-32", "lg:top-36"];

export function HowItWorks() {
	const demoUrl = demoSiteUrl("marketing-page-cta", DEMO_BRAND_PATH);
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
									<div className={`${BODY} mt-6 flex flex-wrap gap-x-6 gap-y-2`}>
										<a
											href={cloudSignupUrl("marketing-cta")}
											onClick={() => trackEvent("signup_click", { from: "marketing-how-it-works" })}
											className={`${LINK} font-medium whitespace-nowrap text-ink`}
										>
											Start tracking
										</a>
										<a
											href={demoUrl}
											target="_blank"
											rel={externalRel(demoUrl)}
											onClick={() => trackEvent("demo_open", { from: "demo-section" })}
											className={`${LINK} font-medium whitespace-nowrap text-ink`}
										>
											Try the live demo
										</a>
									</div>
								) : null}
							</div>
							<Product
								screen={step.screen}
								lead
								from="marketing-page-cta"
								className={`mt-8 lg:sticky lg:col-start-2 lg:row-end-4 lg:mt-0 lg:self-start ${ROW[index]} ${STUCK[index]}`}
							/>
						</li>
					))}
				</ol>
			</Page>
		</section>
	);
}
