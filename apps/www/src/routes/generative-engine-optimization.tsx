import { createFileRoute } from "@tanstack/react-router";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { Faq } from "@/components/faq";
import { CiteRankCta, PillarBody } from "@/components/pillar";
import { getPillar } from "@/data/pillars";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const pillar = getPillar("generative-engine-optimization");

export const Route = createFileRoute("/generative-engine-optimization")({
	loader: () => {
		if (!pillar) return;
		const { slug, metaTitle, description, h1, faqs } = pillar;
		return { seo: { slug, metaTitle, description, h1, faqs } };
	},
	head: ({ loaderData }) => {
		const pillar = loaderData?.seo;
		if (!pillar) return {};
		const path = `/${pillar.slug}`;
		return {
			meta: [
				{ title: pillar.metaTitle },
				{ name: "description", content: pillar.description },
				...ogMeta({ title: pillar.metaTitle, description: pillar.description, path }),
			],
			links: [{ rel: "canonical", href: canonicalUrl(path) }],
			scripts: [
				breadcrumbJsonLd([
					{ name: "Home", path: "/" },
					{ name: pillar.h1, path },
				]),
				faqJsonLd(pillar.faqs),
			],
		};
	},
	component: PillarPage,
});

function PillarPage() {
	if (!pillar) return null;
	return (
		<PageShell>
			<PageHead title={pillar.h1} lede={pillar.lead} />
			<PillarBody pillar={pillar} />
			<Faq items={pillar.faqs} />
			<CiteRankCta />
		</PageShell>
	);
}
