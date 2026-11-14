import { createFileRoute, Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { Compare } from "@/components/citerank/pricing/compare";
import { Closing } from "@/components/citerank/v2/closing";
import { Faq } from "@/components/citerank/v2/faq";
import { INCLUDED } from "@/components/citerank/v2/included";
import { BODY, HEADING, LINK, PanelHead, RuledRow } from "@/components/citerank/v2/kit";
import { PlanTable } from "@/components/citerank/v2/pricing";
import { PageHead, PageShell, PanelSection } from "@/components/citerank/v2/shell";
import { PRICING_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const title = "Pricing: AI Visibility Tracker Plans · CiteRank.com";
const description = `CiteRank.com is a self-serve AI visibility tracker from $${CLOUD_ENTRY_PRICE_USD}/mo, with an AI search agency and custom plans on request.`;

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

/* The plans first, then what every plan includes, the detail, the objections and the offer again. */
function PricingPage() {
	return (
		<PageShell>
			<PageHead
				title="AI visibility tracker pricing"
				lede="Every plan includes your whole team and API access. Pay monthly or yearly, and cancel any time."
			/>

			<PanelSection>
				<h2 className="sr-only">Plans</h2>
				<PlanTable from="pricing" />
				<ul className="mt-12 border-b border-zinc-200">
					<RuledRow title="Our agency">
						We do the work the tracker ranks: new pages, page updates, review sites and forums.{" "}
						<Link to="/agency" className={`${LINK} whitespace-nowrap text-ink`}>
							Book an agency call
						</Link>
					</RuledRow>
					<RuledRow title="Custom">
						More brands, custom prompt limits, higher sampling rates, and more models.{" "}
						<a href="mailto:team@citerank.com?subject=Custom%20plan" className={`${LINK} whitespace-nowrap text-ink`}>
							Email us
						</a>
					</RuledRow>
				</ul>
			</PanelSection>

			<PanelSection>
				<PanelHead title="What every plan includes" className="max-w-[46rem]" />
				<ul className="mt-12 border-b border-zinc-200">
					{INCLUDED.map((item) => (
						<RuledRow key={item.title} title={item.title}>
							{item.body}
						</RuledRow>
					))}
				</ul>
				<p className={`${BODY} mt-10 text-zinc-600`}>
					Not sure which plan?{" "}
					<Link to="/agency" className={`${LINK} text-ink`}>
						Our agency
					</Link>{" "}
					does the work the tracker ranks, on any plan.
				</p>
			</PanelSection>

			<PanelSection>
				<h2 className={`${HEADING} sr-only`}>Compare every plan</h2>
				<Compare />
			</PanelSection>

			<Faq items={PRICING_FAQS} />
			<Closing from="marketing-pricing-closing" />
		</PageShell>
	);
}
