import { createFileRoute, Link } from "@tanstack/react-router";
import { trackAdConversion } from "@workspace/ui/lib/ad-tags";
import { useEffect, useRef } from "react";
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
	StepDisc,
	SUBHEAD,
	Tick,
} from "@/components/citerank/v2/kit";
import { PLAN_GRID, PlanCard, PlanLine } from "@/components/citerank/v2/pricing";
import { PageHead, PageShell, PanelSection } from "@/components/citerank/v2/shell";
import { AGENCY_EVERY_PLAN, AGENCY_PLANS, AGENCY_WORK, FOUNDING_DISCOUNT, formatUsd } from "@/lib/agency-plans";
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

/* The three plans on the cards the tracker's plans use: a price, who it is for and what sets it apart. What they share is said once, under them. */
function AgencyPlans() {
	return (
		<div className={PLAN_GRID}>
			{AGENCY_PLANS.map((plan) => (
				<PlanCard
					key={plan.name}
					name={plan.name}
					summary={plan.summary}
					price={formatUsd(plan.monthlyPriceUsd)}
					priceLead={plan.from ? "From" : ""}
					band={plan.recommended ? "Recommended" : undefined}
					action={
						<a href="#book" className={`w-full ${plan.recommended ? ACTION : ACTION_QUIET}`}>
							Book a call
						</a>
					}
				>
					{plan.lines.map((line) => (
						<PlanLine key={line}>{line}</PlanLine>
					))}
					{plan.without?.map((line) => (
						<PlanLine key={line} none>
							{line}
						</PlanLine>
					))}
				</PlanCard>
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
				<ol className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:mt-16 lg:gap-8">
					{STEPS.map((step, index) => (
						<li key={step.title} className={`${CARD_LIFT} p-6 sm:p-8`}>
							<h3 className={`${SUBHEAD} flex items-start gap-3 text-ink`}>
								<StepDisc step={index + 1} />
								{step.title}
							</h3>
							<p className={`${BODY} mt-3 text-zinc-600`}>{step.body}</p>
						</li>
					))}
				</ol>
			</PanelSection>

			<PanelSection>
				<PanelHead title="What the agency does">
					<p className={`${LEAD} text-zinc-600`}>Every month, from the list the tracker ranks.</p>
				</PanelHead>
				<div className="mt-10 lg:mt-16">
					<LiftedRows items={AGENCY_WORK} />
				</div>
			</PanelSection>

			<PanelSection id="plans">
				<PanelHead title="Agency plans">
					<p className={`${LEAD} text-zinc-600`}>
						Each plan includes a tracker plan, so your dashboard and the monthly report show the same data.
					</p>
				</PanelHead>
				<div className="mt-10 lg:mt-16">
					<LiftedRows
						ticked={false}
						items={[
							{
								title: `${FOUNDING_DISCOUNT * 100}% off your first six months`,
								body: (
									<>
										The founding-client rate, for our first five agency clients. In return, we write up your results as
										a public case study, and you approve it before it goes live.{" "}
										<a href="#book" className={`${LINK} whitespace-nowrap text-ink`}>
											Claim a founding place
										</a>
									</>
								),
							},
						]}
					/>
				</div>
				<div className="mt-12 lg:mt-16">
					<AgencyPlans />
				</div>
				<h3 className={`${SUBHEAD} mt-12 text-ink lg:mt-16`}>Every plan includes</h3>
				<ul className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
					{AGENCY_EVERY_PLAN.map((line) => (
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
