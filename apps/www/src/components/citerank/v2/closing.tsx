import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { FOUNDERS } from "@/lib/founders";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { LinkedInMark } from "../socials";
import { ACTION, ACTION_QUIET, BAND_PAD, CARD_LIFT, LEAD, LINK, Page, SMALL, SUBHEAD } from "./kit";

/*
 * The page closes on the two founders: what each says, on two cards of one
 * size, with the name under the portrait as on the about page. Then the two
 * things a visitor can do about it.
 */
export function Closing({ from = "marketing-closing" }: { from?: ReferralSource } = {}) {
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);
	return (
		<section className={`relative bg-white ${BAND_PAD}`}>
			<Page>
				<h2 className="sr-only">From the founders of CiteRank.com</h2>
				<div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2 lg:gap-8">
					{FOUNDERS.map((founder) => (
						<figure key={founder.name} className={`${CARD_LIFT} flex min-w-0 flex-col p-6 sm:p-8 lg:p-10`}>
							<span
								aria-hidden="true"
								className="block h-9 font-heading text-[5.5rem] leading-none font-bold text-rust lg:h-10 lg:text-[6rem]"
							>
								“
							</span>
							<blockquote className="mt-4 flex-1 font-heading text-[clamp(1.375rem,1.1vw+1rem,1.875rem)] leading-[1.25] font-bold tracking-[-0.01em] text-pretty text-ink">
								{founder.quote}
							</blockquote>
							<figcaption className="mt-8">
								<img
									src={founder.photo}
									alt=""
									width={512}
									height={512}
									loading="lazy"
									decoding="async"
									className="size-24 rounded-card object-cover"
								/>
								<span className={`${SUBHEAD} mt-4 block text-ink`}>{founder.name}</span>
								<span className={`${SMALL} mt-1 block text-zinc-600`}>{founder.role}</span>
								<a
									href={founder.href}
									target="_blank"
									rel="noopener noreferrer"
									className={`${LINK} ${SMALL} mt-2 inline-flex items-center gap-2 whitespace-nowrap text-zinc-700`}
								>
									<LinkedInMark />
									{founder.proof}
									<span className="sr-only"> on LinkedIn</span>
								</a>
							</figcaption>
						</figure>
					))}
				</div>

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
