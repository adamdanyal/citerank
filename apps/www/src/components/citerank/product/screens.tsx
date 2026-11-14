import { type ReactNode, useState } from "react";
import { Bar, Donut, LineChart, Sparkline, StackedArea } from "./charts";
import {
	type Answer,
	type AnswerKind,
	ago,
	axisLabel,
	byEngine,
	type Company,
	count,
	dayLabel,
	ENGINES,
	isKind,
	METRICS,
	type Metric,
	PREVIEW,
	percent,
	plotted,
	ranked,
	show,
	TONE_FILL,
	TONE_LABEL,
	type Tone,
	toneOf,
} from "./data";
import {
	BOX,
	BOX_TITLE,
	Chip,
	Engine,
	FOCUS,
	Legend,
	Mark,
	Press,
	Segmented,
	Stat,
	Swatch,
	ToneWord,
	useStill,
} from "./parts";

/* `lead` keeps a screen to the one block that says what it is for, where there is room for no more. */
export interface ScreenProps {
	lead?: boolean;
}

const BRAND = PREVIEW.brand;
const OWN = PREVIEW.companies.find((company) => company.isBrand) ?? PREVIEW.companies[0];
const TONES: Tone[] = ["positive", "neutral", "mixed", "negative"];
const dayOf = (size: number) => (index: number) => dayLabel(size - 1 - index);
const lineOf = (company: Company, metric: Metric) => ({
	name: company.name,
	tone: toneOf(company.name),
	values: company.series[metric].map((value) => plotted(metric, value)),
	strong: company.isBrand,
});

function Trend({ better }: { better: boolean }) {
	return (
		<svg aria-hidden="true" viewBox="0 0 12 12" className={`size-3 ${better ? "" : "rotate-90"}`}>
			<path d="M3 9l6-6M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

/* How far a figure moved over the period, in the unit the app shows it in. Nothing when it did not move. */
function moved(metric: Metric, change: number) {
	if (metric === "position") return Math.abs(change) >= 0.05 ? Math.abs(change).toFixed(1) : "";
	const points = Math.abs(Math.round(change * 100));
	if (!points) return "";
	return metric === "sentiment" ? String(points) : `${points}pt`;
}

function StatCard({
	metric,
	label,
	active,
	onPick,
}: {
	metric: Metric;
	label: string;
	active: boolean;
	onPick: () => void;
}) {
	const card = PREVIEW.cards[metric];
	const change = moved(metric, card.change);
	const better = metric === "position" ? card.change < 0 : card.change > 0;
	return (
		<Press
			pressed={active}
			onPress={onPick}
			className={`flex min-h-28 flex-col overflow-hidden rounded-xl text-left ${
				metric === "visibility" ? "bg-warn-tint text-warn" : "bg-good-tint text-good"
			} ${active ? "ring-2 ring-current" : "ring-1 ring-current/25 hover:ring-current/60"}`}
		>
			<span className="px-4 pt-3.5 text-sm font-medium">{label}</span>
			<span className="mt-1 flex items-baseline gap-2 px-4">
				<span className="font-mono text-[2rem] leading-none font-medium tracking-[-0.04em]">
					{show(metric, card.value)}
				</span>
				{change ? (
					<span className="flex items-center gap-0.5 text-sm">
						<Trend better={better} />
						<span className="sr-only">{better ? "better by" : "worse by"}</span>
						{change}
					</span>
				) : null}
			</span>
			<Sparkline values={OWN.series[metric]} className="mt-auto h-10 w-full" />
		</Press>
	);
}

/* The first two AI apps show at any width; the rest join as the table gets room. */
const ENGINE_CELL = [
	"",
	"",
	"hidden @[26rem]:table-cell",
	"hidden @[26rem]:table-cell",
	"hidden @[33rem]:table-cell",
	"hidden @[33rem]:table-cell",
];
const CELL = "border-t border-zinc-200 py-1";

function EngineTable({ metric, companies }: { metric: Metric; companies: Company[] }) {
	const values = companies.flatMap((company) => ENGINES.map((engine) => byEngine(company, engine.model, metric)));
	const low = Math.min(...values);
	const span = Math.max(...values) - low || 1;
	const strength = (value: number) => (metric === "position" ? 1 - (value - low) / span : (value - low) / span);
	const name = METRICS.find((item) => item.id === metric)?.tab ?? "";
	return (
		<div className="@container min-w-0">
			<table className="w-full border-separate border-spacing-0 text-sm tabular-nums">
				<caption className="sr-only">
					{name} for {BRAND} and its rivals, overall and in each AI app
				</caption>
				<thead>
					<tr className="text-zinc-500">
						<th scope="col" className="pb-2 text-left font-normal">
							Company
						</th>
						<th scope="col" className="pb-2 text-right font-normal">
							All
						</th>
						{ENGINES.map((engine, place) => (
							<th key={engine.model} scope="col" className={`pb-2 pl-1.5 font-normal ${ENGINE_CELL[place] ?? ""}`}>
								<span className="flex justify-center">
									<Engine model={engine.model} />
								</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{companies.map((company, index) => (
						<tr key={company.name}>
							<th scope="row" className={`${CELL} pr-2 text-left ${company.isBrand ? "font-medium" : "font-normal"}`}>
								<span className="flex items-center gap-2">
									<span className="w-3 font-normal text-zinc-500">{index + 1}</span>
									<Mark name={company.name} />
									<span className="truncate text-ink">{company.name}</span>
								</span>
							</th>
							<td className={`${CELL} text-right font-mono font-medium text-ink`}>
								{show(metric, company.totals[metric])}
							</td>
							{ENGINES.map((engine, place) => {
								const value = byEngine(company, engine.model, metric);
								return (
									<td key={engine.model} className={`${CELL} pl-1.5 ${ENGINE_CELL[place] ?? ""}`}>
										<span
											className="block rounded-md px-1 py-1 text-center font-mono text-[0.8125rem] leading-4 text-ink"
											style={{
												backgroundColor: `color-mix(in oklab, var(--color-chart-1) ${Math.round(10 + strength(value) * 30)}%, transparent)`,
											}}
										>
											{show(metric, value)}
										</span>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function Landscape({ metric, onMetric }: { metric: Metric; onMetric: (metric: Metric) => void }) {
	const still = useStill();
	const companies = ranked(metric);
	const top = companies.slice(0, 5);
	const name = METRICS.find((item) => item.id === metric)?.tab ?? "";
	return (
		<div className={`${BOX} p-4`}>
			<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
				<div>
					<p className={BOX_TITLE}>Competitive Landscape</p>
					<p className="mt-0.5 text-sm text-zinc-600">{name}, last 30 days</p>
				</div>
				<Segmented
					label="Measure"
					options={METRICS.map((item) => ({ id: item.id, label: item.tab }))}
					value={metric}
					onChange={onMetric}
					className="@max-[36rem]:hidden"
				/>
			</div>
			<div className="mt-4 grid gap-5 @[56rem]:grid-cols-2">
				<div className="min-w-0">
					<LineChart
						lines={top.map((company) => lineOf(company, metric))}
						label={`${name} over the last 30 days for ${BRAND} and four rivals`}
						dayAt={dayOf(PREVIEW.days)}
						format={axisLabel(metric)}
						exact={metric === "position" ? (value) => value.toFixed(1) : undefined}
						still={still}
						height="h-36"
					/>
					<Legend names={top.map((company) => company.name)} />
				</div>
				<EngineTable metric={metric} companies={top} />
			</div>
		</div>
	);
}

export function Overview({ lead = false }: ScreenProps) {
	const [metric, setMetric] = useState<Metric>("visibility");
	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-3 @[34rem]:grid-cols-4">
				{METRICS.map((item) => (
					<StatCard
						key={item.id}
						metric={item.id}
						label={item.label}
						active={item.id === metric}
						onPick={() => setMetric(item.id)}
					/>
				))}
			</div>
			{lead ? null : <Landscape metric={metric} onMetric={setMetric} />}
		</div>
	);
}

export function Visibility({ lead = false }: ScreenProps) {
	const still = useStill();
	const data = PREVIEW.visibility;
	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-xl bg-warn-tint px-4 py-3 text-warn ring-1 ring-warn/25">
				<p>
					<span className="font-mono text-xl font-medium">{data.pct}%</span> Visibility
				</p>
				<p className="flex flex-wrap gap-x-4 text-sm">
					<span>{count(PREVIEW.totals.prompts)} prompts</span>
					<span>{count(PREVIEW.totals.runs)} runs</span>
					<span>{count(data.citations)} citations</span>
				</p>
			</div>
			<div className="grid gap-3 @[56rem]:grid-cols-2">
				{data.prompts.slice(0, lead ? 1 : 2).map((prompt) => {
					const own = prompt.lines[0]?.series ?? [];
					return (
						<div key={prompt.value} className={`${BOX} p-4`}>
							<div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
								<p className={BOX_TITLE}>{prompt.value}</p>
								<span className="rounded-md bg-good px-2 py-1 text-xs leading-none font-medium whitespace-nowrap text-white">
									{own[own.length - 1]}% Visibility
								</span>
							</div>
							<div className="mt-4">
								<LineChart
									lines={prompt.lines.map((line) => ({
										name: line.name,
										tone: toneOf(line.name),
										values: line.series,
										strong: line.name === BRAND,
									}))}
									label={`How often each brand is named in answers to “${prompt.value}”, day by day`}
									dayAt={dayOf(own.length)}
									format={(value) => `${value}%`}
									smooth
									still={still}
								/>
								<Legend names={prompt.lines.map((line) => line.name)} />
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function ShareOfVoice({ lead = false }: ScreenProps) {
	const still = useStill();
	const board = PREVIEW.leaderboard;
	const topShare = board[0]?.share || 1;
	const top = ranked("share").slice(0, 5);
	return (
		<div className="grid gap-3 @[60rem]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
			{lead ? null : (
				<div className={`${BOX} p-4`}>
					<p className={BOX_TITLE}>Share of Voice, last 30 days</p>
					<div className="mt-4">
						<LineChart
							lines={top.map((company) => lineOf(company, "share"))}
							label={`Share of voice over the last 30 days for ${BRAND} and four rivals`}
							dayAt={dayOf(PREVIEW.days)}
							format={axisLabel("share")}
							still={still}
							height="h-28 @[60rem]:h-72"
						/>
						<Legend names={top.map((company) => company.name)} />
					</div>
				</div>
			)}
			<div className={`${BOX} p-4`}>
				<p className={BOX_TITLE}>Share of Voice Leaderboard</p>
				<table className="mt-3 w-full border-separate border-spacing-0 text-sm tabular-nums">
					<caption className="sr-only">Every tracked brand by its share of the mentions in AI answers</caption>
					<thead>
						<tr className="text-zinc-500">
							<th scope="col" className="w-7 pr-2 pb-2 text-left font-normal">
								#
							</th>
							<th scope="col" className="pb-2 text-left font-normal">
								Brand
							</th>
							<th scope="col" className="pb-2 pr-4 text-right font-normal">
								Mentions
							</th>
							<th scope="col" className="w-[42%] pb-2 text-left font-normal">
								Share
							</th>
							<th scope="col" className="hidden pb-2 text-right font-normal @[34rem]:table-cell">
								Prompts
							</th>
						</tr>
					</thead>
					<tbody>
						{board.map((entry, index) => (
							<tr key={entry.name}>
								<td className={`${CELL} pr-2 text-zinc-500`}>{index + 1}</td>
								<th scope="row" className={`${CELL} pr-2 text-left font-normal`}>
									<span className="flex items-center gap-2">
										<Mark name={entry.name} className="size-6" />
										<span className={`truncate text-ink ${entry.name === BRAND ? "font-medium" : ""}`}>
											{entry.name}
										</span>
										{entry.name === BRAND ? (
											<span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs text-zinc-700">You</span>
										) : null}
									</span>
								</th>
								<td className={`${CELL} pr-4 text-right font-mono text-ink`}>{entry.mentions}</td>
								<td className={CELL}>
									<span className="flex items-center gap-3">
										<Bar share={entry.share / topShare} tone={toneOf(entry.name)} />
										<span className="w-9 text-right font-mono text-zinc-700">{percent(entry.share)}</span>
									</span>
								</td>
								<td className={`${CELL} hidden text-right font-mono text-zinc-700 @[34rem]:table-cell`}>
									{entry.prompts}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

const DONUT_TONE: Record<Tone, string> = {
	positive: "text-good",
	neutral: "text-zinc-300",
	mixed: "text-chart-2",
	negative: "text-bad",
};
const PASSAGE_TABS = [
	{ id: "praise", label: "Praise" },
	{ id: "mixed", label: "Mixed" },
	{ id: "criticism", label: "Criticism" },
] as const;
type PassageTab = (typeof PASSAGE_TABS)[number]["id"];

export function Sentiment({ lead = false }: ScreenProps) {
	const [tab, setTab] = useState<PassageTab>("praise");
	const data = PREVIEW.sentiment;
	const score = show("sentiment", PREVIEW.cards.sentiment.value);
	return (
		<div className="grid gap-3 @[54rem]:grid-cols-2">
			<div className={`${BOX} p-4`}>
				<p className={BOX_TITLE}>Sentiment</p>
				<div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
					<Donut
						parts={TONES.map((tone) => ({ name: tone, tone: DONUT_TONE[tone], value: data.breakdown[tone] }))}
						label={`Sentiment score ${score} out of 100: ${TONES.map((tone) => `${data.breakdown[tone]}% ${tone}`).join(", ")}`}
					>
						<span className="font-mono text-[2rem] leading-none font-medium tracking-[-0.04em] text-ink">{score}</span>
					</Donut>
					<dl className="min-w-44 flex-1 text-sm">
						{TONES.map((tone) => (
							<div
								key={tone}
								className="flex items-center justify-between gap-3 border-t border-zinc-200 py-2 first:border-t-0"
							>
								<dt className="flex items-center gap-2 text-ink">
									<Swatch tone={DONUT_TONE[tone]} />
									{TONE_LABEL[tone]}
								</dt>
								<dd className="font-mono text-zinc-700">{data.breakdown[tone]}%</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
			<div className={`${BOX} p-4`}>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<p className={BOX_TITLE}>What AI Says About You</p>
					<Segmented label="Kind of passage" options={[...PASSAGE_TABS]} value={tab} onChange={setTab} />
				</div>
				<ul className="mt-4 space-y-4">
					{data.passages[tab].slice(0, lead ? 2 : 3).map((passage) => (
						<li key={passage.passage} className="flex gap-3">
							<span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ring-1 ring-zinc-200">
								<Engine model={passage.model} className="size-3.5" />
							</span>
							<div className="min-w-0">
								<p className="text-sm leading-relaxed text-ink">{passage.passage}</p>
								<p className="mt-1 flex flex-wrap gap-x-3 text-xs text-zinc-500">
									{isKind(passage.sentiment) ? <ToneWord kind={passage.sentiment} /> : null}
									<span>{passage.prompt}</span>
									<span suppressHydrationWarning>{ago(passage.daysAgo)}</span>
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>
			{lead ? null : (
				<div className={`${BOX} hidden p-4 @[54rem]:col-span-2 @[54rem]:block`}>
					<p className={BOX_TITLE}>Sentiment by Model</p>
					<div className="mt-3">
						<EngineTable metric="sentiment" companies={ranked("sentiment").slice(0, 6)} />
					</div>
				</div>
			)}
		</div>
	);
}

const KINDS: AnswerKind[] = [...TONES, "unmentioned"];

function AnswerFilter({ value, onChange }: { value: AnswerKind | null; onChange: (kind: AnswerKind | null) => void }) {
	const counts = PREVIEW.responseCounts;
	const judged = TONES.reduce((sum, tone) => sum + counts[tone], 0) || 1;
	return (
		<div className={`${BOX} p-4`}>
			<p className="text-sm text-zinc-600">
				<span className="font-mono font-medium text-ink">{percent(counts.positive / judged)} positive</span> across{" "}
				{count(counts.all)} answers
			</p>
			<div aria-hidden="true" className="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full">
				{TONES.map((tone) => (
					<span key={tone} className={TONE_FILL[tone]} style={{ flexGrow: counts[tone] }} />
				))}
			</div>
			<fieldset aria-label="Show answers by tone" className="-mx-1.5 mt-2 flex min-w-0 flex-wrap gap-x-1">
				{KINDS.map((kind) => (
					<Press
						key={kind}
						pressed={value === kind}
						onPress={() => onChange(value === kind ? null : kind)}
						className={`inline-flex h-9 items-center gap-1.5 rounded-md px-1.5 text-sm ${
							value === kind ? "bg-paper-2 font-medium text-ink" : "text-zinc-600 hover:text-ink"
						}`}
					>
						<span aria-hidden="true" className={`size-2.5 rounded-xs ${TONE_FILL[kind]}`} />
						{TONE_LABEL[kind]}
						<span className="font-mono text-zinc-500">{count(counts[kind])}</span>
					</Press>
				))}
			</fieldset>
		</div>
	);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="min-w-0">
			<dt className="text-xs text-zinc-500">{label}</dt>
			<dd className="mt-1 text-ink">{children}</dd>
		</div>
	);
}

function AnswerCard({ answer }: { answer: Answer }) {
	const still = useStill();
	const named = answer.brands.some((brand) => brand.name === BRAND);
	return (
		<div className={`${BOX} text-sm`}>
			<dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 @[30rem]:grid-cols-3">
				<div className="col-span-full">
					<dt className="text-xs text-zinc-500">Prompt</dt>
					<dd className={`mt-1 ${BOX_TITLE}`}>{answer.prompt}</dd>
				</div>
				<Field label="Model">
					<Engine model={answer.model} named />
				</Field>
				<Field label="Version">
					<span className="font-mono text-[0.8125rem]">{answer.version}</span>
				</Field>
				<Field label="Evaluated">
					<span suppressHydrationWarning>
						{ago(answer.daysAgo)}, {answer.time}
					</span>
				</Field>
			</dl>
			<dl className="space-y-4 border-t border-zinc-200 p-4">
				{answer.webQueries.length ? (
					<Field label="Web Queries">
						<ul className="flex flex-wrap gap-1.5">
							{answer.webQueries.map((query) => (
								<li key={query}>
									<Chip className="rounded-full px-2.5">{query}</Chip>
								</li>
							))}
						</ul>
					</Field>
				) : null}
				<Field label="Brands Mentioned">
					<ul className="flex flex-wrap gap-1.5">
						{answer.brands.map((brand) => (
							<li key={brand.name}>
								<Chip className={brand.name === BRAND ? "font-medium ring-zinc-400" : ""}>
									<Mark name={brand.name} className="size-4" />
									{brand.name}
									<span className="font-mono font-normal text-zinc-500">#{brand.rank}</span>
									{isKind(brand.sentiment) ? <ToneWord kind={brand.sentiment} /> : null}
								</Chip>
							</li>
						))}
					</ul>
					{named ? null : <p className="mt-2 text-zinc-600">{BRAND} is not in this answer.</p>}
				</Field>
			</dl>
			{still ? null : (
				<details className="group border-t border-zinc-200">
					<summary
						className={`flex h-11 cursor-pointer list-none items-center gap-2 rounded-b-xl px-4 font-medium text-ink [&::-webkit-details-marker]:hidden ${FOCUS}`}
					>
						<svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 group-open:rotate-90">
							<path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
						</svg>
						<span className="group-open:hidden">Read the answer</span>
						<span className="hidden group-open:inline">Hide the answer</span>
					</summary>
					<div className="space-y-3 px-4 pb-4 leading-relaxed text-zinc-700">
						{answer.title ? <p className="text-base font-medium text-ink">{answer.title}</p> : null}
						{answer.intro.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
						<ol className="space-y-2">
							{answer.picks.map((pick) => (
								<li key={pick.name}>
									<span className="font-medium text-ink">
										{pick.rank}. {pick.name}
									</span>{" "}
									{pick.line}
								</li>
							))}
						</ol>
					</div>
				</details>
			)}
		</div>
	);
}

export function Responses({ lead = false }: ScreenProps) {
	const [kind, setKind] = useState<AnswerKind | null>(null);
	const shown = PREVIEW.responses.filter((answer) => !kind || answer.kind === kind).slice(0, 1);
	return (
		<div className="space-y-3">
			{lead ? null : <AnswerFilter value={kind} onChange={setKind} />}
			{shown.map((answer) => (
				<AnswerCard key={answer.kind} answer={answer} />
			))}
		</div>
	);
}

const STATUS: Record<string, string> = { supported: "Available", never: "Not exposed" };
const WORD_SIZE = [
	"text-3xl text-chart-7",
	"text-2xl text-chart-1",
	"text-xl text-good",
	"text-base text-good",
	"text-sm text-warn",
];
const FANOUT_TABS = [
	{ id: "words", label: "Query Words" },
	{ id: "queries", label: "Top Queries" },
] as const;
type FanOutTab = (typeof FANOUT_TABS)[number]["id"];

/* The heaviest words go in the middle of the cloud, the lightest at its ends. */
function cloud<Word>(words: Word[]) {
	const laid: Word[] = [];
	words.forEach((word, index) => {
		if (index % 2) laid.unshift(word);
		else laid.push(word);
	});
	return laid;
}

export function FanOut({ lead = false }: ScreenProps) {
	const [tab, setTab] = useState<FanOutTab>("words");
	const data = PREVIEW.fanout;
	const heaviest = data.terms[0]?.count || 1;
	const size = (weight: number) =>
		WORD_SIZE[Math.min(WORD_SIZE.length - 1, Math.floor((1 - Math.sqrt(weight / heaviest)) * 6.5))];
	const busiest = data.topQueries[0]?.count || 1;
	return (
		<div className="space-y-3">
			{lead ? null : (
				<>
					<div className="grid grid-cols-2 gap-3 @[34rem]:grid-cols-3">
						<Stat label="Search Prompt Runs" value={count(data.runs)} className="col-span-2 @[34rem]:col-span-1" />
						<Stat label="Prompt Runs w/ Known Queries" value={count(data.knownRuns)} />
						<Stat label="Average Fan-Out" value={String(data.average)} />
					</div>
					<div className={`${BOX} p-4`}>
						<p className={BOX_TITLE}>Query Availability</p>
						<ul className="mt-3 flex flex-wrap gap-2 text-sm">
							{data.availability.map((engine) => (
								<li
									key={engine.model}
									className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
										engine.status === "supported" ? "bg-good-tint text-good" : "bg-paper-2 text-zinc-600"
									}`}
								>
									<span className="font-medium text-ink">
										<Engine model={engine.model} named className="size-3.5" />
									</span>
									{STATUS[engine.status] ?? "Unknown"}
								</li>
							))}
						</ul>
					</div>
				</>
			)}
			<div className={`${BOX} p-4`}>
				<Segmented label="View" options={[...FANOUT_TABS]} value={tab} onChange={setTab} />
				{tab === "words" ? (
					<ul className="mt-4 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 leading-tight font-medium">
						{cloud(data.terms).map((term) => (
							<li key={term.term} className={size(term.count)}>
								{term.term}
							</li>
						))}
					</ul>
				) : (
					<ol className="mt-3 text-sm">
						{data.topQueries.map((query) => (
							<li
								key={query.query}
								className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-200 py-2.5"
							>
								<span className="min-w-0 flex-1 basis-52 text-ink">{query.query}</span>
								<span className="flex w-40 items-center gap-3">
									<Bar share={query.count / busiest} tone="text-chart-7" />
									<span className="w-8 text-right font-mono text-zinc-700">{query.count}</span>
								</span>
								<span className="w-28 text-right text-zinc-600">
									<span className="font-mono text-ink">{query.brandPct}%</span> name you
								</span>
							</li>
						))}
					</ol>
				)}
			</div>
		</div>
	);
}

const CATEGORY_LABEL: Record<string, string> = {
	editorial: "Editorial",
	reviews: "Reviews",
	social: "Social",
	competitor: "Competitors",
	brand: "Your Brand",
	reference: "Reference",
	developer: "Developer",
	pr: "PR",
	institutional: "Institutional",
	other: "Other",
};
const CATEGORY_TONE: Record<string, string> = {
	editorial: "text-chart-7",
	reviews: "text-chart-2",
	social: "text-chart-3",
	competitor: "text-chart-6",
	brand: "text-chart-1",
	other: "text-chart-9",
};

/* The five biggest kinds of source each get a layer; the long tail is one layer called Other. */
function citationLayers() {
	const data = PREVIEW.citations;
	const series = data.series as Record<string, number[]>;
	const named = data.categories.filter((category) => category.key !== "other").slice(0, 5);
	const rest = data.categories.filter((category) => !named.includes(category));
	const days = series[named[0]?.key ?? ""]?.length ?? 0;
	const other = Array.from({ length: days }, (_, day) =>
		rest.reduce((sum, category) => sum + (series[category.key]?.[day] ?? 0), 0),
	);
	return [
		{ name: "other", tone: CATEGORY_TONE.other, values: other },
		...named.reverse().map((category) => ({
			name: category.key,
			tone: CATEGORY_TONE[category.key] ?? CATEGORY_TONE.other,
			values: series[category.key] ?? [],
		})),
	];
}

export function Citations({ lead = false }: ScreenProps) {
	const data = PREVIEW.citations;
	const layers = citationLayers();
	const most = data.domains[0]?.count || 1;
	return (
		<div className="space-y-3">
			<div className="grid grid-cols-2 gap-3 @[34rem]:grid-cols-3">
				<Stat
					label="Brand Citation Share"
					value={`${data.brandSharePct}%`}
					className="col-span-2 @[34rem]:col-span-1"
				/>
				<Stat label="Unique Domains" value={count(data.uniqueDomains)} />
				<Stat label="Total Citations" value={count(data.total)} />
			</div>
			<div className="grid gap-3 @[60rem]:grid-cols-2">
				<div className={`${BOX} p-4`}>
					<p className={BOX_TITLE}>Citation Categories</p>
					<div className="mt-4">
						<StackedArea
							layers={layers}
							label="The share of citations going to each kind of source, day by day over the last 30 days"
							dayAt={dayOf(layers[0]?.values.length ?? 0)}
							height="h-40 @[60rem]:h-52"
						/>
						<ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
							{[...layers].reverse().map((layer) => (
								<li key={layer.name} className="flex items-center gap-1.5">
									<Swatch tone={layer.tone} />
									{CATEGORY_LABEL[layer.name] ?? layer.name}
								</li>
							))}
						</ul>
					</div>
				</div>
				{lead ? null : (
					<div className={`${BOX} p-4`}>
						<p className={BOX_TITLE}>Top Cited Domains</p>
						<ol className="mt-3 text-sm">
							{data.domains.slice(0, 6).map((domain, index) => (
								<li key={domain.domain} className="flex items-center gap-3 border-t border-zinc-200 py-2">
									<span className="w-3 text-zinc-500 tabular-nums">{index + 1}</span>
									<span
										className={`min-w-0 flex-1 truncate text-ink ${domain.category === "brand" ? "font-medium" : ""}`}
									>
										{domain.domain}
									</span>
									<span className="hidden w-24 text-zinc-600 @[30rem]:inline">
										{CATEGORY_LABEL[domain.category] ?? domain.category}
									</span>
									<span className="flex w-36 items-center gap-3">
										<Bar share={domain.count / most} tone={CATEGORY_TONE[domain.category] ?? CATEGORY_TONE.other} />
										<span className="w-11 text-right font-mono text-zinc-700">{count(domain.count)}</span>
									</span>
								</li>
							))}
						</ol>
					</div>
				)}
			</div>
		</div>
	);
}

const FIX_LABEL: Record<string, string> = {
	creation: "Creation",
	"existing-content": "Existing Content",
	outreach: "Outreach",
	social: "Social",
};

export function Opportunities({ lead = false }: ScreenProps) {
	const data = PREVIEW.opportunities;
	const kinds = Object.keys(FIX_LABEL).filter((kind) => data.items.some((item) => item.category === kind));
	const [kind, setKind] = useState(kinds[0] ?? "");
	return (
		<div className="space-y-3">
			{lead ? null : (
				<div className={`${BOX} hidden p-4 @[54rem]:block`}>
					<p className={BOX_TITLE}>Summary</p>
					<ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-700">
						{data.summary.slice(0, 3).map((line) => (
							<li key={line}>{line}</li>
						))}
					</ul>
				</div>
			)}
			<Segmented
				label="Kind of fix"
				options={kinds.map((id) => ({
					id,
					label: (
						<>
							{FIX_LABEL[id]}
							<span className="font-mono font-normal text-zinc-500">
								{data.items.filter((item) => item.category === id).length}
							</span>
						</>
					),
				}))}
				value={kind}
				onChange={setKind}
			/>
			<ul className="grid gap-3 @[62rem]:grid-cols-3">
				{data.items
					.filter((item) => item.category === kind)
					.map((item) => (
						<li key={item.title} className={`${BOX} p-4`}>
							<p className={BOX_TITLE}>{item.title}</p>
							<p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{item.why}</p>
							<ul className="mt-3 flex flex-wrap gap-2 border-t border-zinc-200 pt-3 text-sm text-ink">
								{[
									["Prompts", item.prompts],
									["Your citations", item.yours],
									["Competitor citations", item.theirs],
								].map(([label, total]) => (
									<li key={label}>
										<Chip>
											{label}
											<span className="font-mono text-zinc-500">{total}</span>
										</Chip>
									</li>
								))}
							</ul>
						</li>
					))}
			</ul>
		</div>
	);
}

export function Prompts() {
	const [tag, setTag] = useState<string | null>(null);
	const tags = [...new Set(PREVIEW.prompts.flatMap((prompt) => prompt.tags))];
	const shown = PREVIEW.prompts.filter((prompt) => !tag || prompt.tags.includes(tag));
	return (
		<div className={`${BOX} p-4`}>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
				<p className={`${BOX_TITLE} mr-auto`}>Prompts</p>
				<fieldset aria-label="Show prompts by tag" className="flex min-w-0 flex-wrap gap-1.5">
					{tags.map((name) => (
						<Press
							key={name}
							pressed={tag === name}
							onPress={() => setTag(tag === name ? null : name)}
							className={`inline-flex h-9 items-center rounded-full px-3 text-sm capitalize ring-1 ${
								tag === name ? "bg-ink text-paper ring-ink" : "text-zinc-700 ring-zinc-200 hover:ring-zinc-400"
							}`}
						>
							{name}
						</Press>
					))}
				</fieldset>
			</div>
			<ul className="mt-3 text-sm">
				{shown.map((prompt) => (
					<li
						key={prompt.value}
						className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-zinc-200 py-2.5"
					>
						<span className="min-w-0 flex-1 basis-60 text-ink">{prompt.value}</span>
						<span className="flex flex-wrap gap-1.5 text-xs text-zinc-700">
							<span className="rounded-full bg-paper-2 px-2 py-1">{prompt.branded ? "Branded" : "Unbranded"}</span>
							{prompt.tags.map((name) => (
								<span key={name} className="rounded-full px-2 py-1 capitalize ring-1 ring-zinc-200">
									{name}
								</span>
							))}
						</span>
						<span className="w-24 text-right text-zinc-600">
							<span className="font-mono text-ink">{prompt.pct}%</span> visible
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
