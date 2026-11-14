import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import {
	type Competitor,
	ELMO_FEATURES,
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
import {
	BODY,
	HEADING,
	LEAD,
	LINK,
	PANEL,
	PANEL_PAD,
	PANEL_PAD_TIGHT,
	PANEL_PAD_WIDE,
	Page,
	PanelHead,
	RuledRow,
	SMALL,
	SUBHEAD,
} from "./citerank/v2/kit";
import { CiteRankCta, DirectoryHero, SPLIT, SPLIT_BODY, SPLIT_HEAD } from "./directory-shell";
import { Faq } from "./faq";
import { FeatureTable } from "./feature-mark";
import { CITERANK_FACTS, ToolSummary, toolFacts } from "./tool-list";

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
		<div className="max-w-[66ch] rounded-card bg-paper-2 p-6">
			<p className="text-[1rem] leading-[1.4] font-medium text-ink">
				{heading} ({formatFateDate(competitor.fate.date)})
			</p>
			<p className={`${BODY} mt-2 text-zinc-700`}>
				{competitor.fate.summary}{" "}
				<Link to="/ai-visibility-tools/graveyard" className={`${LINK} text-ink`}>
					See the AEO graveyard
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
	const citeRankHas = (key: FeatureKey) => ELMO_FEATURES[key] ?? false;
	const competitorHas = (key: FeatureKey) => competitor.features[key] ?? false;
	const differences = [
		{ title: "Only in CiteRank.com", features: citeRankOnlyFeatures },
		{ title: "Both offer", features: sharedFeatures },
		{ title: `Only in ${competitor.name}`, features: competitorOnlyFeatures },
	].filter((list) => list.features.length > 0);
	const grade = getPopularityGrade(competitor);
	const fate = graveyardFate(competitor);
	const notice =
		fate && competitor.fate ? (
			<FateNotice competitor={competitor} />
		) : isLowDR(competitor) && !fate ? (
			<p className={`${SMALL} flex max-w-[66ch] items-start gap-2.5 rounded-card bg-paper-2 px-5 py-4 text-zinc-700`}>
				<AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-rust" />
				{competitor.name} appears to be a very early-stage product with limited adoption.
			</p>
		) : null;

	return (
		<>
			<DirectoryHero back title={`CiteRank.com vs ${competitor.name}`} lead={getComparisonVerdict(competitor)}>
				{notice}
			</DirectoryHero>

			<section className={`${PANEL} ${PANEL_PAD_TIGHT}`}>
				<Page className="grid gap-10 lg:grid-cols-12 lg:gap-8">
					<div className="lg:col-span-5">
						<h2 className={`${HEADING} text-ink`}>The short version</h2>
						<p className={`${LEAD} mt-5 text-zinc-700`}>{getSoundbite(competitor)}</p>
					</div>
					<ul className="border-y border-zinc-200 lg:col-span-6 lg:col-start-7 lg:self-start">
						<ToolSummary name="CiteRank.com" facts={CITERANK_FACTS} className="py-6">
							AI visibility tracker and AI search agency for AEO. Track AI visibility across ChatGPT, Claude, and Google
							AI Overviews, with every answer kept in full.
						</ToolSummary>
						<ToolSummary name={competitor.name} facts={toolFacts(competitor)} className="border-t border-zinc-200 py-6">
							{competitor.tagline}
						</ToolSummary>
					</ul>
				</Page>
			</section>

			{!competitor.noScreenshot && (
				<section className={`${PANEL} ${PANEL_PAD}`}>
					<Page className={SPLIT}>
						<div className="lg:col-span-4">
							<h2 className={`${HEADING} text-ink`}>{competitor.name} at a glance</h2>
							<p className={`${BODY} mt-5`}>
								<a
									href={competitor.url}
									target="_blank"
									rel="noopener noreferrer nofollow"
									className={`${LINK} text-ink`}
								>
									Visit {competitor.domain}
								</a>
							</p>
						</div>
						<figure className={SPLIT_BODY}>
							<img
								src={getScreenshotUrl(competitor.slug)}
								alt={`Screenshot of ${competitor.name} homepage`}
								width={1920}
								height={1080}
								className="block aspect-video h-auto w-full rounded-card bg-paper-2 object-cover object-top ring-1 ring-zinc-200"
								loading="lazy"
							/>
						</figure>
					</Page>
				</section>
			)}

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<PanelHead title={`About ${competitor.name}`} />
					<div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-8">
						<div className="lg:col-span-6 lg:pt-4">
							<p className={`${BODY} max-w-[62ch] text-zinc-700`}>{competitor.description}</p>
							{grade !== "N/A" && (
								<p className={`${BODY} mt-6 text-zinc-600`}>
									Popularity grade: <span className="font-medium text-ink">{grade}</span>
								</p>
							)}
						</div>
						{competitor.highlights && competitor.highlights.length > 0 && (
							<ul className="border-b border-zinc-200 lg:col-span-6 lg:self-start">
								{competitor.highlights.map((h) => (
									<li key={h} className={`${BODY} border-t border-zinc-200 py-4 text-zinc-700`}>
										{h}
									</li>
								))}
							</ul>
						)}
					</div>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD_WIDE}`}>
				<Page className={SPLIT}>
					<div className={SPLIT_HEAD}>
						<PanelHead title="Feature comparison" />
					</div>
					<div className={SPLIT_BODY}>
						<FeatureTable
							columns={[
								{
									id: "citerank",
									name: "CiteRank.com",
									has: citeRankHas,
									marked: (key) => citeRankHas(key) && !competitorHas(key),
								},
								{
									id: competitor.slug,
									name: competitor.name,
									has: competitorHas,
									marked: (key) => competitorHas(key) && !citeRankHas(key),
								},
							]}
						/>
					</div>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<PanelHead title="Key differences" />
					<div
						className={`mt-10 grid gap-x-8 gap-y-10 lg:mt-16 ${differences.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
					>
						{differences.map((list) => (
							<div key={list.title} className="border-t border-zinc-200 pt-6">
								<h3 className={`${SUBHEAD} text-ink`}>{list.title}</h3>
								<ul className={`${BODY} mt-4 space-y-2 text-zinc-600`}>
									{list.features.map((feature) => (
										<li key={feature}>{feature}</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<PanelHead title={`Why choose CiteRank.com over ${competitor.name}?`} />
					<ul className="mt-10 border-b border-zinc-200 lg:mt-16">
						<RuledRow title="Every answer kept in full">
							You can verify exactly how your visibility data is collected, calculated, and presented.
						</RuledRow>
						<RuledRow title="Hosted for you, month to month">
							Run CiteRank.com without your own infrastructure or a sales call. Plans run from {PLAN_RANGE}, billed
							month to month, and you can cancel any time from your billing settings.
						</RuledRow>
						<RuledRow title="Your data, in your stack">
							Pull every metric, sentiment included, into your own code with the REST API, or ask Claude Code and Cursor
							about it over MCP. Both come with every plan, and you can export or migrate at any time.
						</RuledRow>
						<RuledRow title="We do the work">
							The tracker ranks what to do next. Our AI search agency does that work each month and reports the AI
							answers before and after.
						</RuledRow>
					</ul>
				</Page>
			</section>

			<Faq items={getComparisonFaqs(competitor)} />

			<CiteRankCta />
		</>
	);
}
