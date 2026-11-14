import { createFileRoute } from "@tanstack/react-router";
import { Closing } from "@/components/citerank/v2/closing";
import { BODY, LEAD, PANEL, PANEL_PAD, Page, PanelHead, SMALL } from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { ROW, ROW_LINK, ROW_TITLE } from "@/components/pillar";
import { GLOSSARY_GROUPS, glossaryTerms } from "@/data/glossary";
import { breadcrumbJsonLd, canonicalUrl, definedTermSetJsonLd, ogMeta } from "@/lib/seo";

const title = "AI Search & AEO Glossary · CiteRank.com";
const description =
	"A plain-English glossary of AI search and answer engine optimization terms: AEO, GEO, LLMO, AI Overviews, citations, share of voice, RAG, and more.";

export const Route = createFileRoute("/glossary/")({
	loader: () => ({
		terms: glossaryTerms.map((t) => ({ term: t.term, definition: t.short, url: `/glossary/${t.slug}` })),
	}),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/glossary" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/glossary") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "Glossary", path: "/glossary" },
			]),
			definedTermSetJsonLd({
				name: "AI Search & AEO Glossary",
				description,
				path: "/glossary",
				terms: loaderData?.terms ?? [],
			}),
		],
	}),
	component: GlossaryIndex,
});

function GlossaryIndex() {
	return (
		<PageShell>
			<PageHead
				title="The AI search glossary"
				lede="The vocabulary of AI search and answer engine optimization, defined in plain English and cross-linked. Start anywhere."
			/>

			{GLOSSARY_GROUPS.map((group) => {
				const terms = glossaryTerms.filter((t) => t.group === group);
				if (terms.length === 0) return null;
				return (
					<section key={group} className={`${PANEL} ${PANEL_PAD}`}>
						<Page className="grid gap-10 lg:grid-cols-12 lg:gap-8">
							<div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
								<PanelHead title={group}>
									<p className={`${LEAD} text-zinc-600`}>
										{terms.length} {terms.length === 1 ? "term" : "terms"}
									</p>
								</PanelHead>
							</div>
							<ul className="border-b border-zinc-200 lg:col-span-8">
								{terms.map((t) => (
									<li key={t.slug} className={ROW}>
										<a href={`/glossary/${t.slug}`} className={`${ROW_LINK} block py-6`}>
											<h3 className={ROW_TITLE}>
												{t.term}
												{t.aka && t.aka.length > 0 ? (
													<span
														className={`${SMALL} ml-3 inline-block font-sans font-normal tracking-normal text-zinc-600`}
													>
														{t.aka.join(", ")}
													</span>
												) : null}
											</h3>
											<p className={`${BODY} mt-2 max-w-[64ch] text-zinc-600`}>{t.short}</p>
										</a>
									</li>
								))}
							</ul>
						</Page>
					</section>
				);
			})}

			<Closing from="marketing-page-cta" />
		</PageShell>
	);
}
