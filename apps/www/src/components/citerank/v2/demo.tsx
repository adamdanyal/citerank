import { demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { screenshotSet } from "@/lib/screenshots";
import { DEMO_BRAND_PATH } from "../home/product-demo";
import { ACTION, BODY, HEADING, Page, SECTION } from "./kit";

export function Demo() {
	const demoUrl = demoSiteUrl("marketing-page-cta", DEMO_BRAND_PATH);
	return (
		<section className={`${SECTION} bg-paper-2`}>
			<Page>
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div>
						<h2 className={`${HEADING} text-ink`}>Try the real product</h2>
						<p className={`${BODY} mt-5 max-w-[46ch] text-zinc-600`}>
							No slides and no sales call. Click through every page of the real product before you pay.
						</p>
					</div>
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
					className="mt-12 block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust"
				>
					<img
						{...screenshotSet("/screenshots/overview.webp")}
						alt="The CiteRank.com overview page in the live demo"
						loading="lazy"
						decoding="async"
						sizes="(min-width: 1180px) 1132px, 100vw"
						className="w-full rounded-xl ring-1 ring-zinc-300"
					/>
				</a>
			</Page>
		</section>
	);
}
