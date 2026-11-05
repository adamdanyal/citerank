import { Fragment, useEffect, useRef, useState } from "react";
import { Container } from "../ui";

// One thought per line, so the breaks land where the sentence breaks.
const LINES = ["Your buyers ask AI who to trust.", "See what it says about you,", "and how to change the answer."];

function words(text: string) {
	let at = 0;
	return text.split(" ").map((word) => {
		const entry = { word, at };
		at += word.length + 1;
		return entry;
	});
}

/*
 * Each word turns from muted to full colour as it crosses a line roughly two
 * thirds down the viewport, in reading order. The page is served with every
 * word at full colour; the muted state only exists once JavaScript has run.
 */
export function Tagline() {
	const ref = useRef<HTMLParagraphElement>(null);
	const [armed, setArmed] = useState(false);

	useEffect(() => {
		const root = ref.current;
		if (!root || !("IntersectionObserver" in window)) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		setArmed(true);
		const observer = new IntersectionObserver(
			(entries) => {
				let order = 0;
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const word = entry.target as HTMLElement;
					word.style.transitionDelay = `${order * 40}ms`;
					word.dataset.on = "";
					observer.unobserve(word);
					order += 1;
				}
			},
			{ rootMargin: "0px 0px -35% 0px" },
		);
		for (const word of root.querySelectorAll<HTMLElement>(".cr-word")) observer.observe(word);
		return () => observer.disconnect();
	}, []);

	return (
		<section className="bg-paper-2">
			<Container className="py-24">
				<p
					ref={ref}
					data-armed={armed ? "" : undefined}
					className="cr-tagline heading-2 mx-auto max-w-[48rem] text-center text-zinc-950"
				>
					{LINES.map((line, index) => (
						<Fragment key={line}>
							{index > 0 ? (
								<>
									{" "}
									<br className="max-sm:hidden" />
								</>
							) : null}
							{words(line).map(({ word, at }) => (
								<Fragment key={at}>
									{at > 0 ? " " : null}
									<span className="cr-word">{word}</span>
								</Fragment>
							))}
						</Fragment>
					))}
				</p>
			</Container>
		</section>
	);
}
