import { createFileRoute } from "@tanstack/react-router";
import { Closing } from "@/components/citerank/v2/closing";
import { LinkCards, PANEL, PANEL_PAD, Page, PanelHead } from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { PROSE, TrackingActions } from "@/components/pillar";
import { aeoHeadline, aeoVerticals } from "@/data/aeo-verticals";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "Answer Engine Optimization by Industry · CiteRank.com";
const description =
	"How answer engine optimization applies to your industry: 20 guides on the prompts that matter, what to publish, and how AI engines pick sources.";

export const Route = createFileRoute("/aeo-for/")({
	loader: () => ({
		items: aeoVerticals.map((v) => ({ name: aeoHeadline(v), path: `/aeo-for/${v.slug}` })),
	}),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/aeo-for" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/aeo-for") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AEO by industry", path: "/aeo-for" },
			]),
			itemListJsonLd(loaderData?.items ?? []),
		],
	}),
	component: AeoForIndex,
});

const WHY =
	"AI engines work the same way in every industry, but what they trust differs: credentials in healthcare, finance and insurance, documentation in software, and independent guides and reviews in local and travel. The questions that decide a purchase differ too, so track the ones buyers in your industry actually ask.";

function AeoForIndex() {
	return (
		<PageShell>
			<PageHead
				title="Answer engine optimization, by industry"
				lede="The fundamentals of AEO are the same everywhere, but the prompts that matter and the stakes are not. Pick your industry."
			>
				<TrackingActions from="marketing-aeo-for-hero" />
			</PageHead>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<h2 className="sr-only">Guides by industry</h2>
					<LinkCards
						className="lg:grid-cols-2"
						items={aeoVerticals.map((vertical) => ({
							href: `/aeo-for/${vertical.slug}`,
							title: vertical.industry,
							body: vertical.short,
						}))}
					/>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page className="grid gap-10 lg:grid-cols-12 lg:gap-8">
					<div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
						<PanelHead title="Why AEO differs by industry" />
					</div>
					<p className={`${PROSE} max-w-[60ch] lg:col-span-8`}>{WHY}</p>
				</Page>
			</section>

			<Closing from="marketing-aeo-for-closing" />
		</PageShell>
	);
}
