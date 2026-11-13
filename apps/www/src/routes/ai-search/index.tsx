import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Closing } from "@/components/citerank/home/closing";
import { Container, EASE_CLASS, LINK_CARD, RevealItem } from "@/components/citerank/ui";
import { PANEL, PANEL_PAD, Page } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
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
			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page className="lg: lg:">
					<div className="max-w-3xl">
						<p className="caption-3 text-blue-800">AI search guides</p>
						<h1 className="heading-1 mt-6 text-zinc-950">How to show up in AI search</h1>
						<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">
							Each AI engine chooses its sources a little differently. These guides show how the major ones decide what
							to cite, and the steps to become one of their sources.
						</p>
					</div>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page className="lg:">
					<h2 className="sr-only">Guides by AI engine</h2>
					<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{aiSearchEngines.map((engine, index) => (
							<RevealItem key={engine.slug} delay={(index % 3) * 60} className="flex">
								<a href={`/ai-search/${engine.slug}`} className={LINK_CARD}>
									<span className="flex items-baseline justify-between gap-3">
										<span className="title-2 text-zinc-950">{engine.name}</span>
										<span className="caption-2 shrink-0 text-zinc-500">{engine.vendor}</span>
									</span>
									<span className="body-6 mt-2 flex-1 text-zinc-600">{engine.short}</span>
									<span className="title-4 mt-5 inline-flex items-center gap-1 text-blue-700">
										How to appear in {engine.name}
										<ArrowRight
											className={`size-4 transition-transform duration-300 ${EASE_CLASS} group-hover:translate-x-0.5`}
											aria-hidden="true"
										/>
									</span>
								</a>
							</RevealItem>
						))}
					</ul>
				</Page>
			</section>

			<Closing from="marketing-page-cta" />
		</PageShell>
	);
}
