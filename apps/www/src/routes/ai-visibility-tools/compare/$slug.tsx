import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/citerank/v2/shell";
import { CiteRankCta, DirectoryBackLink, DirectoryHero } from "@/components/directory-shell";
import { Faq } from "@/components/faq";
import { MultiComparison } from "@/components/multi-comparison";
import { PairComparison } from "@/components/pair-comparison";
import { type Competitor, getCompareEntry, getCompareFaqs, getCompareVerdict } from "@/lib/competitors";
import {
	breadcrumbJsonLd,
	canonicalUrl,
	comparisonJsonLd,
	ELMO_LISTING,
	faqJsonLd,
	ogMeta,
	softwareApplicationJsonLd,
} from "@/lib/seo";

export const Route = createFileRoute("/ai-visibility-tools/compare/$slug")({
	loader: ({ params }) => {
		const tools = getCompareEntry(params.slug);
		if (!tools) throw notFound();
		return { tools, faqs: getCompareFaqs(tools) };
	},
	head: ({ params, loaderData }) => {
		if (!loaderData) return {};
		const { tools, faqs } = loaderData;
		const names = tools.map((t) => t.name).join(" vs ");
		const isPair = tools.length === 2;
		const title = isPair ? `${names} | AI Visibility Tool Comparison · CiteRank.com` : `${names} · CiteRank.com`;
		const description = isPair
			? `Compare ${names} for AI visibility tracking, feature by feature, with CiteRank.com included as a third option.`
			: `Compare ${names} for AI visibility and answer engine monitoring, feature by feature, with CiteRank.com included as a reference point.`;
		const path = `/ai-visibility-tools/compare/${params.slug}`;
		return {
			meta: [{ title }, { name: "description", content: description }, ...ogMeta({ title, description, path })],
			links: [{ rel: "canonical", href: canonicalUrl(path) }],
			scripts: [
				breadcrumbJsonLd([
					{ name: "Home", path: "/" },
					{ name: "AI Visibility Tool Directory", path: "/ai-visibility-tools" },
					{ name: names, path },
				]),
				faqJsonLd(faqs),
				comparisonJsonLd([...tools.map((t) => ({ name: t.name, url: t.url })), ELMO_LISTING]),
				softwareApplicationJsonLd(),
			],
		};
	},
	component: ComparePage,
});

function ComparePage() {
	const { tools } = Route.useLoaderData() as { tools: Competitor[] };
	const names = tools.map((t) => t.name).join(" vs ");
	const [a, b] = tools;
	return (
		<PageShell>
			<DirectoryBackLink />
			<DirectoryHero title={names} lead={getCompareVerdict(tools)} />
			{a && b && tools.length === 2 ? <PairComparison a={a} b={b} /> : <MultiComparison tools={tools} />}
			<Faq items={getCompareFaqs(tools)} />
			<CiteRankCta />
		</PageShell>
	);
}
