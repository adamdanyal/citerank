import { demoSiteUrl } from "@workspace/config/referrals";
import { ArrowUpRight } from "lucide-react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { screenshotSet } from "@/lib/screenshots";
import { Container, PRIMARY_BUTTON_LG, Reveal, WINDOW_FRAME, WindowBar } from "../ui";
import { DEMO_BRAND_PATH } from "./product-demo";

export function Demo() {
	const demoUrl = demoSiteUrl("marketing-page-cta", DEMO_BRAND_PATH);
	return (
		<section className="bg-white">
			<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-24">
				<Reveal className="lg:col-span-5">
					<h2 className="heading-2 text-zinc-950">Try the Real Product</h2>
					<p className="body-8 mt-6 text-zinc-700">
						No slides and no sales call. Click through every page of the real product before you pay.
					</p>
					<a
						href={demoUrl}
						target="_blank"
						rel={externalRel(demoUrl)}
						onClick={() => trackEvent("demo_open", { from: "demo-section" })}
						className={`${PRIMARY_BUTTON_LG} mt-8`}
					>
						Open the live demo
						<ArrowUpRight className="size-4" aria-hidden="true" />
					</a>
				</Reveal>
				<Reveal delay={100} className="lg:col-span-7">
					<a
						href={demoUrl}
						target="_blank"
						rel={externalRel(demoUrl)}
						aria-label="Open the live demo"
						className={`block ${WINDOW_FRAME} focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600`}
					>
						<WindowBar />
						<div className="relative aspect-[5/3] overflow-hidden rounded-lg bg-paper-2">
							<img
								{...screenshotSet("/screenshots/overview.webp")}
								sizes="(min-width: 1024px) 50vw, 100vw"
								alt="The CiteRank.com overview page in the live demo"
								loading="lazy"
								decoding="async"
								className="absolute inset-0 size-full object-cover object-left-top"
							/>
						</div>
					</a>
				</Reveal>
			</Container>
		</section>
	);
}
