import { createFileRoute } from "@tanstack/react-router";
import { Closing } from "@/components/citerank/v2/closing";
import { BODY, LIST_CARD, PANEL, PANEL_PAD, Page } from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { ROW, ROW_LINK, ROW_TITLE } from "@/components/pillar";
import { aiSearchEngines } from "@/data/ai-search-engines";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "How to Show Up in AI Search Engines · CiteRank.com";
const description =
	"Guides to appearing in AI search: how ChatGPT, Perplexity and Google AI Overviews choose what to cite, and how to become one of their sources.";

export const Route = createFileRoute("/ai-search/")({
	loader: () => ({
		items: aiSearchEngines.map((e) => ({ name: `How to appear in ${e.name}`, path: `/ai-search/${e.slug}` })),
	}),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/ai-search" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/ai-search") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AI Search", path: "/ai-search" },
			]),
			itemListJsonLd(loaderData?.items ?? []),
		],
	}),
	component: AiSearchIndex,
});

function AiSearchIndex() {
	return (
		<PageShell>
			<PageHead
				title="How to show up in AI search"
				lede="Each AI engine chooses its sources a little differently. These guides show how the major ones decide what to cite, and the steps to become one of their sources."
			/>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<h2 className="sr-only">Guides by AI engine</h2>
					<ul className={LIST_CARD}>
						{aiSearchEngines.map((engine) => (
							<li key={engine.slug} className={ROW}>
								<a
									href={`/ai-search/${engine.slug}`}
									className={`${ROW_LINK} grid gap-2 py-6 lg:grid-cols-12 lg:items-baseline lg:gap-8`}
								>
									<h3 className={`${ROW_TITLE} lg:col-span-5`}>{engine.name}</h3>
									<p className={`${BODY} text-zinc-600 lg:col-span-7`}>{engine.line}</p>
								</a>
							</li>
						))}
					</ul>
				</Page>
			</section>

			<Closing from="marketing-page-cta" />
		</PageShell>
	);
}
