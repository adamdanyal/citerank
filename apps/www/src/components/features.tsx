import type { FeatureGraphicKey, ProductFeature } from "@/data/features";
import { Product, type ScreenId } from "./citerank/product/product";
import { BODY, SUBHEAD } from "./citerank/v2/kit";
import { ApiGraphic, EnginesGraphic, VisibilityTrendGraphic } from "./feature-graphics";

/* Most features are shown by their own screen of the product; the rest by a graphic made from the feature's own material. */
const SCREENS: Partial<Record<FeatureGraphicKey, ScreenId>> = {
	overview: "overview",
	visibility: "visibility",
	"share-of-voice": "share-of-voice",
	sentiment: "sentiment",
	citations: "citations",
	"query-fan-out": "query-fan-out",
	prompts: "prompts",
	responses: "responses",
	opportunities: "opportunities",
};
const BUILT: Partial<Record<FeatureGraphicKey, () => React.ReactNode>> = {
	trend: VisibilityTrendGraphic,
	api: ApiGraphic,
	engines: EnginesGraphic,
};

/* A tile shows the top of a screen and fades out, so every tile in a row is one height. */
const TILE = "h-64 overflow-hidden [mask-image:linear-gradient(to_bottom,var(--color-ink)_72%,transparent)]";

/*
 * On a feature's own page the screen works: its tabs, filters and charts
 * answer. As a `tile` it sits inside the link to that page, so it is a picture
 * of the screen: its first block, or the whole screen when the tile is `wide`.
 */
export function FeatureGraphic({
	graphic,
	tile,
	className = "",
}: {
	graphic: FeatureGraphicKey;
	tile?: "narrow" | "wide";
	className?: string;
}) {
	const screen = SCREENS[graphic];
	const Built = BUILT[graphic];
	return (
		<div className={`@container ${className}`}>
			{screen ? (
				tile ? (
					<Product screen={screen} lead={tile === "narrow"} still peek={TILE} />
				) : (
					<Product screen={screen} from="marketing-features-hero" />
				)
			) : Built ? (
				<Built />
			) : null}
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

/** `wide` gives the visual two columns of the grid. */
export function FeatureCard({ feature, wide = false }: { feature: ProductFeature; wide?: boolean }) {
	return (
		<a
			id={feature.slug}
			href={featurePath(feature.slug)}
			className={`group ${FEATURE_TILE} rounded-lg focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-rust`}
		>
			<FeatureGraphic graphic={feature.graphic} tile={wide ? "wide" : "narrow"} />
			<h3 className={`${SUBHEAD} mt-5 text-ink underline-offset-4 group-hover:underline group-hover:decoration-rust`}>
				{feature.name}
			</h3>
			<p className={`${BODY} mt-2 max-w-[60ch] text-zinc-600`}>{feature.summary}</p>
		</a>
	);
}
