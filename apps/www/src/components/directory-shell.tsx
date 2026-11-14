import { Link } from "@tanstack/react-router";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { Fragment, type ReactNode } from "react";
import { Closing } from "./citerank/v2/closing";
import {
	ACTION,
	ACTION_QUIET_ON_INK,
	BAND_PAD,
	BODY,
	DISPLAY,
	DISPLAY_S,
	HEADING,
	INDEX_CARD,
	LEAD,
	LINK,
	PANEL,
	PANEL_INK,
	PANEL_PAD,
	PANEL_PAD_TIGHT,
	PANEL_PAD_WIDE,
	Page,
	PanelHead,
	SMALL,
} from "./citerank/v2/kit";

const SIGN_UP_URL = cloudSignupUrl("marketing-page-cta");

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";

/* A head held on the left while a long list or table scrolls past it on the right. */
export const SPLIT = "grid gap-10 lg:grid-cols-12 lg:gap-8";
export const SPLIT_HEAD = "lg:sticky lg:top-28 lg:col-span-4 lg:self-start";
export const SPLIT_BODY = "min-w-0 lg:col-span-8";

/*
 * In an index the whole row is the link, and its label takes the colour.
 * The hairline sits on the list item, so the link's focus ring keeps its corners.
 */
export const ROW = "border-t border-zinc-200";
export const ROW_LINK = `group flex items-baseline justify-between gap-6 rounded-sm py-4 text-[1rem] leading-[1.5] font-medium text-ink ${FOCUS}`;
export const ROW_LINK_LABEL = "min-w-0 transition-colors duration-200 group-hover:text-rust";
export const ROW_LINK_COUNT = `${SMALL} shrink-0 font-normal whitespace-nowrap text-zinc-600 tabular-nums`;

const PADS = { tight: PANEL_PAD_TIGHT, base: PANEL_PAD, wide: PANEL_PAD_WIDE };
const COLUMNS = { three: "sm:columns-2 lg:columns-3", four: "sm:columns-2 lg:columns-3 xl:columns-4" };

/** Tool names joined by "vs". Each name after the first carries its "vs", so a line breaks between tools and never inside a name. */
export function Matchup({ names }: { names: string[] }) {
	return (
		<span className={`${ROW_LINK_LABEL} block text-balance`}>
			{names.map((name, index) => (
				<Fragment key={name}>
					{index > 0 ? " " : null}
					<span className="whitespace-nowrap">{index === 0 ? name : `vs ${name}`}</span>
				</Fragment>
			))}
		</span>
	);
}

/** One group of a link index: its head, then its links running down columns. */
export function IndexGroup({
	title,
	columns = "three",
	children,
}: {
	title: string;
	columns?: keyof typeof COLUMNS;
	children: ReactNode;
}) {
	return (
		<div>
			<h2 className={`${HEADING} text-ink`}>{title}</h2>
			<ul className={`${INDEX_CARD} mt-8 gap-x-8 lg:mt-10 ${COLUMNS[columns]}`}>{children}</ul>
		</div>
	);
}

function Crumb({ label, className = "" }: { label: string; className?: string }) {
	return (
		<nav aria-label="Breadcrumb" className={className}>
			<Link to="/ai-visibility-tools" className={`${SMALL} ${LINK} text-zinc-600 hover:text-ink`}>
				{label}
			</Link>
		</nav>
	);
}

export function DirectoryBackLink({ label = "AI visibility tool directory" }: { label?: string }) {
	return (
		<Page className="pt-8 sm:pt-10 lg:pt-14">
			<Crumb label={label} />
		</Page>
	);
}

/**
 * An inner page's opening: the h1 and a lead "answer block" written to be
 * lifted verbatim into an AI answer. `back` puts the way back to the directory
 * in the space above the h1, so the head sits where it does on every other page.
 * `tight` is for a hero whose next section opens on a band or a ruled list,
 * which bring space of their own.
 */
export function DirectoryHero({
	title,
	lead,
	children,
	aside,
	back = false,
	tight = false,
}: {
	title: string;
	lead: string;
	children?: ReactNode;
	aside?: ReactNode;
	back?: boolean;
	tight?: boolean;
}) {
	const long = title.length > 40;
	const top = back ? "pt-8 sm:pt-10 lg:pt-14" : "pt-12 sm:pt-16 lg:pt-24";
	const bottom = tight ? "pb-9 sm:pb-10" : "pb-9 sm:pb-12 lg:pb-18";
	return (
		<section className={`${PANEL} ${top} ${bottom}`}>
			<Page>
				{back ? <Crumb label="AI visibility tool directory" className="mb-6" /> : null}
				<div className={aside ? "grid gap-9 lg:grid-cols-12 lg:items-end lg:gap-8" : undefined}>
					<div className={aside ? "lg:col-span-8" : undefined}>
						<h1 className={`${long ? `${DISPLAY_S} max-w-[24ch]` : `${DISPLAY} max-w-[18ch]`} text-ink`}>{title}</h1>
						<p data-speakable className={`${LEAD} mt-6 max-w-[56ch] text-zinc-600`}>
							{lead}
						</p>
						{children ? <div className="mt-9">{children}</div> : null}
					</div>
					{aside ? <div className="lg:col-span-4">{aside}</div> : null}
				</div>
			</Page>
		</section>
	);
}

/**
 * The CiteRank.com pitch as an ink band, high on a page right under the hero.
 * `pitch` is the page-specific paragraph; `comparison` points the second action
 * at the matching comparison page.
 */
export function DirectoryCiteRankBanner({
	pitch,
	comparison,
}: {
	pitch: string;
	comparison: { slug: string; name: string };
}) {
	return (
		<section className={`${PANEL_INK} ${BAND_PAD}`}>
			<Page className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
				<div className="lg:col-span-7">
					<h2 className={`${HEADING} max-w-[22ch] text-paper`}>CiteRank.com: tracker and AI search agency</h2>
					<p className={`${BODY} mt-5 max-w-[62ch] text-zinc-300`}>{pitch}</p>
				</div>
				<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-5 lg:justify-end">
					<a href={SIGN_UP_URL} className={ACTION}>
						Start tracking
					</a>
					<Link
						to="/ai-visibility-tools/$slug"
						params={{ slug: comparison.slug }}
						className={`${ACTION_QUIET_ON_INK} min-w-0`}
					>
						<span className="truncate">CiteRank.com vs {comparison.name}</span>
					</Link>
				</div>
			</Page>
		</section>
	);
}

/** A directory page ends as every page does: the founders' quotes, then the panel with the two actions. */
export function CiteRankCta() {
	return <Closing from="marketing-page-cta" />;
}

export function DirectorySection({
	title,
	lede,
	children,
	pad = "base",
}: {
	title?: string;
	lede?: ReactNode;
	children: ReactNode;
	pad?: keyof typeof PADS;
}) {
	return (
		<section className={`${PANEL} ${PADS[pad]}`}>
			<Page>
				{title ? (
					<PanelHead title={title} className="mb-10 lg:mb-16">
						{lede}
					</PanelHead>
				) : null}
				{children}
			</Page>
		</section>
	);
}
