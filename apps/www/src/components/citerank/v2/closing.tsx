import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../home/product-demo";
import { ACTION, ACTION_QUIET, HEADING, LEAD, Page } from "./kit";

const FROM = "marketing-closing";

export function Closing() {
	const signupUrl = cloudSignupUrl(FROM);
	const demoUrl = demoSiteUrl(FROM, DEMO_BRAND_PATH);
	return (
		<section className="border-t border-zinc-200 bg-paper py-20 md:py-28">
			<Page className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
				<div className="lg:col-span-7">
					<h2 className={`${HEADING} max-w-[18ch] text-ink`}>Know where you stand in AI search</h2>
					<p className={`${LEAD} mt-6 max-w-[46ch] text-zinc-600`}>
						Set up takes minutes. Plans from ${CLOUD_ENTRY_PRICE_USD} a month, cancel any time.
					</p>
				</div>
				<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
					<a href={signupUrl} onClick={() => trackEvent("signup_click", { from: FROM })} className={ACTION}>
						Start tracking
					</a>
					<a
						href={demoUrl}
						target="_blank"
						rel={externalRel(demoUrl)}
						onClick={() => trackEvent("demo_open", { from: FROM })}
						className={ACTION_QUIET}
					>
						Try the live demo
					</a>
				</div>
			</Page>
		</section>
	);
}
