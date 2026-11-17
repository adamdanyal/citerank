/*
 * The /v3 preview's class recipes. Colours come from the tokens in v3.css:
 * a warm paper ramp, the brand ink, and rust only for the primary action, a
 * selection, your brand's series, the hero's steps, the founders' quote marks
 * and the pen circle.
 */
import { Check } from "lucide-react";
import type { ReactNode } from "react";

export const WRAP = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-16";

export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
	return <div className={`${WRAP} ${className}`}>{children}</div>;
}

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--v3-rust)";
export const EASE = "ease-(--v3-ease)";

const SAFE_HEAD = "min-w-0 [overflow-wrap:break-word] text-balance";
const FACE = "font-(family-name:--v3-display) font-medium";
export const HERO_TITLE = `${FACE} text-[clamp(2.5rem,3.6vw+1.25rem,4.5rem)] leading-[1.16] tracking-[-0.03em] ${SAFE_HEAD}`;
export const CLOSING_TITLE = `${FACE} text-[clamp(2.25rem,2vw+1.5rem,3.5rem)] leading-[1.06] tracking-[-0.025em] ${SAFE_HEAD}`;
export const HEADING = `${FACE} text-[clamp(1.875rem,1.4vw+1.25rem,2.75rem)] leading-[1.1] tracking-[-0.02em] ${SAFE_HEAD}`;
export const TITLE = `${FACE} text-[1.25rem] leading-[1.3] ${SAFE_HEAD}`;
export const LEAD = "text-[1.125rem] leading-[1.6] text-pretty lg:text-[1.25rem] lg:leading-[1.5]";
export const BODY = "text-[1rem] leading-[1.6] text-pretty";
export const SMALL = "text-[0.875rem] leading-[1.45]";
export const MONO = "font-mono text-[0.8125rem] leading-[1.4] tabular-nums";

export const TEXT = "text-(--v3-text)";
export const TEXT_2 = "text-(--v3-text-2)";
export const TEXT_3 = "text-(--v3-text-3)";

/* Each section brings half the gap to the next: 64px on a phone, 96 on a tablet, 112 on a laptop. */
export const SECTION = "relative py-8 sm:py-12 lg:py-14";
export const HEAD_GAP = "mt-8 lg:mt-12";

export const CARD_SURFACE = "rounded-2xl bg-(--v3-card) shadow-(--v3-shadow-sm) ring-1";
export const CARD = `${CARD_SURFACE} ring-(--v3-line)`;
export const PANEL_INK = "rounded-[20px] bg-(--v3-ink) text-(--v3-on-ink)";

const BUTTON = `inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-5 text-[1rem] font-medium transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.98] motion-reduce:active:scale-100 ${EASE} ${FOCUS}`;
export const ACTION = `${BUTTON} bg-(--v3-rust) text-(--v3-card) hover:bg-(--v3-rust-deep)`;
export const ACTION_QUIET = `${BUTTON} bg-(--v3-raised) text-(--v3-text) ring-1 ring-inset ring-(--v3-line-strong) hover:bg-(--v3-card)`;
export const ACTION_QUIET_ON_INK = `${BUTTON} bg-(--v3-ink-raised) text-(--v3-on-ink) shadow-(--v3-highlight) ring-1 ring-inset ring-(--v3-ink-line-strong) hover:ring-(--v3-on-ink-3)`;

export const LINK = `rounded-[4px] underline decoration-dotted decoration-(--v3-text-3) underline-offset-[5px] transition-[color,text-decoration-color] duration-150 hover:decoration-(--v3-text) ${EASE} ${FOCUS}`;

/** A thing you get: a small muted check, no disc. */
export function CheckMark({ onInk = false, className = "" }: { onInk?: boolean; className?: string }) {
	return (
		<Check
			aria-hidden="true"
			strokeWidth={1.5}
			className={`size-[18px] shrink-0 ${onInk ? "text-(--v3-on-ink-3)" : TEXT_3} ${className}`}
		/>
	);
}

/** A step's number, quiet: the list already counts for a reader, so it is hidden from one. */
export function StepNumber({ step }: { step: number }) {
	return (
		<span
			aria-hidden="true"
			className={`grid size-7 shrink-0 place-items-center rounded-full font-mono text-[0.8125rem] leading-none ring-1 ring-inset ring-(--v3-line-strong) ${TEXT_2}`}
		>
			{step}
		</span>
	);
}

/** A section's head block: the head, and at most one line under it. */
export function SectionHead({
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
			<h2 className={`${HEADING} max-w-[22ch] ${onInk ? "text-(--v3-on-ink)" : TEXT}`}>{title}</h2>
			{children ? <div className="mt-4 max-w-[52ch]">{children}</div> : null}
		</div>
	);
}

/**
 * The signature: a rust pen circle drawn round your brand's name, as an editor
 * marks the one word that matters. Used on the name, and on "your brand" in the
 * hero's headline, where it sits tighter so it clears the line below.
 */
export function Pen({
	children,
	className = "",
	display = false,
}: {
	children: ReactNode;
	className?: string;
	display?: boolean;
}) {
	return (
		<span className={`relative inline-block ${display ? "mx-[0.14em]" : ""} ${className}`}>
			{children}
			<svg
				aria-hidden="true"
				viewBox="0 0 120 44"
				preserveAspectRatio="none"
				fill="none"
				className={`pointer-events-none absolute overflow-visible ${display ? "-top-[0.12em] -left-[0.34em] h-[calc(100%+0.4em)] w-[calc(100%+0.78em)]" : "-top-[0.35em] -left-[0.45em] h-[calc(100%+0.7em)] w-[calc(100%+0.9em)]"}`}
			>
				<path
					d="M30 5.5C58 1 100 2 113 11C124 19 112 35 88 40C62 45 22 44 9 34C-2 26 4 12 20 7.5C34 3.5 50 1.5 68 3"
					stroke="currentColor"
					strokeWidth={display ? 2.5 : 1.75}
					strokeLinecap="round"
					strokeLinejoin="round"
					vectorEffect="non-scaling-stroke"
					className="text-(--v3-rust)"
				/>
			</svg>
		</span>
	);
}
