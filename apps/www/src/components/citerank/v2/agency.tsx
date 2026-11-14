import { Link } from "@tanstack/react-router";
import { AGENCY_PLANS, AGENCY_WORK, formatUsd } from "@/lib/agency-plans";
import { trackEvent } from "@/lib/posthog";
import { ACTION, LEAD, LINK_ON_INK, PANEL_PAD, Page, PanelHead, SMALL, Tick } from "./kit";

/* Every kind of work the agency does, then the report that shows it worked. What each plan buys of them is on the agency page. */
const WORK = [...AGENCY_WORK.map((work) => work.name), "Before-and-after report"];

/* On a phone the type gives way before the line breaks: each divisor is the longest line's width in em. */
const HEAD_ONE_LINE = "max-sm:text-[length:calc((100vw_-_5rem)_/_13)] max-sm:whitespace-nowrap";
const TWO_LINES = "max-sm:text-[length:min(var(--text-lead),calc((100vw_-_5rem)_/_16.5))]";
const ONE_LINE = "whitespace-nowrap max-sm:text-[length:min(var(--text-lead),calc((100vw_-_7.75rem)_/_13.2))]";

/*
 * The agency in one look: everything it does, every line ticked, because we
 * do it. The plans and what each buys are one click away on the agency page.
 */
export function Agency() {
	return (
		<section id="agency" className={`relative bg-white ${PANEL_PAD}`}>
			<Page>
				<div className="grid grid-cols-[minmax(0,1fr)] gap-10 rounded-[1.5rem] bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12 lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:p-16">
					<div className="min-w-0 lg:col-span-6">
						<PanelHead title={<span className={HEAD_ONE_LINE}>We can do the work for you</span>} onInk>
							<p className={`${LEAD} ${TWO_LINES} text-zinc-300`}>
								<span className="block">The tracker ranks what to do next.</span>{" "}
								<span className="block">Our agency does it every month.</span>
							</p>
						</PanelHead>
						<p className="mt-8">
							<Link to="/agency" onClick={() => trackEvent("agency_call_click", { from: "home" })} className={ACTION}>
								Book a call
							</Link>
						</p>
						<p className={`${SMALL} mt-4 text-zinc-400`}>
							<span className="inline-block">Plans from {formatUsd(AGENCY_PLANS[0].monthlyPriceUsd)} a month.</span>{" "}
							<span className="inline-block">The tracker is included.</span>{" "}
							<Link to="/agency" hash="plans" className={`${LINK_ON_INK} inline-block text-zinc-300`}>
								See what each plan includes
							</Link>
						</p>
					</div>

					<ul aria-label="What the agency does" className="min-w-0 lg:col-span-6">
						{WORK.map((line) => (
							<li
								key={line}
								className={`flex items-center gap-4 border-t border-ink-rule py-4 text-lead leading-snug text-paper first:border-t-0 first:pt-0 last:pb-0 ${ONE_LINE}`}
							>
								<Tick className="size-7" />
								{line}
							</li>
						))}
					</ul>
				</div>
			</Page>
		</section>
	);
}
