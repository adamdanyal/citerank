import { createFileRoute } from "@tanstack/react-router";
import { PANEL, PANEL_PAD, Page, PanelHead, SUBHEAD } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
import {
	CiteRankCta,
	DirectoryHero,
	DirectorySection,
	FOCUS,
	Matchup,
	ROW,
	ROW_LINK,
	SPLIT,
	SPLIT_BODY,
	SPLIT_HEAD,
} from "@/components/directory-shell";
import { comparePairSlug, comparePairs, compareSetSlug, compareSets } from "@/lib/competitors";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "Compare AI Visibility Tools Head-to-Head · CiteRank.com";
const description =
	"Head-to-head comparisons of the leading AI visibility platforms and SEO suites (Profound, Peec AI, Ahrefs Brand Radar, HubSpot AEO, Semrush, Scrunch, and more), feature by feature, with CiteRank.com included for reference.";

/* Built on demand so the tool data stays out of the client entry bundle. */
function sets() {
	return compareSets.map((tools) => ({
		names: tools.map((t) => t.name),
		path: `/ai-visibility-tools/compare/${compareSetSlug(tools)}`,
	}));
}

function pairs() {
	return comparePairs.map(([a, b]) => ({
		names: [a.name, b.name],
		path: `/ai-visibility-tools/compare/${comparePairSlug(a, b)}`,
	}));
}

function listItems(entries: { names: string[]; path: string }[]) {
	return entries.map((entry) => ({ name: entry.names.join(" vs "), path: entry.path }));
}

export const Route = createFileRoute("/ai-visibility-tools/compare/")({
	loader: () => ({ items: [...listItems(sets()), ...listItems(pairs())] }),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/ai-visibility-tools/compare" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/ai-visibility-tools/compare") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AI Visibility Tool Directory", path: "/ai-visibility-tools" },
				{ name: "Compare", path: "/ai-visibility-tools/compare" },
			]),
			itemListJsonLd(loaderData?.items ?? []),
		],
	}),
	component: CompareHub,
});

function CompareHub() {
	return (
		<PageShell>
			<DirectoryHero
				back
				title="AI visibility tools, head-to-head"
				lead="Weighing the AI visibility tools against each other? These side-by-side breakdowns compare tracking, analytics, and pricing across the funded AEO platforms and the SEO suites that added AI search monitoring, and show where CiteRank.com fits in."
			/>
			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page className={SPLIT}>
					<div className={SPLIT_HEAD}>
						<PanelHead title="Compare several at once" />
					</div>
					<ul className={`${SPLIT_BODY} border-b border-zinc-200`}>
						{sets().map((set) => (
							<li key={set.path} className={ROW}>
								<a href={set.path} className={`${SUBHEAD} group block rounded-sm py-6 text-ink lg:py-8 ${FOCUS}`}>
									<Matchup names={set.names} />
								</a>
							</li>
						))}
					</ul>
				</Page>
			</section>
			<DirectorySection title="Pick a matchup" pad="wide">
				<ul className="grid gap-x-8 border-b border-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
					{pairs().map((pair) => (
						<li key={pair.path} className={ROW}>
							<a href={pair.path} className={ROW_LINK}>
								<Matchup names={pair.names} />
							</a>
						</li>
					))}
				</ul>
			</DirectorySection>
			<CiteRankCta />
		</PageShell>
	);
}
