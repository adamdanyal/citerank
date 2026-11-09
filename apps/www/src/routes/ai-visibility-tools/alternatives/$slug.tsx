import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	CiteRankCta,
	DirectoryBackLink,
	DirectoryCiteRankBanner,
	DirectoryHero,
	DirectorySection,
} from "@/components/directory-shell";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ToolGrid } from "@/components/tool-list";
import {
	type Competitor,
	getAlternatives,
	getAlternativesFaqs,
	getAlternativesVerdict,
	getComparisonSlug,
	getCompetitorBySlug,
	hasOwnPages,
} from "@/lib/competitors";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

export const Route = createFileRoute("/ai-visibility-tools/alternatives/$slug")({
	loader: ({ params }) => {
		const c = getCompetitorBySlug(params.slug);
		if (!c || !hasOwnPages(c)) throw notFound();
		const alternatives = getAlternatives(c);
		return { competitor: c, alternatives, faqs: getAlternativesFaqs(c, alternatives) };
	},
	head: ({ params, loaderData }) => {
		if (!loaderData) return {};
		const { competitor: c, faqs } = loaderData;
		const title = `${c.name} Alternatives | AI Visibility Tracking · CiteRank.com`;
		const description = `The best ${c.name} alternatives for AI visibility tracking, compared feature by feature, including CiteRank.com, a tracker plus an AI search agency.`;
		const path = `/ai-visibility-tools/alternatives/${params.slug}`;
		return {
			meta: [{ title }, { name: "description", content: description }, ...ogMeta({ title, description, path })],
			links: [{ rel: "canonical", href: canonicalUrl(path) }],
			scripts: [
				breadcrumbJsonLd([
					{ name: "Home", path: "/" },
					{ name: "AI Visibility Tool Directory", path: "/ai-visibility-tools" },
					{ name: `${c.name} Alternatives`, path },
				]),
				faqJsonLd(faqs),
			],
		};
	},
	component: AlternativesPage,
});

function AlternativesPage() {
	const { competitor, alternatives } = Route.useLoaderData() as {
		competitor: Competitor;
		alternatives: Competitor[];
	};
	return (
		<div className="min-h-screen">
			<Navbar />
			<main>
				<DirectoryBackLink />
				<DirectoryHero title={`${competitor.name} Alternatives`} lead={getAlternativesVerdict(competitor)} />

				<DirectoryCiteRankBanner
					pitch="CiteRank.com tracks how ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews mention and cite your brand. It keeps every answer in full, so you can verify exactly how each metric is calculated, and its AI search agency can do the work. Every plan has unlimited seats, and you can cancel any time."
					comparison={{
						slug: getComparisonSlug(competitor),
						name: competitor.name,
					}}
				/>

				{competitor.switching ? (
					<DirectorySection title={`Why teams leave ${competitor.name}`}>
						<p className="mb-8 max-w-3xl leading-relaxed text-zinc-600">
							What people say when they leave {competitor.name}, and what CiteRank.com does differently.{" "}
							{competitor.name} is a capable product with real customers, so take this as the case for a different set
							of tradeoffs rather than a verdict on the tool.
						</p>
						<div className="max-w-3xl space-y-8">
							{competitor.switching.reasons.map((reason) => (
								<div key={reason.headline}>
									<h3 className="font-heading mb-2 text-lg text-zinc-950">{reason.headline}</h3>
									<p className="leading-relaxed text-zinc-600">{reason.detail}</p>
									<p className="mt-3 border-l-2 border-zinc-200 pl-4 leading-relaxed text-zinc-700">
										{reason.citeRank}
									</p>
								</div>
							))}
						</div>
					</DirectorySection>
				) : null}

				<DirectorySection title={`Other ${competitor.name} Alternatives`}>
					<ToolGrid competitors={alternatives} />
				</DirectorySection>

				<Faq items={getAlternativesFaqs(competitor, alternatives)} />
				<CiteRankCta />
			</main>
			<Footer />
		</div>
	);
}
