import { Link } from "@tanstack/react-router";
import { trackEvent } from "@/lib/posthog";
import { ACTION, BODY, CARD_INK, Go, InkGlow, LEAD, PANEL_INK, PANEL_PAD, Page, PanelHead, PILL_INK } from "./kit";

const WORK = [
	{ tag: "Content", text: "Writes the comparison, alternatives and guide pages your site is missing" },
	{ tag: "Content", text: "Updates pages AI has stopped citing" },
	{ tag: "Outreach", text: "Gets you onto the review sites and best-of lists AI cites" },
	{ tag: "Community", text: "Answers buyers' questions in forums and communities" },
	{ tag: "Outreach", text: "Publishes guest articles on high-authority sites AI already cites" },
	{ tag: "Technical", text: "Fixes anything that stops AI crawlers reading your site" },
];

export function Agency() {
	return (
		<section className={`${PANEL_INK} ${PANEL_PAD}`}>
			<InkGlow />
			<Page className="relative">
				<div className="flex flex-wrap items-end justify-between gap-8">
					<PanelHead label="Agency" title="We do the work for you" onInk>
						<p className={`${LEAD} max-w-[44ch] text-zinc-400`}>
							The tracker ranks what to do next. Our agency does it every month and reports the AI answers before and
							after.
						</p>
					</PanelHead>
					<Link to="/agency" onClick={() => trackEvent("agency_call_click", { from: "home" })} className={ACTION}>
						Book a call
						<Go />
					</Link>
				</div>

				<ul className="mt-12 grid gap-4 md:grid-cols-2">
					{WORK.map((item) => (
						<li key={item.text} className={CARD_INK}>
							<p>
								<span className={PILL_INK}>{item.tag}</span>
							</p>
							<p className={`${BODY} mt-4 text-zinc-300`}>{item.text}</p>
						</li>
					))}
				</ul>
			</Page>
		</section>
	);
}
