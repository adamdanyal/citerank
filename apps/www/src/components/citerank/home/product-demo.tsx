import { demoSiteUrl } from "@workspace/config/referrals";
import {
	ArrowUpRight,
	ChartPie,
	Eye,
	GitFork,
	LayoutDashboard,
	Lightbulb,
	Link2,
	type LucideIcon,
	MessageSquare,
	Smile,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { EASE_CLASS, WINDOW_FRAME, WindowBar } from "../ui";

export const DEMO_BRAND_PATH = "/app/org/quaildesk/brand/quaildesk";

const PAGES: { label: string; path: string; src: string; alt: string; icon: LucideIcon }[] = [
	{
		label: "Overview",
		path: "",
		src: "/screenshots/overview.png",
		alt: "Overview: visibility, share of voice, sentiment and position at a glance",
		icon: LayoutDashboard,
	},
	{
		label: "Visibility",
		path: "/visibility",
		src: "/screenshots/visibility.png",
		alt: "Visibility: how often AI names you, per prompt and model",
		icon: Eye,
	},
	{
		label: "Share of Voice",
		path: "/share-of-voice",
		src: "/screenshots/share-of-voice.png",
		alt: "Share of voice: who AI recommends instead of you",
		icon: ChartPie,
	},
	{
		label: "Sentiment",
		path: "/sentiment",
		src: "/screenshots/sentiment.png",
		alt: "Sentiment: how AI describes you when it mentions you",
		icon: Smile,
	},
	{
		label: "Responses",
		path: "/responses",
		src: "/screenshots/responses.png",
		alt: "Responses: every AI answer, with each brand's rank and tone",
		icon: MessageSquare,
	},
	{
		label: "Query Fan-Out",
		path: "/query-fan-out",
		src: "/screenshots/query-fan-out.png",
		alt: "Query fan-out: the searches AI runs behind each answer",
		icon: GitFork,
	},
	{
		label: "Citations",
		path: "/citations",
		src: "/screenshots/citations.png",
		alt: "Citations: the sources AI trusts in your category",
		icon: Link2,
	},
	{
		label: "Opportunities",
		path: "/opportunities",
		src: "/screenshots/opportunities.png",
		alt: "Opportunities: what to do next, ranked by impact",
		icon: Lightbulb,
	},
];

const HOLD_MS = 5000;

/*
 * The dashboard's pages, listed the way the app's own sidebar lists them, with
 * the chosen page shown in a browser window. The list advances on its own
 * while it is in view and stops once the visitor picks a page.
 */
export function ProductDemo() {
	const [index, setIndex] = useState(0);
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
			if (visible) setIndex((current) => (current + 1) % PAGES.length);
		}, HOLD_MS);
		return () => {
			clearInterval(timer);
			observer.disconnect();
		};
	}, [auto]);

	const page = PAGES[index];
	const demoUrl = demoSiteUrl("marketing-demo-frame", `${DEMO_BRAND_PATH}${page.path}`);

	return (
		<div ref={ref} className="grid gap-4 lg:grid-cols-12 lg:items-start lg:gap-6">
			<nav
				aria-label="Dashboard pages"
				className="flex gap-2 overflow-x-auto pb-1 lg:col-span-3 lg:flex-col lg:overflow-visible lg:pb-0 lg:pt-6"
			>
				{PAGES.map((item, i) => {
					const Icon = item.icon;
					const current = i === index;
					return (
						<button
							key={item.label}
							type="button"
							aria-pressed={current}
							onClick={() => {
								setAuto(false);
								setIndex(i);
							}}
							className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 button-sm text-left transition-colors duration-300 ${EASE_CLASS} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
								current ? "bg-blue-50 text-blue-800" : "text-zinc-600 hover:bg-paper-2 hover:text-zinc-950"
							}`}
						>
							<Icon className="size-4 shrink-0" aria-hidden="true" />
							{item.label}
						</button>
					);
				})}
			</nav>
			<a
				href={demoUrl}
				target="_blank"
				rel={externalRel(demoUrl)}
				aria-label={`Open the live demo on the ${page.label} page`}
				onClick={() => trackEvent("demo_open", { from: "hero-window", page: page.label })}
				className={`group relative block ${WINDOW_FRAME} lg:col-span-9 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600`}
			>
				<WindowBar />
				<div className="relative aspect-[5/3] overflow-hidden rounded-lg bg-paper-2">
					{PAGES.map((item, i) => (
						<img
							key={item.src}
							src={item.src}
							alt={item.alt}
							width={3000}
							height={1800}
							loading={i < 2 ? "eager" : "lazy"}
							decoding="async"
							aria-hidden={i !== index}
							className={`absolute inset-0 size-full object-cover object-left-top transition-opacity duration-500 ${EASE_CLASS}`}
							style={{ opacity: i === index ? 1 : 0 }}
						/>
					))}
					<div
						aria-hidden="true"
						className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-950/0 transition-colors duration-300 ${EASE_CLASS} group-hover:bg-zinc-950/10 group-focus-visible:bg-zinc-950/10`}
					>
						<span
							className={`inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 button-sm text-white opacity-0 shadow-[0_12px_32px_-12px_rgb(26_25_23/0.5)] transition-opacity duration-300 ${EASE_CLASS} group-hover:opacity-100 group-focus-visible:opacity-100`}
						>
							Open the live demo
							<ArrowUpRight className="size-4" />
						</span>
					</div>
				</div>
			</a>
		</div>
	);
}
