import { type ReactNode, useState } from "react";

export interface Line {
	name: string;
	tone: string;
	values: number[];
	strong?: boolean;
}

type Point = readonly [number, number];

const fix = (value: number) => Math.round(value * 100) / 100;

/* Even steps between round numbers, wide enough to hold every value. */
function axis(values: number[], steps = 4) {
	const low = Math.min(...values);
	const high = Math.max(...values);
	const rough = (high - low) / steps || 1;
	const unit = 10 ** Math.floor(Math.log10(rough));
	const step = [1, 2, 2.5, 5, 10].map((size) => size * unit).find((size) => size >= rough) ?? rough;
	const from = Math.floor(low / step) * step;
	const to = Math.max(from + step, Math.ceil(high / step) * step);
	const ticks: number[] = [];
	for (let tick = from; tick <= to + step / 2; tick += step) ticks.push(fix(tick));
	return { from, to, ticks };
}

const straight = (points: Point[]) => points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join("");

/*
 * The cursor is a range input laid over the plot, so a pointer, a finger and
 * the arrow keys all move it, and a screen reader hears the day it is on.
 */
export function LineChart({
	lines,
	label,
	dayAt,
	format = String,
	exact = format,
	height = "h-40",
}: {
	lines: Line[];
	label: string;
	dayAt: (index: number) => string;
	format?: (value: number) => string;
	exact?: (value: number) => string;
	height?: string;
}) {
	const [at, setAt] = useState<number | null>(null);
	const size = Math.max(...lines.map((line) => line.values.length));
	const last = size - 1;
	const scale = axis(lines.flatMap((line) => line.values));
	const x = (index: number) => fix(last > 0 ? (index / last) * 100 : 50);
	const y = (value: number) => fix(100 - ((value - scale.from) / (scale.to - scale.from)) * 100);
	const marks = [0, 1, 2, 3, 4, 5].map((step) => Math.round((step / 5) * last));

	return (
		<div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-2 font-mono text-xs text-(--v3-text-3) tabular-nums">
			<div aria-hidden="true" className="-my-1.5 flex flex-col-reverse justify-between text-right leading-3">
				{scale.ticks.map((tick) => (
					<span key={tick}>{format(tick)}</span>
				))}
			</div>
			<div
				data-kind="chart"
				className={`relative rounded-[4px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-(--v3-rust) ${height}`}
			>
				<svg
					role="img"
					aria-label={label}
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					className="absolute inset-0 size-full overflow-visible"
				>
					{scale.ticks.map((tick) => (
						<line
							key={tick}
							x1="0"
							x2="100"
							y1={y(tick)}
							y2={y(tick)}
							stroke="currentColor"
							className="text-(--v3-line)"
							vectorEffect="non-scaling-stroke"
						/>
					))}
					{[...lines].reverse().map((line) => (
						<path
							key={line.name}
							d={straight(line.values.map((value, index) => [x(index), y(value)] as const))}
							fill="none"
							stroke="currentColor"
							strokeWidth={line.strong ? 2.5 : 1.5}
							strokeLinejoin="round"
							strokeLinecap="round"
							vectorEffect="non-scaling-stroke"
							className={line.tone}
						/>
					))}
				</svg>
				{at === null ? null : (
					<div aria-hidden="true" className="pointer-events-none absolute inset-0 font-sans">
						<span className="absolute inset-y-0 w-px bg-(--v3-line-strong)" style={{ left: `${x(at)}%` }} />
						{lines.map((line) => (
							<span
								key={line.name}
								className={`absolute size-2 -translate-1/2 rounded-full bg-current ring-2 ring-(--v3-card) ${line.tone}`}
								style={{ left: `${x(at)}%`, top: `${y(line.values[at] ?? scale.from)}%` }}
							/>
						))}
						<div
							className={`absolute top-0 z-10 w-max rounded-[8px] bg-(--v3-ink) px-3 py-2 text-(--v3-on-ink) shadow-(--v3-shadow-float) ${x(at) > 50 ? "-translate-x-[calc(100%+0.5rem)]" : "translate-x-2"}`}
							style={{ left: `${x(at)}%` }}
						>
							<p className="font-medium">{dayAt(at)}</p>
							<ul className="mt-1 space-y-0.5">
								{lines.map((line) => (
									<li key={line.name} className="flex items-center gap-2">
										<span className={`h-0.5 w-3 rounded-full bg-current ${line.tone}`} />
										<span className="flex-1">{line.name}</span>
										<span className="pl-3 font-mono">{exact(line.values[at] ?? 0)}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}
				<input
					type="range"
					min={0}
					max={last}
					step={1}
					value={at ?? last}
					aria-label={`${label}. Day`}
					aria-valuetext={dayAt(at ?? last)}
					onChange={(event) => setAt(Number(event.target.value))}
					onPointerMove={(event) => {
						const box = event.currentTarget.getBoundingClientRect();
						const share = (event.clientX - box.left) / box.width;
						setAt(Math.max(0, Math.min(last, Math.round(share * last))));
					}}
					onPointerLeave={() => setAt(null)}
					onBlur={() => setAt(null)}
					className="absolute inset-0 size-full cursor-crosshair touch-pan-y opacity-0"
				/>
			</div>
			<span />
			<div aria-hidden="true" className="flex justify-between">
				{marks.map((index, place) => (
					<span
						key={index}
						suppressHydrationWarning
						className={place % 2 === 1 && place !== marks.length - 1 ? "hidden @[30rem]:inline" : ""}
					>
						{dayAt(index)}
					</span>
				))}
			</div>
		</div>
	);
}

export function Donut({
	parts,
	label,
	children,
}: {
	parts: { name: string; tone: string; value: number }[];
	label: string;
	children?: ReactNode;
}) {
	const total = parts.reduce((sum, part) => sum + part.value, 0) || 1;
	const shares = parts.map((part) => (part.value / total) * 100);
	const starts = shares.map((_, place) => shares.slice(0, place).reduce((sum, share) => sum + share, 0));
	return (
		<div data-kind="chart" className="relative size-36 shrink-0">
			<svg role="img" aria-label={label} viewBox="0 0 42 42" className="size-full -rotate-90">
				{parts.map((part, place) => (
					<circle
						key={part.name}
						cx="21"
						cy="21"
						r="15.915"
						fill="none"
						stroke="currentColor"
						strokeWidth="5.5"
						pathLength="100"
						strokeDasharray={`${fix(Math.max(0, shares[place] - 0.8))} 100`}
						strokeDashoffset={fix(-starts[place])}
						className={part.tone}
					/>
				))}
			</svg>
			<div className="absolute inset-0 grid place-items-center">{children}</div>
		</div>
	);
}

/* A share drawn as a bar. The widest bar in a list is the leader's, so the others read against it. */
export function Bar({ share, tone }: { share: number; tone: string }) {
	return (
		<span aria-hidden="true" className="block h-1.5 min-w-8 flex-1 overflow-hidden rounded-full bg-(--v3-raised)">
			<span
				className={`block h-full rounded-full bg-current ${tone}`}
				style={{ width: `${fix(Math.max(0, Math.min(1, share)) * 100)}%` }}
			/>
		</span>
	);
}
