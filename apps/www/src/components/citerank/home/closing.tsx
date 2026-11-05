import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, demoSiteUrl, type ReferralSource } from "@workspace/config/referrals";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { Container, PRIMARY_BUTTON_LG, Reveal, SECONDARY_BUTTON_LG } from "../ui";
import { DEMO_BRAND_PATH } from "./product-demo";

export function Closing({ from = "marketing-closing" }: { from?: ReferralSource }) {
	const signupUrl = cloudSignupUrl(from);
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
						Set up takes minutes. Plans from ${CLOUD_ENTRY_PRICE_USD} a month, cancel any time.
					</p>
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
				</Reveal>
			</Container>
		</section>
	);
}
