import type { ReferralSource } from "@workspace/config/referrals";
import { cloudSignupUrl, demoSiteUrl } from "@workspace/config/referrals";
import type { ReactNode } from "react";
import type { Pillar } from "@/data/pillars";
import { externalRel } from "@/lib/external-link";
import { trackEvent } from "@/lib/posthog";
import { DEMO_BRAND_PATH } from "./citerank/product/data";
import { Closing } from "./citerank/v2/closing";
import {
	ACTION,
	ACTION_QUIET,
	BODY,
	CARD,
	CARD_LIFT,
	DISPLAY,
	LEAD,
	LINK,
	LinkCards,
	PANEL,
	PANEL_PAD,
	Page,
	PanelHead,
	SMALL,
	StepDisc,
	SUBHEAD,
} from "./citerank/v2/kit";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

/** A label over a list or a well: the body face, a step smaller. Set on a heading, it keeps the heading out of the display face. */
export const LABEL = `${SMALL} font-sans font-medium tracking-normal text-ink`;

/*
 * A document: a rail on four columns beside the text on eight, the text held
 * to a reading measure. Its heads are document heads, at the title size, so
 * the page reads as one piece of writing rather than a run of sections.
 */
export const DOC = "grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8";
export const DOC_RAIL = "min-w-0 lg:sticky lg:top-28 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start";
export const DOC_TEXT = "min-w-0 max-w-[60ch] lg:col-span-8 lg:col-start-5";
export const DOC_HEAD = `${SUBHEAD} text-ink`;
export const DOC_SUBHEAD = "font-heading text-[1.125rem] leading-[1.35] font-bold tracking-normal text-ink";
export const PROSE = `${BODY} text-zinc-700`;

/** An item's title where it can run to three lines: the title size, leaded a step looser than a one-line title. */
export const ITEM_TITLE =
	"font-heading text-title leading-[1.3] font-bold tracking-[-0.01em] [overflow-wrap:break-word] min-w-0 text-balance";

/* A whole row as one link: the row takes the click and its title takes the colour. The hairline sits on the list item, so the link's focus ring keeps its corners. */
export const ROW = "border-t border-zinc-200";
export const ROW_LINK = `group rounded-sm ${FOCUS}`;
export const ROW_TITLE = `${ITEM_TITLE} text-ink transition-colors duration-200 group-hover:text-rust`;
export const ROW_ACTION = `${BODY} font-medium text-ink underline decoration-dotted decoration-zinc-500 underline-offset-[5px] transition-colors duration-200 group-hover:text-rust group-hover:decoration-rust`;

const RAIL_LINK = `${SMALL} rounded-sm text-zinc-600 transition-colors duration-200 hover:text-ink ${FOCUS}`;

/** The kit's page head, with the way back to the hub above the h1. */
export function GuideHead({
	back,
	title,
	lede,
	children,
}: {
	back: { href: string; label: string };
	title: string;
	lede: ReactNode;
	children?: ReactNode;
}) {
	return (
		<section className={`${PANEL} pt-8 pb-3 sm:pt-10 sm:pb-4 lg:pt-14`}>
			<Page>
				<nav aria-label="Breadcrumb">
					<a href={back.href} className={`${LINK} ${SMALL} text-zinc-600 hover:text-ink`}>
						{back.label}
					</a>
				</nav>
				<h1 className={`${DISPLAY} mt-6 max-w-[18ch] text-ink`}>{title}</h1>
				<p data-speakable className={`${LEAD} mt-6 max-w-[56ch] text-zinc-600`}>
					{lede}
				</p>
				{children ? <div className="mt-9">{children}</div> : null}
			</Page>
		</section>
	);
}

export function RailNav({ label, links }: { label: string; links: { href: string; label: string }[] }) {
	if (links.length === 0) return null;
	return (
		<nav aria-label={label} className={DOC_RAIL}>
			<h2 className={LABEL}>{label}</h2>
			<ul className="mt-3">
				{links.map((link) => (
					<li key={link.href}>
						<a href={link.href} className={`${RAIL_LINK} inline-block py-1.5`}>
							{link.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

/** Steps on one lifted card, each behind its numbered disc. The disc is hidden from a reader, who gets the list's own numbers. */
export function Steps({ steps }: { steps: { name: string; text: string }[] }) {
	return (
		<ol className={`${CARD_LIFT} mt-6 px-6 sm:px-8`}>
			{steps.map((step, index) => (
				<li key={step.name} className="flex gap-4 border-t border-zinc-200 py-5 first:border-t-0">
					<StepDisc step={index + 1} />
					<div className="min-w-0">
						<h3 className={DOC_SUBHEAD}>{step.name}</h3>
						<p className={`${PROSE} mt-1.5`}>{step.text}</p>
					</div>
				</li>
			))}
		</ol>
	);
}

/** A guide ends as every page does: the founders' quotes, then the panel with the two actions. */
export function CiteRankCta() {
	return <Closing from="marketing-page-cta" />;
}

/** "Start tracking", and with `demo` the live demo beside it, for under a page head's lede. */
export function TrackingActions({ from, demo = false }: { from: ReferralSource; demo?: boolean }) {
	const signupUrl = cloudSignupUrl(from);
	const demoUrl = demoSiteUrl(from, DEMO_BRAND_PATH);
	return (
		<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
			<a href={signupUrl} onClick={() => trackEvent("signup_click", { from })} className={ACTION}>
				Start tracking
			</a>
			{demo ? (
				<a
					href={demoUrl}
					target="_blank"
					rel={externalRel(demoUrl)}
					onClick={() => trackEvent("demo_open", { from })}
					className={ACTION_QUIET}
				>
					Try the live demo
				</a>
			) : null}
		</div>
	);
}

export function PillarBody({ pillar }: { pillar: Pillar }) {
	return (
		<>
			{/* The route's PageHead ends just above; this padding matches the gap it leaves before its own children. */}
			<div className={`${PANEL} pt-6 pb-3 sm:pt-5 sm:pb-4`}>
				<Page>
					<TrackingActions from="marketing-page-cta" demo />
				</Page>
			</div>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page className={DOC}>
					<div className={`${DOC_TEXT} lg:row-start-1`}>
						<div className={CARD}>
							<h2 className={LABEL}>In short</h2>
							<p className={`${LEAD} mt-3 text-ink`}>{pillar.definition}</p>
						</div>
					</div>

					<nav aria-label="On this page" className={`${DOC_RAIL} lg:row-span-2`}>
						<h2 className={LABEL}>On this page</h2>
						<ol className="mt-3">
							{pillar.sections.map((section) => (
								<li key={section.id}>
									<a href={`#${section.id}`} className={`${RAIL_LINK} block truncate py-1.5`}>
										{section.heading}
									</a>
								</li>
							))}
						</ol>
					</nav>

					<div className={`${DOC_TEXT} lg:row-start-2`}>
						{pillar.sections.map((section) => (
							<div key={section.id} id={section.id} className="mt-14 scroll-mt-8 first:mt-0">
								<h2 className={DOC_HEAD}>{section.heading}</h2>
								<div className="mt-4 space-y-4">
									{section.body.map((paragraph) => (
										<p key={paragraph.slice(0, 40)} className={PROSE}>
											{paragraph}
										</p>
									))}
								</div>

								{section.steps ? <Steps steps={section.steps} /> : null}

								{section.bullets ? (
									<ul className="mt-6 list-disc space-y-3 pl-5 marker:text-zinc-400">
										{section.bullets.map((bullet) => (
											<li key={bullet.slice(0, 40)} className={PROSE}>
												{bullet}
											</li>
										))}
									</ul>
								) : null}

								{section.callout ? (
									<div className={`${CARD} mt-8`}>
										<h3 className={DOC_SUBHEAD}>{section.callout.heading}</h3>
										<p className={`${PROSE} mt-2`}>{section.callout.text}</p>
									</div>
								) : null}
							</div>
						))}
					</div>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<PanelHead title="Keep reading" />
					<LinkCards
						className="mt-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
						items={pillar.related.map((link) => ({ href: link.href, title: link.label, body: link.description }))}
					/>
				</Page>
			</section>
		</>
	);
}
