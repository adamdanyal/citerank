import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
	CATEGORY_LABELS,
	type Competitor,
	ENTRY_PRICE,
	getComparisonSlug,
	getPopularityGrade,
} from "@/lib/competitors";
import { BODY, LINK, LIST_CARD, PILL_QUIET, SMALL, SUBHEAD } from "./citerank/v2/kit";

export const CITERANK_FACTS = ["Search agency", "13 AI apps", `From ${ENTRY_PRICE}`];

export function toolFacts(competitor: Competitor, withCategory = true): string[] {
	return [
		withCategory ? CATEGORY_LABELS[competitor.category] : null,
		competitor.pricing?.hasFree ? "Free tier" : null,
		competitor.pricing?.startingPrice ? `From ${competitor.pricing.startingPrice}` : null,
	].filter((fact): fact is string => fact !== null);
}

/** A tool in brief: its name, the facts a buyer checks first, and one line. */
export function ToolSummary({
	name,
	facts,
	children,
	site,
	className = "",
}: {
	name: string;
	facts: string[];
	children: ReactNode;
	site?: { url: string; domain: string };
	className?: string;
}) {
	return (
		<li className={`min-w-0 ${className}`}>
			<h3 className={`${SUBHEAD} text-ink`}>{name}</h3>
			<ul className="mt-3 flex flex-wrap gap-2">
				{facts.map((fact) => (
					<li key={fact} className={PILL_QUIET}>
						{fact}
					</li>
				))}
			</ul>
			<p className={`${BODY} mt-4 max-w-[52ch] text-zinc-600`}>{children}</p>
			{site ? (
				<p className={`${SMALL} mt-3`}>
					<a href={site.url} target="_blank" rel="noopener noreferrer nofollow" className={`${LINK} text-zinc-700`}>
						Visit {site.domain}
					</a>
				</p>
			) : null}
		</li>
	);
}

function ToolRow({
	competitor,
	showCategory,
	visit,
	held,
}: {
	competitor: Competitor;
	showCategory: boolean;
	visit: boolean;
	held: boolean;
}) {
	const grade = getPopularityGrade(competitor);
	const facts = [...toolFacts(competitor, showCategory), ...(grade === "N/A" ? [] : [`Popularity grade ${grade}`])];
	return (
		<li
			data-held={held ? "" : undefined}
			className={`group relative gap-x-8 gap-y-2 border-t border-zinc-200 py-5 lg:grid-cols-12 lg:items-baseline ${held ? "hidden" : "grid"}`}
		>
			<h3 className={`${SUBHEAD} text-ink transition-colors duration-200 group-hover:text-rust lg:col-span-3`}>
				{competitor.name}
			</h3>
			<div className="min-w-0 lg:col-span-6">
				<p className={`${BODY} text-zinc-600`}>{competitor.tagline}</p>
				{facts.length > 0 && (
					<ul className={`${SMALL} mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-zinc-600`}>
						{facts.map((fact) => (
							<li key={fact}>{fact}</li>
						))}
					</ul>
				)}
			</div>
			<p className={`${SMALL} mt-1 flex flex-wrap gap-x-6 gap-y-2 font-medium lg:col-span-3 lg:mt-0 lg:justify-end`}>
				<Link
					to="/ai-visibility-tools/$slug"
					params={{ slug: getComparisonSlug(competitor) }}
					className={`${LINK} whitespace-nowrap text-ink after:absolute after:inset-0`}
				>
					Compare with CiteRank.com
				</Link>
				{visit ? (
					<a
						href={competitor.url}
						target="_blank"
						rel="noopener noreferrer nofollow"
						className={`${LINK} relative z-10 whitespace-nowrap text-zinc-700`}
						aria-label={`Visit ${competitor.name}`}
					>
						Visit
					</a>
				) : null}
			</p>
		</li>
	);
}

/**
 * The whole row opens the tool's comparison page. `showCategory` is off where
 * every tool shares the category the page is about, and `visit` where the row
 * should not also lead off the site. Rows past `first` stay in the page but are
 * held back until the caller raises it.
 */
export function ToolGrid({
	competitors,
	showCategory = true,
	visit = true,
	first = Number.POSITIVE_INFINITY,
}: {
	competitors: Competitor[];
	showCategory?: boolean;
	visit?: boolean;
	first?: number;
}) {
	return (
		<ul className={LIST_CARD}>
			{competitors.map((c, index) => (
				<ToolRow key={c.slug} competitor={c} showCategory={showCategory} visit={visit} held={index >= first} />
			))}
		</ul>
	);
}
