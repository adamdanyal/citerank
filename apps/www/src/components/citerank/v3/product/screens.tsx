import { type ReactNode, useState } from "react";
import { EngineIcon } from "@/components/home/engines";
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
	TONE_LABEL,
	type Tone,
} from "../../product/data";
import { Engine, FOCUS, Mark, Press } from "../../product/parts";
import { Pen } from "../kit";
import { Bar, Donut, LineChart } from "./charts";
import { BOX, BOX_TITLE, Chip, Legend, LineKey, Segmented, TONE_FILL, ToneWord, toneOf } from "./parts";

/* `lead` keeps a screen to the one block that says what it is for, where there is room for no more. */
export interface ScreenProps {
	lead?: boolean;
}

const BRAND = PREVIEW.brand;
const TONES: Tone[] = ["positive", "neutral", "mixed", "negative"];
const dayOf = (size: number) => (index: number) => dayLabel(size - 1 - index);
const lineOf = (company: Company, metric: Metric) => ({
	name: company.name,
	tone: toneOf(company.name),
	values: company.series[metric].map((value) => plotted(metric, value)),
	strong: company.isBrand,
});

/* The cards compare the last day of the 30 with the first, as the app's own cards do. */
const SINCE = "vs 30 days ago";

function moved(metric: Metric, change: number) {
	const sign = change > 0 ? "+" : "−";
	if (metric === "position") {
		return Math.abs(change) >= 0.05 ? `${sign}${Math.abs(change).toFixed(1)}` : "";
	}
	const points = Math.abs(Math.round(change * 100));
	if (!points) return "";
	return metric === "sentiment" ? `${sign}${points}` : `${sign}${points} pts`;
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
	return (
		<Press
			pressed={active}
			onPress={onPick}
			className={`flex flex-col rounded-[8px] bg-(--v3-card) p-4 text-left transition-shadow duration-150 ease-(--v3-ease) ${
				active ? "ring-2 ring-(--v3-rust)" : "ring-1 ring-(--v3-line) hover:ring-(--v3-line-strong)"
			}`}
		>
			<span className="text-sm text-(--v3-text-2)">{label}</span>
			<span className="mt-2 text-[2rem] leading-none font-medium tracking-[-0.02em] text-(--v3-text) tabular-nums">
				{show(metric, card.value)}
			</span>
			<span className="mt-3 text-[0.8125rem] leading-[1.35] tabular-nums">
				<span className="block text-(--v3-text-2)">{change || "No change"}</span>{" "}
				<span className="block text-(--v3-text-3)">{SINCE}</span>
			</span>
		</Press>
	);
}

/* The first two AI apps show at any width; the rest join as the table gets room. */
const ENGINE_CELL = [
	"",
	"",
	"hidden @[29rem]:table-cell",
	"hidden @[29rem]:table-cell",
	"hidden @[35rem]:table-cell",
	"hidden @[35rem]:table-cell",
];
const CELL = "border-t border-(--v3-line) py-1";

/* `keyed` puts each brand's line tone at the start of its row, so the table is the key to the chart above it. */
function EngineTable({ metric, companies, keyed = false }: { metric: Metric; companies: Company[]; keyed?: boolean }) {
	const values = companies.flatMap((company) => ENGINES.map((engine) => byEngine(company, engine.model, metric)));
	const low = Math.min(...values);
	const span = Math.max(...values) - low || 1;
	const strength = (value: number) => (metric === "position" ? 1 - (value - low) / span : (value - low) / span);
	const name = METRICS.find((item) => item.id === metric)?.tab ?? "";
	return (
		<div className="@container min-w-0">
			<table className="w-full border-separate border-spacing-0 text-sm tabular-nums">
				<caption className="sr-only">
					{name} for {BRAND} and its rivals, overall and in each AI tool
				</caption>
				<thead>
					<tr className="text-(--v3-text-3)">
						<th scope="col" className="pb-2 text-left align-bottom font-normal">
							Company
						</th>
						<th scope="col" className="pb-2 text-right align-bottom font-normal">
							All
						</th>
						{ENGINES.map((engine, place) => (
							<th
								key={engine.model}
								scope="col"
								title={engine.label}
								className={`pb-2 pl-1.5 align-bottom font-normal ${ENGINE_CELL[place] ?? ""}`}
							>
								<span className="flex flex-col items-center gap-1 text-(--v3-text)">
									<EngineIcon iconId={engine.iconId} className="size-4" />
									<span className="text-xs leading-none text-(--v3-text-2)">{engine.short}</span>
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
									{keyed ? (
										<LineKey tone={toneOf(company.name)} />
									) : (
										<span className="w-3 font-normal text-(--v3-text-3)">{index + 1}</span>
									)}
									<Mark name={company.name} />
									{company.isBrand ? (
										<Pen className="ml-1 text-(--v3-text)">{company.name}</Pen>
									) : (
										<span className="truncate text-(--v3-text)">{company.name}</span>
									)}
								</span>
							</th>
							<td className={`${CELL} text-right font-mono font-medium text-(--v3-text)`}>
								{show(metric, company.totals[metric])}
							</td>
							{ENGINES.map((engine, place) => {
								const value = byEngine(company, engine.model, metric);
								return (
									<td key={engine.model} className={`${CELL} pl-1.5 ${ENGINE_CELL[place] ?? ""}`}>
										<span
											className="block rounded-[4px] px-1 py-1 text-center font-mono text-[0.8125rem] leading-4 text-(--v3-text)"
											style={{
												backgroundColor: `color-mix(in oklab, var(--v3-text) ${Math.round(3 + strength(value) * 13)}%, transparent)`,
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

function Landscape({ metric }: { metric: Metric }) {
	const top = ranked(metric).slice(0, 5);
	const name = METRICS.find((item) => item.id === metric)?.tab ?? "";
	return (
		<div className={`${BOX} p-4`}>
			<p className={BOX_TITLE}>Competitive Landscape</p>
			<p className="mt-0.5 text-sm text-(--v3-text-2)">{name}, last 30 days</p>
			<div className="mt-4 grid items-center gap-5 @[56rem]:grid-cols-2">
				<LineChart
					lines={top.map((company) => lineOf(company, metric))}
					label={`${name} over the last 30 days for ${BRAND} and four rivals`}
					dayAt={dayOf(PREVIEW.days)}
					format={axisLabel(metric)}
					exact={metric === "position" ? (value) => value.toFixed(1) : undefined}
					height="h-[var(--chart-height,9rem)]"
				/>
				<EngineTable metric={metric} companies={top} keyed />
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
			{lead ? null : <Landscape metric={metric} />}
		</div>
	);
}

export function ShareOfVoice({ lead = false }: ScreenProps) {
	const board = PREVIEW.leaderboard;
	const topShare = board[0]?.share || 1;
	const top = ranked("share").slice(0, 5);
	return (
		<div className="grid grid-cols-[minmax(0,1fr)] gap-3 @[60rem]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
			{lead ? null : (
				<div className={`${BOX} p-4`}>
					<p className={BOX_TITLE}>Share of Voice, last 30 days</p>
					<div className="mt-4">
						<LineChart
							lines={top.map((company) => lineOf(company, "share"))}
							label={`Share of voice over the last 30 days for ${BRAND} and four rivals`}
							dayAt={dayOf(PREVIEW.days)}
							format={axisLabel("share")}
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
						<tr className="text-(--v3-text-3)">
							<th scope="col" className="w-7 pr-2 pb-2 text-left font-normal">
								#
							</th>
							<th scope="col" className="pb-2 text-left font-normal">
								Brand
							</th>
							<th scope="col" className="hidden pr-4 pb-2 text-right font-normal @[26rem]:table-cell">
								Mentions
							</th>
							<th scope="col" className="w-[40%] pb-2 text-left font-normal">
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
								<td className={`${CELL} pr-2 font-mono text-(--v3-text-3)`}>{index + 1}</td>
								<th scope="row" className={`${CELL} pr-2 text-left font-normal`}>
									<span className="flex items-center gap-2">
										<Mark name={entry.name} className="size-6" />
										{entry.name === BRAND ? (
											<>
												<Pen className="ml-1 font-medium text-(--v3-text)">{entry.name}</Pen>
												<span className="ml-1 text-xs text-(--v3-text-3)">You</span>
											</>
										) : (
											<span className="truncate text-(--v3-text)">{entry.name}</span>
										)}
									</span>
								</th>
								<td className={`${CELL} hidden pr-4 text-right font-mono text-(--v3-text) @[26rem]:table-cell`}>
									{entry.mentions}
								</td>
								<td className={CELL}>
									<span className="flex items-center gap-3">
										<Bar
											share={entry.share / topShare}
											tone={entry.name === BRAND ? toneOf(entry.name) : "text-(--v3-series-3)"}
										/>
										<span className="w-9 text-right font-mono text-(--v3-text-2)">{percent(entry.share)}</span>
									</span>
								</td>
								<td className={`${CELL} hidden text-right font-mono text-(--v3-text-2) @[34rem]:table-cell`}>
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
	positive: "text-(--v3-good)",
	neutral: "text-(--v3-series-3)",
	mixed: "text-(--v3-series-2)",
	negative: "text-(--v3-bad)",
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
		<div className="grid grid-cols-[minmax(0,1fr)] gap-3 @[54rem]:grid-cols-2">
			<div className={`${BOX} p-4`}>
				<p className={BOX_TITLE}>Sentiment</p>
				<div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
					<Donut
						parts={TONES.map((tone) => ({ name: tone, tone: DONUT_TONE[tone], value: data.breakdown[tone] }))}
						label={`Sentiment score ${score} out of 100: ${TONES.map((tone) => `${data.breakdown[tone]}% ${tone}`).join(", ")}`}
					>
						<span className="text-[2rem] leading-none font-medium tracking-[-0.02em] text-(--v3-text) tabular-nums">
							{score}
						</span>
					</Donut>
					<dl className="min-w-44 flex-1 text-sm">
						{TONES.map((tone) => (
							<div
								key={tone}
								className="flex items-center justify-between gap-3 border-t border-(--v3-line) py-2 first:border-t-0"
							>
								<dt className="flex items-center gap-2 text-(--v3-text)">
									<span
										aria-hidden="true"
										className={`size-2.5 shrink-0 rounded-[2px] bg-current ${DONUT_TONE[tone]}`}
									/>
									{TONE_LABEL[tone]}
								</dt>
								<dd className="font-mono text-(--v3-text-2)">{data.breakdown[tone]}%</dd>
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
							<span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ring-1 ring-(--v3-line)">
								<Engine model={passage.model} className="size-3.5" />
							</span>
							<div className="min-w-0">
								<p className="text-sm leading-relaxed text-(--v3-text)">{passage.passage}</p>
								<p className="mt-1 flex flex-wrap gap-x-3 text-xs text-(--v3-text-3)">
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
				<div className={`${BOX} p-4 @[54rem]:col-span-2`}>
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
			<p className="text-sm text-(--v3-text-2)">
				<span className="font-medium text-(--v3-text)">
					<span className="font-mono">{percent(counts.positive / judged)}</span> positive
				</span>{" "}
				across {count(counts.all)} answers
			</p>
			<div aria-hidden="true" className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
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
						className={`inline-flex h-9 items-center gap-1.5 rounded-[4px] px-1.5 text-sm transition-colors duration-150 ease-(--v3-ease) ${
							value === kind
								? "bg-(--v3-raised) font-medium text-(--v3-text)"
								: "text-(--v3-text-2) hover:text-(--v3-text)"
						}`}
					>
						<span aria-hidden="true" className={`size-2.5 rounded-[2px] ${TONE_FILL[kind]}`} />
						{TONE_LABEL[kind]}
						<span className="font-mono text-(--v3-text-2)">{count(counts[kind])}</span>
					</Press>
				))}
			</fieldset>
		</div>
	);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="min-w-0">
			<dt className="text-xs text-(--v3-text-3)">{label}</dt>
			<dd className="mt-1 text-(--v3-text)">{children}</dd>
		</div>
	);
}

function AnswerCard({ answer }: { answer: Answer }) {
	const named = answer.brands.some((brand) => brand.name === BRAND);
	return (
		<div className={`${BOX} text-sm`}>
			<dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 @[30rem]:grid-cols-3">
				<div className="col-span-full">
					<dt className="text-xs text-(--v3-text-3)">Prompt</dt>
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
			<dl className="space-y-4 border-t border-(--v3-line) p-4">
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
								<Chip className={brand.name === BRAND ? "font-medium ring-(--v3-line-strong)" : ""}>
									<Mark name={brand.name} className="size-4" />
									{brand.name}
									<span className="font-mono font-normal text-(--v3-text-3)">#{brand.rank}</span>
									{isKind(brand.sentiment) ? <ToneWord kind={brand.sentiment} /> : null}
								</Chip>
							</li>
						))}
					</ul>
					{named ? null : <p className="mt-2 text-(--v3-text-2)">{BRAND} is not in this answer.</p>}
				</Field>
			</dl>
			<details className="group border-t border-(--v3-line)">
				<summary
					className={`flex h-11 cursor-pointer list-none items-center gap-2 rounded-b-[8px] px-4 font-medium text-(--v3-text) [&::-webkit-details-marker]:hidden ${FOCUS}`}
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 12 12"
						className="size-3 transition-transform duration-150 ease-(--v3-ease) group-open:rotate-90 motion-reduce:transition-none"
					>
						<path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
					<span className="group-open:hidden">Read the answer</span>
					<span className="hidden group-open:inline">Hide the answer</span>
				</summary>
				<div className="space-y-3 px-4 pb-4 leading-relaxed text-(--v3-text-2)">
					{answer.title ? <p className="text-base font-medium text-(--v3-text)">{answer.title}</p> : null}
					{answer.intro.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
					<ol className="space-y-2">
						{answer.picks.map((pick) => (
							<li key={pick.name}>
								<span className="block font-medium text-(--v3-text)">
									{pick.rank}. {pick.name}
								</span>
								{pick.line}
							</li>
						))}
					</ol>
				</div>
			</details>
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
				<div className={`${BOX} p-4`}>
					<p className={BOX_TITLE}>Summary</p>
					<ul className="mt-2 space-y-2 text-sm leading-relaxed text-(--v3-text-2)">
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
							<span className="font-mono font-normal text-(--v3-text-2)">
								{data.items.filter((item) => item.category === id).length}
							</span>
						</>
					),
				}))}
				value={kind}
				onChange={setKind}
			/>
			<ul className="grid grid-cols-[minmax(0,1fr)] gap-3 @[62rem]:grid-cols-3">
				{data.items
					.filter((item) => item.category === kind)
					.map((item) => (
						<li key={item.title} className={`${BOX} p-4`}>
							<p className={BOX_TITLE}>{item.title}</p>
							<p className="mt-1.5 text-sm leading-relaxed text-(--v3-text-2)">{item.why}</p>
							<ul className="mt-3 flex flex-wrap gap-2 border-t border-(--v3-line) pt-3 text-sm text-(--v3-text)">
								{[
									["Prompts", item.prompts],
									["Your citations", item.yours],
									["Competitor citations", item.theirs],
								].map(([label, total]) => (
									<li key={label}>
										<Chip>
											{label}
											<span className="font-mono text-(--v3-text-3)">{total}</span>
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
