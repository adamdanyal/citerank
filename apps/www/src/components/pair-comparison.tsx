import { type Competitor, PLAN_RANGE } from "@/lib/competitors";
import { PANEL, PANEL_PAD, PANEL_PAD_WIDE, Page, PanelHead } from "./citerank/v2/kit";
import { SPLIT, SPLIT_BODY, SPLIT_HEAD } from "./directory-shell";
import { CITERANK_COLUMN, FeatureTable, toolColumn } from "./feature-mark";
import { CITERANK_FACTS, ToolSummary, toolFacts } from "./tool-list";

const SUMMARY = "border-t border-zinc-200 pt-6";

export function PairComparison({ a, b }: { a: Competitor; b: Competitor }) {
	return (
		<>
			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<ul className="grid gap-x-8 gap-y-10 md:grid-cols-3">
						{[a, b].map((tool) => (
							<ToolSummary
								key={tool.slug}
								name={tool.name}
								facts={toolFacts(tool)}
								site={tool.url && tool.domain ? { url: tool.url, domain: tool.domain } : undefined}
								className={SUMMARY}
							>
								{tool.tagline}
							</ToolSummary>
						))}
						<ToolSummary name="CiteRank.com" facts={CITERANK_FACTS} className={SUMMARY}>
							AI visibility tracker and AI search agency for AEO, covering 13 AI apps with every answer kept in full.
							Plans run from {PLAN_RANGE}.
						</ToolSummary>
					</ul>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD_WIDE}`}>
				<Page className={SPLIT}>
					<div className={SPLIT_HEAD}>
						<PanelHead title={`${a.name} vs ${b.name} vs CiteRank.com`} />
					</div>
					<div className={SPLIT_BODY}>
						<FeatureTable columns={[toolColumn(a), toolColumn(b), CITERANK_COLUMN]} />
					</div>
				</Page>
			</section>
		</>
	);
}
