import { screenshotSet } from "@/lib/screenshots";
import { EngineIcon } from "./home/engines";

// ---------------------------------------------------------------------------
// Feature graphics
//
// Most sit next to their feature as a real product screenshot (see the
// Screenshot helper below); the rest are built from the feature's own
// material: a chart, a terminal session, the list of engines. Those fill the
// width they are given, so one graphic serves an index tile and a page's
// full-width opening.
// ---------------------------------------------------------------------------

function Frame({
	children,
	aspect = "aspect-[5/3]",
	className = "",
}: {
	children: React.ReactNode;
	aspect?: string;
	className?: string;
}) {
	return (
		<div className={`relative w-full overflow-hidden rounded-xl bg-paper-2 ${aspect} ${className}`}>
			<div className="@container relative z-10 size-full">{children}</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Screenshot helper — used by feature graphics that show real product UI
// ---------------------------------------------------------------------------

function Screenshot({
	src,
	alt,
	aspect = "aspect-[5/3]",
	objectPosition = "object-left-top",
}: {
	src: string;
	alt: string;
	aspect?: string;
	objectPosition?: string;
}) {
	const shot = screenshotSet(src);
	return (
		<Frame aspect={aspect}>
			<img
				src={shot.src}
				srcSet={shot.srcSet}
				sizes="(min-width: 1024px) 640px, 100vw"
				width={shot.width}
				height={shot.height}
				alt={alt}
				loading="lazy"
				decoding="async"
				className={`size-full object-cover ${objectPosition}`}
			/>
		</Frame>
	);
}

// ---------------------------------------------------------------------------
// 01 — Dashboard
// ---------------------------------------------------------------------------

export function OverviewPageGraphic({ wide = false }: { wide?: boolean } = {}) {
	return (
		<Screenshot
			src="/screenshots/overview.webp"
			alt="CiteRank.com dashboard overview with visibility, share of voice, sentiment, and position cards above a competitive landscape chart"
			aspect={wide ? "aspect-[12/5]" : "aspect-[5/3]"}
		/>
	);
}

// ---------------------------------------------------------------------------
// 02 — Visibility
// ---------------------------------------------------------------------------

export function VisibilityPageGraphic() {
	return (
		<Screenshot
			src="/screenshots/visibility.webp"
			alt="Per-prompt visibility tracking with brand and competitor trend lines across multiple AI models"
		/>
	);
}

// ---------------------------------------------------------------------------
// 03 — Share of Voice
// ---------------------------------------------------------------------------

export function ShareOfVoicePageGraphic() {
	return (
		<Screenshot
			src="/screenshots/share-of-voice.webp"
			alt="Share of voice donut chart, 30-day trend, and a leaderboard ranking your brand's mention share against competitors"
		/>
	);
}

// ---------------------------------------------------------------------------
// 04 — Sentiment
// ---------------------------------------------------------------------------

export function SentimentPageGraphic() {
	return (
		<Screenshot
			src="/screenshots/sentiment.webp"
			alt="Sentiment score donut, sentiment trends against competitors, sentiment by model, and the passages where AI praises the brand"
		/>
	);
}

// ---------------------------------------------------------------------------
// 05 — Query Fan-Out
// ---------------------------------------------------------------------------

export function QueryFanOutPageGraphic() {
	return (
		<Screenshot
			src="/screenshots/query-fan-out.webp"
			alt="Query fan-out word cloud of the search terms AI engines generate, with a breakdown of how prompts get rewritten"
		/>
	);
}

// ---------------------------------------------------------------------------
// 06 — Citations
// ---------------------------------------------------------------------------

export function CitationsPageGraphic() {
	return (
		<Screenshot
			src="/screenshots/citations.webp"
			alt="Citation analysis showing brand citation share, unique domains, total citations, and category and page-type trends"
		/>
	);
}

// ---------------------------------------------------------------------------
// 07 — Opportunities
// ---------------------------------------------------------------------------

export function OpportunitiesPageGraphic() {
	return (
		<Screenshot
			src="/screenshots/opportunities.webp"
			alt="Opportunities page with an AI-generated summary and prioritized recommendations for content to create and sources to pitch"
		/>
	);
}

// ---------------------------------------------------------------------------
// 08 — Prompts
// ---------------------------------------------------------------------------

export function PromptSearchGraphic() {
	return (
		<Screenshot
			src="/screenshots/prompts.webp"
			alt="Prompt filtering with the Tags dropdown open showing Automation and Comparison selected"
		/>
	);
}

// ---------------------------------------------------------------------------
// 09 — Deep Dive
// ---------------------------------------------------------------------------

export function PromptDetailGraphic() {
	return (
		<Screenshot
			src="/screenshots/prompt-detail.webp"
			alt="Prompt history detail showing an individual AI response with the brands it mentioned and the sources behind it"
		/>
	);
}

export function PromptSettingsGraphic() {
	return (
		<Screenshot
			src="/screenshots/prompt-settings.webp"
			alt="Prompt settings listing tracked prompts with their branded or unbranded system tag and topic tags"
		/>
	);
}

export function ResponsesGraphic() {
	return (
		<Screenshot
			src="/screenshots/responses.webp"
			alt="Responses page with a sentiment split across every answer and a ChatGPT response showing each brand's position and sentiment"
		/>
	);
}

// ---------------------------------------------------------------------------
// 10 — Trends: 12-month area chart
// ---------------------------------------------------------------------------

const LABEL = "text-[0.8125rem] leading-[1.4]";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const BRAND_TREND = [40, 44, 48, 52, 50, 56, 60, 64, 62, 68, 71, 72];
const COMPETITOR_TREND = [55, 52, 50, 48, 51, 49, 47, 44, 46, 43, 42, 40];
const CHART_W = 240;
const CHART_H = 100;

function trendPath(data: number[]) {
	const points = data.map((value, i) => ({
		x: (i / (data.length - 1)) * CHART_W,
		y: CHART_H - ((value - 30) / 50) * CHART_H,
	}));
	const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
	return { line, area: `${line} L${CHART_W},${CHART_H} L0,${CHART_H} Z`, last: points[points.length - 1] };
}

export function VisibilityTrendGraphic() {
	const brand = trendPath(BRAND_TREND);
	const competitor = trendPath(COMPETITOR_TREND);
	const first = BRAND_TREND[0];
	const last = BRAND_TREND[BRAND_TREND.length - 1];

	return (
		<figure
			role="img"
			aria-label={`Chart of brand visibility over twelve months: your brand climbs from ${first}% to ${last}% while a competitor falls`}
			className="flex aspect-[4/3] w-full flex-col gap-3 rounded-card bg-paper-2 p-5 @[30rem]:aspect-[5/3] @[30rem]:p-8"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<p className={`${LABEL} text-zinc-600`}>Brand visibility over twelve months</p>
					<p className="mt-1 flex items-baseline gap-2">
						<span className="font-heading text-[2rem] leading-none font-bold tracking-[-0.03em] text-ink tabular-nums">
							{last}%
						</span>
						<span className={`${LABEL} text-blue-800 tabular-nums`}>up {last - first} points</span>
					</p>
				</div>
				<ul className={`${LABEL} shrink-0 space-y-1 text-zinc-600`}>
					<li className="flex items-center gap-2">
						<span className="h-0.5 w-3 rounded-full bg-rust" />
						Your brand
					</li>
					<li className="flex items-center gap-2">
						<span className="w-3 border-t border-dashed border-zinc-500" />
						Competitor
					</li>
				</ul>
			</div>

			<div className="relative min-h-0 flex-1">
				<svg
					aria-hidden="true"
					viewBox={`0 0 ${CHART_W} ${CHART_H}`}
					className="size-full overflow-visible"
					preserveAspectRatio="none"
				>
					<defs>
						<linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="var(--color-rust)" stopOpacity="0.22" />
							<stop offset="100%" stopColor="var(--color-rust)" stopOpacity="0" />
						</linearGradient>
					</defs>
					{[0, 1, 2, 3].map((i) => (
						<line
							key={i}
							x1="0"
							y1={(i * CHART_H) / 3}
							x2={CHART_W}
							y2={(i * CHART_H) / 3}
							stroke="var(--color-zinc-300)"
							strokeWidth="0.5"
							vectorEffect="non-scaling-stroke"
						/>
					))}
					<path d={brand.area} fill="url(#trend-fill)" />
					<path
						d={competitor.line}
						fill="none"
						stroke="var(--color-zinc-500)"
						strokeWidth="1.25"
						strokeDasharray="3 3"
						strokeLinecap="round"
						vectorEffect="non-scaling-stroke"
					/>
					<path
						d={brand.line}
						fill="none"
						stroke="var(--color-rust)"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						vectorEffect="non-scaling-stroke"
					/>
					<line
						x1={brand.last.x}
						y1={brand.last.y}
						x2={brand.last.x}
						y2={CHART_H}
						stroke="var(--color-rust)"
						strokeWidth="0.75"
						strokeDasharray="2 2"
						opacity="0.5"
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
			</div>

			<div className="flex justify-between text-[0.75rem] leading-[1.4] text-zinc-600">
				{MONTHS.map((month, i) => (
					<span key={month} className={i % 2 === 1 ? "@max-[26rem]:hidden" : undefined}>
						{month}
					</span>
				))}
			</div>
		</figure>
	);
}

// ---------------------------------------------------------------------------
// API and MCP: the two ways in, as terminal snippets
// ---------------------------------------------------------------------------

const COMMAND =
	"mt-2 overflow-x-auto font-mono text-[0.75rem] leading-[1.8] text-paper @[30rem]:text-[0.8125rem] @[56rem]:text-[1.0625rem]";
const COMMAND_LABEL = `${LABEL} text-zinc-400 @[56rem]:text-[0.9375rem]`;

export function ApiGraphic() {
	return (
		<dl className="grid h-full content-center gap-6 rounded-card bg-ink p-5 @[30rem]:p-8 @[56rem]:grid-cols-2 @[56rem]:gap-12 @[56rem]:px-12 @[56rem]:py-16">
			<div className="min-w-0">
				<dt className={COMMAND_LABEL}>Connect the MCP server</dt>
				<dd>
					<pre className={COMMAND}>
						<code>
							<span className="text-zinc-400 select-none">$ </span>claude mcp add --transport http citerank \{"\n"}
							{"    "}
							<span className="text-blue-300">https://app.citerank.com/api/mcp</span>
						</code>
					</pre>
				</dd>
			</div>
			<div className="min-w-0">
				<dt className={COMMAND_LABEL}>Query the REST API</dt>
				<dd>
					<pre className={COMMAND}>
						<code>
							<span className="text-zinc-400 select-none">$ </span>curl{" "}
							<span className="text-blue-300">https://app.citerank.com/api/v1/brands</span> \{"\n"}
							{"    "}-H <span className="text-blue-200">&quot;Authorization: Bearer $CITERANK_API_KEY&quot;</span>
						</code>
					</pre>
				</dd>
			</div>
		</dl>
	);
}

// ---------------------------------------------------------------------------
// Engines: what is scraped from the real apps, and what is called by API
// ---------------------------------------------------------------------------

const SCRAPED_ENGINES = [
	{ name: "ChatGPT", iconId: "openai" },
	{ name: "AI Overviews", iconId: "google" },
	{ name: "AI Mode", iconId: "google" },
	{ name: "Bing AI Mode", iconId: "microsoft" },
	{ name: "Gemini", iconId: "gemini" },
];

const API_ENGINES = [
	{ name: "Claude", iconId: "anthropic" },
	{ name: "Grok", iconId: "x" },
	{ name: "Mistral", iconId: "mistral" },
	{ name: "DeepSeek", iconId: "deepseek" },
	{ name: "Qwen", iconId: "qwen" },
	{ name: "Kimi", iconId: "moonshotai" },
	{ name: "Meta", iconId: "meta" },
	{ name: "Perplexity", iconId: "perplexity" },
];

/* A plain list in a tile, where two groups share a narrow well; capsules once the well is wide enough to hold a row of them. */
function EngineList({
	title,
	engines,
	columns,
}: {
	title: string;
	engines: { name: string; iconId: string }[];
	columns: string;
}) {
	return (
		<div className="min-w-0">
			<dt className={`${LABEL} text-zinc-600 @[56rem]:text-[0.9375rem]`}>{title}</dt>
			<dd className="mt-3 @[56rem]:mt-5">
				<ul className={`grid gap-2 @[56rem]:gap-2.5 ${columns}`}>
					{engines.map((engine) => (
						<li
							key={engine.name}
							className="flex min-w-0 items-center gap-2 text-[0.875rem] leading-[1.4] font-medium text-ink @[56rem]:h-11 @[56rem]:rounded-full @[56rem]:bg-paper @[56rem]:px-4 @[56rem]:text-[0.9375rem]"
						>
							<EngineIcon iconId={engine.iconId} className="size-4 shrink-0" />
							<span className="truncate">{engine.name}</span>
						</li>
					))}
				</ul>
			</dd>
		</div>
	);
}

export function EnginesGraphic() {
	return (
		<dl className="grid h-full grid-cols-2 content-center gap-x-5 rounded-card bg-paper-2 p-5 @[30rem]:gap-x-8 @[30rem]:p-8 @[56rem]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @[56rem]:gap-x-12 @[56rem]:p-12">
			<EngineList
				title="Read in the app, as a user sees them"
				engines={SCRAPED_ENGINES}
				columns="@[56rem]:grid-cols-3"
			/>
			<EngineList title="Read through each company’s API" engines={API_ENGINES} columns="@[56rem]:grid-cols-4" />
		</dl>
	);
}
