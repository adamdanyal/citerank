import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { Closing } from "@/components/citerank/v2/closing";
import { Faq } from "@/components/citerank/v2/faq";
import {
	ACTION,
	ACTION_QUIET,
	BAND_PAD,
	BODY,
	CARD,
	HEADING,
	LEAD,
	LINK,
	LIST_CARD,
	LinkCards,
	PANEL,
	PANEL_PAD,
	PANEL_PAD_TIGHT,
	PANEL_TINT,
	Page,
	PanelHead,
	RuledRow,
	SMALL,
	StepCards,
	StepRows,
	SUBHEAD,
} from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
import { FeatureGraphic, featurePath } from "@/components/features";
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

const FOCUS = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust";
const HOVER_TITLE = "transition-colors duration-200 group-hover:text-rust";

function FeatureHero({ feature }: { feature: ProductFeature }) {
	const signupUrl = cloudSignupUrl(FROM);
	return (
		<PageHead title={feature.title} lede={feature.lede}>
			<div className="flex flex-col gap-3 sm:flex-row">
				<a href={signupUrl} onClick={() => trackEvent("signup_click", { from: FROM })} className={ACTION}>
					Start tracking
				</a>
				<Link to="/agency" className={ACTION_QUIET}>
					Have us do the work
				</Link>
			</div>
			<p className={`${SMALL} mt-5 flex flex-wrap gap-x-6 gap-y-2 text-zinc-700`}>
				<a href={feature.docs.href} className={LINK}>
					{feature.docs.title}
				</a>
				<Link to="/features" className={LINK}>
					All features
				</Link>
			</p>
		</PageHead>
	);
}

/*
 * The product itself across the full width, then what a visitor does with it.
 * The capture opens this section rather than closing the one above, so the
 * page's opening still ends inside the first screen on a tall display.
 */
function Steps({ feature }: { feature: ProductFeature }) {
	const secondary = feature.secondaryGraphic;
	const steps = feature.steps.map((step) => ({ title: step.name, body: step.text }));
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<FeatureGraphic graphic={feature.graphic} className="mb-16 lg:mb-24" />
				{secondary ? (
					<div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-x-16">
						<div>
							<PanelHead title="What you can do" />
							<StepRows stacked steps={steps} className="mt-8 lg:mt-10" />
						</div>
						<FeatureGraphic graphic={secondary} />
					</div>
				) : (
					<>
						<PanelHead title="What you can do" />
						<StepCards steps={steps} className="mt-10 lg:mt-16 lg:grid-cols-3" />
					</>
				)}
			</Page>
		</section>
	);
}

/* Rows, unless there are too few to make a list: one or two measures sit beside the head instead, so the section still fills its width. */
function Metrics({ feature }: { feature: ProductFeature }) {
	if (feature.metrics.length < 3) {
		return (
			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page className="grid gap-10 lg:grid-cols-3 lg:gap-8">
					<PanelHead title="Data you can act on" />
					{feature.metrics.map((metric) => (
						<div key={metric.term} className={CARD}>
							<h3 className={`${SUBHEAD} text-ink`}>{metric.term}</h3>
							<p className={`${BODY} mt-3 max-w-[44ch] text-zinc-600`}>{metric.definition}</p>
						</div>
					))}
				</Page>
			</section>
		);
	}
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="Data you can act on" />
				<ul className={`${LIST_CARD} mt-10 lg:mt-16`}>
					{feature.metrics.map((metric) => (
						<RuledRow key={metric.term} title={metric.term}>
							{metric.definition}
						</RuledRow>
					))}
				</ul>
			</Page>
		</section>
	);
}

/* Who it is for and why this tool, side by side on tinted paper: the page's one band before the close. */
function UseCasesAndWhy({ feature }: { feature: ProductFeature }) {
	return (
		<section className={`${PANEL_TINT} ${BAND_PAD}`}>
			<Page className="grid gap-14 lg:grid-cols-2 lg:gap-x-16">
				<div>
					<h2 className={`${HEADING} text-ink`}>Use cases</h2>
					<ul className={`${LIST_CARD} mt-8 lg:mt-10`}>
						{feature.useCases.map((useCase) => (
							<li key={useCase} className={`${LEAD} border-t border-zinc-200 py-6 text-zinc-700`}>
								{useCase}
							</li>
						))}
					</ul>
				</div>
				<div>
					<h2 className={`${HEADING} text-ink`}>Why CiteRank.com</h2>
					<ul className={`${LIST_CARD} mt-8 lg:mt-10`}>
						{feature.why.map((reason) => (
							<li key={reason.name} className="border-t border-zinc-200 py-6">
								<h3 className={`${SUBHEAD} text-ink`}>{reason.name}</h3>
								<p className={`${BODY} mt-2 text-zinc-600`}>{reason.text}</p>
							</li>
						))}
					</ul>
				</div>
			</Page>
		</section>
	);
}

function LearnMore({ links }: { links: FeatureLink[] }) {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page className="grid gap-10 lg:grid-cols-12 lg:gap-8">
				<div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
					<PanelHead title="Related guides" />
				</div>
				<ul className={`${LIST_CARD} lg:col-span-8`}>
					{links.map((link) => (
						<li key={link.href} className="border-t border-zinc-200">
							<a href={link.href} className={`group flex items-baseline justify-between gap-6 py-5 ${FOCUS}`}>
								<span className={`text-[1.125rem] leading-[1.4] font-medium text-ink ${HOVER_TITLE}`}>
									{link.title}
								</span>
								<span className={`${SMALL} shrink-0 text-zinc-600`}>{link.kind}</span>
							</a>
						</li>
					))}
				</ul>
			</Page>
		</section>
	);
}

function RelatedFeatures({ related }: { related: ProductFeature[] }) {
	return (
		<section className={`${PANEL} ${PANEL_PAD_TIGHT}`}>
			<Page>
				<div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
					<PanelHead title="Related features" />
					<Link to="/features" className={`${LINK} ${BODY} font-medium text-ink`}>
						All features
					</Link>
				</div>
				<LinkCards
					className="mt-10 lg:mt-16 lg:grid-cols-3"
					items={related.map((f) => ({ href: featurePath(f.slug), title: f.name, body: f.summary }))}
				/>
			</Page>
		</section>
	);
}

/* The offer and the product, what you do with it, what it measures, who it is for, where to read on, the objections. */
function FeaturePage() {
	const { feature, related, directory } = Route.useLoaderData() as {
		feature: ProductFeature;
		related: ProductFeature[];
		directory: FeatureLink[];
	};
	const links: FeatureLink[] = [{ kind: "Docs", ...feature.docs }, ...feature.guides, ...directory];
	return (
		<PageShell>
			<FeatureHero feature={feature} />
			<Steps feature={feature} />
			<Metrics feature={feature} />
			<UseCasesAndWhy feature={feature} />
			<LearnMore links={links} />
			<RelatedFeatures related={related} />
			<Faq items={feature.faqs} />
			<Closing from="marketing-features-closing" />
		</PageShell>
	);
}
