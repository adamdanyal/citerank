import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Closing } from "@/components/citerank/home/closing";
import { Faq } from "@/components/citerank/home/faq";
import {
	CARD,
	Container,
	EASE_CLASS,
	LINK_CARD,
	LinkArrow,
	PRIMARY_BUTTON_LG,
	QUIET_LINK,
	Reveal,
	RevealItem,
	SECONDARY_BUTTON_LG,
	TEXT_LINK,
} from "@/components/citerank/ui";
import { FeatureGraphic, featurePath } from "@/components/features";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { type FeatureLink, getProductFeature, type ProductFeature } from "@/data/features";
import { FEATURE_SLUGS, getFeatureLabel, indexableFeatureKeys } from "@/lib/competitors";
import { trackEvent } from "@/lib/posthog";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const FROM = "marketing-features-hero";

/* Lower-cases a feature label for mid-sentence use, keeping the acronyms. */
function lowerLabel(label: string) {
	return label.toLowerCase().replace(/\b(ai|llm|api|mcp|seo|aeo|geo)\b/g, (m) => m.toUpperCase());
}

export const Route = createFileRoute("/features/$slug")({
	loader: ({ params }) => {
		const feature = getProductFeature(params.slug);
		if (!feature) throw notFound();
		const related = feature.related
			.map((slug) => getProductFeature(slug))
			.filter((f): f is ProductFeature => Boolean(f));
		// A directory slice only exists once enough tools share the feature, so link the ones that are live.
		const indexable = new Set(indexableFeatureKeys());
		const directory: FeatureLink[] = (feature.directoryFeatures ?? [])
			.filter((key) => indexable.has(key))
			.map((key) => ({
				kind: "Tool directory",
				title: `AI visibility tools with ${lowerLabel(getFeatureLabel(key))}`,
				href: `/ai-visibility-tools/features/${FEATURE_SLUGS[key]}`,
			}));
		return { feature, related, directory };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const { feature: f } = loaderData;
		const path = featurePath(f.slug);
		return {
			meta: [
				{ title: f.metaTitle },
				{ name: "description", content: f.metaDescription },
				...ogMeta({ title: f.metaTitle, description: f.metaDescription, path, label: "Features" }),
			],
			links: [{ rel: "canonical", href: canonicalUrl(path) }],
			scripts: [
				breadcrumbJsonLd([
					{ name: "Home", path: "/" },
					{ name: "Features", path: "/features" },
					{ name: f.name, path },
				]),
				faqJsonLd(f.faqs),
			],
		};
	},
	component: FeaturePage,
});

function FeatureHero({ feature }: { feature: ProductFeature }) {
	const signupUrl = cloudSignupUrl(FROM);
	return (
		<section className="-mt-16 bg-paper">
			<Container className="pt-28 pb-16 lg:pt-32 lg:pb-24">
				<Link
					to="/features"
					className={`caption-2 inline-flex items-center gap-1 rounded-sm text-zinc-500 transition-colors duration-300 ${EASE_CLASS} hover:text-zinc-950`}
				>
					<ArrowLeft className="size-3" aria-hidden="true" />
					All features
				</Link>
				<div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
					<div className="lg:col-span-5">
						<h1 className="heading-1 text-zinc-950">{feature.title}</h1>
						<p className="body-8 mt-6 text-zinc-600">{feature.lede}</p>
						<div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
							<a
								href={signupUrl}
								onClick={() => trackEvent("signup_click", { from: FROM })}
								className={PRIMARY_BUTTON_LG}
							>
								Start tracking
								<ArrowRight className="size-4" aria-hidden="true" />
							</a>
							<Link to="/agency" className={SECONDARY_BUTTON_LG}>
								Have us do the work
							</Link>
						</div>
						<p className="body-6 mt-6 text-zinc-600">
							Read the{" "}
							<a href={feature.docs.href} className={`${QUIET_LINK} text-zinc-950`}>
								{feature.docs.title.toLowerCase()}
							</a>
							.
						</p>
					</div>
					<div className="lg:col-span-7">
						<FeatureGraphic graphic={feature.graphic} />
					</div>
				</div>
			</Container>
		</section>
	);
}

function Steps({ feature }: { feature: ProductFeature }) {
	const secondary = feature.secondaryGraphic;
	const steps = (
		<ol className={secondary ? "mt-10 space-y-8" : "mt-10 grid gap-8 md:grid-cols-3"}>
			{feature.steps.map((step, i) => (
				<RevealItem key={step.name} delay={i * 80} className="flex gap-5">
					<span className="caption-1 mt-1 font-mono text-blue-700 tabular-nums">0{i + 1}</span>
					<div>
						<h3 className="title-2 text-zinc-950">{step.name}</h3>
						<p className="body-6 mt-2 text-zinc-600">{step.text}</p>
					</div>
				</RevealItem>
			))}
		</ol>
	);
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				{secondary ? (
					<div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
						<div className="lg:col-span-5">
							<Reveal>
								<h2 className="heading-2 text-zinc-950">What You Can Do</h2>
							</Reveal>
							{steps}
						</div>
						<Reveal delay={100} className="lg:col-span-7">
							<FeatureGraphic graphic={secondary} />
						</Reveal>
					</div>
				) : (
					<>
						<Reveal>
							<h2 className="heading-2 text-zinc-950">What You Can Do</h2>
						</Reveal>
						{steps}
					</>
				)}
			</Container>
		</section>
	);
}

function Metrics({ feature }: { feature: ProductFeature }) {
	return (
		<section className="bg-paper-2">
			<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
				<Reveal className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
					<h2 className="heading-2 text-zinc-950">Data You Can Act On</h2>
				</Reveal>
				<Reveal delay={100} className="lg:col-span-8">
					<dl className="grid gap-x-10 sm:grid-cols-2">
						{feature.metrics.map((m) => (
							<div key={m.term} className="border-zinc-200 border-t py-5">
								<dt className="title-3 text-zinc-950">{m.term}</dt>
								<dd className="body-6 mt-1.5 text-zinc-600">{m.definition}</dd>
							</div>
						))}
					</dl>
				</Reveal>
			</Container>
		</section>
	);
}

function UseCasesAndWhy({ feature }: { feature: ProductFeature }) {
	return (
		<section className="bg-white">
			<Container className="grid gap-5 py-20 lg:grid-cols-2 lg:py-24">
				<Reveal className={`${CARD} p-6 md:p-8`}>
					<h2 className="heading-5 text-zinc-950">Use Cases</h2>
					<ul className="mt-6 space-y-4">
						{feature.useCases.map((u) => (
							<li key={u} className="body-6 flex gap-3 text-zinc-700">
								<Check className="mt-1 size-4 shrink-0 text-blue-700" strokeWidth={2.5} aria-hidden="true" />
								{u}
							</li>
						))}
					</ul>
				</Reveal>
				<Reveal delay={100} className={`${CARD} p-6 md:p-8`}>
					<h2 className="heading-5 text-zinc-950">Why CiteRank.com</h2>
					<ul className="mt-6 space-y-5">
						{feature.why.map((w) => (
							<li key={w.name}>
								<h3 className="title-3 text-zinc-950">{w.name}</h3>
								<p className="body-6 mt-1 text-zinc-600">{w.text}</p>
							</li>
						))}
					</ul>
				</Reveal>
			</Container>
		</section>
	);
}

function LearnMore({ links }: { links: FeatureLink[] }) {
	return (
		<section className="bg-paper">
			<Container className="py-20 lg:py-24">
				<Reveal>
					<h2 className="heading-3 text-zinc-950">Related Guides</h2>
				</Reveal>
				<ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{links.map((l, i) => (
						<RevealItem key={l.href} delay={(i % 3) * 80} className="flex">
							<a href={l.href} className={LINK_CARD}>
								<span className="caption-3 text-zinc-500">{l.kind}</span>
								<span className="title-3 mt-2 text-zinc-950">{l.title}</span>
							</a>
						</RevealItem>
					))}
				</ul>
			</Container>
		</section>
	);
}

function RelatedFeatures({ related }: { related: ProductFeature[] }) {
	return (
		<section className="bg-white">
			<Container className="py-20 lg:py-24">
				<Reveal className="flex flex-wrap items-center justify-between gap-4">
					<h2 className="heading-3 text-zinc-950">Related Features</h2>
					<Link to="/features" className={TEXT_LINK}>
						All features
						<LinkArrow />
					</Link>
				</Reveal>
				<ul className="mt-8 grid gap-4 md:grid-cols-3">
					{related.map((f, i) => (
						<RevealItem key={f.slug} delay={i * 80} className="flex">
							<a href={featurePath(f.slug)} className={LINK_CARD}>
								<span className="title-2 flex items-start justify-between gap-3 text-zinc-950">
									{f.name}
									<ArrowRight
										className={`mt-1 size-4 shrink-0 text-blue-700 transition-transform duration-300 ${EASE_CLASS} group-hover:translate-x-0.5`}
										aria-hidden="true"
									/>
								</span>
								<span className="body-6 mt-2 text-zinc-600">{f.summary}</span>
							</a>
						</RevealItem>
					))}
				</ul>
			</Container>
		</section>
	);
}

function FeaturePage() {
	const { feature, related, directory } = Route.useLoaderData() as {
		feature: ProductFeature;
		related: ProductFeature[];
		directory: FeatureLink[];
	};
	const links: FeatureLink[] = [{ kind: "Docs", ...feature.docs }, ...feature.guides, ...directory];
	return (
		<div className="min-h-screen bg-white antialiased">
			<Navbar />
			<main>
				<FeatureHero feature={feature} />
				<Steps feature={feature} />
				<Metrics feature={feature} />
				<UseCasesAndWhy feature={feature} />
				<LearnMore links={links} />
				<RelatedFeatures related={related} />
				<Faq items={feature.faqs} />
				<Closing from="marketing-features-closing" />
			</main>
			<Footer />
		</div>
	);
}
