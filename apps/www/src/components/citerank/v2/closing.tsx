import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { ACTION, ACTION_QUIET, BAND_PAD, DISPLAY_S, LEAD, LINK, Page, SMALL } from "./kit";

/*
 * The page closes on the founder saying why this exists, as a quote beside his
 * portrait, and then the two things a visitor can do about it.
 */
export function Closing({ from = "marketing-closing" }: { from?: ReferralSource } = {}) {
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);
	return (
		<section className={`relative bg-white ${BAND_PAD}`}>
			<Page>
				{/* On a phone the portrait is a small disc beside his name; from a laptop up it stands beside the whole quote. */}
				<figure className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-6">
					<img
						src="/founder-adam.jpg"
						alt=""
						width={512}
						height={512}
						loading="lazy"
						decoding="async"
						className="order-2 size-16 rounded-full object-cover lg:order-1 lg:row-span-2 lg:size-64 lg:rounded-card"
					/>
					<blockquote className="order-1 col-span-2 lg:order-2 lg:col-span-1 lg:self-end">
						<span
							aria-hidden="true"
							className="block h-10 font-heading text-[6rem] leading-none font-bold text-rust lg:h-12 lg:text-[7.5rem]"
						>
							“
						</span>
						{/* A sentence to a line, so none of the three ends on a word of the next. */}
						<h2 className={`${DISPLAY_S} mt-4 text-ink`}>
							<span className="block">Ask AI which product to pick.</span>{" "}
							<span className="block">It names two or three brands.</span>{" "}
							<span className="block">There is no page two.</span>
						</h2>
						<p className={`${LEAD} mt-5 max-w-[52ch] text-zinc-600`}>
							Nothing tells you whether you were in that answer.
						</p>
					</blockquote>
					<figcaption className="order-3 lg:self-start">
						<span className="block text-[1.0625rem] leading-[1.4] font-medium text-ink">Adam Danyal</span>
						<span className={`${SMALL} block text-zinc-600`}>Founder, CiteRank.com</span>
						<a
							href="https://www.linkedin.com/in/adamdanyal/"
							target="_blank"
							rel="noopener noreferrer"
							className={`${LINK} ${SMALL} mt-1 inline-block whitespace-nowrap text-zinc-700`}
						>
							Trusted by 2M+ on LinkedIn
						</a>
					</figcaption>
				</figure>

				<div className="mt-12 grid gap-8 border-t border-zinc-200 pt-10 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-8">
					<p className={`${LEAD} max-w-[52ch] text-zinc-700 lg:col-span-7`}>
						Try the live demo first: no slides, no sales call, every page of the real product. If it is useful, start
						tracking.
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
