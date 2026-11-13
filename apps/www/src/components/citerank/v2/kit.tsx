/*
 * The v2 marketing design.
 *
 * One idea: CiteRank.com sells what AI says about a brand, so the page is built
 * from the thing itself — a typeset answer with the brands it names and the
 * sources it cites. That object opens the page and sets the type, the rules and
 * the one rust accent for everything under it.
 *
 * The page is a stack of panels on warm paper. Each panel is one chunk of the
 * argument with its own edge, so a reader can tell where one idea stops and the
 * next starts without a divider drawn between them. Inside a panel, content sits
 * in cards or capsules — one level deep, never a card inside a card inside a card.
 */
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/** One measure for the page. Panels carry their own padding, so this is the inner width. */
export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
	return <div className={`mx-auto w-full max-w-[1120px] ${className}`}>{children}</div>;
}

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

/*
 * Panels: the page's chunking. A panel is a section with an edge of its own,
 * laid on the paper background with a gap above and below it.
 */
const PANEL_BASE = "relative overflow-hidden rounded-[1.75rem] md:rounded-[2rem]";
export const PANEL = `${PANEL_BASE} bg-white ring-1 ring-zinc-200/70`;
export const PANEL_INK = `${PANEL_BASE} bg-ink`;
export const PANEL_PAD = "px-6 py-14 sm:px-10 sm:py-16 md:px-14 md:py-20";
export const PANEL_PAD_TIGHT = "px-6 py-10 sm:px-10 sm:py-12 md:px-14";

/** Rust light thrown across an ink panel, so the dark has somewhere to come from. */
export function InkGlow() {
	return (
		<span
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_78%_8%,rgba(184,77,37,0.22),transparent_62%)]"
		/>
	);
}

/*
 * Capsules: the recurring small shape. A label, a tag, a count — never a decorative
 * badge with nothing in it, and never tracked capitals.
 */
const PILL_BASE = "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium";
export const PILL_RUST = `${PILL_BASE} bg-rust/10 text-rust ring-1 ring-inset ring-rust/15`;
export const PILL_INK = `${PILL_BASE} bg-white/10 text-paper ring-1 ring-inset ring-white/15`;
export const PILL_QUIET = `${PILL_BASE} bg-paper-2 text-zinc-700 ring-1 ring-inset ring-zinc-200`;

/** One level of chunking inside a panel. */
export const CARD = "rounded-2xl bg-paper-2 p-6 sm:p-7";
export const CARD_INK = "rounded-2xl bg-white/5 p-6 ring-1 ring-inset ring-white/10 sm:p-7";

const BUTTON = `inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-[0.9375rem] font-medium transition-[background-color,color,box-shadow] duration-200 ${FOCUS}`;
export const ACTION = `${BUTTON} bg-rust text-white hover:bg-[#9c3f1e]`;
export const ACTION_QUIET = `${BUTTON} bg-transparent text-ink ring-1 ring-inset ring-zinc-300 hover:ring-zinc-500`;
export const ACTION_QUIET_ON_INK = `${BUTTON} bg-transparent text-paper ring-1 ring-inset ring-white/25 hover:ring-white/60`;
export const LINK = `rounded-sm underline decoration-zinc-300 underline-offset-[5px] transition-colors duration-200 hover:decoration-rust ${FOCUS}`;

/** The arrow on the action that moves a visitor forward. Decorative: the label already says it. */
export function Go() {
	return <ArrowRight aria-hidden="true" className="size-4 shrink-0" />;
}

/** A section heading with its capsule label above it. */
export function PanelHead({
	label,
	title,
	children,
	onInk = false,
	className = "",
}: {
	label: string;
	title: ReactNode;
	children?: ReactNode;
	onInk?: boolean;
	className?: string;
}) {
	return (
		<div className={className}>
			<p>
				<span className={onInk ? PILL_INK : PILL_RUST}>{label}</span>
			</p>
			<h2 className={`${HEADING} mt-6 ${onInk ? "text-paper" : "text-ink"}`}>{title}</h2>
			{children ? <div className="mt-5">{children}</div> : null}
		</div>
	);
}

/** A sheet of evidence: white paper, one hairline, no shadow stack. */
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
