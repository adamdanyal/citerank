import { createFileRoute } from "@tanstack/react-router";
import { AiVisibilitySoftwareHub } from "@/components/ai-visibility-software-hub";
import { BODY, PANEL, PANEL_PAD, Page, PanelHead, SUBHEAD } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
import { CompetitorDirectory } from "@/components/competitor-directory";
import { FOCUS } from "@/components/directory-shell";
import { Faq } from "@/components/faq";
import { competitors, getComparisonSlug, isLowDR, isRetired } from "@/lib/competitors";
import { DIRECTORY_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "Compare 100+ AI Visibility Tools · CiteRank.com";
const description =
	"Compare 100+ AI visibility tools, AEO software and GEO platforms on engine coverage, pricing and features, each head-to-head with CiteRank.com.";

// Indexed comparison pages (mirrors the sitemap filter), surfaced as ItemList
// structured data so AI engines can extract the full directory of tools.
// Built inside the loader so the tool data stays out of the client entry bundle.
function directoryItems() {
	return competitors
		.filter((c) => !isRetired(c) && c.category !== "other" && !isLowDR(c))
		.map((c) => ({
			name: c.name,
			path: `/ai-visibility-tools/${getComparisonSlug(c)}`,
		}));
}

export const Route = createFileRoute("/ai-visibility-tools/")({
	loader: () => ({ directoryItems: directoryItems() }),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({
				title,
				description,
				path: "/ai-visibility-tools",
			}),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/ai-visibility-tools") }],
		scripts: [
			faqJsonLd(DIRECTORY_FAQS),
			itemListJsonLd(loaderData?.directoryItems ?? []),
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AI Visibility Tool Directory", path: "/ai-visibility-tools" },
			]),
		],
	}),
	component: AiVisibilitySoftwarePage,
});

const browseLinks = [
	{
		title: "Compare head-to-head",
		description: "Side-by-side comparisons, with CiteRank.com included.",
		href: "/ai-visibility-tools/compare",
	},
	{
		title: "Find alternatives",
		description: "The closest options to any tool you’re evaluating.",
		href: "/ai-visibility-tools/alternatives",
	},
	{
		title: "Browse by feature",
		description: "Which tools offer citation analytics, white-label, sentiment, and more.",
		href: "/ai-visibility-tools/features",
	},
	{
		title: "Browse by category",
		description: "Trackers, content platforms, APIs, SEO suites, and e-commerce.",
		href: "/ai-visibility-tools/category",
	},
	{
		title: "AEO graveyard",
		description: "Tools that shut down, pivoted, or were acquired, and what to do next.",
		href: "/ai-visibility-tools/graveyard",
	},
];

function AiVisibilitySoftwarePage() {
	return (
		<PageShell>
			<CompetitorDirectory />
			<AiVisibilitySoftwareHub />
			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<PanelHead title="Browse the directory" />
					<ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6 lg:gap-8">
						{browseLinks.map((link, index) => (
							<li
								key={link.href}
								className={index < 3 ? "lg:col-span-2" : index === 4 ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-3"}
							>
								<a
									href={link.href}
									className={`flex h-full min-w-0 flex-col rounded-card bg-paper-2 p-6 transition-colors duration-200 hover:bg-paper-3 sm:p-8 ${FOCUS}`}
								>
									<h3 className={`${SUBHEAD} text-ink`}>{link.title}</h3>
									<p className={`${BODY} mt-3 max-w-[44ch] text-zinc-600`}>{link.description}</p>
								</a>
							</li>
						))}
					</ul>
				</Page>
			</section>
			<Faq items={DIRECTORY_FAQS} />
		</PageShell>
	);
}
