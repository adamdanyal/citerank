import { Link } from "@tanstack/react-router";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { Heart } from "lucide-react";
import { useState } from "react";
import {
	CATEGORY_LABELS,
	type Competitor,
	type CompetitorCategory,
	ELMO_FEATURES,
	ENTRY_PRICE,
	FEATURE_CATEGORIES,
	type FeatureKey,
	getComparisonSlug,
	getFeatureLabel,
	getPopularityGrade,
	isRetired,
	sortedCompetitors,
} from "@/lib/competitors";
import {
	ACTION,
	ACTION_QUIET,
	BAND_PAD,
	HEADING,
	LEAD,
	LINK,
	PANEL,
	PANEL_PAD,
	PANEL_TINT,
	Page,
	SMALL,
} from "./citerank/v2/kit";
import { DirectoryHero, FOCUS } from "./directory-shell";
import { FeatureMark, PINNED, PINNED_EDGE, RULE } from "./feature-mark";

const SIGN_UP_URL = cloudSignupUrl("marketing-page-cta");

const visibleCompetitors = sortedCompetitors.filter((c) => !isRetired(c) && c.category !== "other");

const CHIP = `h-11 rounded-full px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200 ${FOCUS}`;
const CHIP_ON = "bg-ink text-paper";
const CHIP_OFF = "bg-paper-2 text-zinc-700 hover:text-ink";

export function CompetitorDirectory() {
	const [selectedCategory, setSelectedCategory] = useState<CompetitorCategory | "all">("all");

	const filteredCompetitors = visibleCompetitors.filter(
		(c) => selectedCategory === "all" || c.category === selectedCategory,
	);

	const categories = [...new Set(visibleCompetitors.map((c) => c.category))];

	return (
		<>
			<DirectoryHero
				title="AI visibility tools"
				lead="Every AI visibility tool, AEO platform, LLM visibility tracker and GEO tool in one place. Compare engine coverage, features and pricing, and find the right platform for your team."
			/>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<h2 className={`${HEADING} text-ink tabular-nums`}>{filteredCompetitors.length} tools</h2>
					<fieldset className="mt-6 flex flex-wrap gap-2">
						<legend className="sr-only">Category</legend>
						<button
							type="button"
							aria-pressed={selectedCategory === "all"}
							onClick={() => setSelectedCategory("all")}
							className={`${CHIP} ${selectedCategory === "all" ? CHIP_ON : CHIP_OFF}`}
						>
							All
						</button>
						{categories.map((cat) => (
							<button
								type="button"
								key={cat}
								aria-pressed={selectedCategory === cat}
								onClick={() => setSelectedCategory(cat)}
								className={`${CHIP} ${selectedCategory === cat ? CHIP_ON : CHIP_OFF}`}
							>
								{CATEGORY_LABELS[cat]}
							</button>
						))}
					</fieldset>
					<div className="mt-10">
						<FeatureMatrix competitors={filteredCompetitors} />
					</div>
				</Page>
			</section>

			<section className={`${PANEL_TINT} ${BAND_PAD}`}>
				<Page className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
					<div className="lg:col-span-7">
						<h2 className={`${HEADING} text-ink`}>Why consider CiteRank.com</h2>
						<p className={`${LEAD} mt-5 max-w-[52ch] text-zinc-700`}>
							Hosted, self-serve, and transparent. Track AI visibility without a sales call or inflated pricing, from{" "}
							{ENTRY_PRICE}.
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">
						<a href={SIGN_UP_URL} className={ACTION}>
							Start tracking
						</a>
						<Link to="/agency" className={ACTION_QUIET}>
							Let us do the work
						</Link>
					</div>
				</Page>
			</section>
		</>
	);
}

const OURS = "bg-blue-50";
const NAMES = `${PINNED} ${PINNED_EDGE} ${SMALL} pr-4 text-left`;

function FeatureMatrix({ competitors: items }: { competitors: Competitor[] }) {
	return (
		// relative: the cells' sr-only labels are absolutely positioned, and without a
		// containing block here they stretch the whole page instead of this scroller.
		<div className="relative overflow-x-auto">
			{/* The data cells take their rule and padding from the table: there are thousands of them, and a class on each would add hundreds of kilobytes to the page. */}
			<table className="min-w-full border-separate border-spacing-0 [&_td]:border-t [&_td]:border-zinc-200 [&_td]:px-3 [&_td]:py-3">
				<thead>
					<tr>
						<th
							scope="col"
							className={`${NAMES} w-36 min-w-36 py-4 align-bottom font-medium text-ink sm:w-56 sm:min-w-56`}
						>
							Feature
						</th>
						<th
							scope="col"
							className={`${OURS} ${SMALL} px-4 py-4 text-center align-bottom font-medium whitespace-nowrap text-ink`}
						>
							CiteRank.com
						</th>
						{items.map((c) => (
							<th
								key={c.slug}
								scope="col"
								className={`${SMALL} px-3 py-4 text-center align-bottom font-normal whitespace-nowrap`}
							>
								<Link
									to="/ai-visibility-tools/$slug"
									params={{ slug: getComparisonSlug(c) }}
									className={`${LINK} text-zinc-700 hover:text-ink`}
								>
									{c.name}
								</Link>
							</th>
						))}
					</tr>
				</thead>
				{Object.entries(FEATURE_CATEGORIES).map(([catKey, cat]) => (
					<tbody key={catKey}>
						<tr>
							<th scope="rowgroup" className={`${NAMES} ${RULE} pt-8 pb-3 font-medium text-ink`}>
								{cat.label}
							</th>
							<td className={OURS} />
							<td colSpan={items.length} />
						</tr>
						{(Object.keys(cat.features) as FeatureKey[]).map((featureKey) => (
							<tr key={featureKey}>
								<th scope="row" className={`${NAMES} ${RULE} py-3 font-normal text-zinc-700`}>
									{getFeatureLabel(featureKey)}
								</th>
								<td className={OURS}>
									<FeatureMark has={ELMO_FEATURES[featureKey] ?? false} />
								</td>
								{items.map((c) => (
									<td key={c.slug}>
										<FeatureMark has={c.features[featureKey] ?? false} />
									</td>
								))}
							</tr>
						))}
					</tbody>
				))}
				<tbody className={`${SMALL} text-center text-zinc-700 tabular-nums [&_td]:border-b`}>
					<tr>
						<th scope="row" className={`${NAMES} border-y border-zinc-200 py-3 font-medium text-ink`}>
							Popularity grade
						</th>
						<td className={OURS}>
							<Heart aria-hidden="true" className="mx-auto size-4 fill-rust text-rust" />
							<span className="sr-only">Not graded</span>
						</td>
						{items.map((c) => (
							<td key={c.slug}>{getPopularityGrade(c)}</td>
						))}
					</tr>
				</tbody>
			</table>
		</div>
	);
}
