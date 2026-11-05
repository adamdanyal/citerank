import { ArrowRight } from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

export const EASE_CLASS = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

const BUTTON = `inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 button-md transition-[background-color,color,transform] duration-300 ${EASE_CLASS} active:scale-[0.98] ${FOCUS}`;
export const PRIMARY_BUTTON = `${BUTTON} bg-blue-600 text-white hover:bg-blue-700`;
export const PRIMARY_BUTTON_LG = `inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 button-md bg-blue-600 text-white transition-[background-color,transform] duration-300 ${EASE_CLASS} hover:bg-blue-700 active:scale-[0.98] ${FOCUS}`;
export const SECONDARY_BUTTON = `${BUTTON} bg-white text-zinc-950 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50`;
export const SMALL_BUTTON_BASE = `h-8 items-center justify-center gap-1 whitespace-nowrap rounded-md px-3 button-sm transition-[background-color,color,transform] duration-300 ${EASE_CLASS} active:scale-[0.98] ${FOCUS}`;
export const SMALL_BUTTON = `inline-flex ${SMALL_BUTTON_BASE}`;
export const TEXT_LINK = `group inline-flex h-10 items-center gap-1 rounded-md px-1 button-md text-zinc-950 transition-colors duration-300 ${EASE_CLASS} hover:text-blue-700 ${FOCUS}`;
export const QUIET_LINK = `rounded-sm underline decoration-zinc-300 underline-offset-4 transition-colors duration-300 ${EASE_CLASS} hover:text-zinc-950 hover:decoration-zinc-500 ${FOCUS}`;

export function LinkArrow() {
	return (
		<ArrowRight
			className={`size-4 transition-transform duration-300 ${EASE_CLASS} group-hover:translate-x-0.5`}
			aria-hidden="true"
		/>
	);
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
	return <div className={`mx-auto max-w-6xl px-4 md:px-6 ${className}`}>{children}</div>;
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
