import { createFileRoute } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD, PLANS } from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Footer } from "@/components/footer";
import { Closing } from "@/components/home/closing";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { ModelCoverage } from "@/components/home/models";
import { Pricing } from "@/components/home/pricing";
import { HOME_FONT_CLASS, HomeStyles } from "@/components/home/styles";
import { CARD, SectionHeading } from "@/components/home/ui";
import { Navbar } from "@/components/navbar";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const PATH = "/aeo-for/profound-users";
const TITLE = "The Simpler Profound Alternative";
const META_TITLE = "Profound Alternative: Simpler, Self-Serve AI Visibility · CiteRank.com";
const META_DESCRIPTION = `Switching from Profound? CiteRank.com tracks your brand in ChatGPT, Perplexity, Gemini and AI Overviews up to 4× daily, with no sales call, no credit packs, and API access on every plan. From $${CLOUD_ENTRY_PRICE_USD}/mo.`;
const FROM = "marketing-profound-users-hero";

const BUTTON =
	"inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-[15px] font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

const RECOMMENDED = PLANS.pro;
const FOUR_TIMES_DAILY_FROM = PLANS.basic;

const REASONS = [
	{
		name: "No Bloat",
		text: "Profound grew into a suite: content generation, shopping tracking, crawler analytics. CiteRank.com's tracker does one job, AI visibility, and every screen is about it.",
	},
	{
		name: "Not Complicated",
		text: "Are we showing up, who is beating us, what changed, and what to fix. Every view answers one of those in seconds, so checking in daily is not a chore.",
	},
	{
		name: "More Data for the Price",
		text: `From the $${FOUR_TIMES_DAILY_FROM.monthlyPriceUsd}/mo ${FOUR_TIMES_DAILY_FROM.name} plan, CiteRank.com asks every prompt ${FOUR_TIMES_DAILY_FROM.standardRunsPerDay}× a day. AI answers vary run to run, so more samples means numbers you can trust.`,
	},
	{
		name: "Fully Self-Serve",
		text: "Pick a plan, pay by card, and start tracking. There is no demo to book, no procurement cycle, and no sales rep between you and your data.",
	},
	{
		name: "No Paywall Maze",
		text: "No credit packs to top up and no API held back for Enterprise. Each plan is a number of brands, prompts, and platforms, and the rest of the product comes with it.",
	},
	{
		name: "An Agency That Does the Work",
		text: "When you want the work done for you, CiteRank.com's AI search agency writes the missing comparison pages, gets you onto the review sites AI cites, and reports the AI answers before and after each month.",
	},
];

// What tryprofound.com/pricing listed as of October 2026: a 7-day trial, then Enterprise through sales.
const COMPARISON: { label: string; ours: string; profound: string; profoundHas?: boolean }[] = [
	{
		label: "Getting Started",
		ours: `Sign up and pay by card, from $${CLOUD_ENTRY_PRICE_USD}/mo`,
		profound: "7-day trial, then a call with sales",
	},
	{ label: "Published Pricing", ours: "Every plan, on the pricing page", profound: "Enterprise is custom-quoted" },
	{
		label: "How Often Answers Are Checked",
		ours: `Up to ${FOUR_TIMES_DAILY_FROM.standardRunsPerDay}× daily`,
		profound: "Daily",
		profoundHas: true,
	},
	{ label: "API and MCP Access", ours: "Every plan", profound: "API on Enterprise only" },
	{
		label: "Usage Credits",
		ours: "None. Plans are priced by prompts and platforms",
		profound: "Credit allotments, more via sales",
	},
	{ label: "Unlimited Seats", ours: "Every plan", profound: "Yes", profoundHas: true },
];

const STEPS = [
	{
		name: "Create an Account",
		text: "Sign up and choose a plan. No call, no contract, cancel any time.",
	},
	{
		name: "Paste Your Prompt List",
		text: "Copy the prompts you track in Profound and paste them in, one per line. Duplicates are skipped for you.",
	},
	{
		name: "Add Your Competitors",
		text: "Name the rivals you benchmark against, and CiteRank.com tracks their share of voice and citations next to yours.",
	},
];

const FAQS = [
	{
		question: "Do I need to talk to sales to use CiteRank.com?",
		answer: `No. Every CiteRank.com plan is self-serve: sign up, pay by card, and start tracking. Plans start at $${CLOUD_ENTRY_PRICE_USD}/mo, and you can change or cancel from the billing page. Calls are only for the AI search agency, which is a separate service.`,
	},
	{
		question: "Can I bring my prompts over from Profound?",
		answer:
			"Yes. Paste your existing prompt list into CiteRank.com, one prompt per line, and it is tracked from then on. Your Profound history stays in Profound, so you may want to run both for a short overlap before cancelling.",
	},
	{
		question: "Is CiteRank.com's data comparable to Profound's?",
		answer: `Both track how AI engines answer your buyers' prompts. CiteRank.com checks each prompt up to ${FOUR_TIMES_DAILY_FROM.standardRunsPerDay}× a day rather than once, which smooths out the run-to-run variation in AI answers, and keeps every answer in full, so each number traces back to the words an AI wrote.`,
	},
	{
		question: "Which CiteRank.com plan matches a Profound setup?",
		answer: `We recommend ${RECOMMENDED.name} for teams coming from Profound: ${RECOMMENDED.maxPrompts} prompts across ${RECOMMENDED.platformPicks} AI platforms, checked ${RECOMMENDED.standardRunsPerDay}× daily, with premium grounded models included, for $${RECOMMENDED.monthlyPriceUsd}/mo. Larger programs can step up to ${PLANS.business.name}, which adds more prompts and brands.`,
	},
	{
		question: "Can CiteRank.com do the work as well as track it?",
		answer:
			"Yes. CiteRank.com's AI search agency does the work every month for businesses that want it done. It writes the comparison and alternatives pages your site is missing, updates pages AI has stopped citing, gets you onto the review sites and best-of lists AI cites, and answers buyers' questions in forums. Each month's report lists every piece of work, the question it targets, and the AI answers before and after.",
		links: [{ text: "AI search agency", href: "/agency" }],
	},
];

export const Route = createFileRoute("/aeo-for/profound-users")({
	head: () => ({
		meta: [
			{ title: META_TITLE },
			{ name: "description", content: META_DESCRIPTION },
			...ogMeta({ title: META_TITLE, description: META_DESCRIPTION, path: PATH }),
		],
		links: [{ rel: "canonical", href: canonicalUrl(PATH) }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AEO by industry", path: "/aeo-for" },
				{ name: TITLE, path: PATH },
			]),
			faqJsonLd(FAQS),
		],
	}),
	component: ProfoundUsersPage,
});

function Badge() {
	return (
		<span className="inline-flex h-7 items-center gap-2 rounded-full bg-white/80 px-3 text-xs font-medium text-zinc-600 shadow-sm ring-1 ring-zinc-200">
			<span className="size-1.5 rounded-full bg-blue-600" />
			For Profound users
		</span>
	);
}

function Reasons() {
	const signupUrl = cloudSignupUrl(FROM);
	return (
		<section className="border-t border-zinc-200/80 bg-zinc-50/70">
			<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 lg:py-28">
				<SectionHeading
					title="Everything You Check in Profound, Without the Rest"
					lede="Switch to CiteRank.com when the tool you bought for a weekly visibility number turns into a suite, a sales process, and a credit balance."
				/>
				<ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{REASONS.map((r) => (
						<li key={r.name} className={`p-6 ${CARD}`}>
							<p className="text-lg font-semibold tracking-[-0.015em] text-zinc-950">{r.name}</p>
							<p className="mt-2 text-pretty text-[15px]/6 text-zinc-600">{r.text}</p>
						</li>
					))}
					<li className="flex flex-col justify-between gap-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white md:col-span-2 md:flex-row md:items-center lg:col-span-3">
						<div>
							<p className="text-lg font-semibold tracking-[-0.015em]">Try It on Your Own Brand</p>
							<p className="mt-2 text-pretty text-[15px]/6 text-blue-50">
								Plans start at ${CLOUD_ENTRY_PRICE_USD}/mo. You can be tracking your Profound prompt set in minutes.
							</p>
						</div>
						<a
							href={signupUrl}
							className={`${BUTTON} shrink-0 self-start bg-white text-blue-700 hover:bg-blue-50 md:self-center`}
						>
							Start Tracking
							<ArrowRight className="size-4" aria-hidden="true" />
						</a>
					</li>
				</ul>
			</div>
		</section>
	);
}

function Comparison() {
	return (
		<section className="border-t border-zinc-200/80 bg-white">
			<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 lg:py-28">
				<SectionHeading
					title="CiteRank.com and Profound, Side by Side"
					lede="How the two compare on the things that decide what you pay and how quickly you get going."
				/>
				<div className={`mt-12 overflow-x-auto ${CARD}`}>
					<table className="w-full min-w-[40rem] text-left text-[15px]">
						<thead>
							<tr className="border-b border-zinc-100 text-[13px] font-medium text-zinc-500">
								<th scope="col" className="px-6 py-4 font-medium">
									<span className="sr-only">Feature</span>
								</th>
								<th scope="col" className="px-6 py-4 font-semibold text-blue-600">
									CiteRank.com
								</th>
								<th scope="col" className="px-6 py-4 font-medium">
									Profound
								</th>
							</tr>
						</thead>
						<tbody>
							{COMPARISON.map((row) => (
								<tr key={row.label} className="border-b border-zinc-100 last:border-0">
									<th scope="row" className="px-6 py-4 font-medium text-zinc-950">
										{row.label}
									</th>
									<td className="px-6 py-4 text-zinc-900">
										<span className="flex items-start gap-2">
											<Check className="mt-0.5 size-4 shrink-0 text-blue-600" strokeWidth={2.5} aria-hidden="true" />
											{row.ours}
										</span>
									</td>
									<td className="px-6 py-4 text-zinc-600">
										<span className="flex items-start gap-2">
											{row.profoundHas ? (
												<Check className="mt-0.5 size-4 shrink-0 text-zinc-400" strokeWidth={2.5} aria-hidden="true" />
											) : (
												<Minus className="mt-0.5 size-4 shrink-0 text-zinc-300" strokeWidth={2.5} aria-hidden="true" />
											)}
											{row.profound}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<p className="mt-4 text-[13px] text-zinc-500">
					Profound details are from its public pricing page as of October 2026 and may have changed since.
				</p>
			</div>
		</section>
	);
}

function Switching() {
	const signupUrl = cloudSignupUrl(FROM);
	return (
		<section className="border-t border-zinc-200/80 bg-zinc-50/70">
			<div className="mx-auto max-w-6xl px-4 py-20 md:px-6 lg:py-28">
				<SectionHeading
					title="Switch in an Afternoon"
					lede={`Bring the prompts you already track, and CiteRank.com starts checking them up to ${FOUR_TIMES_DAILY_FROM.standardRunsPerDay}× a day across the engines you pick.`}
				/>
				<ol className="mt-12 grid gap-4 md:grid-cols-3">
					{STEPS.map((step, i) => (
						<li key={step.name} className={`p-6 ${CARD}`}>
							<p className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.015em] text-zinc-950">
								<span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white tabular-nums">
									{i + 1}
								</span>
								{step.name}
							</p>
							<p className="mt-2 text-pretty text-[15px]/6 text-zinc-600">{step.text}</p>
						</li>
					))}
				</ol>
				<div className="mt-8 flex flex-col gap-3 sm:flex-row">
					<a href={signupUrl} className={`${BUTTON} bg-blue-600 text-white hover:bg-blue-700`}>
						Start Tracking
						<ArrowRight className="size-4" aria-hidden="true" />
					</a>
				</div>
			</div>
		</section>
	);
}

function ProfoundUsersPage() {
	return (
		<div className={`${HOME_FONT_CLASS} min-h-screen bg-white antialiased`}>
			<HomeStyles />
			<Navbar />
			<main>
				<Hero
					badge={<Badge />}
					title={TITLE}
					lede={`Everything you check in Profound, sampled up to ${FOUR_TIMES_DAILY_FROM.standardRunsPerDay}× as often, at a price you can see and pay by card today. No sales call, no credit packs, and nothing held back for Enterprise.`}
					from={FROM}
				/>
				<Reasons />
				<Comparison />
				<Switching />
				<ModelCoverage />
				<Pricing
					lede={`We recommend ${RECOMMENDED.name} for teams coming from Profound: ${RECOMMENDED.maxPrompts} prompts across ${RECOMMENDED.platformPicks} AI platforms, checked ${RECOMMENDED.standardRunsPerDay}× daily, for $${RECOMMENDED.monthlyPriceUsd}/mo. Unlimited seats on every plan.`}
					recommended={{ plan: RECOMMENDED.key, label: "Best for Profound users" }}
				/>
				<Faq items={FAQS} />
				<Closing from="marketing-profound-users-closing" />
			</main>
			<Footer />
		</div>
	);
}
