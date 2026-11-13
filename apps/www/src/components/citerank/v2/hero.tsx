import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../home/product-demo";
import { INCLUDED } from "./included";
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
	PILL_INK,
} from "./kit";

const FROM = "marketing-hero";

/* What the money buys, named before the first click; the panel below gives each one its line. */
const PROOF = INCLUDED.map((item) => item.title);

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
		<section className={`${PANEL_INK} ${PANEL_PAD}`}>
			<InkGlow />
			<Page className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
				<div className="min-w-0 lg:col-span-6">
					<h1 className={`${DISPLAY} text-paper`}>Track your brand in AI search</h1>
					<p className={`${LEAD} mt-6 max-w-[42ch] text-zinc-400`}>
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
							className={ACTION_QUIET_ON_INK}
						>
							Try the live demo
						</a>
					</div>
					<ul className="mt-7 flex flex-wrap gap-2">
						{PROOF.map((fact) => (
							<li key={fact} className={PILL_INK}>
								{fact}
							</li>
						))}
						<li className={PILL_INK}>From ${CLOUD_ENTRY_PRICE_USD} a month</li>
					</ul>
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
