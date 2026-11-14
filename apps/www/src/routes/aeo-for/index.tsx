import { createFileRoute } from "@tanstack/react-router";
import { Closing } from "@/components/citerank/v2/closing";
import { BODY, PANEL, PANEL_PAD, Page, PanelHead } from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { INDEX_PAD, PROSE, ROW, ROW_LINK, ROW_TITLE, WithPrompts } from "@/components/pillar";
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

const WHY = [
	"Answer engine optimization is the practice of getting a brand named, cited, and described accurately when someone asks an AI engine a question. The mechanics are consistent across industries: engines retrieve a handful of sources, weigh them for authority and specificity, and synthesise an answer that names a few options. What changes from one industry to the next is which sources carry weight and which questions decide the outcome.",
	"In regulated categories like healthcare, financial services, and insurance, engines lean hard on credentials, accreditation, and verifiable third-party sources, because the cost of a wrong answer is high. In software and developer tools, documentation quality dominates. A tool whose docs are thorough and crawlable gets recommended over an equally capable one whose docs are thin or client-rendered. In local and travel categories, independent guides and review platforms outweigh anything a brand publishes about itself.",
	"The shape of the deciding question changes too. SaaS buyers ask for comparisons and alternatives. Industrial buyers ask by specification. Donors ask about efficiency, patients ask about symptoms, and travellers ask for itineraries rather than for hotels. Tracking the prompts that precede a decision in your category, rather than a generic set of brand queries, is what makes AI visibility measurable instead of anecdotal.",
	"Each guide above covers the prompts worth tracking in that industry, what to publish so engines have something specific to cite, and where the category's answers are currently sourced from.",
];

function AeoForIndex() {
	return (
		<PageShell>
			<PageHead
				title="Answer engine optimization, by industry"
				lede="The fundamentals of AEO are the same everywhere, but the prompts that matter and the stakes are not. Pick your industry."
			/>

			<section className={`${PANEL} ${INDEX_PAD}`}>
				<Page>
					<h2 className="sr-only">Guides by industry</h2>
					<ul className="grid gap-x-8 border-b border-zinc-200 lg:grid-cols-2">
						{aeoVerticals.map((vertical) => (
							<li key={vertical.slug} className={`${ROW} flex`}>
								<a href={`/aeo-for/${vertical.slug}`} className={`${ROW_LINK} flex-1 py-6`}>
									<h3 className={ROW_TITLE}>{aeoHeadline(vertical)}</h3>
									<p className={`${BODY} mt-2 max-w-[56ch] text-zinc-600`}>
										<WithPrompts text={vertical.short} />
									</p>
								</a>
							</li>
						))}
					</ul>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page className="grid gap-10 lg:grid-cols-12 lg:gap-8">
					<div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
						<PanelHead title="Why AEO differs by industry" />
					</div>
					<div className="max-w-[60ch] space-y-4 lg:col-span-8">
						{WHY.map((paragraph) => (
							<p key={paragraph.slice(0, 32)} className={PROSE}>
								{paragraph}
							</p>
						))}
					</div>
				</Page>
			</section>

			<Closing from="marketing-aeo-for-closing" />
		</PageShell>
	);
}
