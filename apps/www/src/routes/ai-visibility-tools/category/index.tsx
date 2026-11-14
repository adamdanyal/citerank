import { createFileRoute } from "@tanstack/react-router";
import { SUBHEAD } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
import {
	CiteRankCta,
	DirectoryHero,
	DirectorySection,
	FOCUS,
	ROW,
	ROW_LINK_COUNT,
	ROW_LINK_LABEL,
} from "@/components/directory-shell";
import { CATEGORY_HEADINGS, CATEGORY_SLUGS, indexableCategories, toolsInCategory } from "@/lib/competitors";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "AI Visibility Tools by Category · CiteRank.com";
const description =
	"Browse AI visibility tools by category: dedicated trackers, content platforms, developer APIs, SEO suites, and e-commerce tools.";

/* Built inside the loader so the tool data stays out of the client entry bundle. */
function items() {
	return indexableCategories.map((category) => ({
		name: CATEGORY_HEADINGS[category],
		path: `/ai-visibility-tools/category/${CATEGORY_SLUGS[category]}`,
	}));
}

export const Route = createFileRoute("/ai-visibility-tools/category/")({
	loader: () => ({ items: items() }),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/ai-visibility-tools/category" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/ai-visibility-tools/category") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AI Visibility Tool Directory", path: "/ai-visibility-tools" },
				{ name: "Categories", path: "/ai-visibility-tools/category" },
			]),
			itemListJsonLd(loaderData?.items ?? []),
		],
	}),
	component: CategoryHub,
});

function CategoryHub() {
	return (
		<PageShell>
			<DirectoryHero
				back
				tight
				title="Browse AI visibility tools by category"
				lead="The market splits into a few distinct groups. Pick the type of tool you’re after to compare the options in that category side by side."
			/>
			<DirectorySection>
				<ul className="border-b border-zinc-200">
					{indexableCategories.map((category) => (
						<li key={category} className={ROW}>
							<a
								href={`/ai-visibility-tools/category/${CATEGORY_SLUGS[category]}`}
								className={`group flex flex-col gap-1 rounded-sm py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 lg:py-8 ${FOCUS}`}
							>
								<span className={`${SUBHEAD} ${ROW_LINK_LABEL} text-ink`}>{CATEGORY_HEADINGS[category]}</span>
								<span className={ROW_LINK_COUNT}>{toolsInCategory(category).length} tools</span>
							</a>
						</li>
					))}
				</ul>
			</DirectorySection>
			<CiteRankCta />
		</PageShell>
	);
}
