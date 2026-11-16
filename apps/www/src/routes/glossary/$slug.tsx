import { createFileRoute, notFound } from "@tanstack/react-router";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { Closing } from "@/components/citerank/v2/closing";
import { ACTION, CARD, PANEL, PANEL_PAD, Page, SMALL } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
import { DOC, DOC_TEXT, GuideHead, LABEL, PROSE, RailNav, ROW_ACTION, ROW_LINK } from "@/components/pillar";
import { type GlossaryTerm, getGlossaryTerm, glossaryTerms } from "@/data/glossary";
import { trackEvent } from "@/lib/posthog";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const FROM = "marketing-page-cta";

export const Route = createFileRoute("/glossary/$slug")({
	loader: ({ params }) => {
		const t = getGlossaryTerm(params.slug);
		if (!t) throw notFound();
		const related = (t.related ?? [])
			.map((slug) => glossaryTerms.find((x) => x.slug === slug))
			.filter((x): x is GlossaryTerm => Boolean(x));
		return { term: t, related };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const t = loaderData.term;
		const title = `What Is ${t.term}? · CiteRank.com`;
		const description = t.short;
		const path = `/glossary/${t.slug}`;
		return {
			meta: [{ title }, { name: "description", content: description }, ...ogMeta({ title, description, path })],
			links: [{ rel: "canonical", href: canonicalUrl(path) }],
			scripts: [
				breadcrumbJsonLd([
					{ name: "Home", path: "/" },
					{ name: "Glossary", path: "/glossary" },
					{ name: t.term, path },
				]),
				faqJsonLd([
					{
						question: `What is ${t.term}?`,
						answer: `${t.short} ${t.body[0]}`,
					},
				]),
			],
		};
	},
	component: GlossaryTermPage,
});

function GlossaryTermPage() {
	const { term, related } = Route.useLoaderData() as {
		term: GlossaryTerm;
		related: GlossaryTerm[];
	};
	const signupUrl = cloudSignupUrl(FROM);
	return (
		<PageShell>
			<article>
				<GuideHead back={{ href: "/glossary", label: "AI search glossary" }} title={term.term} lede={term.short} />

				<section className={`${PANEL} ${PANEL_PAD}`}>
					<Page className={DOC}>
						<div className={`${DOC_TEXT} space-y-4 lg:row-start-1`}>
							{term.aka && term.aka.length > 0 ? (
								<p className={`${SMALL} text-zinc-600`}>Also known as {term.aka.join(", ")}</p>
							) : null}
							{term.body.map((p) => (
								<p key={p.slice(0, 32)} className={PROSE}>
									{p}
								</p>
							))}

							<div className={`${CARD} mt-10`}>
								<h2 className={LABEL}>Go deeper</h2>
								<ul className="mt-1.5">
									{(term.seeAlso ?? []).map((link) => (
										<li key={link.href}>
											<a href={link.href} className={`${ROW_LINK} block py-1.5`}>
												<span className={`${ROW_ACTION} block`}>{link.label}</span>
											</a>
										</li>
									))}
								</ul>
								<div className="mt-5 flex flex-col gap-4 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
									<p className={PROSE}>See how often AI names your brand.</p>
									<a href={signupUrl} onClick={() => trackEvent("signup_click", { from: FROM })} className={ACTION}>
										Start tracking
									</a>
								</div>
							</div>
						</div>

						<RailNav
							label="Related terms"
							links={related.map((r) => ({ href: `/glossary/${r.slug}`, label: r.term }))}
						/>
					</Page>
				</section>
			</article>

			<Closing from="marketing-page-cta" />
		</PageShell>
	);
}
