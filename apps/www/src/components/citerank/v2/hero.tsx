import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import type { CSSProperties, ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { Product, type ScreenId } from "../product/product";
import { ACTION, ACTION_QUIET_ON_INK, DISPLAY, SMALL } from "./kit";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

/* The screens a visitor can move between without leaving the page. */
const HERO_TABS: ScreenId[] = ["overview", "share-of-voice", "sentiment", "responses", "opportunities"];

const NEXT_STEPS = [
	"Add your website",
	`We ask ${ENGINE_COUNT} AI assistants what buyers ask`,
	"See which brands they recommend",
	"Get a list of what to fix",
];

/* On a phone the type gives way before a step breaks: the divisor is the longest step's width in em. */
const STEP_ONE_LINE = "whitespace-nowrap max-sm:text-[length:min(0.875rem,calc((100vw_-_4.5rem)_/_19.2))]";

/* What happens after Start tracking. Each number turns into a tick in turn, once, so the list ends looking done. */
function NextSteps() {
	return (
		<ol aria-label="What happens after you start tracking" className="mt-8 grid gap-4">
			{NEXT_STEPS.map((step, index) => (
				<li
					key={step}
					style={{ "--step": index } as CSSProperties}
					className="relative flex items-center gap-3 sm:max-xl:flex-col sm:max-xl:items-start"
				>
					<span
						aria-hidden="true"
						className="relative grid size-7 shrink-0 select-none place-items-center rounded-full font-sans text-[0.8125rem] leading-none font-medium text-zinc-300 ring-1 ring-zinc-600 ring-inset"
					>
						{index + 1}
						<span className="cr-step-tick absolute inset-0 grid place-items-center rounded-full bg-rust text-paper">
							<svg aria-hidden="true" viewBox="0 0 12 12" className="size-1/2">
								<path
									d="M2 6.5l2.5 2.5 5.5-6"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
					</span>
					<span className={`${SMALL} ${STEP_ONE_LINE} text-zinc-300`}>{step}</span>
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

const DEFAULT_LEDE = `See who ChatGPT, Gemini and ${ENGINE_COUNT - 2} other AI apps recommend to your buyers, and what to fix.`;

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
		<section className="relative overflow-x-clip bg-ink text-paper">
			{/* From 1280 wide, five tracks: a gutter, the text, a gap, the product, a gutter. The gutters grow past 1440; the text and the product do not. Narrower, the product sits under the text at full width. */}
			<div className="grid items-center gap-y-10 px-4 py-10 sm:px-6 sm:py-12 lg:px-16 xl:min-h-[min(calc(100svh-4.5rem),52rem)] xl:grid-cols-[minmax(4rem,1fr)_minmax(0,30rem)_3rem_minmax(0,49rem)_minmax(4rem,1fr)] xl:px-0 xl:py-8">
				<div className="min-w-0 xl:col-start-2">
					<h1 className={`${DISPLAY} text-paper`}>{title}</h1>
					<p data-speakable className="mt-6 max-w-[46ch] text-lead leading-[1.45] text-balance text-zinc-300">
						{lede}
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:max-xl:*:flex-1">
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
					<p className={`${SMALL} mt-4 text-center text-zinc-400 xl:text-left`}>
						<span className="inline-block">Plans from ${CLOUD_ENTRY_PRICE_USD} a month.</span>{" "}
						<span className="inline-block">No contract, cancel any time.</span>
					</p>
					<NextSteps />
				</div>

				{/* The product itself, in HTML: the overview first, and four more screens a tab away. Beside the text its chart gives up height on a short screen, so the whole of it stays inside the first one. */}
				<Product
					screen="overview"
					tabs={HERO_TABS}
					from={from}
					className="xl:col-start-4 xl:[--chart-height:clamp(6rem,calc(100svh-43.5rem),9rem)]"
				/>
			</div>
		</section>
	);
}
