import { useEffect, useRef, useState } from "react";
import { Container, EASE_CLASS, Reveal } from "../ui";

const STEPS = [
	{
		title: "Add Your Brand",
		body: "Point CiteRank.com at your site. It suggests the prompts your buyers ask and the competitors to track against.",
		src: "/screenshots/prompt-settings.png",
		alt: "CiteRank.com prompts settings listing the buyer prompts tracked for a demo brand, each tagged by topic",
	},
	{
		title: "See Where You Stand",
		body: "Visibility, share of voice, and the sources AI cites, sampled up to 4× daily from the real apps.",
		src: "/screenshots/visibility.png",
		alt: "CiteRank.com visibility page showing per-prompt visibility over time against competitors",
	},
	{
		title: "Know What to Fix",
		body: "Opportunities ranked by impact. CiteRank.com keeps you updated, so you always know what to do next.",
		src: "/screenshots/opportunities.png",
		alt: "CiteRank.com opportunities page with prioritized recommendations for content and sources",
	},
];

const STEP_MS = 4000;

/** One screenshot at a time: the steps advance on their own while in view, and stop once the visitor picks one. */
export function HowItWorks() {
	const [active, setActive] = useState(0);
	const [auto, setAuto] = useState(true);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		let visible = false;
		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
		});
		if (ref.current) observer.observe(ref.current);
		const timer = setInterval(() => {
			if (visible) setActive((index) => (index + 1) % STEPS.length);
		}, STEP_MS);
		return () => {
			clearInterval(timer);
			observer.disconnect();
		};
	}, [auto]);

	const pick = (index: number) => {
		setAuto(false);
		setActive(index);
	};

	return (
		<section className="cr-grain relative overflow-hidden bg-paper-2">
			<Container className="relative py-20 lg:py-24">
				<Reveal className="max-w-3xl">
					<h2 className="heading-2 text-zinc-950">From Zero to a Plan in One Afternoon</h2>
					<p className="body-7 mt-6 max-w-[60ch] text-zinc-600">
						No sales call, no bloat. CiteRank.com sets up your tracking and tells you what to change.
					</p>
				</Reveal>
				<div ref={ref} className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-16">
					<ol className="space-y-2 lg:col-span-5">
						{STEPS.map((step, index) => {
							const current = index === active;
							return (
								<li key={step.title}>
									<button
										type="button"
										onClick={() => pick(index)}
										aria-pressed={current}
										className={`flex w-full gap-5 rounded-xl p-5 text-left transition-colors duration-300 ${EASE_CLASS} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
											current ? "bg-white shadow-[0_1px_2px_rgb(26_25_23/0.05)]" : "hover:bg-white/60"
										}`}
									>
										<span
											className={`caption-1 mt-1 font-mono tabular-nums ${current ? "text-blue-700" : "text-zinc-400"}`}
										>
											0{index + 1}
										</span>
										<span className="min-w-0">
											<span className={`title-1 block ${current ? "text-zinc-950" : "text-zinc-600"}`}>
												{step.title}
											</span>
											<span className={`body-6 mt-1 block ${current ? "text-zinc-600" : "text-zinc-500"}`}>
												{step.body}
											</span>
										</span>
									</button>
								</li>
							);
						})}
					</ol>
					<div className="lg:col-span-7">
						<div className="rounded-2xl bg-white p-2 shadow-[0_1px_2px_rgb(26_25_23/0.05),0_32px_64px_-32px_rgb(26_25_23/0.3)] lg:w-[120%]">
							<div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-paper-2">
								{STEPS.map((step, index) => (
									<img
										key={step.src}
										src={step.src}
										alt={step.alt}
										width={3000}
										height={1800}
										loading="lazy"
										decoding="async"
										aria-hidden={index !== active}
										className={`absolute left-[-29.75%] top-[-1.5%] w-[170%] max-w-none transition-opacity duration-500 ${EASE_CLASS}`}
										style={{ opacity: index === active ? 1 : 0 }}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
