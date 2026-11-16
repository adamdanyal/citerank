import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { ACTION, ACTION_QUIET, BODY, LIST_CARD, SUBHEAD } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
import { CiteRankCta, DirectoryHero, DirectorySection } from "@/components/directory-shell";
import { Faq } from "@/components/faq";
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
import { trackEvent } from "@/lib/posthog";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const FROM = "marketing-page-cta";

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
		<PageShell>
			<DirectoryHero back title={`${competitor.name} alternatives`} lead={getAlternativesVerdict(competitor)}>
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
					<a href={cloudSignupUrl(FROM)} onClick={() => trackEvent("signup_click", { from: FROM })} className={ACTION}>
						Start tracking
					</a>
					<Link
						to="/ai-visibility-tools/$slug"
						params={{ slug: getComparisonSlug(competitor) }}
						className={`${ACTION_QUIET} min-w-0`}
					>
						<span className="truncate">CiteRank.com vs {competitor.name}</span>
					</Link>
				</div>
			</DirectoryHero>

			{competitor.switching ? (
				<DirectorySection
					title={`Why teams leave ${competitor.name}`}
					lede={
						<p className={`${BODY} text-zinc-600`}>
							What people say when they leave {competitor.name}, and what CiteRank.com does differently.
						</p>
					}
				>
					<ul className={LIST_CARD}>
						{competitor.switching.reasons.map((reason) => (
							<li
								key={reason.headline}
								className="grid gap-x-8 gap-y-3 border-t border-zinc-200 py-6 lg:grid-cols-12 lg:py-8"
							>
								<h3 className={`${SUBHEAD} text-ink lg:col-span-5`}>{reason.headline}</h3>
								<p className={`${BODY} text-zinc-600 lg:col-span-7`}>{reason.citeRank}</p>
							</li>
						))}
					</ul>
				</DirectorySection>
			) : null}

			<DirectorySection title={`Other ${competitor.name} alternatives`}>
				<ToolGrid competitors={alternatives} />
			</DirectorySection>

			<Faq items={getAlternativesFaqs(competitor, alternatives)} />
			<CiteRankCta />
		</PageShell>
	);
}
