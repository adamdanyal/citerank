import { demoSiteUrl } from "@workspace/config/referrals";
import { ArrowUpRight } from "lucide-react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { EASE_CLASS, WINDOW_FRAME, WindowBar } from "../ui";

export const DEMO_BRAND_PATH = "/app/org/quaildesk/brand/quaildesk";

/** One still of the real dashboard in a browser window. Clicking it opens the same page in the live demo. */
export function ProductDemo() {
	const demoUrl = demoSiteUrl("marketing-demo-frame", DEMO_BRAND_PATH);
	return (
		<a
			href={demoUrl}
			target="_blank"
			rel={externalRel(demoUrl)}
			aria-label="Open the live demo"
			onClick={() => trackEvent("demo_open", { from: "hero-window" })}
			className={`group relative mx-auto block max-w-4xl ${WINDOW_FRAME} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600`}
		>
			<WindowBar />
			<div className="relative aspect-[5/3] overflow-hidden rounded-lg bg-paper-2">
				<img
					src="/screenshots/overview.png"
					alt="The CiteRank.com overview page: visibility, share of voice, sentiment and position for a brand against its competitors"
					width={3000}
					height={1800}
					loading="eager"
					decoding="async"
					className="absolute inset-0 size-full object-cover object-left-top"
				/>
				<div
					aria-hidden="true"
					className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-950/0 transition-colors duration-300 ${EASE_CLASS} group-hover:bg-zinc-950/10 group-focus-visible:bg-zinc-950/10`}
				>
					<span
						className={`inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 button-sm text-white opacity-0 shadow-[0_12px_32px_-12px_rgb(26_25_23/0.5)] transition-opacity duration-300 ${EASE_CLASS} group-hover:opacity-100 group-focus-visible:opacity-100`}
					>
						Open the live demo
						<ArrowUpRight className="size-4" />
					</span>
				</div>
			</div>
		</a>
	);
}
