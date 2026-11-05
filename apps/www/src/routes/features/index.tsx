import { createFileRoute, Link } from "@tanstack/react-router";
import { Closing } from "@/components/citerank/home/closing";
import { FeatureCard, featurePath } from "@/components/features";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { productFeatures } from "@/data/features";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "Features: AI Visibility, Citation & Competitor Tracking · CiteRank.com";
const description =
	"Everything CiteRank.com's tracker does: AI visibility tracking across 12 AI apps, share of voice, sentiment, citations, query fan-out, prompt tracking, recommendations, reporting, and an API and MCP server.";

export const Route = createFileRoute("/features/")({
	head: () => ({
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
			itemListJsonLd(productFeatures.map((f) => ({ name: f.name, path: featurePath(f.slug), description: f.summary }))),
		],
	}),
	component: FeaturesPage,
});

function FeaturesPage() {
	return (
		<div className="min-h-screen bg-white antialiased">
			<Navbar />
			<main>
				<section className="relative overflow-hidden bg-paper">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
					/>
					<div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 md:px-6 lg:pb-20 lg:pt-24">
						<h1 className="heading-1 max-w-3xl text-zinc-950">All You Need to Grow AI Visibility</h1>
						<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">
							CiteRank.com tracks whether ChatGPT, Google AI Overviews, Perplexity, Gemini and other AI apps mention
							you, how they describe you, who they name instead and which sources they cite. Then it tells you what to
							do, and our{" "}
							<Link to="/agency" className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4">
								AI search agency
							</Link>{" "}
							can do it.
						</p>
					</div>
				</section>

				<section className="bg-white">
					<div className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:py-20">
						<ul className="grid gap-5 md:grid-cols-2">
							{productFeatures.map((f) => (
								<li key={f.slug} className="flex">
									<FeatureCard feature={f} />
								</li>
							))}
						</ul>
					</div>
				</section>

				<Closing from="marketing-features-closing" />
			</main>
			<Footer />
		</div>
	);
}
