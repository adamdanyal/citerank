import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { demoSiteUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { externalRel } from "@/lib/external-link";
import { Container, QUIET_LINK } from "../ui";
import { DEMO_BRAND_PATH, ProductDemo } from "./product-demo";
import { SignupForm } from "./signup-form";

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
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);

	return (
		<section className="relative overflow-hidden bg-paper">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
			/>

			<Container className="relative pt-32 lg:pt-40">
				<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
					<p className="caption-3 rounded-md bg-blue-50 px-3 py-1 text-blue-800">
						AI Visibility Tracker + AI Search Agency
					</p>
					<h1 className="heading-1 cr-gradient-text mt-8">{title}</h1>
					<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">{lede}</p>
					<SignupForm from={from} className="mt-8 sm:w-auto" />
					<p className="caption-2 mt-4 text-zinc-500">
						Tracker plans from ${CLOUD_ENTRY_PRICE_USD} a month. No contract, cancel any time. Or{" "}
						<a
							href={demoUrl}
							target="_blank"
							rel={externalRel(demoUrl)}
							className={`${QUIET_LINK} inline-flex items-center gap-1 text-zinc-700`}
						>
							try the live demo first
							<ArrowUpRight className="size-3.5" aria-hidden="true" />
						</a>
						.
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
