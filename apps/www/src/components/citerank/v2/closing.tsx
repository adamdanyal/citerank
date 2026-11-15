import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { FOUNDERS } from "@/lib/founders";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { LinkedInMark } from "../socials";
import { ACTION, ACTION_QUIET_ON_INK, BAND_PAD, CARD_LIFT, DISPLAY_S, LEAD, LINK, Page, PanelHead, SMALL } from "./kit";

/** The founders, a card each: what they say, signed with a picture, a name, their LinkedIn and a role. */
export function FounderQuotes({ title }: { title: string }) {
	return (
		<>
			<PanelHead title={title} />
			<div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 lg:mt-16 lg:grid-cols-2 lg:gap-8">
				{FOUNDERS.map((founder) => (
					<figure key={founder.name} className={`${CARD_LIFT} flex min-w-0 flex-col p-6 sm:p-8 lg:p-10`}>
						<span
							aria-hidden="true"
							className="block h-9 font-heading text-[5.5rem] leading-none font-bold text-rust lg:h-10 lg:text-[6rem]"
						>
							“
						</span>
						<blockquote className="mt-4 flex-1 text-[clamp(1.125rem,0.5vw+1rem,1.375rem)] leading-[1.5] text-pretty text-ink">
							{founder.quote}
						</blockquote>
						{/* The picture, then the name and LinkedIn on one line with the role under them. */}
						<figcaption className="mt-8 flex items-center gap-4">
							<img
								src={founder.photo}
								alt=""
								width={512}
								height={512}
								loading="lazy"
								decoding="async"
								className="size-14 shrink-0 rounded-full object-cover"
							/>
							<span className="min-w-0">
								<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
									<span className="text-[1.0625rem] leading-snug font-medium text-ink">{founder.name}</span>
									<a
										href={founder.href}
										target="_blank"
										rel="noopener noreferrer"
										className={`${LINK} ${SMALL} inline-flex items-center gap-1.5 whitespace-nowrap text-zinc-700`}
									>
										<LinkedInMark />
										{founder.proof}
										<span className="sr-only"> on LinkedIn</span>
									</a>
								</span>
								<span className={`${SMALL} mt-0.5 block text-zinc-600`}>{founder.role}, CiteRank.com</span>
							</span>
						</figcaption>
					</figure>
				))}
			</div>
		</>
	);
}

/*
 * The page closes on the two founders: what each says, on two cards of one
 * size, signed with a picture, a name and a role. Then the two things a
 * visitor can do about it.
 */
export function Closing({
	from = "marketing-closing",
	quotes = true,
}: {
	from?: ReferralSource;
	/** False on a page that already tells the founders' story, which then ends on the panel alone. */
	quotes?: boolean;
} = {}) {
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);
	return (
		<section className={`relative bg-white ${BAND_PAD}`}>
			<Page>
				{quotes ? <FounderQuotes title="Why we built CiteRank.com" /> : null}

				{/* The last thing on the page: one head, one line and the two things a visitor can do, on ink like the hero. It stands as far under the quotes as the section's own padding stands over them. */}
				<div
					className={`rounded-[1.5rem] bg-ink px-6 py-12 text-center text-paper sm:px-10 sm:py-16 lg:py-20 ${quotes ? "mt-14 sm:mt-20 lg:mt-30" : ""}`}
				>
					{/* Two lines on any phone: the type gives way before a third. */}
					<h2
						className={`${DISPLAY_S} mx-auto max-w-[20ch] text-paper max-sm:text-[length:min(2.25rem,calc((100vw_-_5rem)_/_8.6))]`}
					>
						See what AI says about your brand
					</h2>
					<p className={`${LEAD} mx-auto mt-5 max-w-[44ch] text-zinc-300`}>
						Try the live demo first. No slides, no sales call.
					</p>
					<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
						<a href={signupUrl} onClick={() => trackEvent("signup_click", { from })} className={ACTION}>
							Start tracking
						</a>
						<a
							href={demoUrl}
							target="_blank"
							rel={externalRel(demoUrl)}
							onClick={() => trackEvent("demo_open", { from })}
							className={ACTION_QUIET_ON_INK}
						>
							Try the live demo
						</a>
					</div>
					<p className={`${SMALL} mt-4 text-zinc-400`}>
						<span className="inline-block">Set up takes minutes.</span>{" "}
						<span className="inline-block">Plans from ${CLOUD_ENTRY_PRICE_USD} a month, cancel any time.</span>
					</p>
				</div>
			</Page>
		</section>
	);
}
