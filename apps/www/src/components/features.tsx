import type { FeatureGraphicKey, ProductFeature } from "@/data/features";
import { BODY, SUBHEAD } from "./citerank/v2/kit";
import {
	ApiGraphic,
	CitationsPageGraphic,
	EnginesGraphic,
	OpportunitiesPageGraphic,
	OverviewPageGraphic,
	PromptSettingsGraphic,
	QueryFanOutPageGraphic,
	ResponsesGraphic,
	SentimentPageGraphic,
	ShareOfVoicePageGraphic,
	VisibilityPageGraphic,
	VisibilityTrendGraphic,
} from "./feature-graphics";

const GRAPHICS: Record<FeatureGraphicKey, () => React.ReactNode> = {
	overview: OverviewPageGraphic,
	visibility: VisibilityPageGraphic,
	"share-of-voice": ShareOfVoicePageGraphic,
	sentiment: SentimentPageGraphic,
	citations: CitationsPageGraphic,
	"query-fan-out": QueryFanOutPageGraphic,
	prompts: PromptSettingsGraphic,
	responses: ResponsesGraphic,
	opportunities: OpportunitiesPageGraphic,
	trend: VisibilityTrendGraphic,
	api: ApiGraphic,
	engines: EnginesGraphic,
};

export function FeatureGraphic({ graphic, className = "" }: { graphic: FeatureGraphicKey; className?: string }) {
	const Graphic = GRAPHICS[graphic];
	return (
		<div className={`@container ${className}`}>
			<Graphic />
		</div>
	);
}

export function featurePath(slug: string) {
	return `/features/${slug}`;
}

/** The features index, grouped by the question a buyer is asking. */
export const FEATURE_GROUPS: { heading: string; lede: string; slugs: string[] }[] = [
	{
		heading: "See where you stand",
		lede: "How often AI answers mention you, how they describe you and which sources they trust.",
		slugs: ["ai-visibility-tracking", "share-of-voice", "sentiment-analysis", "citation-tracking"],
	},
	{
		heading: "Know what to fix",
		lede: "The prompts and web searches behind every answer, ranked into next steps.",
		slugs: ["aeo-recommendations", "prompt-tracking", "query-fan-out"],
	},
	{
		heading: "Take the data anywhere",
		lede: "Reports, an API and an MCP server, fed by the real AI apps.",
		slugs: ["ai-visibility-reporting", "api-and-mcp", "multi-engine-tracking"],
	},
];

/*
 * A feature as one link: what it looks like, its name and a line. The three
 * parts sit on the rows of the grid around the tile, so the names of two tiles
 * side by side line up even when their graphics differ in height.
 */
export const FEATURE_TILE = "row-span-3 grid grid-rows-subgrid gap-y-0";

/** `wide` crops the visual to a banner. */
export function FeatureCard({ feature, wide = false }: { feature: ProductFeature; wide?: boolean }) {
	return (
		<a
			id={feature.slug}
			href={featurePath(feature.slug)}
			className={`group ${FEATURE_TILE} rounded-lg focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-rust`}
		>
			<FeatureGraphic graphic={feature.graphic} className={wide ? "[&>div]:aspect-[12/5]" : ""} />
			<h3 className={`${SUBHEAD} mt-5 text-ink underline-offset-4 group-hover:underline group-hover:decoration-rust`}>
				{feature.name}
			</h3>
			<p className={`${BODY} mt-2 max-w-[60ch] text-zinc-600`}>{feature.summary}</p>
		</a>
	);
}
