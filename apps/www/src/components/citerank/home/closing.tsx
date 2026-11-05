import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { demoSiteUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowUpRight } from "lucide-react";
import { externalRel } from "@/lib/external-link";
import { Container, QUIET_LINK, Reveal } from "../ui";
import { DEMO_BRAND_PATH } from "./product-demo";
import { SignupForm } from "./signup-form";

export function Closing({ from = "marketing-closing" }: { from?: ReferralSource }) {
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);
	return (
		<section className="relative overflow-hidden bg-paper">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_top,black,transparent_85%)]"
			/>
			<Container className="relative py-20 lg:py-24">
				<Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
					<h2 className="heading-2 text-zinc-950">Know Where You Stand in AI Search</h2>
					<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">
						Set up takes minutes. Plans start at ${CLOUD_ENTRY_PRICE_USD} a month, with no contract, and you can cancel
						any time.
					</p>
					<SignupForm from={from} className="mt-8 sm:w-auto" />
					<p className="caption-2 mt-4 text-zinc-500">
						Or{" "}
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
				</Reveal>
			</Container>
		</section>
	);
}
