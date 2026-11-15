import { createFileRoute, Link } from "@tanstack/react-router";
import { BookingForm } from "@/components/citerank/v2/booking";
import { FounderQuotes } from "@/components/citerank/v2/closing";
import { Faq } from "@/components/citerank/v2/faq";
import {
	ACTION,
	ACTION_QUIET,
	BAND_PAD,
	BODY,
	CARD_LIFT,
	DISPLAY_S,
	LEAD,
	LINK,
	LiftedRows,
	PANEL_TINT,
	Page,
	PanelHead,
	SMALL,
	StepCards,
	SUBHEAD,
	Tick,
} from "@/components/citerank/v2/kit";
import { PageHead, PageShell, PanelSection } from "@/components/citerank/v2/shell";
import { AGENCY_DOES, AGENCY_FROM_USD, AGENCY_INCLUDES, AGENCY_WORK, formatUsd } from "@/lib/agency-plans";
import { AGENCY_FAQS } from "@/lib/faqs";
import { agencyServiceJsonLd, breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

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

/* One offer on one card: where the price starts, everything the work covers, and the call that sets the scope. */
function AgencyOffer() {
	return (
		<div
			className={`${CARD_LIFT} grid grid-cols-[minmax(0,1fr)] gap-10 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-x-16 lg:p-12`}
		>
			<div className="min-w-0 lg:col-span-5">
				<h3 className={`${SUBHEAD} text-ink`}>Custom scope</h3>
				<p className="mt-5">
					<span className={`${SMALL} block text-zinc-600`}>Starting from</span>
					<span className="mt-1 block font-heading text-[clamp(2.75rem,2vw+2rem,3.75rem)] leading-none font-bold tracking-[-0.03em] text-ink">
						{formatUsd(AGENCY_FROM_USD)}
					</span>
					<span className={`${BODY} mt-1 block text-zinc-600`}>a month</span>
				</p>
				<p className={`${BODY} mt-5 max-w-[38ch] text-zinc-600`}>
					You don’t buy a set number of pages or links. Each month’s work goes where the tracker shows the biggest gap.
				</p>
				<p className="mt-8">
					<a href="#book" className={`${ACTION} w-full sm:w-auto`}>
						Book a call
					</a>
				</p>
			</div>
			<ul aria-label="What the agency does" className="min-w-0 lg:col-span-7">
				{AGENCY_DOES.map((line) => (
					<li
						key={line}
						className="flex items-center gap-4 border-t border-zinc-200 py-3.5 text-lead leading-snug text-ink first:border-t-0 first:pt-0 last:pb-0"
					>
						<Tick className="size-7" />
						{line}
					</li>
				))}
			</ul>
		</div>
	);
}

/* The offer, who does the work, how a month runs, what the work is, the price, the objections, then the call. */
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
					<span className="inline-block">From {formatUsd(AGENCY_FROM_USD)} a month.</span>{" "}
					<span className="inline-block">Three-month minimum, then month to month.</span>
				</p>
			</PageHead>

			<PanelSection>
				<FounderQuotes title="Who does the work" />
			</PanelSection>

			<PanelSection>
				<PanelHead title="How a month runs" />
				<StepCards steps={STEPS} className="mt-10 sm:grid-cols-2 lg:mt-16" />
			</PanelSection>

			<PanelSection>
				<PanelHead title="What the agency does">
					<p className={`${LEAD} text-zinc-600`}>Every month, from the list the tracker ranks.</p>
				</PanelHead>
				<div className="mt-10 lg:mt-16">
					<LiftedRows items={AGENCY_WORK} />
				</div>
			</PanelSection>

			<PanelSection id="pricing">
				<PanelHead title="What it costs">
					<p className={`${LEAD} text-zinc-600`}>
						The price includes a tracker plan, so your dashboard and the monthly report show the same data.
					</p>
				</PanelHead>
				<div className="mt-10 lg:mt-16">
					<AgencyOffer />
				</div>
				<h3 className={`${SUBHEAD} mt-12 text-ink lg:mt-16`}>Always included</h3>
				<ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
					{AGENCY_INCLUDES.map((line) => (
						<li key={line} className="flex items-start gap-3 text-[1.0625rem] leading-snug text-zinc-700">
							<Tick className="mt-px size-6" />
							{line}
						</li>
					))}
				</ul>
				<p className={`${SMALL} mt-8 text-zinc-600`}>
					Three-month minimum, then month to month. Prices in US dollars, plus VAT where it applies.
				</p>
			</PanelSection>

			<Faq items={AGENCY_FAQS} />

			<section id="book" className={`${PANEL_TINT} ${BAND_PAD} scroll-mt-16`}>
				<Page>
					<h2 className={`${DISPLAY_S} text-ink`}>Book a call</h2>
					<p className={`${LEAD} mt-5 max-w-[56ch] text-zinc-700`}>
						Three questions, then pick a time. On the call we look at what AI says about your business today and the
						work that would change it.
					</p>
					<div className="mt-10 lg:mt-12">
						<BookingForm />
					</div>
					<p className={`${SMALL} mt-6 text-zinc-600`}>
						Rather write?{" "}
						<a href={`mailto:${CONTACT_EMAIL}?subject=AI%20search%20agency`} className={`${LINK} text-ink`}>
							Email {CONTACT_EMAIL}
						</a>
					</p>
				</Page>
			</section>
		</PageShell>
	);
}
