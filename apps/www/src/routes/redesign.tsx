import { createFileRoute } from "@tanstack/react-router";
import { AgencySection } from "@/components/citerank/home/agency";
import { Closing } from "@/components/citerank/home/closing";
import { Demo } from "@/components/citerank/home/demo";
import { EngineCoverage } from "@/components/citerank/home/engines";
import { Faq } from "@/components/citerank/home/faq";
import { Hero } from "@/components/citerank/home/hero";
import { Letter } from "@/components/citerank/home/letter";
import { Pricing } from "@/components/citerank/home/pricing";
import { Reviews } from "@/components/citerank/home/reviews";
import { Story } from "@/components/citerank/home/story";
import { Support } from "@/components/citerank/home/support";
import { Why } from "@/components/citerank/home/why";
import { Navbar } from "@/components/citerank/navbar";
import { RedesignStyles } from "@/components/citerank/styles";
import { PRIMARY_BUTTON } from "@/components/citerank/ui";
import { Footer } from "@/components/footer";
import { HOME_FAQS } from "@/lib/faqs";
import { SITE_NAME } from "@/lib/seo";

/** A side-by-side preview of the redesigned homepage. Not indexed; it goes once the design is decided. */
export const Route = createFileRoute("/redesign")({
	head: () => ({
		meta: [{ title: `Homepage Redesign Preview · ${SITE_NAME}` }, { name: "robots", content: "noindex, nofollow" }],
	}),
	component: RedesignPreview,
});

/*
 * In order: the offer and the product, the pitch in the founder's words, the
 * problem made concrete, how the product answers it, what every plan includes, what it covers, who vouches
 * for it, a no-risk way to try it, the price, the done-for-you option, who
 * the remaining objections, who answers questions, and the offer again.
 */
function RedesignPreview() {
	return (
		<div className="min-h-screen bg-paper antialiased">
			<RedesignStyles />
			<a
				href="#content"
				className={`${PRIMARY_BUTTON} sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50`}
			>
				Skip to content
			</a>
			<Navbar />
			<main id="content">
				<Hero />
				<Letter />
				<Story />
				<Why />
				<EngineCoverage />
				<Reviews />
				<Demo />
				<Pricing />
				<AgencySection />
				<Faq items={HOME_FAQS} />
				<Support />
				<Closing />
			</main>
			<Footer />
		</div>
	);
}
