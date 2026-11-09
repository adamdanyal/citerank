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
import { Faq } from "@/components/citerank/home/faq";
import {
	CARD,
	Container,
	ICON_BOX,
	PRIMARY_BUTTON,
	PRIMARY_BUTTON_LG,
	Reveal,
	RevealItem,
	SECONDARY_BUTTON,
	SECONDARY_BUTTON_LG,
} from "@/components/citerank/ui";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
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
		title: "Pages Your Site Is Missing",
		body: "The comparison, alternatives and guide pages buyers ask about, where AI names competitors instead of you.",
	},
	{
		icon: RefreshCw,
		title: "Pages AI Stopped Citing",
		body: "We update old pages AI no longer cites, so they answer the questions buyers ask today.",
	},
	{
		icon: Star,
		title: "Review Sites and Best-Of Lists",
		body: "We get you onto the review sites and lists AI cites when it names competitors and leaves you out.",
	},
	{
		icon: MessagesSquare,
		title: "Forums and Communities",
		body: "We answer buyers' questions in the forums and communities where they ask about your field.",
	},
	{
		icon: Newspaper,
		title: "Guest Articles",
		body: "Articles on sites AI already cites, each aimed at a question where a competitor is named instead.",
	},
	{
		icon: Wrench,
		title: "Crawler Fixes",
		body: "We fix anything that stops AI crawlers reading your site.",
	},
];

const STEPS = [
	{
		title: "The Tracker Ranks the Work",
		body: "About once a week it lists what to change: missing pages, pages AI stopped citing, and the sites and threads that leave you out.",
	},
	{
		title: "We Do It Every Month",
		body: "We write and update the pages, get you listed, answer buyers in forums, publish guest articles and fix crawler problems.",
	},
	{
		title: "You See Before and After",
		body: "A monthly report lists every piece of work, the question it targets, and the AI answers before and after.",
	},
	{
		title: "The Cycle Repeats",
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
		<div className={`${CARD} mx-auto flex max-w-2xl flex-col items-center p-8 text-center sm:p-12`}>
			<span className={ICON_BOX}>
				<Mail className="size-5" aria-hidden="true" />
			</span>
			<p className="title-1 mt-6 text-zinc-950">Email us to book a call</p>
			<p className="body-6 mt-2 max-w-[48ch] text-zinc-600">
				Send your website and what you want to change, and we reply with times. On the call we look at what AI says
				about your business today and the work that would change it.
			</p>
			<a
				href={`mailto:${CONTACT_EMAIL}?subject=AI%20search%20agency`}
				className={`${PRIMARY_BUTTON_LG} mt-8 w-full sm:w-auto`}
			>
				Email {CONTACT_EMAIL}
			</a>
		</div>
	);
}

function FoundingRate() {
	return (
		<Reveal className="flex flex-col gap-5 rounded-2xl bg-blue-50 p-6 ring-1 ring-blue-200 md:flex-row md:items-center md:justify-between lg:p-8">
			<div>
				<p className="caption-1 text-blue-700">Founding-Client Rate</p>
				<p className="title-1 mt-2 text-zinc-950">{FOUNDING_DISCOUNT * 100}% Off Your First Six Months</p>
				<p className="body-6 mt-1 max-w-[60ch] text-zinc-600">
					For our first five agency clients. In return, we write up your results as a public case study, and you approve
					it before it goes live.
				</p>
			</div>
			<a href="#book" className={`${PRIMARY_BUTTON} shrink-0`}>
				Claim a founding place
			</a>
		</Reveal>
	);
}

function AgencyPlanCard({ plan, delay }: { plan: AgencyPlan; delay: number }) {
	return (
		<RevealItem delay={delay} className={`${CARD} flex flex-col p-6 ${plan.recommended ? "ring-2 ring-blue-600" : ""}`}>
			<p className="flex items-center justify-between gap-2 title-1 text-zinc-950">
				{plan.name}
				{plan.recommended ? (
					<span className="caption-3 rounded-md bg-blue-600 px-2 py-0.5 text-white">Recommended</span>
				) : null}
			</p>
			<p className="body-6 mt-1 text-zinc-600">{plan.summary}</p>
			<p className="mt-6 flex items-baseline gap-2">
				<span className="font-mono text-4xl font-medium tracking-[-0.02em] text-zinc-950 tabular-nums">
					{formatUsd(plan.monthlyPriceUsd)}
				</span>
				<span className="caption-2 text-zinc-500">a month</span>
			</p>
			<p className="caption-2 mt-1 text-blue-700 tabular-nums">
				{formatUsd(foundingPriceUsd(plan))} a month for six months at the founding rate
			</p>
			<a href="#book" className={`mt-6 w-full ${plan.recommended ? PRIMARY_BUTTON : SECONDARY_BUTTON}`}>
				Book a call
				<ArrowRight className="size-4" aria-hidden="true" />
			</a>
			<p className="caption-1 mt-6 text-zinc-950">Includes</p>
			<ul className="mt-3 space-y-2">
				{plan.includes.map((item) => (
					<li key={item} className="flex items-start gap-2 body-6 text-zinc-700">
						<Check className="mt-0.5 size-4 shrink-0 text-blue-600" strokeWidth={2.5} aria-hidden="true" />
						{item}
					</li>
				))}
			</ul>
		</RevealItem>
	);
}

/* The offer, what the work is, how a month runs, the plans, the objections, then the call. */
function AgencyPage() {
	return (
		<div className="min-h-screen bg-white antialiased">
			<a
				href="#content"
				className={`${PRIMARY_BUTTON} sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50`}
			>
				Skip to content
			</a>
			<Navbar />
			<main id="content">
				<section className="relative overflow-hidden bg-paper">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
					/>
					<Container className="relative pb-20 pt-16 lg:pb-24 lg:pt-24">
						<div className="mx-auto flex max-w-3xl flex-col items-center text-center">
							<p className="caption-3 rounded-md bg-blue-50 px-3 py-1 text-blue-800">AI Search Agency</p>
							<h1 className="heading-1 cr-gradient-text mt-8">We Do the Work That Gets You Named</h1>
							<p className="body-8 mt-6 max-w-[60ch] text-zinc-600">
								The tracker shows what AI says about your business and ranks what to change. We make those changes every
								month and show you the AI answers before and after.
							</p>
							<div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
								<a href="#book" className={PRIMARY_BUTTON_LG}>
									Book a call
									<ArrowRight className="size-4" aria-hidden="true" />
								</a>
								<Link to="/pricing" className={SECONDARY_BUTTON_LG}>
									See tracker plans
								</Link>
							</div>
							<p className="caption-2 mt-6 text-zinc-500">
								Plans from {formatUsd(AGENCY_PLANS[0].monthlyPriceUsd)} a month. Three-month minimum, then month to
								month.
							</p>
						</div>
					</Container>
				</section>

				<section className="bg-white">
					<Container className="py-20 lg:py-24">
						<Reveal className="mx-auto max-w-3xl text-center">
							<h2 className="heading-2 text-zinc-950">What the Agency Does</h2>
							<p className="body-8 mt-6 text-zinc-700">Every month, from the list the tracker ranks.</p>
						</Reveal>
						<ul className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
							{WORK.map((item, index) => {
								const Icon = item.icon;
								return (
									<RevealItem key={item.title} delay={index * 60} className={`${CARD} p-6 lg:p-8`}>
										<span className={ICON_BOX}>
											<Icon className="size-5" aria-hidden="true" />
										</span>
										<h3 className="title-1 mt-6 text-zinc-950">{item.title}</h3>
										<p className="body-6 mt-2 text-zinc-600">{item.body}</p>
									</RevealItem>
								);
							})}
						</ul>
					</Container>
				</section>

				<section className="bg-paper">
					<Container className="py-20 lg:py-24">
						<Reveal className="mx-auto max-w-3xl text-center">
							<h2 className="heading-2 text-zinc-950">How a Month Runs</h2>
						</Reveal>
						<ol className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
							{STEPS.map((step, index) => (
								<RevealItem key={step.title} delay={index * 60} className={`${CARD} p-6`}>
									<p className="caption-1 font-mono text-blue-700 tabular-nums">0{index + 1}</p>
									<h3 className="title-1 mt-4 text-zinc-950">{step.title}</h3>
									<p className="body-6 mt-2 text-zinc-600">{step.body}</p>
								</RevealItem>
							))}
						</ol>
					</Container>
				</section>

				<section className="bg-white">
					<Container className="py-20 lg:py-24">
						<Reveal className="mx-auto max-w-3xl text-center">
							<h2 className="heading-2 text-zinc-950">Agency Plans</h2>
							<p className="body-8 mt-6 text-zinc-700">
								Each plan includes a tracker plan, so your dashboard and the monthly report show the same data.
							</p>
						</Reveal>
						<div className="mt-12 lg:mt-16">
							<FoundingRate />
						</div>
						<ul className="mt-5 grid gap-5 md:grid-cols-3">
							{AGENCY_PLANS.map((plan, index) => (
								<AgencyPlanCard key={plan.name} plan={plan} delay={index * 60} />
							))}
						</ul>
						<p className="caption-2 mx-auto mt-6 max-w-3xl text-center text-zinc-500">
							Every plan has a three-month minimum, then runs month to month. Prices are in US dollars, plus VAT where
							it applies. We pitch review sites and lists but can't promise they'll add you, and we post forum answers
							openly as your brand.
						</p>
					</Container>
				</section>

				<Faq items={AGENCY_FAQS} />

				<section id="book" className="scroll-mt-20 bg-paper">
					<Container className="py-20 lg:py-24">
						<Reveal className="mx-auto max-w-3xl text-center">
							<h2 className="heading-2 text-zinc-950">Book a Call</h2>
							<p className="body-8 mt-6 text-zinc-700">
								We look at what AI says about your business today and the work that would change it.
							</p>
						</Reveal>
						<div className="mt-12">
							<Booking />
						</div>
					</Container>
				</section>
			</main>
			<Footer />
		</div>
	);
}
