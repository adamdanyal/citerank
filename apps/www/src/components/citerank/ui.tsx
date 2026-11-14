import { ArrowRight } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { WRAP } from "./v2/kit";

export const EASE_CLASS = "ease-out";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

/* The older recipe names, kept for the components that still use them, on the kit's sizes and colours. */
const BUTTON = `inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-[0.9375rem] font-medium transition-colors duration-200 active:translate-y-px ${FOCUS}`;
const BUTTON_LG = `inline-flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-full px-7 text-[1rem] font-medium transition-colors duration-200 active:translate-y-px ${FOCUS}`;
const FILLED = "bg-rust text-paper hover:bg-blue-700 active:bg-blue-800";
const OUTLINED = "bg-transparent text-ink ring-1 ring-inset ring-zinc-400 hover:ring-ink";
export const PRIMARY_BUTTON = `${BUTTON} ${FILLED}`;
export const PRIMARY_BUTTON_LG = `${BUTTON_LG} ${FILLED}`;
export const SECONDARY_BUTTON_LG = `${BUTTON_LG} ${OUTLINED}`;
export const SECONDARY_BUTTON = `${BUTTON} ${OUTLINED}`;
export const SMALL_BUTTON_BASE = `h-11 items-center justify-center gap-1 whitespace-nowrap rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-200 active:translate-y-px ${FOCUS}`;
export const SMALL_BUTTON = `inline-flex ${SMALL_BUTTON_BASE}`;
export const TEXT_LINK = `group inline-flex h-11 items-center gap-1 rounded-md px-1 text-[1rem] font-medium text-ink transition-colors duration-200 hover:text-blue-700 ${FOCUS}`;
export const QUIET_LINK = `rounded-sm underline decoration-zinc-400 underline-offset-[5px] transition-colors duration-200 hover:decoration-rust ${FOCUS}`;

export function LinkArrow() {
	return <ArrowRight className="size-4" aria-hidden="true" />;
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
	return <div className={`${WRAP} ${className}`}>{children}</div>;
}

export const CARD = "rounded-card bg-paper-2";
export const ICON_BOX = "inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-800";
/** A whole card as one link: its tint deepens on hover, rather than every card lifting the same way. */
export const LINK_CARD = `group flex h-full w-full flex-col p-6 ${CARD} transition-colors duration-200 hover:bg-paper-3 ${FOCUS}`;

export const WINDOW_FRAME = "rounded-card bg-paper ring-1 ring-zinc-200";

/** Kept so older sections still compile: a capture is shown as it is, with no drawn window bar over it. */
export function WindowBar() {
	return null;
}

type RevealState = "idle" | "hidden" | "shown";

/*
 * Sections below the fold rise and fade in once as they enter the viewport.
 * The server-rendered page is the final state, so crawlers, screenshots and
 * reduced-motion visitors never see the hidden state.
 */
export function useReveal<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const [state, setState] = useState<RevealState>("idle");

	useEffect(() => {
		const element = ref.current;
		if (!element || !("IntersectionObserver" in window)) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		if (element.getBoundingClientRect().top < window.innerHeight) return;
		setState("hidden");
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setState("shown");
				observer.disconnect();
			},
			{ rootMargin: "0px 0px -10% 0px" },
		);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return { ref, state };
}

function revealStyle(delay: number): CSSProperties | undefined {
	return delay ? { transitionDelay: `${delay}ms` } : undefined;
}

export function Reveal({
	className = "",
	delay = 0,
	children,
}: {
	className?: string;
	delay?: number;
	children: ReactNode;
}) {
	const { ref, state } = useReveal<HTMLDivElement>();
	return (
		<div ref={ref} data-state={state} style={revealStyle(delay)} className={`cr-reveal ${className}`}>
			{children}
		</div>
	);
}

export function RevealItem({
	className = "",
	delay = 0,
	children,
}: {
	className?: string;
	delay?: number;
	children: ReactNode;
}) {
	const { ref, state } = useReveal<HTMLLIElement>();
	return (
		<li ref={ref} data-state={state} style={revealStyle(delay)} className={`cr-reveal ${className}`}>
			{children}
		</li>
	);
}
