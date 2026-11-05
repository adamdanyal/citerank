import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, demoSiteUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { Container, PRIMARY_BUTTON_LG, SECONDARY_BUTTON_LG } from "../ui";
import { DEMO_BRAND_PATH, ProductDemo } from "./product-demo";

const DEFAULT_LEDE =
	"CiteRank.com is the AI visibility tracker and AI search agency for AEO and GEO. See how ChatGPT, Claude, Gemini and nine other AI apps talk about your brand, which sources they trust, and what to do to get recommended.";

export function Hero({
	title = "Track Your Brand in AI Search",
	lede = DEFAULT_LEDE,
	from = "marketing-hero",
}: {
	title?: string;
	lede?: ReactNode;
	from?: ReferralSource;
} = {}) {
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);

	return (
		<section className="relative overflow-hidden bg-paper">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
			/>

			<Container className="relative pt-16 lg:pt-24">
				<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
					<p className="caption-3 rounded-md bg-blue-50 px-3 py-1 text-blue-800">
						AI Visibility Tracker + AI Search Agency
					</p>
					<h1 className="heading-1 cr-gradient-text mt-8">{title}</h1>
					<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">{lede}</p>
					<div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
						<a href={signupUrl} onClick={() => trackEvent("signup_click", { from })} className={PRIMARY_BUTTON_LG}>
							Start tracking
							<ArrowRight className="size-4" aria-hidden="true" />
						</a>
						<a
							href={demoUrl}
							target="_blank"
							rel={externalRel(demoUrl)}
							onClick={() => trackEvent("demo_open", { from })}
							className={SECONDARY_BUTTON_LG}
						>
							Try the live demo
							<ArrowUpRight className="size-4" aria-hidden="true" />
						</a>
					</div>
					<p className="caption-2 mt-6 text-zinc-500">
						Tracker plans from ${CLOUD_ENTRY_PRICE_USD} a month. No contract, cancel any time.
					</p>
				</div>
			</Container>

			<div className="relative mt-16 md:mt-20">
				<div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-white" />
				<Container className="relative">
					<ProductDemo />
				</Container>
			</div>
		</section>
	);
}
