import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AGENCY_PLANS, formatUsd } from "@/lib/agency-plans";
import { trackEvent } from "@/lib/posthog";
import { ACTION, BAND_PAD, BODY, FOCUS, LEAD, PANEL_INK, Page, PanelHead, SMALL } from "./kit";

/*
 * The six jobs, each beside how many of it a plan buys in a month. A plan
 * states its work as lines of text ("4 new pages a month"); `find` picks the
 * line for a job out of them, so the figures here are the plan's own.
 */
const JOBS = [
	{ find: "new page", does: "Writes the comparison, alternatives and guide pages your site is missing" },
	{ find: "page update", does: "Updates pages AI has stopped citing" },
	{ find: "pitch", does: "Gets you onto the review sites and best-of lists AI cites" },
	{ find: "guest article", does: "Publishes guest articles on high-authority sites AI already cites" },
	{ find: "forum answer", does: "Answers buyers’ questions in forums and communities" },
	{ find: "rawler fix", does: "Fixes anything that stops AI crawlers reading your site" },
];
const COUNTED = /^(\d+) (.+?)(?: a month)?$/;

/* What a plan with no line for a job is shown as having none of, in the widest plan's words for it. */
const WIDEST = AGENCY_PLANS[AGENCY_PLANS.length - 1];
const nameOf = (find: string) =>
	(WIDEST.includes.find((line) => line.includes(find)) ?? "").replace(/^\d+ /, "").replace(/ a month$/, "");

function Tick({ small = false }: { small?: boolean }) {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 20 20"
			className={small ? "size-4 shrink-0 text-zinc-400" : "size-7 text-paper"}
		>
			<path
				d="M4 10.5l4 4 8-9"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

/*
 * The agency as a month of work in figures, not a list of services: pick a
 * plan and the month changes. The figures and the prices are the agency page's.
 */
export function Agency() {
	const [name, setName] = useState((AGENCY_PLANS.find((plan) => plan.recommended) ?? AGENCY_PLANS[0]).name);
	const plan = AGENCY_PLANS.find((item) => item.name === name) ?? AGENCY_PLANS[0];
	const rows = JOBS.map((job) => {
		const line = plan.includes.find((item) => item.includes(job.find));
		const counted = line ? COUNTED.exec(line) : null;
		return {
			...job,
			count: counted ? counted[1] : line ? null : "0",
			what: counted ? counted[2] : (line ?? nameOf(job.find)),
			none: !line,
		};
	});
	const rest = plan.includes.filter((line) => !JOBS.some((job) => line.includes(job.find)));

	return (
		<section id="agency" className={`${PANEL_INK} ${BAND_PAD}`}>
			<Page className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12 lg:gap-8">
				<div className="min-w-0 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
					<PanelHead title="We do the work for you" onInk>
						<p className={`${LEAD} text-zinc-300`}>
							The tracker ranks what to do next. Our agency does it every month and reports the AI answers before and
							after.
						</p>
					</PanelHead>
					<p className="mt-8">
						<Link to="/agency" onClick={() => trackEvent("agency_call_click", { from: "home" })} className={ACTION}>
							Book a call
						</Link>
					</p>
					<p className={`${SMALL} mt-4 text-zinc-400`}>
						<span className="inline-block">Plans from {formatUsd(AGENCY_PLANS[0].monthlyPriceUsd)} a month.</span>{" "}
						<span className="inline-block">The tracker is included.</span>
					</p>
				</div>

				<div className="min-w-0 lg:col-span-7">
					<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
						<fieldset className="inline-flex w-fit max-w-full min-w-0 rounded-full bg-ink-well p-1">
							<legend className="sr-only">Agency plan</legend>
							{AGENCY_PLANS.map((item) => (
								<button
									key={item.name}
									type="button"
									aria-pressed={item.name === plan.name}
									onClick={() => setName(item.name)}
									className={`h-11 rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-200 sm:px-5 ${FOCUS} ${
										item.name === plan.name ? "bg-paper text-ink" : "text-zinc-300 hover:text-paper"
									}`}
								>
									{item.name}
								</button>
							))}
						</fieldset>
						<p aria-live="polite">
							<span className="font-heading text-title leading-none font-bold text-paper">
								{formatUsd(plan.monthlyPriceUsd)}
							</span>{" "}
							<span className={`${SMALL} text-zinc-400`}>a month</span>
						</p>
					</div>

					<ul className="mt-8">
						{rows.map((row) => (
							<li
								key={row.find}
								className={`grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-5 border-t border-ink-rule py-5 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-x-6 ${row.none ? "text-zinc-500" : "text-paper"}`}
							>
								<span className="font-heading text-[clamp(2.25rem,2vw+1.5rem,3.25rem)] leading-none font-bold tracking-[-0.03em] tabular-nums">
									{row.count ?? <Tick />}
								</span>
								<span>
									<span className="block text-lead leading-snug font-medium first-letter:uppercase">{row.what}</span>
									<span className={`${BODY} mt-1 block ${row.none ? "text-zinc-500" : "text-zinc-400"}`}>
										{row.does}
									</span>
								</span>
							</li>
						))}
					</ul>

					<ul className="flex flex-wrap gap-x-8 gap-y-2 border-t border-ink-rule pt-6 text-[0.9375rem] leading-normal text-zinc-300">
						{rest.map((line) => (
							<li key={line} className="flex items-center gap-2">
								<Tick small />
								{line}
							</li>
						))}
					</ul>
				</div>
			</Page>
		</section>
	);
}
