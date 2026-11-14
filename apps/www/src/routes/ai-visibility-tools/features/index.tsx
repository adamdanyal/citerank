import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/citerank/v2/shell";
import {
	CiteRankCta,
	DirectoryHero,
	DirectorySection,
	IndexGroup,
	ROW,
	ROW_LINK,
	ROW_LINK_COUNT,
	ROW_LINK_LABEL,
} from "@/components/directory-shell";
import {
	FEATURE_CATEGORIES,
	FEATURE_SLUGS,
	type FeatureKey,
	getFeatureLabel,
	indexableFeatureKeys,
	toolsWithFeature,
} from "@/lib/competitors";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "AI Visibility Tools by Feature · CiteRank.com";
const description =
	"Browse AI visibility tools by capability: multi-LLM tracking, citation analytics, sentiment, white-label, and more. See which tools offer each feature.";

// Group the indexable features under their feature-matrix sections, keeping the
// matrix order. Sections with no indexable feature are dropped. Computed on
// demand so the tool data stays out of the client entry bundle.
function featureGroups() {
	const indexableKeys = new Set(indexableFeatureKeys());
	return Object.values(FEATURE_CATEGORIES)
		.map((section) => ({
			label: section.label,
			keys: (Object.keys(section.features) as FeatureKey[]).filter((key) => indexableKeys.has(key)),
		}))
		.filter((group) => group.keys.length > 0);
}

function items() {
	return indexableFeatureKeys().map((key) => ({
		name: getFeatureLabel(key),
		path: `/ai-visibility-tools/features/${FEATURE_SLUGS[key]}`,
	}));
}

export const Route = createFileRoute("/ai-visibility-tools/features/")({
	loader: () => ({ items: items() }),
	head: ({ loaderData }) => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/ai-visibility-tools/features" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/ai-visibility-tools/features") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AI Visibility Tool Directory", path: "/ai-visibility-tools" },
				{ name: "Features", path: "/ai-visibility-tools/features" },
			]),
			itemListJsonLd(loaderData?.items ?? []),
		],
	}),
	component: FeatureHub,
});

function FeatureHub() {
	return (
		<PageShell>
			<DirectoryHero
				back
				title="Browse AI visibility tools by feature"
				lead="Filter the field by capability. Pick a feature to see which AI visibility tools offer it and how they compare, including CiteRank.com, a tracker plus an AI search agency."
			/>
			<DirectorySection>
				<div className="space-y-16 lg:space-y-24">
					{featureGroups().map((group) => (
						<IndexGroup key={group.label} title={group.label}>
							{group.keys.map((key) => (
								<li key={key} className={`${ROW} break-inside-avoid`}>
									<a href={`/ai-visibility-tools/features/${FEATURE_SLUGS[key]}`} className={ROW_LINK}>
										<span className={ROW_LINK_LABEL}>{getFeatureLabel(key)}</span>
										<span className={ROW_LINK_COUNT}>{toolsWithFeature(key).length} tools</span>
									</a>
								</li>
							))}
						</IndexGroup>
					))}
				</div>
			</DirectorySection>
			<CiteRankCta />
		</PageShell>
	);
}
