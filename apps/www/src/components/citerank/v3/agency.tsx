import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AGENCY_DOES, AGENCY_DOES_FIRST, AGENCY_FROM_USD, formatUsd } from "@/lib/agency-plans";
import { trackEvent } from "@/lib/posthog";
import { ACTION, CheckMark, EASE, FOCUS, LEAD, PANEL_INK, Page, SECTION, SectionHead, SMALL } from "./kit";

const LINE = "flex items-center gap-3 border-t border-(--v3-ink-line) py-4 text-[1.125rem] leading-snug";

function Line({ children, className = "" }: { children: string; className?: string }) {
	return (
		<li className={`${LINE} text-(--v3-on-ink) ${className}`}>
			<CheckMark onInk />
			{children}
		</li>
	);
}

/* The agency in one look: everything it does, every line ticked, because we do it. How much of each is agreed on a call. */
export function Agency() {
	const more = AGENCY_DOES.filter((line) => !AGENCY_DOES_FIRST.includes(line));
	return (
		<section id="agency" className={SECTION}>
			<Page>
				<div
					className={`${PANEL_INK} grid grid-cols-[minmax(0,1fr)] gap-10 px-6 py-10 sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:p-16`}
				>
					<div className="min-w-0 lg:col-span-6">
						<SectionHead title="We can do the work for you" onInk>
							<p className={`${LEAD} text-(--v3-on-ink-2)`}>
								<span className="sm:block">The tracker ranks what to do next.</span>{" "}
								<span className="sm:block">You can do the work yourself, or</span>{" "}
								<span className="sm:block">our AI search agency can do it for you.</span>
							</p>
						</SectionHead>
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
						<p className={`${SMALL} mt-4 text-(--v3-on-ink-3)`}>
							<span className="inline-block">From {formatUsd(AGENCY_FROM_USD)} a month, scoped to your brand.</span>{" "}
							<span className="inline-block">The tracker is included.</span>
						</p>
					</div>

					<div className="min-w-0 lg:col-span-6">
						<ul aria-label="What the agency does">
							{AGENCY_DOES_FIRST.map((line) => (
								<Line key={line} className="first:border-t-0 first:pt-0">
									{line}
								</Line>
							))}
						</ul>
						{more.length ? (
							<details className="group">
								<summary
									className={`flex cursor-pointer list-none select-none items-center gap-3 border-t border-(--v3-ink-line) pt-4 text-[1.125rem] leading-snug text-(--v3-on-ink-2) transition-colors duration-150 group-open:hidden hover:text-(--v3-on-ink) [&::-webkit-details-marker]:hidden ${EASE} ${FOCUS}`}
								>
									<Plus aria-hidden="true" strokeWidth={1.5} className="size-[18px] shrink-0" />
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
