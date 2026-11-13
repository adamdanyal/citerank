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
			className={`group flex h-full flex-col rounded-2xl bg-paper-2 p-3 ring-1 ring-zinc-200 transition-[box-shadow] duration-200 hover:ring-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust`}
		>
			<FeatureGraphic graphic={feature.graphic} className={wide ? "[&>div]:aspect-[12/5]" : ""} />
			<div className="flex flex-1 flex-col px-3 pt-5 pb-3">
				<h3 className="font-heading text-[1.25rem] leading-[1.3] font-semibold tracking-[-0.02em] text-ink [overflow-wrap:break-word] min-w-0 group-hover:underline group-hover:decoration-rust group-hover:underline-offset-4">
					{feature.name}
				</h3>
				<p className="mt-2 text-[1.0625rem] leading-[1.65] text-zinc-600">{feature.summary}</p>
			</div>
		</a>
	);
}
