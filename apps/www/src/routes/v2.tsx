import { createFileRoute } from "@tanstack/react-router";
import { Agency } from "@/components/citerank/v2/agency";
import { Closing } from "@/components/citerank/v2/closing";
import { Demo } from "@/components/citerank/v2/demo";
import { Engines } from "@/components/citerank/v2/engines";
import { Faq } from "@/components/citerank/v2/faq";
import { Hero } from "@/components/citerank/v2/hero";
import { HowItWorks } from "@/components/citerank/v2/how-it-works";
import { Letter } from "@/components/citerank/v2/letter";
import { Pricing } from "@/components/citerank/v2/pricing";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { HOME_FAQS } from "@/lib/faqs";

/* A preview of the v2 design, kept out of search until it replaces the home page. */
export const Route = createFileRoute("/v2")({
	head: () => ({
		meta: [{ title: "CiteRank.com · v2 preview" }, { name: "robots", content: "noindex, nofollow" }],
	}),
	component: V2Preview,
});

function V2Preview() {
	return (
		<div className="min-h-screen bg-paper antialiased">
			<Navbar />
			<main>
				<Hero />
				<Engines />
				<HowItWorks />
				<Letter />
				<Demo />
				<Pricing />
				<Agency />
				<Faq items={HOME_FAQS} />
				<Closing />
			</main>
			<Footer />
		</div>
	);
}
