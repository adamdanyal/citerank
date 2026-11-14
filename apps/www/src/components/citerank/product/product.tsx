import type { ReferralSource } from "@workspace/config/referrals";
import { demoSiteUrl } from "@workspace/config/referrals";
import { type ReactNode, useState } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH, PREVIEW } from "./data";
import { FOCUS, Press, Still } from "./parts";
import {
	Citations,
	FanOut,
	Opportunities,
	Overview,
	Prompts,
	Responses,
	type ScreenProps,
	Sentiment,
	ShareOfVoice,
	Visibility,
} from "./screens";

/* Each screen, under the name the app gives it and at the address the demo serves it from. */
const SCREENS = {
	overview: { label: "Overview", path: "", view: Overview },
	visibility: { label: "Visibility", path: "/visibility", view: Visibility },
	"share-of-voice": { label: "Share of Voice", path: "/share-of-voice", view: ShareOfVoice },
	sentiment: { label: "Sentiment", path: "/sentiment", view: Sentiment },
	responses: { label: "Responses", path: "/responses", view: Responses },
	"query-fan-out": { label: "Query Fan-Out", path: "/query-fan-out", view: FanOut },
	citations: { label: "Citations", path: "/citations", view: Citations },
	opportunities: { label: "Opportunities", path: "/opportunities", view: Opportunities },
	prompts: { label: "Prompts", path: "/settings/prompts", view: Prompts },
} satisfies Record<string, { label: string; path: string; view: (props: ScreenProps) => ReactNode }>;

export type ScreenId = keyof typeof SCREENS;

/*
 * The product, as HTML. Never a picture of it and never a frame around it: the
 * words can be read by a person, a search engine and an AI assistant alike, it
 * lays itself out for the width it is given, and its tabs, filters and charts
 * answer like the real ones.
 *
 * `tabs` adds a row for moving between screens. `lead` keeps to a screen's
 * first block. `still` draws it as a picture, for inside a link. `peek` is a
 * height to fade it out at.
 */
export function Product({
	screen = "overview",
	tabs,
	lead = false,
	still = false,
	peek = "",
	from = "marketing-demo-frame",
	className = "",
}: {
	screen?: ScreenId;
	tabs?: ScreenId[];
	lead?: boolean;
	still?: boolean;
	peek?: string;
	from?: ReferralSource;
	className?: string;
}) {
	const [current, setCurrent] = useState<ScreenId>(screen);
	const shown = SCREENS[current];
	const View = shown.view;
	const demoUrl = demoSiteUrl(from, `${DEMO_BRAND_PATH}${shown.path}`);

	return (
		<figure
			data-slot={`product-${screen}`}
			data-kind="product"
			data-nosnippet
			aria-hidden={still || undefined}
			className={`min-w-0 overflow-hidden rounded-card bg-paper text-left font-sans text-base font-normal text-ink ring-1 ring-zinc-200 ${className}`}
		>
			<Still value={still}>
				{tabs ? (
					<nav aria-label="Product screens" className="flex gap-1 overflow-x-auto border-b border-zinc-200 px-2 py-2">
						{tabs.map((id) => (
							<Press
								key={id}
								pressed={id === current}
								onPress={() => {
									setCurrent(id);
									trackEvent("product_screen", { screen: id });
								}}
								className={`inline-flex h-10 shrink-0 items-center rounded-lg px-3 text-sm whitespace-nowrap ${
									id === current ? "bg-paper-2 font-medium text-ink" : "text-zinc-600 hover:text-ink"
								}`}
							>
								{SCREENS[id].label}
							</Press>
						))}
					</nav>
				) : null}
				<div className={`@container p-3 sm:p-4 ${peek}`}>
					<View lead={lead} />
				</div>
				{peek ? null : (
					<figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-zinc-200 px-4 py-2.5 text-sm text-zinc-600">
						<span>Sample data. {PREVIEW.brand} is a made-up brand.</span>
						{still ? null : (
							<a
								href={demoUrl}
								target="_blank"
								rel={externalRel(demoUrl)}
								onClick={() => trackEvent("demo_open", { from: `product-${current}` })}
								className={`rounded-sm font-medium text-ink underline decoration-zinc-300 underline-offset-4 hover:decoration-rust ${FOCUS}`}
							>
								Open {shown.label} in the live demo
							</a>
						)}
					</figcaption>
				)}
			</Still>
		</figure>
	);
}
