import { createFileRoute } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { AgencySection } from "@/components/citerank/home/agency";
import { Closing } from "@/components/citerank/home/closing";
import { Demo } from "@/components/citerank/home/demo";
import { EngineCoverage } from "@/components/citerank/home/engines";
import { Faq } from "@/components/citerank/home/faq";
import { Hero } from "@/components/citerank/home/hero";
import { Letter } from "@/components/citerank/home/letter";
import { Pricing } from "@/components/citerank/home/pricing";
import { Reviews } from "@/components/citerank/home/reviews";
import { StickyCta } from "@/components/citerank/home/sticky-cta";
import { Story } from "@/components/citerank/home/story";
import { Why } from "@/components/citerank/home/why";
import { PRIMARY_BUTTON } from "@/components/citerank/ui";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getHeroVariant } from "@/data/hero-variants";
import { useAiReferral } from "@/lib/ai-referral";
import { HOME_FAQS } from "@/lib/faqs";
import { canonicalUrl, faqJsonLd, ogMeta, SITE_NAME, softwareApplicationJsonLd } from "@/lib/seo";

const title = `${SITE_NAME} · AI Visibility Tracker and AI Search Agency`;
// The shared SITE_DESCRIPTION is a terse fallback for pages without their own
// copy. The homepage takes the largest share of search clicks and is the page
// answer engines cite most, so it gets a full-width description of its own.
const description =
	"CiteRank.com is answer engine optimization (AEO): track your brand's AI visibility in ChatGPT, Perplexity, and Gemini. Plans from $29/mo, or hire our AI search agency.";

export const Route = createFileRoute("/")({
	// Passes every other param through untouched: ad clicks carry gclid and UTM
	// tags that the conversion tags read from the landing URL.
	validateSearch: (search: Record<string, unknown>): { v?: unknown } => search,
	head: () => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({
				title,
				description,
				path: "/",
			}),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/") }],
		scripts: [softwareApplicationJsonLd(), faqJsonLd(HOME_FAQS)],
	}),
	component: HomePage,
});

function aiReferralHero(assistant: string): ComponentProps<typeof Hero> {
	return {
		title: `Get Customers from ${assistant}`,
		lede: `You found us through ${assistant}. CiteRank.com shows how AI search engines talk about your brand, which sources they trust, and what to change so they recommend you too.`,
		from: "marketing-ai-referral",
	};
}

/*
 * In order: the offer and the product, the pitch in the founder's words, the
 * problem made concrete, how the product answers it, what every plan includes,
 * what it covers, who vouches for it, a no-risk way to try it, the price, the
 * done-for-you option, the remaining objections, and the offer again.
 */
function HomePage() {
	const explicit = getHeroVariant(Route.useSearch().v);
	const [referral] = useAiReferral();
	const variant = explicit ?? (referral ? aiReferralHero(referral.assistant) : undefined);
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
				<Hero {...variant} />
				<Letter />
				<Story />
				<Why />
				<EngineCoverage />
				<Reviews />
				<Demo />
				<Pricing />
				<AgencySection />
				<Faq items={HOME_FAQS} />
				<Closing />
			</main>
			<Footer />
			<StickyCta />
		</div>
	);
}
