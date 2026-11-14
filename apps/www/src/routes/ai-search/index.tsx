import { createFileRoute } from "@tanstack/react-router";
import { Closing } from "@/components/citerank/v2/closing";
import { BODY, PANEL, Page, SMALL, SUBHEAD } from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { INDEX_PAD, ROW, ROW_ACTION, ROW_LINK } from "@/components/pillar";
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

			<section className={`${PANEL} ${INDEX_PAD}`}>
				<Page>
					<h2 className="sr-only">Guides by AI engine</h2>
					<ul className="border-b border-zinc-200">
						{aiSearchEngines.map((engine) => (
							<li key={engine.slug} className={ROW}>
								<a
									href={`/ai-search/${engine.slug}`}
									className={`${ROW_LINK} grid gap-3 py-6 lg:grid-cols-12 lg:gap-8 lg:py-8`}
								>
									<div className="lg:col-span-5">
										<h3 className={`${SUBHEAD} text-ink`}>{engine.name}</h3>
										<p className={`${SMALL} mt-1 text-zinc-600`}>{engine.vendor}</p>
									</div>
									<div className="lg:col-span-7">
										<p className={`${BODY} max-w-[60ch] text-zinc-600`}>{engine.short}</p>
										<p className={`${ROW_ACTION} mt-3`}>How to appear in {engine.name}</p>
									</div>
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
