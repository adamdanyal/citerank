import { getModelMeta } from "@workspace/config/models";
import preview from "@/data/product-preview.json";

/*
 * The product screens on this site are HTML, built from the sample data the
 * live demo shows (scripts/demo-data/export-preview.ts writes it). A visitor
 * who opens the demo finds the same brand and the same figures.
 */
export const DEMO_BRAND_PATH = "/app/org/quaildesk/brand/quaildesk";

export const PREVIEW = preview;
export type Metric = "visibility" | "share" | "sentiment" | "position";
export type Company = (typeof preview.companies)[number];
export type Answer = (typeof preview.responses)[number];
export type Tone = "positive" | "neutral" | "mixed" | "negative";
export type AnswerKind = Tone | "unmentioned";

export const METRICS: { id: Metric; label: string; tab: string }[] = [
	{ id: "visibility", label: "AI Visibility", tab: "Visibility" },
	{ id: "share", label: "Share of Voice", tab: "Share of Voice" },
	{ id: "sentiment", label: "Sentiment", tab: "Sentiment" },
	{ id: "position", label: "Position", tab: "Position" },
];

const ENGINE_ORDER = ["chatgpt", "gemini", "google-ai-overview", "perplexity", "claude", "bing-ai-mode"];
const enginePlace = (model: string) => ENGINE_ORDER.indexOf(model) + 1 || ENGINE_ORDER.length + 1;

const ENGINE_SHORT: Record<string, string> = { "google-ai-overview": "AI Overviews", "bing-ai-mode": "Bing" };

export function engineOf(model: string) {
	const meta = getModelMeta(model);
	return {
		model,
		label: meta.label,
		/** The name where there is a column's width for it. */
		short: ENGINE_SHORT[model] ?? meta.label,
		iconId: model === "gemini" ? "gemini" : meta.iconId,
	};
}
export const ENGINES = [...preview.models].sort((a, b) => enginePlace(a) - enginePlace(b)).map(engineOf);

/* A brand keeps one colour on every chart and one mark on every screen, by its place on the leaderboard. */
const BRAND_ORDER = preview.leaderboard.map((entry) => entry.name);
const LINE_TONES = [
	"text-chart-1",
	"text-chart-2",
	"text-chart-3",
	"text-chart-4",
	"text-chart-5",
	"text-chart-6",
	"text-chart-7",
	"text-chart-8",
	"text-chart-9",
];
export const placeOf = (name: string) => {
	const place = BRAND_ORDER.indexOf(name);
	return place === -1 ? LINE_TONES.length - 1 : place;
};
export const toneOf = (name: string) => LINE_TONES[placeOf(name) % LINE_TONES.length];

const NUMBER = new Intl.NumberFormat("en-US");
export const count = (value: number) => NUMBER.format(value);
export const percent = (value: number) => `${Math.round(value * 100)}%`;

export function show(metric: Metric, value: number) {
	if (metric === "position") return value.toFixed(1);
	if (metric === "sentiment") return String(Math.round(value * 100));
	return percent(value);
}

/* A chart plots whole numbers: percentages as 0 to 100, a position as it is. */
export const plotted = (metric: Metric, value: number) => (metric === "position" ? value : Math.round(value * 100));
export const axisLabel = (metric: Metric) => (value: number) =>
	metric === "visibility" || metric === "share" ? `${value}%` : String(value);

/* Position counts down: first place is best. Everything else counts up. */
export const ranked = (metric: Metric) =>
	[...preview.companies].sort((a, b) =>
		metric === "position" ? a.totals[metric] - b.totals[metric] : b.totals[metric] - a.totals[metric],
	);

export const byEngine = (company: Company, model: string, metric: Metric) =>
	(company.byModel as Record<string, Record<Metric, number>>)[model]?.[metric] ?? 0;

const DAY = 86_400_000;
const SHORT_DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

/* The sample data always ends today, so the screens never look out of date. */
export const dayLabel = (daysAgo: number) => SHORT_DATE.format(Date.now() - daysAgo * DAY);
export const ago = (days: number) => (days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`);

export const TONE_LABEL: Record<AnswerKind, string> = {
	positive: "Positive",
	neutral: "Neutral",
	mixed: "Mixed",
	negative: "Negative",
	unmentioned: "Doesn’t mention you",
};
export const TONE_TEXT: Record<AnswerKind, string> = {
	positive: "text-good",
	neutral: "text-zinc-600",
	mixed: "text-warn",
	negative: "text-bad",
	unmentioned: "text-zinc-500",
};
export const TONE_FILL: Record<AnswerKind, string> = {
	positive: "bg-good",
	neutral: "bg-zinc-300",
	mixed: "bg-chart-2",
	negative: "bg-bad",
	unmentioned: "bg-zinc-200",
};
export const isKind = (value: string): value is AnswerKind => value in TONE_LABEL;
