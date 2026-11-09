import { createFileRoute } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { Closing } from "@/components/citerank/home/closing";
import { Faq } from "@/components/citerank/home/faq";
import { OtherPlans } from "@/components/citerank/home/pricing";
import { Compare } from "@/components/citerank/pricing/compare";
import { PlanCards } from "@/components/citerank/pricing/plan-cards";
import { Container, PRIMARY_BUTTON } from "@/components/citerank/ui";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PRICING_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const title = "Pricing: AI Visibility Tracker Plans · CiteRank.com";
const description = `CiteRank.com is a self-serve AI visibility tracker from $${CLOUD_ENTRY_PRICE_USD}/mo, with an AI search agency and custom plans on request.`;

export const Route = createFileRoute("/pricing")({
	head: () => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/pricing" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/pricing") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "Pricing", path: "/pricing" },
			]),
			faqJsonLd(PRICING_FAQS),
		],
	}),
	component: PricingPage,
});

/* The plans first with one button each, then the two other ways to buy, then the detail, the objections and the offer again. */
function PricingPage() {
	return (
		<div className="min-h-screen bg-white antialiased">
			<a
				href="#content"
				className={`${PRIMARY_BUTTON} sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50`}
			>
				Skip to content
			</a>
			<Navbar />
			<main id="content">
				<section className="-mt-16 bg-paper">
					<Container className="pt-32 lg:pt-40">
						<div className="mx-auto max-w-3xl text-center">
							<h1 className="heading-1 text-zinc-950">AI Visibility Tracker Pricing</h1>
							<p className="body-8 mt-6 text-zinc-600">
								Every plan includes your whole team and API access. Pay monthly or yearly, and cancel any time.
							</p>
						</div>
					</Container>
				</section>
				<section className="bg-paper">
					<Container className="py-12 lg:py-16">
						<h2 className="sr-only">Tracker Plans</h2>
						<PlanCards />
						<OtherPlans className="mt-10" />
					</Container>
				</section>
				<Compare />
				<Faq items={PRICING_FAQS} />
				<Closing from="marketing-pricing-closing" />
			</main>
			<Footer />
		</div>
	);
}
