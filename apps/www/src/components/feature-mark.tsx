import { Check, X } from "lucide-react";
import { type Competitor, ELMO_FEATURES, FEATURE_CATEGORIES, type FeatureKey } from "@/lib/competitors";
import { SMALL } from "./citerank/v2/kit";

/**
 * Lucide icons are aria-hidden, so without the text a feature table reads to
 * crawlers, answer engines, and screen readers as feature names with no answers.
 */
export function FeatureMark({ has }: { has: boolean }) {
	return has ? (
		<>
			<Check className="mx-auto size-4 text-rust" />
			<span className="sr-only">Yes</span>
		</>
	) : (
		<>
			<X className="mx-auto size-4 text-zinc-400" />
			<span className="sr-only">No</span>
		</>
	);
}

/*
 * The column that names the row holds its place while the others scroll under
 * it. Its edge is drawn only where a table is wider than its frame, so a table
 * that fits keeps to horizontal rules.
 */
export const PINNED = "sticky left-0 z-10 bg-paper";
export const PINNED_EDGE = "shadow-[inset_-1px_0_0_var(--color-zinc-200)]";
const PINNED_EDGE_PHONE = "max-sm:shadow-[inset_-1px_0_0_var(--color-zinc-200)]";
const PINNED_EDGE_NARROW = "max-md:shadow-[inset_-1px_0_0_var(--color-zinc-200)]";
export const RULE = "border-t border-zinc-200";

export interface FeatureColumn {
	id: string;
	name: string;
	has: (key: FeatureKey) => boolean;
	/** Tints a cell, to mark the tool that wins the row. */
	marked?: (key: FeatureKey) => boolean;
}

export function toolColumn(tool: Competitor): FeatureColumn {
	return { id: tool.slug, name: tool.name, has: (key) => tool.features[key] ?? false };
}

export const CITERANK_COLUMN: FeatureColumn = {
	id: "citerank",
	name: "CiteRank.com",
	has: (key) => ELMO_FEATURES[key] ?? false,
	marked: (key) => ELMO_FEATURES[key] ?? false,
};

const UNDER = "border-b border-zinc-200";
/* From lg the table fits its frame, so the frame stops scrolling and the column heads can hold under the nav while the rows pass. */
const HEAD = `${UNDER} ${SMALL} bg-paper py-4 align-bottom font-medium text-ink lg:sticky lg:top-18 lg:z-20`;

/** Every feature as a row and every tool as a column, grouped as the feature list is. */
export function FeatureTable({ columns }: { columns: FeatureColumn[] }) {
	const many = columns.length > 3;
	const pinned = columns.length < 3 ? PINNED : `${PINNED} ${many ? PINNED_EDGE_NARROW : PINNED_EDGE_PHONE}`;
	const width = many ? "w-24 min-w-24 xl:w-32" : "w-24 min-w-24 sm:w-36";
	return (
		// relative: the cells' sr-only labels are absolutely positioned, and without a
		// containing block here they stretch the whole page instead of this scroller.
		<div className="relative overflow-x-auto lg:overflow-visible">
			<table className="w-full border-separate border-spacing-0">
				<thead>
					<tr>
						<th scope="col" className={`${pinned} ${HEAD} min-w-32 pr-4 text-left`}>
							Feature
						</th>
						{columns.map((column) => (
							<th key={column.id} scope="col" className={`${HEAD} ${width} px-2 text-center`}>
								{column.name}
							</th>
						))}
					</tr>
				</thead>
				{Object.entries(FEATURE_CATEGORIES).map(([groupKey, group]) => (
					<tbody key={groupKey}>
						<tr>
							<th
								scope="rowgroup"
								className={`${pinned} ${UNDER} ${SMALL} pt-8 pr-4 pb-3 text-left font-medium text-ink`}
							>
								{group.label}
							</th>
							<td colSpan={columns.length} className={UNDER} />
						</tr>
						{(Object.keys(group.features) as FeatureKey[]).map((key) => (
							<tr key={key}>
								<th
									scope="row"
									className={`${pinned} ${UNDER} py-3 pr-4 text-left text-[0.875rem] leading-[1.5] font-normal text-zinc-700 sm:text-[1rem]`}
								>
									{group.features[key].label}
								</th>
								{columns.map((column) => (
									<td key={column.id} className={`${UNDER} px-2 py-3 ${column.marked?.(key) ? "bg-blue-50" : ""}`}>
										<FeatureMark has={column.has(key)} />
									</td>
								))}
							</tr>
						))}
					</tbody>
				))}
			</table>
		</div>
	);
}
