import { createFileRoute } from "@tanstack/react-router";
import { getModelMeta } from "@workspace/config/models";
import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS } from "@workspace/config/plans";
import type { ComponentProps } from "react";
import { StickyCta } from "@/components/citerank/home/sticky-cta";
import { PRIMARY_BUTTON } from "@/components/citerank/ui";
import { Agency } from "@/components/citerank/v2/agency";
import { Closing } from "@/components/citerank/v2/closing";
import { Demo } from "@/components/citerank/v2/demo";
import { Engines } from "@/components/citerank/v2/engines";
import { Faq } from "@/components/citerank/v2/faq";
import { Figures } from "@/components/citerank/v2/figures";
import { Hero } from "@/components/citerank/v2/hero";
import { HowItWorks } from "@/components/citerank/v2/how-it-works";
import { Includes } from "@/components/citerank/v2/includes";
import { Letter } from "@/components/citerank/v2/letter";
import { Logos } from "@/components/citerank/v2/logos";
import { Pricing } from "@/components/citerank/v2/pricing";
import { Reviews } from "@/components/citerank/v2/reviews";
import { STEP_SCHEMA } from "@/components/citerank/v2/steps";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getHeroVariant } from "@/data/hero-variants";
import { useAiReferral } from "@/lib/ai-referral";
import { HOME_FAQS } from "@/lib/faqs";
import {
	canonicalUrl,
	faqJsonLd,
	homePageJsonLd,
	howToJsonLd,
	ogMeta,
	SITE_NAME,
	softwareApplicationJsonLd,
	trackedEnginesJsonLd,
} from "@/lib/seo";

const title = `${SITE_NAME} · AI Visibility Tracker and AI Search Agency`;
// The shared SITE_DESCRIPTION is a terse fallback for pages without their own
// copy. The homepage takes the largest share of search clicks and is the page
// answer engines cite most, so it gets a full-width description of its own.
const description = `CiteRank.com is an AEO platform: track your brand in ChatGPT, Perplexity and Gemini and see what to fix. Plans from $${CLOUD_ENTRY_PRICE_USD}/mo, or hire our AI search agency.`;

const ENGINES = Object.keys(CLOUD_PLATFORMS).map((model) => ({ model, label: getModelMeta(model).label }));

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
				image: "/og-home.png",
			}),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/") }],
		// The page entity and the engine list come first: they name what this page
		// is about and resolve every engine it mentions to a real product, which is
		// what an answer engine reads before deciding the page answers a question.
		scripts: [
			homePageJsonLd(ENGINES),
			softwareApplicationJsonLd(),
			trackedEnginesJsonLd(ENGINES),
			howToJsonLd({
				name: `How ${SITE_NAME} tracks a brand in AI search`,
				description: `The three steps ${SITE_NAME} runs every day, from asking the engines to ranking what to fix.`,
				steps: STEP_SCHEMA,
			}),
			faqJsonLd(HOME_FAQS),
		],
	}),
	component: HomePage,
});

function aiReferralHero(assistant: string): ComponentProps<typeof Hero> {
	return {
		title: `Get customers from ${assistant}`,
		lede: `You found us through ${assistant}. CiteRank.com shows how AI search engines talk about your brand, which sources they trust, and what to change so they recommend you too.`,
		from: "marketing-ai-referral",
	};
}

/*
 * In order: the offer and the product, who uses it, what it covers, how it
 * works, the numbers behind it, the pitch in the founder's words, a no-risk way
 * to try it, who vouches for it, the price, the done-for-you option, the
 * remaining objections, and the offer again.
 */
function HomePage() {
	const explicit = getHeroVariant(Route.useSearch().v);
	const [referral] = useAiReferral();
	const variant = explicit ?? (referral ? aiReferralHero(referral.assistant) : undefined);
	return (
		<div className="cr-v2 min-h-screen bg-paper-2 antialiased">
			<a
				href="#content"
				className={`${PRIMARY_BUTTON} sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50`}
			>
				Skip to content
			</a>
			<Navbar />
			{/* The nav is a floating pill, so the first panel keeps the same gap below it as the panels keep from each other. */}
			<main
				id="content"
				className="mx-auto w-full max-w-[1400px] space-y-3 px-3 pt-3 pb-3 sm:px-4 sm:pt-4 sm:pb-4 md:space-y-4 md:px-5 md:pt-5 md:pb-5"
			>
				<Hero {...variant} />
				<Logos />
				<Includes />
				<Engines />
				<HowItWorks />
				<Figures />
				<Letter />
				<Demo />
				<Reviews />
				<Pricing />
				<Agency />
				<Faq items={HOME_FAQS} />
				<Closing />
			</main>
			<Footer />
			<StickyCta />
		</div>
	);
}
