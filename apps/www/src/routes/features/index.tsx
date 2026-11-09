import { createFileRoute, Link } from "@tanstack/react-router";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Closing } from "@/components/citerank/home/closing";
import { DEMO_BRAND_PATH } from "@/components/citerank/home/product-demo";
import {
	Container,
	PRIMARY_BUTTON_LG,
	QUIET_LINK,
	Reveal,
	RevealItem,
	SECONDARY_BUTTON_LG,
} from "@/components/citerank/ui";
import { FEATURE_GROUPS, FeatureCard, featurePath } from "@/components/features";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { productFeatures } from "@/data/features";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const FROM = "marketing-features-hero";
const title = "Features: AI Visibility & Citation Tracking · CiteRank.com";
const description =
	"What the CiteRank.com tracker does: AI visibility across 12 AI apps, share of voice, sentiment, citations, query fan-out, opportunities, API and MCP.";

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
		<div className="min-h-screen bg-white antialiased">
			<Navbar />
			<main>
				<section className="-mt-16 bg-paper">
					<Container className="pt-32 pb-16 lg:pt-40 lg:pb-20">
						<div className="max-w-3xl">
							<p className="caption-3 text-blue-800">Features</p>
							<h1 className="heading-1 mt-6 text-zinc-950">All you need to grow AI visibility</h1>
							<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">
								CiteRank.com tracks whether ChatGPT, Google AI Overviews, Perplexity, Gemini and eight other AI apps
								mention you, how they describe you, who they name instead and which sources they cite. Then it tells you
								what to fix, and our{" "}
								<Link to="/agency" className={`${QUIET_LINK} text-zinc-950`}>
									AI search agency
								</Link>{" "}
								can do it.
							</p>
							<div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
								<a
									href={signupUrl}
									onClick={() => trackEvent("signup_click", { from: FROM })}
									className={PRIMARY_BUTTON_LG}
								>
									Start tracking
									<ArrowRight className="size-4" aria-hidden="true" />
								</a>
								<a
									href={demoUrl}
									target="_blank"
									rel={externalRel(demoUrl)}
									onClick={() => trackEvent("demo_open", { from: FROM })}
									className={SECONDARY_BUTTON_LG}
								>
									Try the live demo
									<ArrowUpRight className="size-4" aria-hidden="true" />
								</a>
							</div>
						</div>
					</Container>
				</section>

				{FEATURE_GROUPS.map((group, index) => {
					const features = group.slugs.flatMap((slug) => productFeatures.find((f) => f.slug === slug) ?? []);
					const lead = features.length % 2 === 1;
					return (
						<section key={group.heading} className={index % 2 ? "bg-paper-2" : "bg-white"}>
							<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
								<Reveal className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
									<h2 className="heading-2 text-zinc-950">{group.heading}</h2>
									<p className="body-6 mt-6 text-zinc-600">{group.lede}</p>
								</Reveal>
								<ul className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
									{features.map((feature, i) => {
										const wide = lead && i === 0;
										return (
											<RevealItem key={feature.slug} delay={(i % 2) * 80} className={wide ? "sm:col-span-2" : ""}>
												<FeatureCard feature={feature} wide={wide} />
											</RevealItem>
										);
									})}
								</ul>
							</Container>
						</section>
					);
				})}

				<Closing from="marketing-features-closing" />
			</main>
			<Footer />
		</div>
	);
}
