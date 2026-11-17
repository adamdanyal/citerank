import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import { externalRel } from "@/lib/external-link";
import { FOUNDERS } from "@/lib/founders";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "../product/data";
import { LinkedInMark } from "../socials";
import {
	ACTION,
	ACTION_QUIET_ON_INK,
	CARD,
	CLOSING_TITLE,
	HEAD_GAP,
	LEAD,
	LINK,
	PANEL_INK,
	Page,
	SectionHead,
	SMALL,
	TEXT,
	TEXT_2,
} from "./kit";

function FounderQuotes() {
	return (
		<>
			<SectionHead title="Why we built CiteRank.com" />
			<div className={`${HEAD_GAP} grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2 lg:gap-6`}>
				{FOUNDERS.map((founder) => (
					<figure key={founder.name} className={`${CARD} flex min-w-0 flex-col p-6 lg:p-8`}>
						<span
							aria-hidden="true"
							className="block h-8 font-(family-name:--v3-display) text-[4rem] leading-none font-medium text-(--v3-rust)"
						>
							“
						</span>
						<blockquote className={`mt-4 flex-1 text-[1.125rem] leading-[1.55] text-pretty lg:text-[1.25rem] ${TEXT}`}>
							{founder.quote}
						</blockquote>
						<figcaption className="mt-8 flex items-center gap-4">
							<img
								src={founder.photo}
								alt=""
								width={512}
								height={512}
								loading="lazy"
								decoding="async"
								className="size-12 shrink-0 rounded-full object-cover"
							/>
							<span className="min-w-0">
								<span className="flex flex-wrap items-center gap-x-3 gap-y-1">
									<span className={`text-[1rem] leading-snug font-medium ${TEXT}`}>{founder.name}</span>
									<a
										href={founder.href}
										target="_blank"
										rel="noopener noreferrer"
										className={`${LINK} ${SMALL} inline-flex items-center gap-1.5 whitespace-nowrap ${TEXT_2}`}
									>
										<LinkedInMark />
										{founder.proof}
										<span className="sr-only"> on LinkedIn</span>
									</a>
								</span>
								<span className={`${SMALL} mt-0.5 block ${TEXT_2}`}>{founder.role}, CiteRank.com</span>
							</span>
						</figcaption>
					</figure>
				))}
			</div>
		</>
	);
}

/* The page closes on the two founders, then the two things a visitor can do about it, on ink like the hero. */
export function Closing() {
	const from = "marketing-closing";
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);
	return (
		<section className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-14 lg:pb-28">
			<Page>
				<FounderQuotes />

				<div className={`${PANEL_INK} mt-16 px-6 py-12 text-center sm:mt-24 sm:px-12 sm:py-16 lg:mt-28 lg:py-20`}>
					<h2 className={`${CLOSING_TITLE} mx-auto max-w-[20ch] text-(--v3-on-ink)`}>
						See what AI says about your brand
					</h2>
					<p className={`${LEAD} mx-auto mt-4 max-w-[44ch] text-(--v3-on-ink-2)`}>
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
					<p className={`${SMALL} mt-4 text-(--v3-on-ink-3)`}>
						<span className="inline-block">Set up takes minutes.</span>{" "}
						<span className="inline-block">Plans from ${CLOUD_ENTRY_PRICE_USD} a month, cancel any time.</span>
					</p>
				</div>
			</Page>
		</section>
	);
}
