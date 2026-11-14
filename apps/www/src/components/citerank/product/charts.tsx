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

/* A curve through every point that never overshoots one: where the line turns, it passes through level. */
function curved(points: Point[]) {
	if (points.length < 3) return straight(points);
	const slopes = points.slice(1).map(([x, y], index) => (y - points[index][1]) / (x - points[index][0]));
	const tangents = points.map((_, index) => {
		if (index === 0) return slopes[0];
		if (index === points.length - 1) return slopes[slopes.length - 1];
		const before = slopes[index - 1];
		const after = slopes[index];
		return before * after <= 0 ? 0 : (2 * before * after) / (before + after);
	});
	let path = `M${points[0][0]} ${points[0][1]}`;
	for (let index = 0; index < points.length - 1; index++) {
		const [x0, y0] = points[index];
		const [x1, y1] = points[index + 1];
		const third = (x1 - x0) / 3;
		path += `C${fix(x0 + third)} ${fix(y0 + tangents[index] * third)} ${fix(x1 - third)} ${fix(y1 - tangents[index + 1] * third)} ${x1} ${y1}`;
	}
	return path;
}

export function Sparkline({ values, className = "" }: { values: number[]; className?: string }) {
	const low = Math.min(...values);
	const span = Math.max(...values) - low || 1;
	const line = curved(
		values.map(
			(value, index) => [fix((index / (values.length - 1)) * 100), fix(90 - ((value - low) / span) * 76)] as const,
		),
	);
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className={className}>
			<path d={`${line}V100H0Z`} fill="currentColor" fillOpacity="0.16" />
			<path
				d={line}
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

/*
 * The chart's cursor is a range input laid over the plot, so a pointer, a
 * finger and the arrow keys all move it, and a screen reader hears the day it
 * is on. Where the screen is only a picture, there is no cursor.
 */
export function LineChart({
	lines,
	label,
	dayAt,
	format = String,
	exact = format,
	smooth = false,
	still = false,
	height = "h-40",
}: {
	lines: Line[];
	label: string;
	dayAt: (index: number) => string;
	/** How the axis writes a value, and how the cursor writes one where that needs more figures. */
	format?: (value: number) => string;
	exact?: (value: number) => string;
	smooth?: boolean;
	still?: boolean;
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
		<div className="@container">
			<div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-2 text-xs text-zinc-500 tabular-nums">
				<div aria-hidden="true" className="-my-1.5 flex flex-col-reverse justify-between text-right leading-3">
					{scale.ticks.map((tick) => (
						<span key={tick}>{format(tick)}</span>
					))}
				</div>
				<div
					className={`relative rounded-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-rust ${height}`}
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
								className="stroke-zinc-200"
								vectorEffect="non-scaling-stroke"
							/>
						))}
						{[...lines].reverse().map((line) => {
							const points = line.values.map((value, index) => [x(index), y(value)] as const);
							return (
								<path
									key={line.name}
									d={smooth ? curved(points) : straight(points)}
									fill="none"
									stroke="currentColor"
									strokeWidth={line.strong ? 2.5 : 1.5}
									strokeLinejoin="round"
									strokeLinecap="round"
									vectorEffect="non-scaling-stroke"
									className={line.tone}
								/>
							);
						})}
					</svg>
					{at === null ? null : (
						<div aria-hidden="true" className="pointer-events-none absolute inset-0">
							<span className="absolute inset-y-0 w-px bg-zinc-400" style={{ left: `${x(at)}%` }} />
							{lines.map((line) => (
								<span
									key={line.name}
									className={`absolute size-2 -translate-1/2 rounded-full bg-current ring-2 ring-white ${line.tone}`}
									style={{ left: `${x(at)}%`, top: `${y(line.values[at] ?? scale.from)}%` }}
								/>
							))}
							<div
								className={`absolute top-0 z-10 w-max rounded-lg bg-ink px-3 py-2 text-paper shadow-card ${x(at) > 50 ? "-translate-x-[calc(100%+0.5rem)]" : "translate-x-2"}`}
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
					{still ? null : (
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
					)}
				</div>
				<span />
				<div aria-hidden="true" className="flex justify-between">
					{marks.map((index, place) => (
						<span
							key={index}
							suppressHydrationWarning
							className={place % 2 === 1 && place !== marks.length - 1 ? "hidden @[26rem]:inline" : ""}
						>
							{dayAt(index)}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

/* Shares of a whole, stacked: each layer's height on a day is its share of that day. */
export function StackedArea({
	layers,
	label,
	dayAt,
	height = "h-40",
}: {
	layers: { name: string; tone: string; values: number[] }[];
	label: string;
	dayAt: (index: number) => string;
	height?: string;
}) {
	const size = layers[0]?.values.length ?? 0;
	const last = size - 1;
	const totals = Array.from(
		{ length: size },
		(_, index) => layers.reduce((sum, layer) => sum + layer.values[index], 0) || 1,
	);
	const x = (index: number) => fix(last > 0 ? (index / last) * 100 : 50);
	const edges: number[][] = [new Array<number>(size).fill(0)];
	for (const layer of layers) {
		const under = edges[edges.length - 1];
		edges.push(under.map((base, index) => base + (layer.values[index] / totals[index]) * 100));
	}
	const marks = [0, 1, 2, 3, 4].map((step) => Math.round((step / 4) * last));

	return (
		<div className="@container">
			<div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-2 text-xs text-zinc-500 tabular-nums">
				<div aria-hidden="true" className="-my-1.5 flex flex-col-reverse justify-between text-right leading-3">
					{[0, 25, 50, 75, 100].map((tick) => (
						<span key={tick}>{tick}%</span>
					))}
				</div>
				<svg
					role="img"
					aria-label={label}
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					className={`w-full rounded-sm ${height}`}
				>
					{layers.map((layer, place) => {
						const top = edges[place + 1].map((edge, index) => `${index ? "L" : "M"}${x(index)} ${fix(100 - edge)}`);
						const bottom = edges[place].map((edge, index) => `L${x(index)} ${fix(100 - edge)}`).reverse();
						return (
							<path
								key={layer.name}
								d={`${top.join("")}${bottom.join("")}Z`}
								fill="currentColor"
								className={layer.tone}
							/>
						);
					})}
				</svg>
				<span />
				<div aria-hidden="true" className="flex justify-between">
					{marks.map((index, place) => (
						<span key={index} suppressHydrationWarning className={place % 2 === 1 ? "hidden @[24rem]:inline" : ""}>
							{dayAt(index)}
						</span>
					))}
				</div>
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
		<div className="relative size-36 shrink-0">
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
		<span aria-hidden="true" className="block h-2 min-w-8 flex-1 overflow-hidden rounded-full bg-paper-2">
			<span
				className={`block h-full rounded-full bg-current ${tone}`}
				style={{ width: `${fix(Math.max(0, Math.min(1, share)) * 100)}%` }}
			/>
		</span>
	);
}
