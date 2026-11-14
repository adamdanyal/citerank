import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { Product, type ScreenId } from "../product/product";
import { BODY, LINK, PANEL, PANEL_PAD_WIDE, Page, PanelHead, SUBHEAD, TILE_INK, TILE_SAND, TILE_TINT } from "./kit";

/* Each step shows the screen it describes: the product's own, with the demo's sample data. */
const STEPS: { title: string; body: string; screen: ScreenId; tile: string; span: string; onInk?: boolean }[] = [
	{
		title: "We ask AI your buyers’ questions",
		body: "We put your buyers’ questions to every engine and keep each answer whole, with the brands it named and the sources it cited.",
		screen: "responses",
		tile: TILE_SAND,
		span: "lg:col-span-7",
	},
	{
		title: "See where you stand",
		body: "How often you are named, how often each rival is, how AI describes you, and which pages it trusts.",
		screen: "share-of-voice",
		tile: TILE_INK,
		span: "lg:col-span-5",
		onInk: true,
	},
	{
		title: "Know what to fix",
		body: "Opportunities ranks the fixes, biggest win first: a page to write, a page to update, a review site to get on.",
		screen: "opportunities",
		tile: TILE_TINT,
		span: "lg:col-span-12",
	},
];

/*
 * Three tiles, one a step: its number, what happens, and the screen where it
 * happens, working. The second is ink, so the row has a dark and a light side
 * and the screens stand out on both.
 */
export function HowItWorks() {
	const demoUrl = demoSiteUrl("marketing-page-cta", DEMO_BRAND_PATH);
	return (
		<section id="how-it-works" className={`${PANEL} ${PANEL_PAD_WIDE}`}>
			<Page>
				<PanelHead title="How CiteRank.com works" />

				<ol className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 [counter-reset:step] lg:mt-16 lg:grid-cols-12 lg:gap-6">
					{STEPS.map((step, index) => (
						<li key={step.title} className={`flex flex-col ${step.tile} ${step.span}`}>
							<div
								className={`grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 [counter-increment:step] before:font-heading before:text-display-s before:leading-[0.9] before:font-bold before:tracking-[-0.03em] before:content-[counter(step)] ${step.onInk ? "before:text-blue-300" : "before:text-rust"}`}
							>
								<div className="max-w-[52ch]">
									<h3 className={SUBHEAD}>{step.title}</h3>
									<p className={`${BODY} mt-2 ${step.onInk ? "text-zinc-300" : "text-zinc-700"}`}>{step.body}</p>
									{index === STEPS.length - 1 ? (
										<p className={`${BODY} mt-4 flex flex-wrap gap-x-6 gap-y-2`}>
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
										</p>
									) : null}
								</div>
							</div>
							<Product screen={step.screen} lead from="marketing-page-cta" className="mt-8 lg:mt-10" />
						</li>
					))}
				</ol>
			</Page>
		</section>
	);
}
