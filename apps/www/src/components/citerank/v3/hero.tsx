import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { Check } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { Product, type ScreenId } from "../product/product";
import { ACTION, ACTION_QUIET_ON_INK, HERO_TITLE, LEAD, Pen, SMALL, WRAP } from "./kit";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

/* The screens a visitor can move between without leaving the page. */
const HERO_TABS: ScreenId[] = ["overview", "share-of-voice", "sentiment", "responses", "opportunities"];

const NEXT_STEPS = [
	"Add your company website",
	`We ask ${ENGINE_COUNT} AI assistants daily`,
	"See which brands they pick",
	"Get a list of what to fix",
];

/* What happens after Start tracking. Each number turns into a tick in turn, once, so the list ends looking done. */
function NextSteps() {
	return (
		<ol aria-label="What happens after you start tracking" className="mt-8 grid gap-4">
			{NEXT_STEPS.map((step, index) => (
				<li key={step} style={{ "--step": index } as CSSProperties} className="relative flex items-center gap-3">
					<span
						aria-hidden="true"
						className="relative grid size-7 shrink-0 select-none place-items-center rounded-full font-mono text-[0.8125rem] leading-none text-(--v3-on-ink-3) ring-1 ring-(--v3-ink-line-strong) ring-inset"
					>
						{index + 1}
						<span className="cr-step-tick absolute inset-0 grid place-items-center rounded-full bg-(--v3-rust) text-(--v3-card)">
							<Check aria-hidden="true" strokeWidth={2.5} className="size-3.5" />
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

/* The headline underlines "your brand" with the page's rust brush mark wherever a variant says it; a possessive is left plain. */
function Title({ text }: { text: string }) {
	const match = /your brand(?![’'])/.exec(text);
	if (!match) return text;
	return (
		<>
			{text.slice(0, match.index)}
			<Pen display underline>
				{match[0]}
			</Pen>
			{text.slice(match.index + match[0].length)}
		</>
	);
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
		<section className="relative overflow-x-clip bg-(--v3-ink) text-(--v3-on-ink)">
			{/* From 1100 wide, every tablet held sideways and up, the text and the product sit side by side, centred in the first screen; the product's chart gives up height on a short screen so all of it stays in view. Narrower, everything stacks in reading order. */}
			<div
				className={`${WRAP} grid grid-cols-[minmax(0,1fr)] gap-y-12 py-12 sm:max-[1100px]:py-16 min-[1100px]:min-h-[min(calc(100svh-4.5rem),52rem)] min-[1100px]:max-[1280px]:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] min-[1100px]:items-center min-[1100px]:gap-x-10 min-[1100px]:py-8 xl:max-[1440px]:grid-cols-[minmax(0,31rem)_minmax(0,1fr)] min-[1440px]:grid-cols-[minmax(0,35rem)_minmax(0,1fr)] xl:gap-x-16`}
			>
				<div className="min-w-0">
					<h1
						className={`${HERO_TITLE} text-(--v3-on-ink) min-[1100px]:max-[1280px]:text-[2.625rem] xl:max-[1440px]:text-[3.75rem] min-[1440px]:text-[4.125rem]`}
					>
						<Title text={title} />
					</h1>
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

				<Product
					screen="overview"
					tabs={HERO_TABS}
					from={from}
					className="min-w-0 min-[1100px]:[--chart-height:clamp(6rem,calc(100svh-43.5rem),9rem)]"
				/>
			</div>
		</section>
	);
}
