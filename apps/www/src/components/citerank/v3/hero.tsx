import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { Check } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { Product, type ScreenId } from "../product/product";
import { ACTION, ACTION_QUIET_ON_INK, HERO_TITLE, LEAD, SMALL, WRAP } from "./kit";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

/* The screens a visitor can move between without leaving the page. */
const HERO_TABS: ScreenId[] = ["overview", "share-of-voice", "sentiment", "responses", "opportunities"];

const NEXT_STEPS = [
	"Add your company website",
	`We ask ${ENGINE_COUNT} AI tools daily`,
	"See which brands they pick",
	"Get a list of what to fix",
];

/* What happens after Start tracking. Each number turns into a tick in turn, once, so the list ends looking done. */
function NextSteps() {
	return (
		<ol aria-label="What happens after you start tracking" className="mt-10 grid gap-4">
			{NEXT_STEPS.map((step, index) => (
				<li key={step} style={{ "--step": index } as CSSProperties} className="relative flex items-center gap-3">
					<span
						aria-hidden="true"
						className="relative grid size-7 shrink-0 select-none place-items-center rounded-full font-mono text-[0.8125rem] leading-none text-(--v3-on-ink-3) ring-1 ring-(--v3-ink-line-strong) ring-inset"
					>
						{index + 1}
						<span className="cr-step-tick absolute inset-0 grid place-items-center rounded-full bg-(--v3-ink-raised) text-(--v3-on-ink) ring-1 ring-(--v3-ink-line-strong) ring-inset">
							<Check aria-hidden="true" strokeWidth={1.5} className="size-4" />
						</span>
					</span>
					<span className={`${SMALL} whitespace-nowrap text-(--v3-on-ink-2)`}>{step}</span>
					{index < NEXT_STEPS.length - 1 && (
						<span aria-hidden="true" className="cr-step-line">
							<span className="cr-step-fill" />
						</span>
					)}
				</li>
			))}
		</ol>
	);
}

/*
 * The scene behind the hero. Its picture is /v3/hero-scene.webp (2880 × 1620):
 * once that file exists it goes in here as an <img> with object-cover, eager,
 * and an alt that says what it shows. Until then the slot is a plain surface
 * one step lighter than the ink, so nothing unfinished can ship.
 */
function HeroScene() {
	return <div aria-hidden="true" data-slot="hero-scene" className="absolute inset-0 -z-10 bg-(--v3-ink-step)" />;
}

const DEFAULT_LEDE = `See who ChatGPT, Gemini and ${ENGINE_COUNT - 2} other AI tools recommend to your buyers, and what to fix.`;

/* Title, lede and source are overridden when a visitor arrives from an AI assistant, or on a tested variant. */
export function Hero({
	title = "Track your brand in AI search",
	lede = DEFAULT_LEDE,
	from = "marketing-hero",
}: {
	title?: string;
	lede?: ReactNode;
	from?: ReferralSource;
} = {}) {
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);

	return (
		<section className="relative isolate overflow-x-clip bg-(--v3-ink) text-(--v3-on-ink)">
			<HeroScene />
			{/* From 1280 wide the text holds the calm upper left and the product rises from the hero's lower edge, running 10rem past it into the next section; its offset follows the window's height so the hero ends at the first screen's edge. Narrower, everything stacks in reading order. */}
			<div
				className={`${WRAP} grid grid-cols-[minmax(0,1fr)] gap-y-12 py-12 sm:py-16 xl:grid-cols-[minmax(0,31rem)_minmax(0,1fr)] xl:items-start xl:gap-x-16 xl:py-0`}
			>
				<div className="min-w-0 xl:pt-24 xl:pb-24">
					<h1 className={`${HERO_TITLE} text-(--v3-on-ink) xl:text-[4rem]`}>{title}</h1>
					<p data-speakable className={`${LEAD} mt-6 max-w-[34rem] text-(--v3-on-ink-2)`}>
						{lede}
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<a href={signupUrl} onClick={() => trackEvent("signup_click", { from })} className={ACTION}>
							Start tracking
						</a>
						<a
							href={demoUrl}
							target="_blank"
							rel={externalRel(demoUrl)}
							onClick={() => trackEvent("demo_open", { from })}
							className={ACTION_QUIET_ON_INK}
						>
							Try the live demo
						</a>
					</div>
					<p className={`${SMALL} mt-4 text-center text-(--v3-on-ink-3) sm:text-left`}>
						<span className="inline-block">Plans from ${CLOUD_ENTRY_PRICE_USD} a month.</span>{" "}
						<span className="inline-block">No contract, cancel any time.</span>
					</p>
					<NextSteps />
				</div>

				<div className="relative z-10 min-w-0 xl:mt-[clamp(14rem,calc(100svh-42rem),26rem)] xl:-mb-40">
					<Product screen="overview" tabs={HERO_TABS} from={from} />
				</div>
			</div>
		</section>
	);
}
