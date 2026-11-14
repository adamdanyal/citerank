import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { LinkedInMark } from "../socials";
import { ACTION, ACTION_QUIET, BAND_PAD, DISPLAY_S, LEAD, LINK, Page, SMALL, SUBHEAD } from "./kit";

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
				{/* His name stands under his portrait, as on the about page. On a laptop the two sit beside the quote; narrower, under it. */}
				<figure className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-16">
					<blockquote className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
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
					<img
						src="/founder-adam.jpg"
						alt=""
						width={512}
						height={512}
						loading="lazy"
						decoding="async"
						className="mt-10 size-28 rounded-card object-cover lg:col-start-1 lg:row-start-1 lg:mt-0 lg:size-64"
					/>
					<figcaption className="mt-4 lg:col-start-1 lg:row-start-2">
						<span className={`${SUBHEAD} block text-ink`}>Adam Danyal</span>
						<span className={`${SMALL} mt-1 block text-zinc-600`}>Founder</span>
						<a
							href="https://www.linkedin.com/in/adamdanyal/"
							target="_blank"
							rel="noopener noreferrer"
							className={`${LINK} ${SMALL} mt-2 inline-flex items-center gap-2 whitespace-nowrap text-zinc-700`}
						>
							<LinkedInMark />
							2M+ followers
							<span className="sr-only"> on LinkedIn</span>
						</a>
					</figcaption>
				</figure>

				<div className="mt-12 grid gap-8 border-t border-zinc-200 pt-10 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-8">
					<p className={`${LEAD} max-w-[52ch] text-zinc-700 lg:col-span-7`}>
						Try the live demo first: no slides, no sales call, every page of the real product. If it is useful, start
						tracking.
					</p>
					<div className="lg:col-span-5 lg:justify-self-end">
						<div className="flex flex-col gap-3 sm:flex-row sm:max-lg:*:flex-1">
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
						<p className={`${SMALL} mt-4 text-center text-zinc-600 lg:text-left`}>
							<span className="inline-block">Set up takes minutes.</span>{" "}
							<span className="inline-block">Plans from ${CLOUD_ENTRY_PRICE_USD} a month, cancel any time.</span>
						</p>
					</div>
				</div>
			</Page>
		</section>
	);
}
