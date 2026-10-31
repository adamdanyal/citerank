import { Link } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { AlertTriangle, ArrowLeft, Check, ExternalLink } from "lucide-react";
import {
	CATEGORY_LABELS,
	type Competitor,
	ELMO_FEATURES,
	ENTRY_PRICE,
	FEATURE_CATEGORIES,
	type FeatureKey,
	formatFateDate,
	getComparisonFaqs,
	getComparisonVerdict,
	getPopularityGrade,
	getScreenshotUrl,
	getSoundbite,
	graveyardFate,
	isLowDR,
	PLAN_RANGE,
} from "@/lib/competitors";
import { CiteRankCta } from "./directory-shell";
import { Faq } from "./faq";
import { FeatureMark } from "./feature-mark";

function FeatureRow({ label, citeRank, competitor }: { label: string; citeRank: boolean; competitor: boolean }) {
	const citeRankWins = citeRank && !competitor;
	const competitorWins = !citeRank && competitor;
	return (
		<tr className="border-b border-dashed border-zinc-200 last:border-solid">
			<td className="py-3 pr-4 text-sm text-zinc-600">{label}</td>
			<td className={`px-4 py-3 text-center ${citeRankWins ? "bg-blue-50" : ""}`}>
				<FeatureMark has={citeRank} />
			</td>
			<td className={`px-4 py-3 text-center ${competitorWins ? "bg-blue-50" : ""}`}>
				<FeatureMark has={competitor} />
			</td>
		</tr>
	);
}

function FateNotice({ competitor }: { competitor: Competitor }) {
	const fate = graveyardFate(competitor);
	if (!fate || !competitor.fate) return null;
	const heading =
		fate === "shut-down"
			? `${competitor.name} has shut down`
			: fate === "pivoted"
				? `${competitor.name} has pivoted away from AI visibility`
				: `${competitor.name} has been acquired`;
	return (
		<div className="mt-6 max-w-3xl rounded-md border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
			<p className="font-medium text-zinc-950">
				{heading} ({formatFateDate(competitor.fate.date)})
			</p>
			<p className="mt-1">
				{competitor.fate.summary}{" "}
				<Link to="/ai-visibility-tools/graveyard" className="text-blue-700 hover:underline">
					See the AEO Graveyard
				</Link>{" "}
				for what to do next.
			</p>
		</div>
	);
}

function diffFeatures(competitor: Competitor): {
	citeRankOnlyFeatures: string[];
	competitorOnlyFeatures: string[];
	sharedFeatures: string[];
} {
	const citeRankOnlyFeatures: string[] = [];
	const competitorOnlyFeatures: string[] = [];
	const sharedFeatures: string[] = [];

	for (const category of Object.values(FEATURE_CATEGORIES)) {
		for (const featureKey of Object.keys(category.features)) {
			const key = featureKey as FeatureKey;
			const label = category.features[key].label;
			const citeRankHas = ELMO_FEATURES[key] ?? false;
			const competitorHas = competitor.features[key] ?? false;
			if (citeRankHas && competitorHas) sharedFeatures.push(label);
			else if (citeRankHas) citeRankOnlyFeatures.push(label);
			else if (competitorHas) competitorOnlyFeatures.push(label);
		}
	}

	return { citeRankOnlyFeatures, competitorOnlyFeatures, sharedFeatures };
}

export function CompetitorComparison({ competitor }: { competitor: Competitor }) {
	const { citeRankOnlyFeatures, competitorOnlyFeatures, sharedFeatures } = diffFeatures(competitor);

	return (
		<>
			{/* Back link */}
			<div className="mx-auto max-w-6xl px-4 pt-8 md:px-6">
				<Link
					to="/ai-visibility-tools"
					className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
				>
					<ArrowLeft className="h-3 w-3" />
					AI Visibility Tool Directory
				</Link>
			</div>

			{/* Hero */}
			<section className="border-b border-zinc-200 bg-white py-12 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<h1 className="font-heading text-4xl text-balance text-zinc-950 md:text-5xl">
						CiteRank.com vs {competitor.name}
					</h1>
					<p className="mt-4 max-w-3xl text-lg text-balance text-zinc-600">{getComparisonVerdict(competitor)}</p>
					<div className="mt-6 max-w-3xl border-l-2 border-blue-600 pl-4">
						<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">The Short Version</p>
						<p className="mt-1 text-lg font-medium text-balance text-zinc-950">{getSoundbite(competitor)}</p>
					</div>
					<FateNotice competitor={competitor} />
					{isLowDR(competitor) && !graveyardFate(competitor) && (
						<p className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50 px-3 py-1 text-sm text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
							<AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
							{competitor.name} appears to be a very early-stage product with limited adoption.
						</p>
					)}
				</div>
			</section>

			{/* Quick summary */}
			<section className="border-b border-zinc-200 bg-zinc-50 py-8">
				<div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 md:px-6">
					<div>
						<h3 className="mb-1 text-lg font-semibold text-zinc-950">CiteRank.com</h3>
						<div className="mt-2 flex flex-wrap gap-2">
							<Badge variant="secondary">Search Agency</Badge>
							<Badge variant="secondary">12 AI Apps</Badge>
							<Badge variant="secondary">From {ENTRY_PRICE}</Badge>
						</div>
						<p className="mt-3 text-sm text-zinc-600">
							AI visibility tracker and AI search agency for AEO. Track AI visibility across ChatGPT, Claude, and Google
							AI Overviews, with every answer kept in full.
						</p>
					</div>
					<div>
						<h3 className="mb-1 text-lg font-semibold text-zinc-950">{competitor.name}</h3>
						<div className="mt-2 flex flex-wrap gap-2">
							<Badge variant="secondary">{CATEGORY_LABELS[competitor.category]}</Badge>
							{competitor.pricing?.hasFree && <Badge variant="secondary">Free Tier</Badge>}
							{competitor.pricing?.startingPrice && (
								<Badge variant="secondary">From {competitor.pricing.startingPrice}</Badge>
							)}
						</div>
						<p className="mt-3 text-sm text-zinc-600">{competitor.tagline}</p>
					</div>
				</div>
			</section>

			{/* Screenshot */}
			{!competitor.noScreenshot && (
				<section className="border-b border-zinc-200 bg-white py-12">
					<div className="mx-auto max-w-6xl px-4 md:px-6">
						<h2 className="font-heading mb-6 text-2xl text-zinc-950">{competitor.name} at a Glance</h2>
						<div className="overflow-hidden rounded-md border border-zinc-200 shadow-sm">
							<img
								src={getScreenshotUrl(competitor.slug)}
								alt={`Screenshot of ${competitor.name} homepage`}
								width={1920}
								height={1080}
								className="aspect-video w-full object-cover object-top"
								loading="lazy"
							/>
						</div>
						<div className="mt-3 flex items-center gap-2">
							<a
								href={competitor.url}
								target="_blank"
								rel="noopener noreferrer nofollow"
								className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
							>
								Visit {competitor.domain}
								<ExternalLink className="h-3 w-3" />
							</a>
						</div>
					</div>
				</section>
			)}

			{/* About the competitor */}
			<section className="border-b border-zinc-200 bg-white py-12">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<h2 className="font-heading mb-4 text-2xl text-zinc-950">About {competitor.name}</h2>
					<p className="leading-relaxed text-zinc-600">{competitor.description}</p>
					<p className="mt-4 text-sm text-zinc-500">
						Popularity Grade: <span className="font-semibold text-zinc-950">{getPopularityGrade(competitor)}</span>
					</p>
					{competitor.highlights && competitor.highlights.length > 0 && (
						<ul className="mt-4 space-y-2">
							{competitor.highlights.map((h) => (
								<li key={h} className="flex items-start gap-2 text-sm text-zinc-600">
									<Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
									{h}
								</li>
							))}
						</ul>
					)}
				</div>
			</section>

			{/* Feature comparison table */}
			<section className="border-b border-zinc-200 bg-white py-12">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<h2 className="font-heading mb-8 text-2xl text-zinc-950">Feature Comparison</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-zinc-200">
									<th className="py-3 pr-4 text-left font-semibold text-zinc-950">Feature</th>
									<th className="w-32 px-4 py-3 text-center font-semibold text-zinc-950">CiteRank.com</th>
									<th className="w-32 px-4 py-3 text-center font-semibold text-zinc-950">{competitor.name}</th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(FEATURE_CATEGORIES).flatMap(([catKey, cat]) => [
									<tr key={`cat-${catKey}`}>
										<td
											colSpan={3}
											className="bg-zinc-50 px-0 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500"
										>
											{cat.label}
										</td>
									</tr>,
									...Object.entries(cat.features).map(([featureKey, featureDef]) => (
										<FeatureRow
											key={featureKey}
											label={featureDef.label}
											citeRank={ELMO_FEATURES[featureKey as FeatureKey] ?? false}
											competitor={competitor.features[featureKey as FeatureKey] ?? false}
										/>
									)),
								])}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* Key Differences */}
			<section className="border-b border-zinc-200 bg-white py-12">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<h2 className="font-heading mb-8 text-2xl text-zinc-950">Key Differences</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{citeRankOnlyFeatures.length > 0 && (
							<div className="rounded-md border border-zinc-200 bg-zinc-50 p-5">
								<h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
									Only in CiteRank.com
								</h3>
								<ul className="space-y-2">
									{citeRankOnlyFeatures.map((f) => (
										<li key={f} className="flex items-center gap-2 text-sm text-zinc-600">
											<Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
											{f}
										</li>
									))}
								</ul>
							</div>
						)}
						{sharedFeatures.length > 0 && (
							<div className="rounded-md border border-zinc-200 bg-zinc-50 p-5">
								<h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
									Both Offer
								</h3>
								<ul className="space-y-2">
									{sharedFeatures.map((f) => (
										<li key={f} className="flex items-center gap-2 text-sm text-zinc-600">
											<Check className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
											{f}
										</li>
									))}
								</ul>
							</div>
						)}
						{competitorOnlyFeatures.length > 0 && (
							<div className="rounded-md border border-zinc-200 bg-zinc-50 p-5">
								<h3 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
									Only in {competitor.name}
								</h3>
								<ul className="space-y-2">
									{competitorOnlyFeatures.map((f) => (
										<li key={f} className="flex items-center gap-2 text-sm text-zinc-600">
											<Check className="h-3.5 w-3.5 shrink-0 text-zinc-300" />
											{f}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Why Elmo */}
			<section className="border-b border-zinc-200 bg-white py-12">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<h2 className="font-heading mb-4 text-2xl text-zinc-950">Why Choose CiteRank.com Over {competitor.name}?</h2>
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="rounded-md border border-zinc-200 bg-white p-5">
							<h3 className="font-semibold text-zinc-950">Every Answer Kept in Full</h3>
							<p className="mt-2 text-sm text-zinc-600">
								Every AI answer is kept in full. You can verify exactly how your visibility data is collected,
								calculated, and presented.
							</p>
						</div>
						<div className="rounded-md border border-zinc-200 bg-white p-5">
							<h3 className="font-semibold text-zinc-950">Hosted for You, Month to Month</h3>
							<p className="mt-2 text-sm text-zinc-600">
								Run CiteRank.com without your own infrastructure or a sales call. Plans run from {PLAN_RANGE}, billed
								month to month, and you can cancel any time from your billing settings.
							</p>
						</div>
						<div className="rounded-md border border-zinc-200 bg-white p-5">
							<h3 className="font-semibold text-zinc-950">Your Data, in Your Stack</h3>
							<p className="mt-2 text-sm text-zinc-600">
								Pull every metric, sentiment included, into your own code with the REST API, or ask Claude Code and
								Cursor about it over MCP. Both come with every plan, and you can export or migrate at any time.
							</p>
						</div>
						<div className="rounded-md border border-zinc-200 bg-white p-5">
							<h3 className="font-semibold text-zinc-950">We Do the Work</h3>
							<p className="mt-2 text-sm text-zinc-600">
								The tracker ranks what to do next. Our AI search agency does that work each month and reports the AI
								answers before and after.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<Faq items={getComparisonFaqs(competitor)} />

			{/* CTA */}
			<CiteRankCta />
		</>
	);
}
