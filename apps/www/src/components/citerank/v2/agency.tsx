import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AGENCY_DOES, AGENCY_DOES_FIRST, AGENCY_FROM_USD, formatUsd } from "@/lib/agency-plans";
import { trackEvent } from "@/lib/posthog";
import { ACTION, FOCUS, LEAD, PANEL_PAD, Page, PanelHead, SMALL, Tick } from "./kit";

/* On a phone the type gives way before the line breaks: each divisor is the longest line's width in em. */
const HEAD_ONE_LINE = "max-sm:text-[length:calc((100vw_-_5rem)_/_13)] max-sm:whitespace-nowrap";
const LINES = "max-sm:text-[length:min(var(--text-lead),calc((100vw_-_5rem)_/_18.6))] max-sm:whitespace-nowrap";
const ONE_LINE = "whitespace-nowrap max-sm:text-[length:min(var(--text-lead),calc((100vw_-_7.75rem)_/_14.4))]";
const LINE = `flex items-center gap-4 border-t border-ink-rule py-4 text-lead leading-snug text-paper ${ONE_LINE}`;

function Line({ children, className = "" }: { children: string; className?: string }) {
	return (
		<li className={`${LINE} ${className}`}>
			<Tick tone="quietOnInk" className="size-7" />
			{children}
		</li>
	);
}

/*
 * The agency in one look: everything it does, every line ticked, because we
 * do it. How much of each is agreed on a call, so the panel gives no amounts.
 */
export function Agency({ folded = false }: { folded?: boolean } = {}) {
	const first = folded ? AGENCY_DOES_FIRST : AGENCY_DOES;
	const more = AGENCY_DOES.filter((line) => !first.includes(line));
	return (
		<section id="agency" className={`relative bg-white ${PANEL_PAD}`}>
			<Page>
				<div className="grid grid-cols-[minmax(0,1fr)] gap-10 rounded-[1.5rem] bg-ink px-6 py-10 text-paper sm:px-10 sm:py-12 lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:p-16">
					<div className="min-w-0 lg:col-span-6">
						<PanelHead title={<span className={HEAD_ONE_LINE}>We can do the work for you</span>} onInk>
							<p className={`${LEAD} ${LINES} text-zinc-300`}>
								<span className="block">The tracker ranks what to do next.</span>{" "}
								<span className="block">You can do the work yourself, or</span>{" "}
								<span className="block">our AI search agency can do it for you.</span>
							</p>
						</PanelHead>
						<p className="mt-8">
							<Link
								to="/agency"
								search={{ book: true }}
								onClick={() => trackEvent("agency_call_click", { from: "home" })}
								className={ACTION}
							>
								Book a call
							</Link>
						</p>
						<p className={`${SMALL} mt-4 text-zinc-400`}>
							<span className="inline-block">From {formatUsd(AGENCY_FROM_USD)} a month, scoped to your brand.</span>{" "}
							<span className="inline-block">The tracker is included.</span>
						</p>
					</div>

					<div className="min-w-0 lg:col-span-6">
						<ul aria-label="What the agency does">
							{first.map((line) => (
								<Line key={line} className={`first:border-t-0 first:pt-0 ${more.length ? "" : "last:pb-0"}`}>
									{line}
								</Line>
							))}
						</ul>
						{more.length ? (
							<details className="group">
								<summary
									className={`flex cursor-pointer list-none items-center gap-4 border-t border-ink-rule pt-4 text-lead leading-snug text-zinc-300 transition-colors duration-200 hover:text-paper group-open:hidden [&::-webkit-details-marker]:hidden ${FOCUS}`}
								>
									<span
										aria-hidden="true"
										className="grid size-7 shrink-0 place-items-center rounded-full ring-1 ring-current ring-inset"
									>
										<Plus className="size-4" />
									</span>
									Show {more.length} more
								</summary>
								<ul aria-label="More of what the agency does">
									{more.map((line) => (
										<Line key={line} className="last:pb-0">
											{line}
										</Line>
									))}
								</ul>
							</details>
						) : null}
					</div>
				</div>
			</Page>
		</section>
	);
}
