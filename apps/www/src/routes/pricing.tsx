import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { Closing } from "@/components/home/closing";
import { Faq } from "@/components/home/faq";
import { HOME_FONT_CLASS, HomeStyles } from "@/components/home/styles";
import { Navbar } from "@/components/navbar";
import { Pricing } from "@/components/pricing";
import { PRICING_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const title = "Pricing: Self-Serve AI Visibility Tracker Plans · CiteRank.com";
const description =
	"CiteRank.com tracker plans: Starter $29/mo, Basic $99/mo, Pro $299/mo, Business $649/mo. Yearly billing saves two months.";

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

function PricingPage() {
	return (
		<div className={`${HOME_FONT_CLASS} min-h-screen`}>
			<HomeStyles />
			<Navbar />
			<main>
				<Pricing as="h1" />
				<Faq items={PRICING_FAQS} />
				<Closing from="marketing-pricing-closing" />
			</main>
			<Footer />
		</div>
	);
}
