import { demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { screenshotSet } from "@/lib/screenshots";
import { DEMO_BRAND_PATH } from "../home/product-demo";
import { ACTION, LEAD, PANEL, PANEL_PAD, Page, PanelHead } from "./kit";

export function Demo() {
	const demoUrl = demoSiteUrl("marketing-page-cta", DEMO_BRAND_PATH);
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<div className="flex flex-wrap items-end justify-between gap-8">
					<PanelHead title="Try the real product">
						<p className={`${LEAD} max-w-[46ch] text-zinc-600`}>
							No slides and no sales call. Click through every page of the real product before you pay.
						</p>
					</PanelHead>
					<a
						href={demoUrl}
						target="_blank"
						rel={externalRel(demoUrl)}
						onClick={() => trackEvent("demo_open", { from: "demo-section" })}
						className={ACTION}
					>
						Open the live demo
					</a>
				</div>
				<a
					href={demoUrl}
					target="_blank"
					rel={externalRel(demoUrl)}
					aria-label="Open the live demo"
					className="mt-12 block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust"
				>
					<img
						{...screenshotSet("/screenshots/overview.webp")}
						alt="The CiteRank.com overview page in the live demo"
						loading="lazy"
						decoding="async"
						sizes="(min-width: 1180px) 1120px, 100vw"
						className="w-full rounded-2xl bg-paper-2 ring-1 ring-zinc-200"
					/>
				</a>
			</Page>
		</section>
	);
}
