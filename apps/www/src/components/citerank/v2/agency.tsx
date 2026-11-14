import { Link } from "@tanstack/react-router";
import { AGENCY_PLANS, formatUsd } from "@/lib/agency-plans";
import { trackEvent } from "@/lib/posthog";
import { ACTION, LEAD, PANEL_PAD, Page, PanelHead, SMALL, SUBHEAD, Tick } from "./kit";

/*
 * The plan the "from" price buys, and its work a line a job. "A month" is in
 * the price over the list, and the small print is on the agency page, so each
 * job fits one line on a phone. The tracker and the brand count are said beside the button.
 */
const ENTRY = AGENCY_PLANS[0];
const WORK = ENTRY.includes
	.filter((line) => !/tracker plan|brand/.test(line))
	.map((line) => line.replace(/ a month$| in the first month, then as found$|^Monthly /, ""))
	.map((line) => line.charAt(0).toUpperCase() + line.slice(1));

/* On a phone the type gives way before the line breaks: the divisor is the longest line's width in em. */
const TWO_LINES = "max-sm:text-[length:min(var(--text-lead),calc((100vw_-_5rem)_/_16.5))]";
const ONE_LINE = "whitespace-nowrap max-sm:text-[length:min(var(--text-lead),calc((100vw_-_7.75rem)_/_13.8))]";

/*
 * The agency in one look: a month of work, every line ticked, because we do
 * it. It shows the plan the "from" price buys, so the list and the price agree,
 * and the other two plans are one click away on the agency page.
 */
export function Agency() {
	return (
		<section id="agency" className={`relative bg-white ${PANEL_PAD}`}>
			<Page>
				<div className="grid grid-cols-[minmax(0,1fr)] gap-10 rounded-[1.5rem] bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12 lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:p-16">
					<div className="min-w-0 lg:col-span-6">
						<PanelHead title="We do the work for you" onInk>
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
							<span className="inline-block">Plans from {formatUsd(ENTRY.monthlyPriceUsd)} a month.</span>{" "}
							<span className="inline-block">The tracker is included.</span>
						</p>
					</div>

					<div className="min-w-0 lg:col-span-6">
						<h3 className={`${SUBHEAD} flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-paper`}>
							{ENTRY.name}
							<span className="font-sans text-[1rem] leading-normal font-normal tracking-normal text-zinc-300">
								{formatUsd(ENTRY.monthlyPriceUsd)} a month
							</span>
						</h3>
						<ul className="mt-5">
							{WORK.map((line) => (
								<li
									key={line}
									className={`flex items-center gap-4 border-t border-ink-rule py-4 text-lead leading-snug text-paper last:pb-0 ${ONE_LINE}`}
								>
									<Tick className="size-7" />
									{line}
								</li>
							))}
						</ul>
					</div>
				</div>
			</Page>
		</section>
	);
}
