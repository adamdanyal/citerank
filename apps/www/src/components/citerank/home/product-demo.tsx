import { demoSiteUrl } from "@workspace/config/referrals";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { externalRel } from "@/lib/external-link";
import { EASE_CLASS, WINDOW_FRAME, WindowBar } from "../ui";

export const DEMO_BRAND_PATH = "/app/org/quaildesk/brand/quaildesk";

/*
 * Each slide is a real screenshot. `y` is where that page's link sits in the
 * app sidebar, as a fraction of the 3000×1800 capture, so the cursor lands on
 * the item it "clicks".
 */
const SLIDES = [
	{
		src: "/screenshots/overview.png",
		label: "Overview",
		path: "",
		caption: "Visibility, share of voice, sentiment, and position at a glance",
		y: 0.141,
	},
	{
		src: "/screenshots/visibility.png",
		label: "Visibility",
		path: "/visibility",
		caption: "How often AI names you, per prompt and model",
		y: 0.181,
	},
	{
		src: "/screenshots/share-of-voice.png",
		label: "Share of Voice",
		path: "/share-of-voice",
		caption: "Who AI recommends instead of you",
		y: 0.221,
	},
	{
		src: "/screenshots/sentiment.png",
		label: "Sentiment",
		path: "/sentiment",
		caption: "How AI describes you when it mentions you",
		y: 0.261,
	},
	{
		src: "/screenshots/responses.png",
		label: "Responses",
		path: "/responses",
		caption: "Every AI answer, with each brand's rank and tone",
		y: 0.301,
	},
	{
		src: "/screenshots/query-fan-out.png",
		label: "Query Fan-Out",
		path: "/query-fan-out",
		caption: "The searches AI runs behind each answer",
		y: 0.341,
	},
	{
		src: "/screenshots/citations.png",
		label: "Citations",
		path: "/citations",
		caption: "The sources AI trusts in your category",
		y: 0.381,
	},
	{
		src: "/screenshots/opportunities.png",
		label: "Opportunities",
		path: "/opportunities",
		caption: "What to do next, ranked by impact",
		y: 0.421,
	},
] as const;

const CURSOR_X = 0.055;
const MOVE_MS = 900;
const HOLD_MS = 3200;

// Vercel's optimizer only exists in production; dev serves the originals.
function optimized(src: string, width: number) {
	return `/_vercel/image?${new URLSearchParams({ url: src, w: String(width), q: "75" })}`;
}

function Shot({ src, alt, active, eager }: { src: string; alt: string; active: boolean; eager: boolean }) {
	const prod = import.meta.env.PROD && import.meta.env.VITE_IMAGE_OPTIMIZER === "vercel";
	return (
		<img
			src={prod ? optimized(src, 1200) : src}
			srcSet={prod ? [750, 1200, 1920].map((w) => `${optimized(src, w)} ${w}w`).join(", ") : undefined}
			sizes="(min-width: 1024px) 896px, 100vw"
			alt={alt}
			width={3000}
			height={1800}
			loading={eager ? "eager" : "lazy"}
			decoding="async"
			className={`absolute inset-0 size-full object-cover object-left-top transition-opacity duration-500 ${EASE_CLASS}`}
			style={{ opacity: active ? 1 : 0 }}
		/>
	);
}

function Cursor({ y, clicking }: { y: number; clicking: boolean }) {
	return (
		<div
			aria-hidden="true"
			className={`pointer-events-none absolute z-10 transition-[top] ${EASE_CLASS}`}
			style={{ left: `${CURSOR_X * 100}%`, top: `${y * 100}%`, transitionDuration: `${MOVE_MS}ms` }}
		>
			<span
				className={`absolute -left-3 -top-3 size-6 rounded-full bg-blue-500/30 transition-[transform,opacity] duration-300 ${EASE_CLASS}`}
				style={{ transform: `scale(${clicking ? 1 : 0.2})`, opacity: clicking ? 1 : 0 }}
			/>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				className={`relative size-5 drop-shadow-[0_2px_3px_rgb(0_0_0/0.25)] transition-transform duration-300 ${EASE_CLASS} md:size-6`}
				style={{ transform: clicking ? "scale(0.88)" : "none" }}
			>
				<path
					d="M5 3.5 L5 19 L9.3 15 L12.2 21.2 L15 20 L12.2 13.9 L18 13.9 Z"
					fill="#1a1917"
					stroke="white"
					strokeWidth="1.5"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
}

export function ProductDemo() {
	const [index, setIndex] = useState(0);
	const [cursorY, setCursorY] = useState<number>(SLIDES[0].y);
	const [clicking, setClicking] = useState(false);
	const [auto, setAuto] = useState(true);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setAuto(false);
			return;
		}
		let visible = true;
		let current = 0;
		const timers: ReturnType<typeof setTimeout>[] = [];
		const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

		// Move to the next sidebar link, press it, then swap the page underneath.
		const step = () => {
			if (!visible) {
				later(HOLD_MS, step);
				return;
			}
			const next = (current + 1) % SLIDES.length;
			setCursorY(SLIDES[next].y);
			later(MOVE_MS, () => setClicking(true));
			later(MOVE_MS + 160, () => {
				setIndex(next);
				current = next;
			});
			later(MOVE_MS + 360, () => setClicking(false));
			later(MOVE_MS + HOLD_MS, step);
		};
		later(HOLD_MS, step);

		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
		});
		if (ref.current) observer.observe(ref.current);
		return () => {
			for (const t of timers) clearTimeout(t);
			observer.disconnect();
		};
	}, [auto]);

	const slide = SLIDES[index];
	const demoUrl = demoSiteUrl("marketing-demo-frame", `${DEMO_BRAND_PATH}${slide.path}`);

	return (
		<div ref={ref} className="mx-auto max-w-4xl">
			<a
				href={demoUrl}
				target="_blank"
				rel={externalRel(demoUrl)}
				aria-label={`View the live demo: ${slide.label}`}
				className={`group relative block ${WINDOW_FRAME} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600`}
			>
				<WindowBar />
				<div className="relative aspect-[5/3] overflow-hidden rounded-lg bg-paper-2">
					{SLIDES.map((s, i) => (
						<Shot
							key={s.src}
							src={s.src}
							alt={`CiteRank.com ${s.label} page: ${s.caption}`}
							active={i === index}
							eager={i < 2}
						/>
					))}
					{auto ? <Cursor y={cursorY} clicking={clicking} /> : null}
					<div
						aria-hidden="true"
						className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/0 transition-colors duration-300 ${EASE_CLASS} group-hover:bg-zinc-950/10 group-focus-visible:bg-zinc-950/10`}
					>
						<span
							className={`inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 button-sm text-white opacity-0 shadow-[0_12px_32px_-12px_rgb(26_25_23/0.5)] transition-opacity duration-300 ${EASE_CLASS} group-hover:opacity-100 group-focus-visible:opacity-100`}
						>
							View live demo
							<ArrowUpRight className="size-4" />
						</span>
					</div>
				</div>
			</a>
		</div>
	);
}
