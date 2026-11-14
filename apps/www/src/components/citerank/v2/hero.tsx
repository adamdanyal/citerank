import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { Product, type ScreenId } from "../product/product";
import { ACTION, ACTION_QUIET_ON_INK, DISPLAY, SMALL } from "./kit";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

/* The screens a visitor can move between without leaving the page. */
const HERO_TABS: ScreenId[] = ["overview", "share-of-voice", "sentiment", "responses", "opportunities"];

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
					<p className={`${SMALL} mt-4 text-zinc-400`}>
						<span className="inline-block">Plans from ${CLOUD_ENTRY_PRICE_USD} a month.</span>{" "}
						<span className="inline-block">No contract, cancel any time.</span>
					</p>
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
