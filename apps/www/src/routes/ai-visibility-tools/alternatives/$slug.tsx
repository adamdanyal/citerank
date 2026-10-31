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
		const title = `${c.name} Alternatives | AI Visibility Tools · CiteRank.com`;
		const description = `The best ${c.name} alternatives for AI visibility tracking, compared feature by feature, including CiteRank.com, a tracker plus an AI search agency.`;
		const path = `/ai-visibility-tools/alternatives/${params.slug}`;
		return {
			meta: [{ title }, { name: "description", content: description }, ...ogMeta({ title, description, path })],
			links: [{ rel: "canonical", href: canonicalUrl(path) }],
			scripts: [
				breadcrumbJsonLd([
					{ name: "Home", path: "/" },
					{ name: "AI Visibility Tool Directory", path: "/ai-visibility-tools" },
					{ name: `${c.name} alternatives`, path },
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
				<DirectoryHero title={`${competitor.name} alternatives`} lead={getAlternativesVerdict(competitor)} />

				<DirectoryCiteRankBanner
					pitch="From the answers it collects, CiteRank.com shows how often you are named for each question and each AI app, your share of voice against each competitor, how each answer describes you, and which websites and pages each answer cites. It checks ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews, and five more AI apps."
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

				<DirectorySection title={`Other ${competitor.name} alternatives`}>
					<ToolGrid competitors={alternatives} />
				</DirectorySection>

				<Faq items={getAlternativesFaqs(competitor, alternatives)} />
				<CiteRankCta />
			</main>
			<Footer />
		</div>
	);
}
