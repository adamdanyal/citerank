import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Closing } from "@/components/citerank/home/closing";
import { Container, EASE_CLASS, LINK_CARD, Reveal, RevealItem } from "@/components/citerank/ui";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { aeoHeadline, aeoVerticals } from "@/data/aeo-verticals";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "Answer Engine Optimization by Industry · CiteRank.com";
const description =
	"How answer engine optimization applies to your industry: 20 guides on the prompts that matter, what to publish, and how AI engines pick sources.";

export const Route = createFileRoute("/aeo-for/")({
	loader: () => ({
		items: aeoVerticals.map((v) => ({ name: aeoHeadline(v), path: `/aeo-for/${v.slug}` })),
	}),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/aeo-for" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/aeo-for") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AEO by industry", path: "/aeo-for" },
			]),
			itemListJsonLd(loaderData?.items ?? []),
		],
	}),
	component: AeoForIndex,
});

const WHY = [
	"Answer engine optimization is the practice of getting a brand named, cited, and described accurately when someone asks an AI engine a question. The mechanics are consistent across industries: engines retrieve a handful of sources, weigh them for authority and specificity, and synthesise an answer that names a few options. What changes from one industry to the next is which sources carry weight and which questions decide the outcome.",
	"In regulated categories like healthcare, financial services, and insurance, engines lean hard on credentials, accreditation, and verifiable third-party sources, because the cost of a wrong answer is high. In software and developer tools, documentation quality dominates. A tool whose docs are thorough and crawlable gets recommended over an equally capable one whose docs are thin or client-rendered. In local and travel categories, independent guides and review platforms outweigh anything a brand publishes about itself.",
	"The shape of the deciding question changes too. SaaS buyers ask for comparisons and alternatives. Industrial buyers ask by specification. Donors ask about efficiency, patients ask about symptoms, and travellers ask for itineraries rather than for hotels. Tracking the prompts that precede a decision in your category, rather than a generic set of brand queries, is what makes AI visibility measurable instead of anecdotal.",
	"Each guide above covers the prompts worth tracking in that industry, what to publish so engines have something specific to cite, and where the category's answers are currently sourced from.",
];

function AeoForIndex() {
	return (
		<div className="min-h-screen bg-white antialiased">
			<Navbar />
			<main>
				<section className="-mt-16 bg-paper">
					<Container className="pt-32 pb-16 lg:pt-40 lg:pb-20">
						<div className="max-w-3xl">
							<p className="caption-3 text-blue-800">AEO by Industry</p>
							<h1 className="heading-1 mt-6 text-zinc-950">Answer Engine Optimization, by Industry</h1>
							<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">
								The fundamentals of AEO are the same everywhere, but the prompts that matter and the stakes are not.
								Pick your world.
							</p>
						</div>
					</Container>
				</section>

				<section className="bg-white">
					<Container className="py-20 lg:py-24">
						<h2 className="sr-only">Guides by Industry</h2>
						<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{aeoVerticals.map((vertical, index) => (
								<RevealItem key={vertical.slug} delay={(index % 3) * 60} className="flex">
									<a href={`/aeo-for/${vertical.slug}`} className={LINK_CARD}>
										<span className="title-2 flex items-start justify-between gap-3 text-zinc-950">
											{aeoHeadline(vertical)}
											<ArrowRight
												className={`mt-1 size-4 shrink-0 text-blue-700 transition-transform duration-300 ${EASE_CLASS} group-hover:translate-x-0.5`}
												aria-hidden="true"
											/>
										</span>
										<span className="body-6 mt-2 text-zinc-600">{vertical.short}</span>
									</a>
								</RevealItem>
							))}
						</ul>
					</Container>
				</section>

				<section className="bg-paper-2">
					<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
						<Reveal className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
							<h2 className="heading-2 text-zinc-950">Why AEO Differs by Industry</h2>
						</Reveal>
						<Reveal delay={100} className="space-y-6 lg:col-span-8">
							{WHY.map((paragraph) => (
								<p key={paragraph.slice(0, 32)} className="body-7 max-w-[65ch] text-zinc-700">
									{paragraph}
								</p>
							))}
						</Reveal>
					</Container>
				</section>

				<Closing from="marketing-aeo-for-closing" />
			</main>
			<Footer />
		</div>
	);
}
