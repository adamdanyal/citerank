import { type Competitor, PLAN_RANGE } from "@/lib/competitors";
import { HEADING, PANEL, PANEL_PAD, PANEL_PAD_WIDE, Page } from "./citerank/v2/kit";
import { CITERANK_COLUMN, FeatureTable, toolColumn } from "./feature-mark";
import { CITERANK_FACTS, ToolSummary, toolFacts } from "./tool-list";

const SUMMARY = "border-t border-zinc-200 pt-6";

export function MultiComparison({ tools }: { tools: Competitor[] }) {
	const heading = `${tools.map((t) => t.name).join(" vs ")} vs CiteRank.com`;

	return (
		<>
			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
						{tools.map((tool) => (
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
				<Page>
					<h2 className={`${HEADING} max-w-[34ch] text-ink`}>{heading}</h2>
					<div className="mt-10 lg:mt-16">
						<FeatureTable columns={[...tools.map(toolColumn), CITERANK_COLUMN]} />
					</div>
				</Page>
			</section>
		</>
	);
}
