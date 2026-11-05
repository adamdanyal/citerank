import { createFileRoute } from "@tanstack/react-router";
import { AgencySection } from "@/components/citerank/home/agency";
import { Closing } from "@/components/citerank/home/closing";
import { EngineCoverage } from "@/components/citerank/home/engines";
import { Faq } from "@/components/citerank/home/faq";
import { Hero } from "@/components/citerank/home/hero";
import { LogoStrip } from "@/components/citerank/home/logos";
import { Pricing } from "@/components/citerank/home/pricing";
import { Reviews } from "@/components/citerank/home/reviews";
import { Story } from "@/components/citerank/home/story";
import { Tagline } from "@/components/citerank/home/tagline";
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
				<LogoStrip />
				<Story />
				<Tagline />
				<EngineCoverage />
				<Reviews />
				<Pricing />
				<AgencySection />
				<Faq items={HOME_FAQS} />
				<Closing />
			</main>
			<Footer />
		</div>
	);
}
