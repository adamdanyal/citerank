import { createFileRoute } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { SKIP_LINK } from "@/components/citerank/v2/shell";
import { Agency } from "@/components/citerank/v3/agency";
import { Closing } from "@/components/citerank/v3/closing";
import { Faq } from "@/components/citerank/v3/faq";
import { Hero } from "@/components/citerank/v3/hero";
import { HowItWorks } from "@/components/citerank/v3/how-it-works";
import { Includes } from "@/components/citerank/v3/includes";
import { Logos } from "@/components/citerank/v3/logos";
import { Pricing } from "@/components/citerank/v3/pricing";
import { Reviews } from "@/components/citerank/v3/reviews";
import v3Css from "@/components/citerank/v3/v3.css?url";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getHeroVariant } from "@/data/hero-variants";
import { useAiReferral } from "@/lib/ai-referral";
import { HOME_FAQS } from "@/lib/faqs";

/* The home page redesigned, kept out of search so the owner can compare it with / side by side. */
export const Route = createFileRoute("/v3")({
	validateSearch: (search: Record<string, unknown>): { v?: unknown } => search,
	head: () => ({
		meta: [{ title: "CiteRank.com · v3 preview" }, { name: "robots", content: "noindex, nofollow" }],
		links: [{ rel: "stylesheet", href: v3Css }],
	}),
	component: V3Preview,
});

function aiReferralHero(assistant: string): ComponentProps<typeof Hero> {
	return {
		title: `Get customers from ${assistant}`,
		lede: `You found us through ${assistant}. CiteRank.com shows how AI tools talk about your brand, which sources they trust, and what to change so they recommend you too.`,
		from: "marketing-ai-referral",
	};
}

function V3Preview() {
	const explicit = getHeroVariant(Route.useSearch().v);
	const [referral] = useAiReferral();
	const variant = explicit ?? (referral ? aiReferralHero(referral.assistant) : undefined);
	return (
		<div className="cr-v3 min-h-screen antialiased">
			<a href="#content" className={SKIP_LINK}>
				Skip to content
			</a>
			<Navbar />
			<main id="content">
				<Hero {...variant} />
				<Logos />
				<HowItWorks />
				<Includes />
				<Reviews />
				<Pricing />
				<Agency />
				<Faq items={HOME_FAQS} />
				<Closing />
			</main>
			<Footer />
		</div>
	);
}
