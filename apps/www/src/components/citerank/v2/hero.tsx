import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../home/product-demo";
import {
	ACTION,
	ACTION_QUIET_ON_INK,
	AnswerSheet,
	DISPLAY,
	InkGlow,
	LEAD,
	MONO_ON_INK,
	PANEL_INK,
	PANEL_PAD,
	Page,
	SMALL,
} from "./kit";

const DEFAULT_LEDE =
	"See how ChatGPT, Claude, Gemini and ten other AI apps talk about your brand, and what to fix. Do it yourself, or have our agency do it every month.";

/* The fictional brand the live demo tracks, so the answer on the page is one a visitor can go and read. */
const DEMO_ANSWER = {
	engine: "ChatGPT",
	question: "best help desk software for B2B SaaS",
	lines: [
		{ text: "For a B2B SaaS team of ten agents, most buyers end up comparing " },
		{ text: "Quaildesk", mark: "brand" as const, cite: 1 },
		{ text: ", which leads on shared inboxes and SLA rules, with " },
		{ text: "Queueloft", mark: "rival" as const, cite: 2 },
		{ text: " and " },
		{ text: "Brookdesk", mark: "rival" as const, cite: 3 },
		{ text: " close behind on price." },
	],
	sources: ["quaildesk.com/pricing", "g2.com", "reddit.com/r/saas"],
};

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
		<section className={`${PANEL_INK} ${PANEL_PAD}`}>
			<InkGlow />
			<Page className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
				<div className="min-w-0 lg:col-span-6">
					<h1 className={`${DISPLAY} text-paper`}>{title}</h1>
					<p data-speakable className={`${LEAD} mt-6 max-w-[42ch] text-zinc-400`}>
						{lede}
					</p>
					<div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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
					{/* A chip strips a promise of the words that explain it, so the detail stays as a sentence. */}
					<p className={`${SMALL} mt-7 text-zinc-400`}>
						Plans from ${CLOUD_ENTRY_PRICE_USD} a month. No contract, cancel any time.
					</p>
				</div>

				<div className="min-w-0 lg:col-span-6">
					<AnswerSheet
						engine={DEMO_ANSWER.engine}
						question={DEMO_ANSWER.question}
						lines={DEMO_ANSWER.lines}
						sources={DEMO_ANSWER.sources}
						size="lg"
					/>
					<p className={`${MONO_ON_INK} mt-4`}>
						An answer from the live demo, kept in full with every source it cited.
					</p>
				</div>
			</Page>
		</section>
	);
}
