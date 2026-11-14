import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../home/product-demo";
import { ACTION, ACTION_QUIET_ON_INK, DISPLAY, SMALL } from "./kit";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;

const WIDE = {
	src: "/screens/overview-wide.webp",
	srcSet: "/screens/overview-wide.webp 1000w, /screens/overview-wide-2x.webp 2000w",
	sizes: "(min-width: 1024px) 1000px, 100vw",
};
const PHONE = {
	src: "/screens/overview-phone.webp",
	srcSet: "/screens/overview-phone.webp 390w, /screens/overview-phone-2x.webp 780w",
	sizes: "100vw",
	media: "(max-width: 639px)",
};

/* A browser cannot see inside a picture until it parses it, so the page that renders the hero preloads the right capture. */
export const HERO_PRELOADS = [
	{
		rel: "preload",
		as: "image",
		href: PHONE.src,
		imageSrcSet: PHONE.srcSet,
		imageSizes: PHONE.sizes,
		media: PHONE.media,
		fetchPriority: "high",
	},
	{
		rel: "preload",
		as: "image",
		href: WIDE.src,
		imageSrcSet: WIDE.srcSet,
		imageSizes: WIDE.sizes,
		media: "(min-width: 640px)",
		fetchPriority: "high",
	},
] as const;

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
			{/*
			 * Five tracks: a gutter, the text, a gap, the capture, a gutter. The
			 * capture spans its own track and the gutter after it, so it always
			 * reaches the edge of the window, however wide that is.
			 */}
			<div className="grid items-center gap-y-10 px-4 py-10 sm:px-6 sm:py-12 lg:min-h-[min(calc(100svh-4.5rem),52rem)] lg:grid-cols-[minmax(4rem,1fr)_minmax(0,32.5rem)_4rem_minmax(0,45.5rem)_minmax(4rem,1fr)] lg:px-0">
				<div className="min-w-0 lg:col-start-2">
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

				{/*
				 * The product itself, captured from the live demo. On a wide screen it
				 * is shown at its real size or larger and runs off the edge of the
				 * window; on a phone it is the four figures alone, so they land on the
				 * first screen. It is the largest paint there, so it loads eagerly.
				 */}
				<a
					href={demoUrl}
					target="_blank"
					rel={externalRel(demoUrl)}
					onClick={() => trackEvent("demo_open", { from: "hero-screenshot" })}
					aria-label="Open the live demo"
					data-slot="hero"
					data-kind="product"
					className="block min-w-0 rounded-card focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust lg:col-start-4 lg:col-end-6"
				>
					<picture>
						<source media={PHONE.media} srcSet={PHONE.srcSet} sizes={PHONE.sizes} width={390} height={348} />
						<img
							src={WIDE.src}
							srcSet={WIDE.srcSet}
							sizes={WIDE.sizes}
							width={1000}
							height={673}
							alt="The CiteRank.com overview: AI visibility, share of voice, sentiment and position for the tracked brand, above a chart and a table ranking it against its competitors in each AI app"
							loading="eager"
							fetchPriority="high"
							decoding="async"
							className="block h-auto w-full rounded-card bg-paper ring-1 ring-ink-rule lg:w-[max(calc(100%+6rem),min(62.5rem,calc((100svh-10.5rem)*1.486)))] lg:max-w-none"
						/>
					</picture>
				</a>
			</div>
		</section>
	);
}
