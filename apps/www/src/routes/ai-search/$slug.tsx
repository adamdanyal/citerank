import { createFileRoute, notFound } from "@tanstack/react-router";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { ACTION, CARD, LINK, PANEL, PANEL_PAD, Page } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
import { Faq } from "@/components/faq";
import { CiteRankCta, DOC, DOC_HEAD, DOC_TEXT, GuideHead, PROSE, RailNav, Steps } from "@/components/pillar";
import { type AiSearchEngine, aiSearchEngines, getAiSearchEngine } from "@/data/ai-search-engines";
import type { FaqItem } from "@/lib/faqs";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, howToJsonLd, ogMeta } from "@/lib/seo";

function engineFaqs(e: AiSearchEngine): FaqItem[] {
	return [
		{
			question: `How do I get my brand mentioned in ${e.name}?`,
			answer: `${e.short} ${e.steps[0].text} ${e.steps[1].text}`,
		},
		{
			question: `Does CiteRank.com track ${e.name}?`,
			answer: e.tracking,
		},
	];
}

export const Route = createFileRoute("/ai-search/$slug")({
	loader: ({ params }) => {
		const e = getAiSearchEngine(params.slug);
		if (!e) throw notFound();
		const related = (e.related ?? [])
			.map((slug) => aiSearchEngines.find((x) => x.slug === slug))
			.filter((x): x is AiSearchEngine => Boolean(x));
		return { engine: e, related };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const e = loaderData.engine;
		const title = `How to Appear in ${e.name} · CiteRank.com`;
		const description = e.short;
		const path = `/ai-search/${e.slug}`;
		return {
			meta: [{ title }, { name: "description", content: description }, ...ogMeta({ title, description, path })],
			links: [{ rel: "canonical", href: canonicalUrl(path) }],
			scripts: [
				breadcrumbJsonLd([
					{ name: "Home", path: "/" },
					{ name: "AI Search", path: "/ai-search" },
					{ name: e.name, path },
				]),
				howToJsonLd({
					name: `How to appear in ${e.name}`,
					description: e.short,
					steps: e.steps,
				}),
				faqJsonLd(engineFaqs(e)),
			],
		};
	},
	component: EnginePage,
});

function EnginePage() {
	const { engine, related } = Route.useLoaderData() as {
		engine: AiSearchEngine;
		related: AiSearchEngine[];
	};
	const signupUrl = cloudSignupUrl("marketing-page-cta");
	return (
		<PageShell>
			<article>
				<GuideHead
					back={{ href: "/ai-search", label: "AI search guides" }}
					title={`How to appear in ${engine.name}`}
					lede={engine.short}
				>
					<a href={signupUrl} className={ACTION}>
						Start tracking
					</a>
				</GuideHead>

				<section className={`${PANEL} ${PANEL_PAD}`}>
					<Page className={DOC}>
						<div className={`${DOC_TEXT} lg:row-start-1`}>
							<div className="space-y-4">
								{engine.intro.map((p) => (
									<p key={p.slice(0, 32)} className={PROSE}>
										{p}
									</p>
								))}
							</div>

							<h2 className={`${DOC_HEAD} mt-14`}>How to improve your odds</h2>
							<Steps steps={engine.steps} />

							<div className={`${CARD} mt-14`}>
								<h2 className={DOC_HEAD}>Tracking your visibility in {engine.name}</h2>
								<p className={`${PROSE} mt-3`}>{engine.tracking}</p>
								<p className="mt-5">
									<a href={signupUrl} className={`${LINK} font-medium text-ink`}>
										Start tracking
									</a>
								</p>
							</div>
						</div>

						<RailNav
							label="Other engines"
							links={related.map((r) => ({ href: `/ai-search/${r.slug}`, label: r.name }))}
						/>
					</Page>
				</section>
			</article>

			<Faq items={engineFaqs(engine)} />
			<CiteRankCta />
		</PageShell>
	);
}
