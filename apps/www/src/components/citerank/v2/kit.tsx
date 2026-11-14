/*
 * The marketing design system.
 *
 * Every section runs the full width of the window and parts from the next by
 * space, or by a change of paper: warm paper for most, tinted paper or ink for
 * a band. Nothing is boxed to show where an idea stops. Inside a section the
 * content sits in one container, 1312px wide at a 1440px window, and the
 * gutters are what grow past that.
 *
 * Type carries the hierarchy at five sizes (84, 52, 25, 21 and 16px at 1440),
 * so a head is never one step from the text under it. Labels are the body face,
 * a step smaller, in sentence case. Mono is kept for code and measured figures.
 */
import type { ReactNode } from "react";

export const WRAP = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16";

export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
	return <div className={`${WRAP} ${className}`}>{children}</div>;
}

/** Display heads must be able to break, or a long word pushes its grid track wide. */
const SAFE_HEAD = "[overflow-wrap:break-word] min-w-0 text-balance";

export const DISPLAY = `font-heading font-bold text-display leading-[1] tracking-[-0.02em] ${SAFE_HEAD}`;
export const DISPLAY_S = `font-heading font-bold text-display-s leading-[1.02] tracking-[-0.02em] ${SAFE_HEAD}`;
export const HEADING = `font-heading font-bold text-section leading-[1.04] tracking-[-0.02em] ${SAFE_HEAD}`;
export const SUBHEAD = `font-heading font-bold text-title leading-[1.2] tracking-[-0.01em] ${SAFE_HEAD}`;
export const LEAD = "text-lead leading-[1.45] text-pretty";
export const BODY = "text-[1rem] leading-[1.6] text-pretty";
export const SMALL = "text-[0.875rem] leading-[1.5]";
/** Mono is for what a machine wrote: code, a prompt, a measured figure. */
const MONO_BASE = "font-mono text-[0.8125rem] leading-[1.5]";
export const MONO = `${MONO_BASE} text-zinc-600`;
export const MONO_ON_INK = `${MONO_BASE} text-zinc-400`;

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

/*
 * A section's surface and its share of the gap to its neighbours. Two sections
 * on the same paper each bring half the gap, so the three paddings below make
 * gaps of 120, 144 and 176px at 1440. A band brings its own 120px either side.
 */
export const PANEL = "relative bg-paper";
export const PANEL_TINT = "relative bg-paper-2";
export const PANEL_INK = "relative bg-ink text-paper";
export const PANEL_PAD_TIGHT = "py-7 sm:py-10 lg:py-15";
export const PANEL_PAD = "py-9 sm:py-12 lg:py-18";
export const PANEL_PAD_WIDE = "py-12 sm:py-15 lg:py-22";
export const BAND_PAD = "py-14 sm:py-20 lg:py-30";

/** Kept so older sections still compile: a glow behind text is a wash, and the bands no longer carry one. */
export function InkGlow() {
	return null;
}

/* A capsule carries a fact of its own: a plan's name, the engine an answer came from. It never announces a heading. */
const PILL_BASE = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.875rem] font-medium";
export const PILL_RUST = `${PILL_BASE} bg-blue-100 text-blue-800`;
export const PILL_ACCENT = `${PILL_BASE} bg-rust text-paper`;
export const PILL_INK = `${PILL_BASE} bg-ink-well text-paper`;
export const PILL_QUIET = `${PILL_BASE} bg-paper-2 text-zinc-700`;

/** A white card lifted off the page: the surface for a picture, a list or a plan. Its padding is the caller's. */
export const CARD_LIFT = "rounded-card bg-white shadow-lift ring-1 ring-zinc-200";
/** The same card with its usual padding, for content of another kind than the text around it. */
export const CARD = `${CARD_LIFT} p-6 sm:p-8`;
/** A list on one lifted card: the rows keep their own hairlines, and the first gives its up to the card's edge. */
export const LIST_CARD = `${CARD_LIFT} px-6 sm:px-8 [&>li:first-child]:border-t-0`;
/** A link index on one lifted card, its rows running down columns. No selector finds the row that opens each column, so a strip of the card's white covers their hairlines. */
export const INDEX_CARD = `${CARD_LIFT} relative px-6 before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-white sm:px-8 sm:before:inset-x-8`;

const BUTTON = `inline-flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 text-[1rem] font-medium transition-colors duration-200 active:translate-y-px ${FOCUS}`;
const BUTTON_SM = `inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-200 active:translate-y-px ${FOCUS}`;
const FILLED = "bg-rust text-paper hover:bg-blue-700 active:bg-blue-800";
const OUTLINED = "bg-transparent text-ink ring-1 ring-inset ring-zinc-400 hover:ring-ink";
const OUTLINED_ON_INK = "bg-transparent text-paper ring-1 ring-inset ring-zinc-500 hover:ring-paper";
export const ACTION = `${BUTTON} ${FILLED}`;
export const ACTION_QUIET = `${BUTTON} ${OUTLINED}`;
export const ACTION_QUIET_ON_INK = `${BUTTON} ${OUTLINED_ON_INK}`;
export const ACTION_SM = `${BUTTON_SM} ${FILLED}`;
export const LINK = `rounded-sm underline decoration-dotted decoration-zinc-500 underline-offset-[5px] transition-colors duration-200 hover:text-rust hover:decoration-rust ${FOCUS}`;
export const LINK_ON_INK = `rounded-sm underline decoration-dotted decoration-zinc-400 underline-offset-[5px] transition-colors duration-200 hover:text-blue-300 hover:decoration-blue-300 ${FOCUS}`;

/** The mark beside a thing you get. It says nothing a reader needs, so it is hidden from one. */
export function Tick({ className = "size-7" }: { className?: string }) {
	return (
		<span
			aria-hidden="true"
			className={`grid shrink-0 place-items-center rounded-full bg-rust text-paper ${className}`}
		>
			<svg aria-hidden="true" viewBox="0 0 12 12" className="size-1/2">
				<path
					d="M2 6.5l2.5 2.5 5.5-6"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</span>
	);
}

/** The number of a step, on the disc that opens its head. The list already counts for a reader, so it is hidden from one. */
export function StepDisc({ step }: { step: number }) {
	return (
		<span
			aria-hidden="true"
			className="grid size-8 shrink-0 place-items-center rounded-full bg-rust font-sans text-[1rem] leading-none font-medium tracking-normal text-paper"
		>
			{step}
		</span>
	);
}

/** Things you get, a row each, on one lifted card: the name beside its tick, then the sentence that explains it. */
export function LiftedRows({
	items,
	ticked = true,
}: {
	items: { title: string; body: ReactNode }[];
	ticked?: boolean;
}) {
	return (
		<ul className={`${CARD_LIFT} px-6 sm:px-8`}>
			{items.map((item) => (
				<li
					key={item.title}
					className="grid gap-x-8 gap-y-2 border-t border-zinc-200 py-6 first:border-t-0 lg:grid-cols-12 lg:items-center"
				>
					<h3 className="flex items-start gap-4 font-sans text-lead leading-snug font-medium tracking-normal text-ink lg:col-span-5">
						{ticked ? <Tick className="size-7" /> : null}
						{item.title}
					</h3>
					<p className={`${BODY} text-zinc-600 lg:col-span-7 ${ticked ? "max-lg:pl-11" : ""}`}>{item.body}</p>
				</li>
			))}
		</ul>
	);
}

/** Steps in order, a row each, on one lifted card: the numbered disc opens the head, then the sentence. `stacked` keeps the sentence under the head where the card is narrow. */
export function StepRows({
	steps,
	stacked = false,
	className = "",
}: {
	steps: { title: string; body: ReactNode }[];
	stacked?: boolean;
	className?: string;
}) {
	return (
		<ol className={`${LIST_CARD} ${className}`}>
			{steps.map((step, index) => (
				<li
					key={step.title}
					className={`grid gap-x-8 gap-y-2 border-t border-zinc-200 py-6 ${stacked ? "" : "lg:grid-cols-12 lg:items-start"}`}
				>
					<h3 className={`${SUBHEAD} flex items-start gap-3 text-ink ${stacked ? "" : "lg:col-span-5"}`}>
						<StepDisc step={index + 1} />
						{step.title}
					</h3>
					<p className={`${BODY} text-zinc-600 ${stacked ? "pl-11" : "max-w-[60ch] max-lg:pl-11 lg:col-span-7"}`}>
						{step.body}
					</p>
				</li>
			))}
		</ol>
	);
}

/** The same steps where each has room to stand alone: a lifted card each. The caller's `className` sets the columns. */
export function StepCards({
	steps,
	className = "",
}: {
	steps: { title: string; body: ReactNode }[];
	className?: string;
}) {
	return (
		<ol className={`grid grid-cols-[minmax(0,1fr)] gap-5 lg:gap-8 ${className}`}>
			{steps.map((step, index) => (
				<li key={step.title} className={CARD}>
					<h3 className={`${SUBHEAD} flex items-start gap-3 text-ink`}>
						<StepDisc step={index + 1} />
						{step.title}
					</h3>
					<p className={`${BODY} mt-3 text-zinc-600`}>{step.body}</p>
				</li>
			))}
		</ol>
	);
}

/** Places to go next, a lifted card each. The whole card is the link, and its title takes the accent on hover. The caller's `className` sets the columns. */
export function LinkCards({
	items,
	className = "",
}: {
	items: { href: string; title: ReactNode; body?: ReactNode }[];
	className?: string;
}) {
	return (
		<ul className={`grid grid-cols-[minmax(0,1fr)] gap-5 lg:gap-8 ${className}`}>
			{items.map((item) => (
				<li key={item.href} className="flex min-w-0">
					<a
						href={item.href}
						className={`${CARD} group block w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust`}
					>
						<h3 className={`${SUBHEAD} text-ink transition-colors duration-200 group-hover:text-rust`}>{item.title}</h3>
						{item.body ? <p className={`${BODY} mt-2 max-w-[52ch] text-zinc-600`}>{item.body}</p> : null}
					</a>
				</li>
			))}
		</ul>
	);
}

/** A section's head block: the head, and at most one line under it. */
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
			<h2 className={`${HEADING} max-w-[22ch] ${onInk ? "text-paper" : "text-ink"}`}>{title}</h2>
			{children ? <div className="mt-5 max-w-[52ch] text-lead">{children}</div> : null}
		</div>
	);
}

/** Rows parted by hairlines, never boxed: the title carries the weight and the line carries the detail. */
export function RuledRow({
	title,
	children,
	onInk = false,
}: {
	title: ReactNode;
	children: ReactNode;
	onInk?: boolean;
}) {
	return (
		<li
			className={`grid gap-2 border-t py-6 lg:grid-cols-12 lg:gap-8 lg:py-8 ${onInk ? "border-ink-rule" : "border-zinc-200"}`}
		>
			<h3 className={`${SUBHEAD} lg:col-span-5 ${onInk ? "text-paper" : "text-ink"}`}>{title}</h3>
			<div className={`${BODY} max-w-[60ch] lg:col-span-7 ${onInk ? "text-zinc-300" : "text-zinc-600"}`}>
				{children}
			</div>
		</li>
	);
}

/** A sheet of evidence: paper and one hairline. */
export const SHEET = "rounded-card bg-paper ring-1 ring-zinc-200";

/**
 * An answer as a reader sees it, with the brands it named and the sources it
 * cited. Marks are data, not decoration: the cited brand is the client's, the
 * rest are whoever else got named.
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
				<span className={`${SMALL} shrink-0 font-medium text-ink`}>{engine}</span>
				{/* min-w-0 or the nowrap question sets this sheet's minimum width and pushes the grid track wide. */}
				<span className={`${MONO} min-w-0 truncate text-right`}>{question}</span>
			</figcaption>
			<div className={`${gutter} ${large ? "py-9" : "py-6"}`}>
				<p className={`${large ? LEAD : BODY} text-zinc-700`}>
					{lines.map((line) => (
						<span key={line.text} className={line.mark === "brand" ? "text-ink" : undefined}>
							{line.mark === "brand" ? (
								<strong className="font-medium text-ink underline decoration-rust decoration-2 underline-offset-4">
									{line.text}
								</strong>
							) : line.mark === "rival" ? (
								<span className="text-zinc-600 underline decoration-zinc-300 underline-offset-4">{line.text}</span>
							) : (
								line.text
							)}
							{line.cite ? <sup className="ml-0.5 font-mono text-[0.75rem] text-blue-800">{line.cite}</sup> : null}
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
