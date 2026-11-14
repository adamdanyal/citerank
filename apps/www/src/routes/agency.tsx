import { createFileRoute, Link } from "@tanstack/react-router";
import { trackAdConversion } from "@workspace/ui/lib/ad-tags";
import { type CSSProperties, useEffect, useRef } from "react";
import { Faq } from "@/components/citerank/v2/faq";
import {
	ACTION,
	ACTION_QUIET,
	BAND_PAD,
	BODY,
	DISPLAY_S,
	LEAD,
	LINK,
	PANEL_TINT,
	Page,
	PanelHead,
	RuledRow,
	SMALL,
	SUBHEAD,
} from "@/components/citerank/v2/kit";
import { PageHead, PageShell, PanelSection } from "@/components/citerank/v2/shell";
import { AGENCY_PLANS, FOUNDING_DISCOUNT, formatUsd, foundingPriceUsd } from "@/lib/agency-plans";
import { embedInlineBooking } from "@/lib/cal-embed";
import { AGENCY_FAQS } from "@/lib/faqs";
import { agencyServiceJsonLd, breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

// Placeholder until Adam supplies the booking calendar (a Cal.com "user/event" link).
const AGENCY_CAL_LINK = "";
const CONTACT_EMAIL = "team@citerank.com";

const title = "AI Search Agency · CiteRank.com";
const description =
	"The CiteRank.com agency does the work that gets you named in AI answers: new pages, updates, review sites and forums, with a before-and-after report.";

export const Route = createFileRoute("/agency")({
	head: () => ({
		meta: [
			{ title },
			{ name: "description", content: description },
			...ogMeta({ title, description, path: "/agency" }),
		],
		links: [{ rel: "canonical", href: canonicalUrl("/agency") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AI Search Agency", path: "/agency" },
			]),
			faqJsonLd(AGENCY_FAQS),
			agencyServiceJsonLd(),
		],
	}),
	component: AgencyPage,
});

const STEPS = [
	{
		title: "The tracker ranks the work",
		body: "About once a week it lists what to change: missing pages, pages AI stopped citing, and the sites and threads that leave you out.",
	},
	{
		title: "We do it every month",
		body: "We write and update the pages, get you listed, answer buyers in forums, publish guest articles and fix crawler problems.",
	},
	{
		title: "You see before and after",
		body: "A monthly report lists every piece of work, the question it targets, and the AI answers before and after.",
	},
	{
		title: "The cycle repeats",
		body: "The tracker measures the new answers, and the next month’s work follows from them.",
	},
];

const WORK = [
	{
		title: "Pages your site is missing",
		body: "The comparison, alternatives and guide pages buyers ask about, where AI names competitors instead of you.",
	},
	{
		title: "Pages AI stopped citing",
		body: "We update old pages AI no longer cites, so they answer the questions buyers ask today.",
	},
	{
		title: "Review sites and best-of lists",
		body: "We get you onto the review sites and lists AI cites when it names competitors and leaves you out.",
	},
	{
		title: "Forums and communities",
		body: "We answer buyers’ questions in the forums and communities where they ask about your field.",
	},
	{
		title: "Guest articles",
		body: "Articles on sites AI already cites, each aimed at a question where a competitor is named instead.",
	},
	{
		title: "Crawler fixes",
		body: "We fix anything that stops AI crawlers reading your site.",
	},
];

/*
 * A numbered stage of a real sequence. The numeral is the list's own counter,
 * never a label typed over the head. The three parts sit on shared rows: when
 * one head wraps, the others drop to its last line and every body starts level.
 */
const STEP =
	"row-span-3 grid grid-rows-subgrid gap-y-0 border-t border-zinc-200 pt-8 pb-10 [counter-increment:step] before:font-heading before:text-display-s before:leading-none before:font-bold before:tracking-[-0.03em] before:text-rust before:content-[counter(step)] last:pb-0 sm:[&:nth-last-child(-n+2)]:pb-0 lg:pb-0";

const PLAN_ROWS = Math.max(...AGENCY_PLANS.map((plan) => plan.includes.length));
/* Every plan closes on its crawler fixes and its report, so a shorter plan leaves the row above those two empty and they stay level across the plans. */
const PLAN_TAIL = 2;
const PLAN_CELL = "border-t border-zinc-200 py-3.5";

function planRows(includes: string[]): { id: string; text?: string }[] {
	const split = Math.max(0, includes.length - PLAN_TAIL);
	const line = (text: string) => ({ id: text, text });
	const gaps = Array.from({ length: PLAN_ROWS - includes.length }, (_, n) => ({ id: `gap-${n}` }));
	return [...includes.slice(0, split).map(line), ...gaps, ...includes.slice(split).map(line)];
}

/*
 * The three plans as one ledger. Each plan is a column on the same rows, so
 * a line of one plan sits level with the same line of the next, and the plan
 * to pick is marked by its filled button and two words, never by another surface.
 */
function AgencyPlans() {
	return (
		<div
			style={{ "--plan-rows": PLAN_ROWS + 2 } as CSSProperties}
			className="grid gap-12 md:grid-cols-3 md:gap-x-8 md:gap-y-0"
		>
			{AGENCY_PLANS.map((plan) => (
				<article key={plan.name} className="md:[grid-row:span_var(--plan-rows)] md:grid md:grid-rows-subgrid">
					<div className="pb-8">
						<h3 className={`${SUBHEAD} flex flex-wrap items-baseline gap-x-3 text-ink`}>
							{plan.name}
							{plan.recommended ? (
								<span className="font-sans text-[0.875rem] font-medium tracking-normal text-blue-800">Most chosen</span>
							) : null}
						</h3>
						<p className={`${BODY} mt-2 text-zinc-600`}>{plan.summary}</p>
						<p className="mt-6 flex items-baseline gap-2">
							<span className="font-heading text-[3rem] leading-none font-bold tracking-[-0.03em] text-ink">
								{formatUsd(plan.monthlyPriceUsd)}
							</span>
							<span className={`${SMALL} text-zinc-600`}>a month</span>
						</p>
						<p className={`${SMALL} mt-2 text-zinc-600`}>
							{formatUsd(foundingPriceUsd(plan))} a month for six months at the founding rate
						</p>
					</div>
					<ul aria-label={`What ${plan.name} includes`} className="md:contents">
						{planRows(plan.includes).map((row) =>
							row.text ? (
								<li key={row.id} className={`${PLAN_CELL} ${BODY} text-zinc-700`}>
									{row.text}
								</li>
							) : (
								<li key={row.id} aria-hidden="true" className={`${PLAN_CELL} hidden md:block`} />
							),
						)}
					</ul>
					<div className="border-t border-zinc-200 pt-6">
						<a href="#book" className={`w-full ${plan.recommended ? ACTION : ACTION_QUIET}`}>
							Book a call
						</a>
					</div>
				</article>
			))}
		</div>
	);
}

function Booking() {
	const booker = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!AGENCY_CAL_LINK || !booker.current) return;
		embedInlineBooking({
			element: booker.current,
			calLink: AGENCY_CAL_LINK,
			onBooked: (uid) => trackAdConversion("demo_booked", { id: uid }),
		});
	}, []);

	if (AGENCY_CAL_LINK) return <div ref={booker} className="min-h-[640px] w-full overflow-auto" />;

	return (
		<a href={`mailto:${CONTACT_EMAIL}?subject=AI%20search%20agency`} className={`${ACTION} w-full sm:w-auto`}>
			Email {CONTACT_EMAIL}
		</a>
	);
}

/* The offer, how a month runs, what the work is, the plans, the objections, then the call. */
function AgencyPage() {
	return (
		<PageShell>
			<PageHead
				title="We do the work that gets you named"
				lede="The tracker shows what AI says about your business and ranks what to change. We make those changes every month and show you the AI answers before and after."
			>
				<div className="flex flex-col gap-3 sm:flex-row">
					<a href="#book" className={ACTION}>
						Book a call
					</a>
					<Link to="/pricing" className={ACTION_QUIET}>
						See tracker plans
					</Link>
				</div>
				<p className={`${SMALL} mt-4 text-zinc-600`}>
					<span className="inline-block">Plans from {formatUsd(AGENCY_PLANS[0].monthlyPriceUsd)} a month.</span>{" "}
					<span className="inline-block">Three-month minimum, then month to month.</span>
				</p>
			</PageHead>

			<PanelSection>
				<PanelHead title="How a month runs" />
				<ol className="mt-10 grid gap-x-8 [counter-reset:step] sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
					{STEPS.map((step) => (
						<li key={step.title} className={STEP}>
							<h3 className={`${SUBHEAD} mt-6 self-end text-ink`}>{step.title}</h3>
							<p className={`${BODY} mt-3 text-zinc-600`}>{step.body}</p>
						</li>
					))}
				</ol>
			</PanelSection>

			<PanelSection>
				<PanelHead title="What the agency does">
					<p className={`${LEAD} text-zinc-600`}>Every month, from the list the tracker ranks.</p>
				</PanelHead>
				<ul className="mt-10 border-b border-zinc-200 lg:mt-16">
					{WORK.map((item) => (
						<RuledRow key={item.title} title={item.title}>
							{item.body}
						</RuledRow>
					))}
				</ul>
			</PanelSection>

			<PanelSection>
				<PanelHead title="Agency plans">
					<p className={`${LEAD} text-zinc-600`}>
						Each plan includes a tracker plan, so your dashboard and the monthly report show the same data.
					</p>
				</PanelHead>
				<ul className="mt-10 border-b border-zinc-200 lg:mt-16">
					<RuledRow title={`${FOUNDING_DISCOUNT * 100}% off your first six months`}>
						The founding-client rate, for our first five agency clients. In return, we write up your results as a public
						case study, and you approve it before it goes live.{" "}
						<a href="#book" className={`${LINK} whitespace-nowrap text-ink`}>
							Claim a founding place
						</a>
					</RuledRow>
				</ul>
				<div className="mt-12 lg:mt-16">
					<AgencyPlans />
				</div>
				<p className={`${SMALL} mt-8 max-w-[80ch] text-zinc-600`}>
					Every plan has a three-month minimum, then runs month to month. Prices are in US dollars, plus VAT where it
					applies. We pitch review sites and lists but can’t promise they’ll add you, and we post forum answers openly
					as your brand.
				</p>
			</PanelSection>

			<Faq items={AGENCY_FAQS} />

			<section id="book" className={`${PANEL_TINT} ${BAND_PAD}`}>
				<Page>
					<div className={AGENCY_CAL_LINK ? undefined : "grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8"}>
						<div className="lg:col-span-8">
							<h2 className={`${DISPLAY_S} text-ink`}>Book a call</h2>
							<p className={`${LEAD} mt-5 max-w-[56ch] text-zinc-700`}>
								{AGENCY_CAL_LINK
									? "We look at what AI says about your business today and the work that would change it."
									: "Send your website and what you want to change, and we reply with times. On the call we look at what AI says about your business today and the work that would change it."}
							</p>
						</div>
						<div className={AGENCY_CAL_LINK ? "mt-12" : "lg:col-span-4 lg:justify-self-end"}>
							<Booking />
						</div>
					</div>
				</Page>
			</section>
		</PageShell>
	);
}
