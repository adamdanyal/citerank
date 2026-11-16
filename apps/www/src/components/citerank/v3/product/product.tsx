import type { ReferralSource } from "@workspace/config/referrals";
import { demoSiteUrl } from "@workspace/config/referrals";
import { type ReactNode, useState } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH, PREVIEW } from "../../product/data";
import { Press } from "../../product/parts";
import { LINK } from "../kit";
import { Opportunities, Overview, Responses, type ScreenProps, Sentiment, ShareOfVoice } from "./screens";

/* Each screen, under the name the app gives it and at the address the demo serves it from. */
const SCREENS = {
	overview: { label: "Overview", path: "", view: Overview },
	"share-of-voice": { label: "Share of Voice", path: "/share-of-voice", view: ShareOfVoice },
	sentiment: { label: "Sentiment", path: "/sentiment", view: Sentiment },
	responses: { label: "Responses", path: "/responses", view: Responses },
	opportunities: { label: "Opportunities", path: "/opportunities", view: Opportunities },
} satisfies Record<string, { label: string; path: string; view: (props: ScreenProps) => ReactNode }>;

export type ScreenId = keyof typeof SCREENS;

/* Behind tabs the screens share one frame, so most keep to their first block and the frame holds its height. */
const WHOLE_IN_TABS: ScreenId[] = ["overview", "responses"];

/* The product as HTML in a window of its own, the one floating thing on the page. */
export function Product({
	screen = "overview",
	tabs,
	from = "marketing-demo-frame",
	className = "",
}: {
	screen?: ScreenId;
	tabs?: ScreenId[];
	from?: ReferralSource;
	className?: string;
}) {
	const [current, setCurrent] = useState<ScreenId>(screen);
	const shown = SCREENS[current];
	const brief = tabs ? !WHOLE_IN_TABS.includes(current) : false;
	const View = shown.view;
	const demoUrl = demoSiteUrl(from, `${DEMO_BRAND_PATH}${shown.path}`);

	return (
		<figure
			data-slot={`product-${screen}`}
			data-kind="product"
			data-nosnippet
			className={`min-w-0 overflow-hidden rounded-[20px] bg-(--v3-page) text-left font-sans text-base font-normal text-(--v3-text) shadow-(--v3-shadow-float) ring-1 ring-(--v3-line) ${className}`}
		>
			{tabs ? (
				<nav aria-label="Product screens" className="flex gap-1 overflow-x-auto border-b border-(--v3-line) p-2">
					{tabs.map((id) => (
						<Press
							key={id}
							pressed={id === current}
							onPress={() => {
								setCurrent(id);
								trackEvent("product_screen", { screen: id });
							}}
							className={`inline-flex h-10 shrink-0 items-center rounded-[8px] px-3 text-sm whitespace-nowrap transition-colors duration-150 ease-(--v3-ease) ${
								id === current
									? "bg-(--v3-raised) font-medium text-(--v3-text)"
									: "text-(--v3-text-2) hover:text-(--v3-text)"
							}`}
						>
							{SCREENS[id].label}
						</Press>
					))}
				</nav>
			) : null}
			<div className="@container p-3">
				<View lead={brief} />
			</div>
			<figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-(--v3-line) px-4 py-2.5 text-sm text-(--v3-text-2)">
				<span>Sample data. {PREVIEW.brand} is a made-up brand.</span>
				<a
					href={demoUrl}
					target="_blank"
					rel={externalRel(demoUrl)}
					onClick={() => trackEvent("demo_open", { from: `product-${current}` })}
					className={`${LINK} font-medium text-(--v3-text)`}
				>
					Open {shown.label} in the live demo
				</a>
			</figcaption>
		</figure>
	);
}
