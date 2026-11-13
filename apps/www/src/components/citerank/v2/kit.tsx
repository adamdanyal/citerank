/*
 * The v2 marketing design.
 *
 * One idea: CiteRank.com sells what AI says about a brand, so the page is built
 * from the thing itself: a typeset answer with the brands it names and the
 * sources it cites. That object opens the page and sets the type, the rules and
 * the one rust accent for everything under it.
 *
 * The page is a stack of panels on warm paper. Each panel is one chunk of the
 * argument with its own edge, so a reader can tell where one idea stops and the
 * next starts without a divider drawn between them.
 *
 * Panels carry a surface and a radius but no outline, so the only outlined
 * things on the page are the cards inside them. That keeps every card exactly
 * one level deep. Labels carry their own content, never announce the heading
 * underneath them, and the colours and faces all come from the site's tokens.
 */
import type { ReactNode } from "react";

/** One measure for the page. Panels carry their own padding, so this is the inner width. */
export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
	return <div className={`mx-auto w-full max-w-[1200px] ${className}`}>{children}</div>;
}

/** Display heads must be able to break, or a long word pushes its grid track wide. */
const SAFE_HEAD = "[overflow-wrap:break-word] min-w-0";

/** Four distant sizes, so the hierarchy reads at a glance and nothing lands between them. */
export const DISPLAY = `font-heading font-semibold tracking-[-0.04em] text-[2.75rem] leading-[1.02] sm:text-[3.5rem] lg:text-[4.25rem] ${SAFE_HEAD}`;
export const HEADING = `font-heading font-semibold tracking-[-0.03em] text-[2rem] leading-[1.1] sm:text-[2.5rem] lg:text-[2.75rem] ${SAFE_HEAD}`;
export const SUBHEAD = `font-heading font-semibold tracking-[-0.02em] text-[1.25rem] leading-[1.3] ${SAFE_HEAD}`;
export const LEAD = "text-[1.125rem] leading-[1.7] sm:text-[1.25rem] sm:leading-[1.75]";
export const BODY = "text-[1.0625rem] leading-[1.65]";
export const SMALL = "text-[0.9375rem] leading-[1.5]";
/** Mono is the machine's voice: an engine's name, a prompt, a cited source. Never a decorative label. */
const MONO_BASE = "font-mono text-[0.8125rem] leading-[1.4]";
export const MONO = `${MONO_BASE} text-zinc-500`;
export const MONO_ON_INK = `${MONO_BASE} text-zinc-400`;

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

/*
 * Panels: the page's chunking. A surface and a radius, and deliberately no ring,
 * so the cards inside a panel are the only outlined boxes on the page.
 */
const PANEL_BASE = "relative overflow-hidden rounded-[1.75rem] md:rounded-[2rem]";
export const PANEL = `${PANEL_BASE} bg-paper`;
export const PANEL_INK = `${PANEL_BASE} bg-ink`;
export const PANEL_PAD = "px-6 py-16 sm:px-10 sm:py-20 md:px-14 md:py-24";
export const PANEL_PAD_WIDE = "px-6 py-20 sm:px-10 sm:py-28 md:px-14 md:py-32";
export const PANEL_PAD_TIGHT = "px-6 py-10 sm:px-10 sm:py-12 md:px-14";

/** One fixed, unanimated bloom, kept small enough to be light on a wall rather than a wash behind the text. */
export function InkGlow() {
	return (
		<span
			aria-hidden="true"
			className="pointer-events-none absolute top-0 right-0 hidden size-[28%] bg-[radial-gradient(circle_at_70%_30%,var(--color-rust),transparent_70%)] opacity-25 lg:block"
		/>
	);
}

/*
 * Capsules carry their own content: a fact, a tag, the engine an answer came
 * from. None of them sits above a heading to announce it.
 */
const PILL_BASE = "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.875rem] font-medium";
export const PILL_RUST = `${PILL_BASE} bg-rust/10 text-blue-800`;
/** The rust tint goes muddy on ink, so a capsule that has to carry the accent there is filled instead. */
export const PILL_ACCENT = `${PILL_BASE} bg-rust text-paper`;
export const PILL_INK = `${PILL_BASE} bg-white/10 text-paper`;
export const PILL_QUIET = `${PILL_BASE} bg-paper-2 text-zinc-700`;

/** One level of chunking inside a panel, and the only outlined box on the page. */
export const CARD = "rounded-2xl bg-paper-2 p-6 ring-1 ring-zinc-200 sm:p-7";
export const CARD_INK = "rounded-2xl bg-white/5 p-6 ring-1 ring-inset ring-white/10 sm:p-7";

const BUTTON = `inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full px-6 text-[0.9375rem] font-medium transition-colors duration-200 ${FOCUS}`;
export const ACTION = `${BUTTON} bg-rust text-paper hover:bg-blue-700`;
export const ACTION_QUIET = `${BUTTON} bg-transparent text-ink ring-1 ring-inset ring-zinc-300 hover:ring-zinc-500`;
export const ACTION_QUIET_ON_INK = `${BUTTON} bg-transparent text-paper ring-1 ring-inset ring-white/25 hover:ring-white/60`;
export const LINK = `rounded-sm underline decoration-zinc-300 underline-offset-[5px] transition-colors duration-200 hover:decoration-rust ${FOCUS}`;

/** A section's heading and its opening line. The heading stands on its own, with nothing above it. */
export function PanelHead({
	title,
	children,
	onInk = false,
	className = "",
}: {
	title: ReactNode;
	children?: ReactNode;
	onInk?: boolean;
	className?: string;
}) {
	return (
		<div className={className}>
			<h2 className={`${HEADING} ${onInk ? "text-paper" : "text-ink"}`}>{title}</h2>
			{children ? <div className="mt-6">{children}</div> : null}
		</div>
	);
}

/** A sheet of evidence: paper, one hairline, no shadow stack. */
export const SHEET = "rounded-2xl bg-paper ring-1 ring-zinc-200";

/**
 * The signature: an answer as a reader sees it, with the brands it named and the
 * sources it cited. Marks are data, not decoration: the cited brand is the
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
				<span className={`${MONO} shrink-0`}>{engine}</span>
				{/* min-w-0 or the nowrap question sets this sheet's minimum width and pushes the grid track wide. */}
				<span className={`${MONO} min-w-0 truncate text-right`}>{question}</span>
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
								<span className="text-zinc-600 underline decoration-zinc-300 underline-offset-4">{line.text}</span>
							) : (
								line.text
							)}
							{line.cite ? <sup className="ml-0.5 font-mono text-[0.6875rem] text-blue-800">{line.cite}</sup> : null}
						</span>
					))}
				</p>
			</div>
			<ul className={`flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-200 py-4 ${gutter}`}>
				{sources.map((source, index) => (
					<li key={source} className={MONO}>
						<span className="text-blue-800">{index + 1}</span> {source}
					</li>
				))}
			</ul>
		</figure>
	);
}
