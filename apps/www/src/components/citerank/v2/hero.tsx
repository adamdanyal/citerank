import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../home/product-demo";
import { ACTION, ACTION_QUIET, AnswerSheet, DISPLAY, LEAD, Mono, Page, SMALL } from "./kit";

const FROM = "marketing-hero";

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

export function Hero() {
	const signupUrl = cloudSignupUrl(FROM);
	const demoUrl = demoSiteUrl(FROM, DEMO_BRAND_PATH);

	return (
		<section className="-mt-16 bg-paper pt-32 pb-20 md:pt-40 md:pb-28">
			<Page className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
				<div className="lg:col-span-6">
					<h1 className={`${DISPLAY} text-ink`}>Track your brand in AI search</h1>
					<div className="mt-7 h-px w-16 bg-rust" />
					<p className={`${LEAD} mt-7 max-w-[46ch] text-zinc-600`}>
						CiteRank.com is the AI visibility tracker and AI search agency for AEO and GEO. See how ChatGPT, Claude,
						Gemini and ten other AI apps talk about your brand and what to fix. Do it yourself, or have our agency do it
						every month.
					</p>
					<div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
						<a href={signupUrl} onClick={() => trackEvent("signup_click", { from: FROM })} className={ACTION}>
							Start tracking
						</a>
						<a
							href={demoUrl}
							target="_blank"
							rel={externalRel(demoUrl)}
							onClick={() => trackEvent("demo_open", { from: FROM })}
							className={ACTION_QUIET}
						>
							Try the live demo
						</a>
					</div>
					<p className={`${SMALL} mt-6 text-zinc-500`}>
						Tracker plans from ${CLOUD_ENTRY_PRICE_USD} a month. No contract, cancel any time.
					</p>
				</div>

				<div className="lg:col-span-6">
					<AnswerSheet
						engine={DEMO_ANSWER.engine}
						question={DEMO_ANSWER.question}
						lines={DEMO_ANSWER.lines}
						sources={DEMO_ANSWER.sources}
					/>
					<Mono className="mt-4">An answer from the live demo, kept in full with every source it cited.</Mono>
				</div>
			</Page>
		</section>
	);
}
