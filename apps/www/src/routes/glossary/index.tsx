import { createFileRoute } from "@tanstack/react-router";
import { Closing } from "@/components/citerank/home/closing";
import { Container, EASE_CLASS, Reveal } from "@/components/citerank/ui";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
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
		<div className="min-h-screen bg-white antialiased">
			<Navbar />
			<main>
				<section className="-mt-16 bg-paper">
					<Container className="pt-32 pb-16 lg:pt-40 lg:pb-20">
						<div className="max-w-3xl">
							<p className="caption-3 text-blue-800">Glossary</p>
							<h1 className="heading-1 mt-6 text-zinc-950">The AI Search Glossary</h1>
							<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">
								The vocabulary of AI search and answer engine optimization, defined in plain English and cross-linked.
								Start anywhere.
							</p>
						</div>
					</Container>
				</section>

				{GLOSSARY_GROUPS.map((group, index) => {
					const terms = glossaryTerms.filter((t) => t.group === group);
					if (terms.length === 0) return null;
					return (
						<section key={group} className={index % 2 ? "bg-paper-2" : "bg-white"}>
							<Container className="grid gap-10 py-16 lg:grid-cols-12 lg:gap-16 lg:py-20">
								<Reveal className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
									<h2 className="heading-3 text-zinc-950">{group}</h2>
									<p className="caption-2 mt-3 text-zinc-500">
										{terms.length} {terms.length === 1 ? "term" : "terms"}
									</p>
								</Reveal>
								<Reveal delay={100} className="lg:col-span-8">
									<dl className="grid gap-x-10 sm:grid-cols-2">
										{terms.map((t) => (
											<div key={t.slug} className="border-zinc-200 border-t py-5">
												<dt className="title-3 text-zinc-950">
													<a
														href={`/glossary/${t.slug}`}
														className={`rounded-sm transition-colors duration-300 ${EASE_CLASS} hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600`}
													>
														{t.term}
													</a>
													{t.aka && t.aka.length > 0 ? (
														<span className="caption-2 ml-2 font-normal text-zinc-500">{t.aka.join(", ")}</span>
													) : null}
												</dt>
												<dd className="body-6 mt-1.5 text-zinc-600">{t.short}</dd>
											</div>
										))}
									</dl>
								</Reveal>
							</Container>
						</section>
					);
				})}

				<Closing from="marketing-page-cta" />
			</main>
			<Footer />
		</div>
	);
}
