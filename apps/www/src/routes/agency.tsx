import { createFileRoute, Link } from "@tanstack/react-router";
import { trackAdConversion } from "@workspace/ui/lib/ad-tags";
import {
	ArrowRight,
	Check,
	FileText,
	type LucideIcon,
	Mail,
	MessagesSquare,
	Newspaper,
	RefreshCw,
	Star,
	Wrench,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Faq } from "@/components/citerank/v2/faq";
import {
	ACTION,
	ACTION_QUIET,
	BODY,
	CARD,
	DISPLAY,
	LEAD,
	MONO,
	MONO_ON_INK,
	PANEL,
	PANEL_PAD,
	Page,
	PanelHead,
	PILL_ACCENT,
	PILL_RUST,
	RuledRow,
	SMALL,
	SUBHEAD,
} from "@/components/citerank/v2/kit";
import { PageShell, PanelSection } from "@/components/citerank/v2/shell";
import { AGENCY_PLANS, type AgencyPlan, FOUNDING_DISCOUNT, formatUsd, foundingPriceUsd } from "@/lib/agency-plans";
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

const WORK: { icon: LucideIcon; title: string; body: string }[] = [
	{
		icon: FileText,
		title: "Pages your site is missing",
		body: "The comparison, alternatives and guide pages buyers ask about, where AI names competitors instead of you.",
	},
	{
		icon: RefreshCw,
		title: "Pages AI stopped citing",
		body: "We update old pages AI no longer cites, so they answer the questions buyers ask today.",
	},
	{
		icon: Star,
		title: "Review sites and best-of lists",
		body: "We get you onto the review sites and lists AI cites when it names competitors and leaves you out.",
	},
	{
		icon: MessagesSquare,
		title: "Forums and communities",
		body: "We answer buyers' questions in the forums and communities where they ask about your field.",
	},
	{
		icon: Newspaper,
		title: "Guest articles",
		body: "Articles on sites AI already cites, each aimed at a question where a competitor is named instead.",
	},
	{
		icon: Wrench,
		title: "Crawler fixes",
		body: "We fix anything that stops AI crawlers reading your site.",
	},
];

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
		body: "The tracker measures the new answers, and the next month's work follows from them.",
	},
];

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
		<div className={`${CARD} mx-auto flex max-w-2xl flex-col items-start`}>
			<h3 className={`${SUBHEAD} text-ink`}>Email us to book a call</h3>
			<p className={`${BODY} mt-3 max-w-[56ch] text-zinc-600`}>
				Send your website and what you want to change, and we reply with times. On the call we look at what AI says
				about your business today and the work that would change it.
			</p>
			<a href={`mailto:${CONTACT_EMAIL}?subject=AI%20search%20agency`} className={`${ACTION} mt-7`}>
				Email {CONTACT_EMAIL}
			</a>
		</div>
	);
}

function FoundingRate() {
	return (
		<div className="flex flex-col gap-5 rounded-2xl bg-rust/10 p-6 md:flex-row md:items-center md:justify-between sm:p-7">
			<div>
				<p>
					<span className={PILL_RUST}>Founding-client rate</span>
				</p>
				<p className={`${SUBHEAD} mt-4 text-ink`}>{FOUNDING_DISCOUNT * 100}% off your first six months</p>
				<p className={`${BODY} mt-2 max-w-[60ch] text-zinc-600`}>
					For our first five agency clients. In return, we write up your results as a public case study, and you approve
					it before it goes live.
				</p>
			</div>
			<a href="#book" className={`${ACTION} shrink-0`}>
				Claim a founding place
			</a>
		</div>
	);
}

function AgencyPlanCard({ plan }: { plan: AgencyPlan }) {
	const ink = plan.recommended;
	return (
		<li
			className={`flex flex-col rounded-2xl p-7 ${ink ? "bg-ink ring-1 ring-ink" : "bg-paper-2 ring-1 ring-zinc-200"}`}
		>
			<div className="flex items-center justify-between gap-3">
				<h3 className={`${SUBHEAD} ${ink ? "text-paper" : "text-ink"}`}>{plan.name}</h3>
				{plan.recommended ? <span className={PILL_ACCENT}>Most chosen</span> : null}
			</div>
			<p className={`${BODY} mt-2 ${ink ? "text-zinc-400" : "text-zinc-600"}`}>{plan.summary}</p>
			<p className="mt-6 flex items-baseline gap-2">
				<span
					className={`font-heading text-[2.5rem] leading-none font-semibold tracking-[-0.03em] tabular-nums ${ink ? "text-paper" : "text-ink"}`}
				>
					{formatUsd(plan.monthlyPriceUsd)}
				</span>
				<span className={`${SMALL} ${ink ? "text-zinc-400" : "text-zinc-500"}`}>a month</span>
			</p>
			<p className={`${SMALL} mt-2 tabular-nums ${ink ? "text-zinc-400" : "text-zinc-600"}`}>
				{formatUsd(foundingPriceUsd(plan))} a month for six months at the founding rate
			</p>
			<a href="#book" className={`mt-7 w-full ${ink ? ACTION : ACTION_QUIET}`}>
				Book a call
			</a>
			<p className={`${ink ? MONO_ON_INK : MONO} mt-7`}>Includes</p>
			<ul className={`mt-3 space-y-2 border-t pt-4 ${ink ? "border-white/15" : "border-zinc-200"}`}>
				{plan.includes.map((item) => (
					<li key={item} className={`${BODY} ${ink ? "text-zinc-300" : "text-zinc-700"}`}>
						{item}
					</li>
				))}
			</ul>
		</li>
	);
}

/* The offer, what the work is, how a month runs, the plans, the objections, then the call. */
function AgencyPage() {
	return (
		<PageShell>
			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
					<div className="min-w-0 lg:col-span-6">
						<div aria-hidden="true" className="h-[3px] w-14 bg-rust" />
						<h1 className={`${DISPLAY} mt-7 text-ink`}>We do the work that gets you named</h1>
						<p data-speakable className={`${LEAD} mt-6 max-w-[48ch] text-zinc-600`}>
							The tracker shows what AI says about your business and ranks what to change. We make those changes every
							month and show you the AI answers before and after.
						</p>
						<div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
							<a href="#book" className={ACTION}>
								Book a call
							</a>
							<Link to="/pricing" className={ACTION_QUIET}>
								See tracker plans
							</Link>
						</div>
						<p className={`${SMALL} mt-6 text-zinc-500`}>
							Plans from {formatUsd(AGENCY_PLANS[0].monthlyPriceUsd)} a month. Three-month minimum, then month to month.
						</p>
					</div>
					<div className="min-w-0 lg:col-span-6">
						<div className={CARD}>
							<h2 className={MONO}>How a month runs</h2>
							<ol className="mt-5 border-t border-zinc-200">
								{STEPS.map((step, index) => (
									<li key={step.title} className="flex gap-5 border-b border-zinc-200 py-4">
										<span className={`${MONO} mt-1 shrink-0 tabular-nums`}>0{index + 1}</span>
										<div>
											<h3 className={`${SUBHEAD} text-ink`}>{step.title}</h3>
											<p className={`${BODY} mt-1 text-zinc-600`}>{step.body}</p>
										</div>
									</li>
								))}
							</ol>
						</div>
					</div>
				</Page>
			</section>

			<PanelSection>
				<PanelHead title="What the agency does" className="max-w-[46rem]">
					<p className={`${LEAD} text-zinc-600`}>Every month, from the list the tracker ranks.</p>
				</PanelHead>
				<ul className="mt-12 border-b border-zinc-200">
					{WORK.map((item) => (
						<RuledRow key={item.title} title={item.title}>
							{item.body}
						</RuledRow>
					))}
				</ul>
			</PanelSection>

			<PanelSection>
				<PanelHead title="Agency plans" className="max-w-[46rem]">
					<p className={`${LEAD} text-zinc-600`}>
						Each plan includes a tracker plan, so your dashboard and the monthly report show the same data.
					</p>
				</PanelHead>
				<div className="mt-12">
					<FoundingRate />
				</div>
				<ul className="mt-5 grid gap-5 md:grid-cols-3">
					{AGENCY_PLANS.map((plan) => (
						<AgencyPlanCard key={plan.name} plan={plan} />
					))}
				</ul>
				<p className={`${SMALL} mt-8 max-w-[80ch] text-zinc-500`}>
					Every plan has a three-month minimum, then runs month to month. Prices are in US dollars, plus VAT where it
					applies. We pitch review sites and lists but can't promise they'll add you, and we post forum answers openly
					as your brand.
				</p>
			</PanelSection>

			<Faq items={AGENCY_FAQS} />

			<PanelSection id="book">
				<PanelHead title="Book a call" className="max-w-[46rem]">
					<p className={`${LEAD} text-zinc-600`}>
						We look at what AI says about your business today and the work that would change it.
					</p>
				</PanelHead>
				<div className="mt-12">
					<Booking />
				</div>
			</PanelSection>
		</PageShell>
	);
}
