import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/citerank/v2/shell";
import {
	CiteRankCta,
	DirectoryHero,
	DirectorySection,
	IndexGroup,
	ROW,
	ROW_LINK,
	ROW_LINK_LABEL,
} from "@/components/directory-shell";
import { CATEGORY_LABELS, indexableCategories, indexedCompetitors, toolsInCategory } from "@/lib/competitors";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "AI Visibility Tool Alternatives · CiteRank.com";
const description =
	"Find alternatives to the AI visibility tools you're evaluating. Each guide compares the closest options feature by feature, with CiteRank.com included for reference.";

/* Built inside the loader so the tool data stays out of the client entry bundle. */
function items() {
	return indexedCompetitors.map((c) => ({
		name: `${c.name} Alternatives`,
		path: `/ai-visibility-tools/alternatives/${c.slug}`,
	}));
}

export const Route = createFileRoute("/ai-visibility-tools/alternatives/")({
	loader: () => ({ items: items() }),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({
				title,
				description,
				path: "/ai-visibility-tools/alternatives",
			}),
		],
		links: [
			{
				rel: "canonical",
				href: canonicalUrl("/ai-visibility-tools/alternatives"),
			},
		],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AI Visibility Tool Directory", path: "/ai-visibility-tools" },
				{ name: "Alternatives", path: "/ai-visibility-tools/alternatives" },
			]),
			itemListJsonLd(loaderData?.items ?? []),
		],
	}),
	component: AlternativesHub,
});

function AlternativesHub() {
	return (
		<PageShell>
			<DirectoryHero
				back
				title="Alternatives to every AI visibility tool"
				lead="Shopping for a replacement, or want to know your options? Pick a tool to see its closest alternatives, including CiteRank.com, a tracker plus an AI search agency."
			/>
			<DirectorySection>
				<div className="space-y-16 lg:space-y-24">
					{indexableCategories.map((category) => (
						<IndexGroup key={category} title={CATEGORY_LABELS[category]} columns="four">
							{toolsInCategory(category).map((c) => (
								<li key={c.slug} className={`${ROW} break-inside-avoid`}>
									<a href={`/ai-visibility-tools/alternatives/${c.slug}`} className={ROW_LINK}>
										<span className={ROW_LINK_LABEL}>{c.name} alternatives</span>
									</a>
								</li>
							))}
						</IndexGroup>
					))}
				</div>
			</DirectorySection>
			<CiteRankCta />
		</PageShell>
	);
}
