import { createFileRoute, Link } from "@tanstack/react-router";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { DEMO_BRAND_PATH } from "@/components/citerank/home/product-demo";
import { Closing } from "@/components/citerank/v2/closing";
import { ACTION, ACTION_QUIET, BODY, LINK, PanelHead } from "@/components/citerank/v2/kit";
import { PageHead, PageShell, PanelSection } from "@/components/citerank/v2/shell";
import { FEATURE_GROUPS, FEATURE_TILE, FeatureCard, featurePath } from "@/components/features";
import { productFeatures } from "@/data/features";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const FROM = "marketing-features-hero";
const title = "Features: AI Visibility & Citation Tracking · CiteRank.com";
const description =
	"What the CiteRank.com tracker does: AI visibility across 13 AI apps, share of voice, sentiment, citations, query fan-out, opportunities, API and MCP.";

export const Route = createFileRoute("/features/")({
	/* The head reads loader data so the feature catalog stays out of the client entry bundle. */
	loader: () => ({
		items: productFeatures.map((f) => ({ name: f.name, path: featurePath(f.slug), description: f.summary })),
	}),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/features" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/features") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "Features", path: "/features" },
			]),
			itemListJsonLd(loaderData?.items ?? []),
		],
	}),
	component: FeaturesPage,
});

function FeaturesPage() {
	const signupUrl = cloudSignupUrl(FROM);
	const demoUrl = demoSiteUrl(FROM, DEMO_BRAND_PATH);
	return (
		<PageShell>
			<PageHead
				title="All you need to grow AI visibility"
				lede={
					<>
						CiteRank.com tracks whether ChatGPT, Google AI Overviews, Perplexity, Gemini and nine other AI apps mention
						you, how they describe you, who they name instead and which sources they cite. Then it tells you what to
						fix, and our{" "}
						<Link to="/agency" className={`${LINK} text-ink`}>
							AI search agency
						</Link>{" "}
						can do it.
					</>
				}
			>
				<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
					<a href={signupUrl} onClick={() => trackEvent("signup_click", { from: FROM })} className={ACTION}>
						Start tracking
					</a>
					<a
						href={demoUrl}
						target="_blank"
						rel={externalRel(demoUrl)}
						onClick={() => trackEvent("demo_open", { from: FROM })}
						className={ACTION_QUIET}
					>
						Try the live demo
					</a>
				</div>
			</PageHead>

			{FEATURE_GROUPS.map((group) => {
				const features = group.slugs.flatMap((slug) => productFeatures.find((f) => f.slug === slug) ?? []);
				const lead = features.length % 2 === 1;
				return (
					<PanelSection key={group.heading}>
						<div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
							<div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
								<PanelHead title={group.heading}>
									<p className={`${BODY} text-zinc-600`}>{group.lede}</p>
								</PanelHead>
							</div>
							<ul className="-mb-12 grid gap-x-8 sm:grid-cols-2 lg:col-span-8">
								{features.map((feature, i) => {
									const wide = lead && i === 0;
									return (
										<li key={feature.slug} className={`${FEATURE_TILE} pb-12 ${wide ? "sm:col-span-2" : ""}`}>
											<FeatureCard feature={feature} wide={wide} />
										</li>
									);
								})}
							</ul>
						</div>
					</PanelSection>
				);
			})}

			<Closing from="marketing-features-closing" />
		</PageShell>
	);
}
