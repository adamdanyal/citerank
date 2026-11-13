import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import type { ReactNode } from "react";
import {
	ACTION,
	ACTION_QUIET,
	BODY,
	DISPLAY,
	HEADING,
	LEAD,
	LINK,
	PANEL,
	PANEL_PAD,
	PANEL_PAD_TIGHT,
	Page,
	SUBHEAD,
} from "./citerank/v2/kit";

const SIGN_UP_URL = cloudSignupUrl("marketing-page-cta");

export function DirectoryBackLink({ label = "AI visibility tool directory" }: { label?: string }) {
	return (
		<Page className="pt-2">
			<Link to="/ai-visibility-tools" className={`${BODY} ${LINK} text-zinc-600 hover:text-ink`}>
				{label}
			</Link>
		</Page>
	);
}

/**
 * Page hero with an H1 and a lead "answer block" written to be lifted verbatim
 * into an AI answer. The rust rule marks the opening without a word above the
 * heading announcing it.
 */
export function DirectoryHero({ title, lead, children }: { title: string; lead: string; children?: ReactNode }) {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<div aria-hidden="true" className="h-[3px] w-14 bg-rust" />
				<h1 className={`${DISPLAY} mt-7 max-w-[20ch] text-ink`}>{title}</h1>
				<p data-speakable className={`${LEAD} mt-6 max-w-[62ch] text-zinc-600`}>
					{lead}
				</p>
				{children ? <div className="mt-9">{children}</div> : null}
			</Page>
		</section>
	);
}

/**
 * The "CiteRank.com: the open-source alternative" panel, surfaced high on a page
 * right under the hero. `pitch` is the page-specific paragraph; `comparison`
 * points the second action at the matching comparison page.
 */
export function DirectoryCiteRankBanner({
	pitch,
	comparison,
}: {
	pitch: string;
	comparison: { slug: string; name: string };
}) {
	return (
		<section className={`${PANEL} ${PANEL_PAD_TIGHT}`}>
			<Page>
				<h2 className={`${SUBHEAD} text-ink`}>CiteRank.com: tracker and AI search agency</h2>
				<p className={`${BODY} mt-3 max-w-[72ch] text-zinc-600`}>{pitch}</p>
				<div className="mt-7 flex flex-wrap gap-3">
					<a href={SIGN_UP_URL} className={ACTION}>
						Start tracking
					</a>
					<Link to="/ai-visibility-tools/$slug" params={{ slug: comparison.slug }} className={ACTION_QUIET}>
						CiteRank.com vs {comparison.name}
					</Link>
				</div>
			</Page>
		</section>
	);
}

export function CiteRankCta() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<div aria-hidden="true" className="h-[3px] w-14 bg-rust" />
				<h2 className={`${HEADING} mt-7 max-w-[20ch] text-ink`}>Ready to track your AI visibility?</h2>
				<p className={`${LEAD} mt-6 max-w-[62ch] text-zinc-600`}>
					Sign up in minutes and start monitoring how ChatGPT, Claude, and Google AI Overviews talk about your brand.
					Plans start at ${CLOUD_ENTRY_PRICE_USD}/mo, or have our agency do the work.
				</p>
				<div className="mt-9 flex flex-wrap gap-3">
					<a href={SIGN_UP_URL} className={ACTION}>
						Start tracking
					</a>
					<Link to="/agency" className={ACTION_QUIET}>
						Let us do the work
					</Link>
				</div>
			</Page>
		</section>
	);
}

export function DirectorySection({ title, children }: { title?: string; children: ReactNode }) {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				{title ? (
					<>
						<div aria-hidden="true" className="h-[3px] w-14 bg-rust" />
						<h2 className={`${HEADING} mt-7 mb-10 text-ink`}>{title}</h2>
					</>
				) : null}
				{children}
			</Page>
		</section>
	);
}
