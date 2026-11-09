import { ArrowRight } from "lucide-react";
import type { FeatureGraphicKey, ProductFeature } from "@/data/features";
import { CARD, EASE_CLASS } from "./citerank/ui";
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

/** A feature as one linked card: its visual on top, name and summary below. `wide` crops the visual to a banner. */
export function FeatureCard({ feature, wide = false }: { feature: ProductFeature; wide?: boolean }) {
	return (
		<a
			id={feature.slug}
			href={featurePath(feature.slug)}
			className={`group flex h-full flex-col p-3 ${CARD} transition-[box-shadow,transform] duration-300 ${EASE_CLASS} hover:-translate-y-0.5 hover:ring-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600`}
		>
			<FeatureGraphic graphic={feature.graphic} className={wide ? "[&>div]:aspect-[12/5]" : ""} />
			<div className="flex flex-1 flex-col px-3 pt-5 pb-3">
				<h3 className="title-2 flex items-start justify-between gap-3 text-zinc-950">
					{feature.name}
					<ArrowRight
						className={`mt-1 size-4 shrink-0 text-blue-700 transition-transform duration-300 ${EASE_CLASS} group-hover:translate-x-0.5`}
						aria-hidden="true"
					/>
				</h3>
				<p className="body-6 mt-2 text-zinc-600">{feature.summary}</p>
			</div>
		</a>
	);
}
