/*
 * The v2 marketing design: one idea, carried through every section.
 *
 * CiteRank.com sells what AI says about a brand, so the page is built from the
 * thing itself — a typeset answer with the brands it names and the sources it
 * cites. Every surface here is a sheet of that evidence. Nothing is a card for
 * the sake of being a card, no sheet sits inside another, and the rust is spent
 * only on the next step, the cited brand and one rule under the display line.
 *
 * The page opens and closes on ink and alternates white and paper between, so
 * the answer sheet reads as paper held against the dark rather than one more
 * pale panel on a pale page.
 */
import type { ReactNode } from "react";

/** One measure for the page: twelve columns at 1180, 24px gutters. */
export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
	return <div className={`mx-auto w-full max-w-[1180px] px-6 ${className}`}>{children}</div>;
}

export const SECTION = "py-20 md:py-28";

export const RULE = "border-zinc-200";

/** Four distant sizes, so the hierarchy reads at a glance and nothing lands between them. */
export const DISPLAY =
	"font-heading font-semibold tracking-[-0.04em] text-[2.75rem] leading-[1.02] sm:text-[3.5rem] lg:text-[4.25rem]";
export const HEADING =
	"font-heading font-semibold tracking-[-0.03em] text-[2rem] leading-[1.1] sm:text-[2.5rem] lg:text-[2.75rem]";
export const SUBHEAD = "font-heading font-semibold tracking-[-0.02em] text-[1.25rem] leading-[1.3]";
export const LEAD = "text-[1.125rem] leading-[1.7] sm:text-[1.25rem] sm:leading-[1.75]";
export const BODY = "text-[1.0625rem] leading-[1.65]";
export const SMALL = "text-[0.875rem] leading-[1.5]";
/** Mono carries the machine's voice: prompts, engine names, counts. Never tracked capitals. */
const MONO_BASE = "font-mono text-[0.8125rem] leading-[1.4]";
export const MONO = `${MONO_BASE} text-zinc-500`;
export const MONO_ON_INK = `${MONO_BASE} text-zinc-400`;

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

const BUTTON = `inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full px-6 text-[0.9375rem] font-medium transition-[background-color,color,box-shadow] duration-200 ${FOCUS}`;
export const ACTION = `${BUTTON} bg-rust text-white hover:bg-[#9c3f1e]`;
export const ACTION_QUIET = `${BUTTON} bg-transparent text-ink ring-1 ring-inset ring-zinc-300 hover:ring-zinc-500`;
export const ACTION_QUIET_ON_INK = `${BUTTON} bg-transparent text-paper ring-1 ring-inset ring-white/25 hover:ring-white/60`;
export const LINK = `rounded-sm underline decoration-zinc-300 underline-offset-[5px] transition-colors duration-200 hover:decoration-rust ${FOCUS}`;

/** A sheet of evidence: white paper, one hairline, no shadow stack, never nested. */
export const SHEET = "rounded-2xl bg-white ring-1 ring-zinc-200";

/**
 * The signature: an answer as a reader sees it, with the brands it named and the
 * sources it cited. Marks are data, not decoration — the cited brand is the
 * client's, the rest are whoever else got named.
 */
export interface AnswerLine {
	text: string;
	mark?: "brand" | "rival";
	cite?: number;
}

export function AnswerSheet({
	engine,
	question,
	lines,
	sources,
	size = "md",
	className = "",
}: {
	engine: string;
	question: string;
	lines: AnswerLine[];
	sources: string[];
	size?: "md" | "lg";
	className?: string;
}) {
	const large = size === "lg";
	const gutter = large ? "px-7 sm:px-9" : "px-6";
	return (
		<figure className={`${SHEET} overflow-hidden ${className}`}>
			<figcaption className={`flex items-baseline justify-between gap-4 border-b border-zinc-200 py-4 ${gutter}`}>
				<span className={MONO}>{engine}</span>
				<span className={`${MONO} truncate text-right`}>{question}</span>
			</figcaption>
			<div className={`${gutter} ${large ? "py-9" : "py-6"}`}>
				<p className={`${large ? LEAD : BODY} text-zinc-700`}>
					{lines.map((line) => (
						<span key={line.text} className={line.mark === "brand" ? "text-ink" : undefined}>
							{line.mark === "brand" ? (
								<strong className="font-semibold text-ink underline decoration-rust decoration-2 underline-offset-4">
									{line.text}
								</strong>
							) : line.mark === "rival" ? (
								<span className="text-zinc-500 underline decoration-zinc-300 underline-offset-4">{line.text}</span>
							) : (
								line.text
							)}
							{line.cite ? <sup className="ml-0.5 font-mono text-[0.6875rem] text-rust">{line.cite}</sup> : null}
						</span>
					))}
				</p>
			</div>
			<ul className={`flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-200 py-4 ${gutter}`}>
				{sources.map((source, index) => (
					<li key={source} className={MONO}>
						<span className="text-rust">{index + 1}</span> {source}
					</li>
				))}
			</ul>
		</figure>
	);
}
