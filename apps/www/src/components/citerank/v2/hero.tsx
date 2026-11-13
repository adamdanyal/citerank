import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { screenshotSet } from "@/lib/screenshots";
import { DEMO_BRAND_PATH } from "../home/product-demo";
import { ACTION, ACTION_QUIET_ON_INK, DISPLAY, InkGlow, LEAD, PANEL_INK, Page, SMALL } from "./kit";

const ENGINE_COUNT = Object.keys(CLOUD_PLATFORMS).length;
const RUNS_PER_DAY = Math.max(...Object.values(PLANS).map((plan) => plan.standardRunsPerDay));
const TIMES = ["", "once", "twice", "three times", "four times"][RUNS_PER_DAY] ?? `${RUNS_PER_DAY} times`;

/*
 * The first thing a stranger needs is what this is and what they get for it, in
 * that order. So: what we do, then the two things they receive.
 */
const DEFAULT_LEDE = `We ask ChatGPT, Gemini and ${ENGINE_COUNT - 2} other AI apps the questions your buyers ask, ${TIMES} a day. You get a dashboard showing who they recommend, and a ranked list of what to fix.`;

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
	const shot = screenshotSet("/screenshots/overview.webp");

	return (
		<section className={`${PANEL_INK} px-6 pt-14 sm:px-10 sm:pt-16 md:px-14 md:pt-20`}>
			<InkGlow />
			<Page className="relative">
				<div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
					<h1 className={`${DISPLAY} text-paper lg:col-span-7`}>{title}</h1>
					<div className="min-w-0 lg:col-span-5">
						<p data-speakable className={`${LEAD} text-zinc-300`}>
							{lede}
						</p>
						<div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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
						<p className={`${SMALL} mt-5 text-zinc-400`}>
							Plans from ${CLOUD_ENTRY_PRICE_USD} a month. No contract, cancel any time.
						</p>
					</div>
				</div>

				{/*
				 * The product itself, not a drawing of it. This is the largest thing on
				 * the first screen, so it loads eagerly and at high priority: left lazy
				 * it would be the slowest paint on the page.
				 */}
				<a
					href={demoUrl}
					target="_blank"
					rel={externalRel(demoUrl)}
					onClick={() => trackEvent("demo_open", { from: "hero-screenshot" })}
					aria-label="Open the live demo"
					className="mt-12 block rounded-t-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust md:mt-14"
				>
					<img
						src={shot.src}
						srcSet={shot.srcSet}
						sizes="(min-width: 1280px) 1200px, 100vw"
						width={shot.width}
						height={shot.height}
						alt="The CiteRank.com dashboard: how often AI names your brand, your share of voice against competitors, sentiment, and a chart of each rival over the last 30 days"
						loading="eager"
						fetchPriority="high"
						decoding="async"
						className="w-full rounded-t-2xl bg-paper ring-1 ring-white/15"
					/>
				</a>
			</Page>
		</section>
	);
}
