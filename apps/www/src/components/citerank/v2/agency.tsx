import { Link } from "@tanstack/react-router";
import { trackEvent } from "@/lib/posthog";
import { ACTION, BAND_PAD, BODY, LEAD, PANEL_INK, Page, PanelHead, SUBHEAD } from "./kit";

/* The same six jobs as before, grouped by the kind of work, so there are four things to read rather than six. */
const WORK = [
	{
		kind: "Content",
		jobs: [
			"Writes the comparison, alternatives and guide pages your site is missing",
			"Updates pages AI has stopped citing",
		],
	},
	{
		kind: "Outreach",
		jobs: [
			"Gets you onto the review sites and best-of lists AI cites",
			"Publishes guest articles on high-authority sites AI already cites",
		],
	},
	{ kind: "Community", jobs: ["Answers buyers’ questions in forums and communities"] },
	{ kind: "Technical", jobs: ["Fixes anything that stops AI crawlers reading your site"] },
];

export function Agency() {
	return (
		<section id="agency" className={`${PANEL_INK} ${BAND_PAD}`}>
			<Page>
				<div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
					<PanelHead title="We do the work for you" onInk className="lg:col-span-7">
						<p className={`${LEAD} text-zinc-300`}>
							The tracker ranks what to do next. Our agency does it every month and reports the AI answers before and
							after.
						</p>
					</PanelHead>
					<p className="lg:col-span-5 lg:justify-self-end">
						<Link to="/agency" onClick={() => trackEvent("agency_call_click", { from: "home" })} className={ACTION}>
							Book a call
						</Link>
					</p>
				</div>

				<ul className="mt-10 grid sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
					{WORK.map((group) => (
						<li
							key={group.kind}
							className="border-t border-ink-rule py-8 sm:pr-8 lg:border-t-0 lg:border-l lg:py-0 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
						>
							<h3 className={`${SUBHEAD} text-paper`}>{group.kind}</h3>
							<ul className="mt-4 space-y-3">
								{group.jobs.map((job) => (
									<li key={job} className={`${BODY} text-zinc-300`}>
										{job}
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</Page>
		</section>
	);
}
