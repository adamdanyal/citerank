import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../home/product-demo";
import { ACTION, ACTION_QUIET, BAND_PAD, DISPLAY_S, LEAD, LINK, PANEL_TINT, Page, SMALL } from "./kit";

/*
 * The page closes on the founder's own argument and the two things a visitor
 * can do about it. One statement, his name under it, then the actions.
 */
export function Closing({ from = "marketing-closing" }: { from?: ReferralSource } = {}) {
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);
	return (
		<section className={`${PANEL_TINT} ${BAND_PAD}`}>
			<Page>
				<figure>
					<blockquote>
						<h2 className={`${DISPLAY_S} max-w-[24ch] text-ink`}>
							Ask AI which product to pick. It names two or three brands. There is no page two.
						</h2>
					</blockquote>
					<figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
						<img
							src="/founder.jpg"
							alt=""
							width={256}
							height={256}
							loading="lazy"
							decoding="async"
							className="size-12 rounded-full object-cover"
						/>
						<span>
							<span className="block text-[1rem] leading-[1.4] font-medium text-ink">Adam Danyal</span>
							<span className={`${SMALL} block text-zinc-600`}>Founder, CiteRank.com</span>
						</span>
						<img
							src="/signature.webp"
							alt="Adam Danyal’s signature"
							width={402}
							height={132}
							loading="lazy"
							decoding="async"
							className="ml-2 h-11 w-auto"
						/>
						<a
							href="https://www.linkedin.com/in/adamdanyal/"
							target="_blank"
							rel="noopener noreferrer"
							className={`${LINK} ${SMALL} whitespace-nowrap text-zinc-700`}
						>
							Trusted by 2M+ on LinkedIn
						</a>
					</figcaption>
				</figure>

				<div className="mt-12 grid gap-8 border-t border-zinc-300 pt-10 lg:grid-cols-12 lg:items-center lg:gap-8">
					<p className={`${LEAD} max-w-[52ch] text-zinc-700 lg:col-span-7`}>
						Nothing tells you whether you were in that answer. Try the live demo first: no slides, no sales call, every
						page of the real product. If it is useful, start tracking.
					</p>
					<div className="lg:col-span-5 lg:justify-self-end">
						<div className="flex flex-col gap-3 sm:flex-row">
							<a href={signupUrl} onClick={() => trackEvent("signup_click", { from })} className={ACTION}>
								Start tracking
							</a>
							<a
								href={demoUrl}
								target="_blank"
								rel={externalRel(demoUrl)}
								onClick={() => trackEvent("demo_open", { from })}
								className={ACTION_QUIET}
							>
								Try the live demo
							</a>
						</div>
						<p className={`${SMALL} mt-4 text-zinc-600`}>
							<span className="inline-block">Set up takes minutes.</span>{" "}
							<span className="inline-block">Plans from ${CLOUD_ENTRY_PRICE_USD} a month, cancel any time.</span>
						</p>
					</div>
				</div>
			</Page>
		</section>
	);
}
