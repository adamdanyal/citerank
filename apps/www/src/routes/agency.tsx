import { createFileRoute, Link } from "@tanstack/react-router";
import { trackAdConversion } from "@workspace/ui/lib/ad-tags";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { Footer } from "@/components/footer";
import { Faq } from "@/components/home/faq";
import { HOME_FONT_CLASS, HomeStyles } from "@/components/home/styles";
import { CARD, SectionHeading } from "@/components/home/ui";
import { Navbar } from "@/components/navbar";
import { embedInlineBooking } from "@/lib/cal-embed";
import { AGENCY_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

// Placeholder until Adam supplies the booking calendar (a Cal.com "user/event" link).
const AGENCY_CAL_LINK = "";
const CONTACT_EMAIL = "team@citerank.com";

const title = "AI Search Agency · CiteRank.com";
const description =
	"CiteRank.com's AI search agency does the work that gets your business named in ChatGPT and Google AI answers: new pages, page updates, review sites, forums and guest articles, with a monthly before-and-after report.";

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
		],
	}),
	component: AgencyPage,
});

const WORK = [
	{
		title: "Pages Your Site Is Missing",
		body: "We write the comparison, alternatives and guide pages buyers' questions call for, where AI names competitors instead of you.",
	},
	{
		title: "Pages AI Stopped Citing",
		body: "We update old pages AI no longer cites, so they answer the questions buyers ask today.",
	},
	{
		title: "Review Sites and Best-Of Lists",
		body: "We get your business onto the review sites and best-of lists AI cites when it names competitors and leaves you out.",
	},
	{
		title: "Forums and Communities",
		body: "We answer buyers' questions in the forums and communities where they ask about your field.",
	},
	{
		title: "Guest Articles",
		body: "We publish guest articles on high-authority sites AI already cites, each aimed at a question where a competitor is named instead.",
	},
	{
		title: "Crawler Fixes",
		body: "We fix anything that stops AI crawlers reading your site.",
	},
];

const STEPS = [
	{
		title: "The Tracker Ranks the Work",
		body: "About once a week, the AI Visibility Tracker ranks what to change: missing pages, pages AI stopped citing, and the review sites, lists and forum threads that leave you out.",
	},
	{
		title: "We Do It Every Month",
		body: "The agency writes and updates the pages, gets you listed, answers buyers in forums, publishes guest articles and fixes crawler problems.",
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

// Tier names, contents and prices are not decided yet; these cards hold the layout until they are.
const PLACEHOLDER_TIERS = ["Tier One", "Tier Two", "Tier Three"];

const BUTTON =
	"inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-base font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

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
		<div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
			<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">Placeholder</p>
			<p className="max-w-md text-pretty text-zinc-600">The booking calendar goes here once its link is set.</p>
			<a
				href={`mailto:${CONTACT_EMAIL}?subject=AI%20search%20agency`}
				className={`${BUTTON} bg-blue-600 text-white hover:bg-blue-700`}
			>
				Email {CONTACT_EMAIL}
			</a>
		</div>
	);
}

function AgencyPage() {
	return (
		<div className={`${HOME_FONT_CLASS} min-h-screen bg-paper antialiased`}>
			<HomeStyles />
			<Navbar />
			<main>
				<section className="relative overflow-hidden">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
					/>
					<div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-20 pt-14 text-center md:px-6 md:pt-20">
						<span className="inline-flex h-7 items-center rounded-full bg-white/80 px-3 text-xs font-medium text-zinc-600 shadow-sm ring-1 ring-zinc-200">
							AI Search Agency
						</span>
						<h1 className="mt-8 text-[2.75rem] font-semibold leading-[1] tracking-[-0.04em] text-balance text-zinc-950 sm:text-6xl lg:text-7xl">
							We Do the Work That Gets You Named
						</h1>
						<p className="mt-6 max-w-[60ch] text-balance text-[17px]/7 text-zinc-600 md:text-xl/8">
							The AI Visibility Tracker shows what AI says about your business and ranks what to change. Our AI search
							agency makes those changes every month, and the monthly report shows the AI answers before and after.
						</p>
						<div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
							<a href="#book" className={`${BUTTON} bg-blue-600 text-white hover:bg-blue-700`}>
								Book a call
								<ArrowRight className="size-4" aria-hidden="true" />
							</a>
							<Link
								to="/pricing"
								className={`${BUTTON} bg-white text-zinc-950 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 hover:ring-zinc-300`}
							>
								See tracker plans
							</Link>
						</div>
					</div>
				</section>

				<section className="border-t border-zinc-200/80 bg-white">
					<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 lg:py-28">
						<SectionHeading title="What the Agency Does" lede="Every month, from the list the tracker ranks." />
						<ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{WORK.map((item) => (
								<li key={item.title} className={`p-6 ${CARD}`}>
									<p className="flex items-center gap-2 text-lg font-semibold tracking-[-0.015em] text-zinc-950">
										<Check className="size-4 shrink-0 text-blue-600" strokeWidth={2.5} aria-hidden="true" />
										{item.title}
									</p>
									<p className="mt-2 text-pretty text-[15px]/6 text-zinc-600">{item.body}</p>
								</li>
							))}
						</ul>
					</div>
				</section>

				<section className="border-t border-zinc-200/80 bg-zinc-50/70">
					<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 lg:py-28">
						<SectionHeading title="How It Works" />
						<ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{STEPS.map((step, i) => (
								<li key={step.title} className={`p-6 ${CARD}`}>
									<span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white tabular-nums">
										{i + 1}
									</span>
									<p className="mt-4 text-lg font-semibold tracking-[-0.015em] text-zinc-950">{step.title}</p>
									<p className="mt-2 text-pretty text-[15px]/6 text-zinc-600">{step.body}</p>
								</li>
							))}
						</ol>
					</div>
				</section>

				<section className="border-t border-zinc-200/80 bg-white">
					<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 lg:py-28">
						<SectionHeading title="Agency Plans" lede="Placeholder: tier names, contents and prices to be confirmed." />
						<div className="mt-12 grid gap-4 md:grid-cols-3">
							{PLACEHOLDER_TIERS.map((tier) => (
								<div
									key={tier}
									className="flex min-h-56 flex-col rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/60 p-6"
								>
									<p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">Placeholder</p>
									<p className="mt-3 text-lg font-semibold text-zinc-950">{tier}</p>
									<p className="mt-2 text-sm text-zinc-500">Contents and price to be confirmed.</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section id="book" className="scroll-mt-20 border-t border-zinc-200/80 bg-zinc-50/70">
					<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 lg:py-28">
						<SectionHeading
							title="Book a Call"
							lede="We'll look at what AI says about your business today and the work that would change it."
						/>
						<div className="mt-10">
							<Booking />
						</div>
					</div>
				</section>

				<Faq items={AGENCY_FAQS} />
			</main>
			<Footer />
		</div>
	);
}
