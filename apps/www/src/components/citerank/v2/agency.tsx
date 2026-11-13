import { Link } from "@tanstack/react-router";
import { trackEvent } from "@/lib/posthog";
import { ACTION, BODY, HEADING, MONO, Page, SECTION, SMALL } from "./kit";

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
		<section className={`${SECTION} bg-paper-2`}>
			<Page className="grid gap-12 lg:grid-cols-12 lg:gap-16">
				<div className="lg:col-span-5">
					<h2 className={`${HEADING} text-ink`}>We do the work for you</h2>
					<p className={`${BODY} mt-6 max-w-[42ch] text-zinc-600`}>
						The tracker ranks what to do next. Our agency does it every month and reports the AI answers before and
						after.
					</p>
					<Link
						to="/agency"
						onClick={() => trackEvent("agency_call_click", { from: "home" })}
						className={`${ACTION} mt-8`}
					>
						Book a call
					</Link>
				</div>
				<div className="lg:col-span-7">
					<p className={MONO}>What a month includes</p>
					<ul className="mt-4 border-t border-zinc-200">
						{WORK.map((item) => (
							<li key={item.text} className="flex gap-6 border-b border-zinc-200 py-4">
								<span className={`${MONO} w-24 shrink-0 pt-1`}>{item.tag}</span>
								<span className={`${BODY} text-ink`}>{item.text}</span>
							</li>
						))}
					</ul>
					<p className={`${SMALL} mt-4 text-zinc-500`}>Reported with the AI answers before and after.</p>
				</div>
			</Page>
		</section>
	);
}
