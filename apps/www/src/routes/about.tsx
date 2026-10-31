import { createFileRoute, Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD, PLANS } from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { buttonVariants } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Faq } from "@/components/home/faq";
import { Navbar } from "@/components/navbar";
import { externalRel } from "@/lib/external-link";
import { ABOUT_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const SIGN_UP_URL = cloudSignupUrl("marketing-about");
const CONTACT_EMAIL = "team@citerank.com";

const title = "About CiteRank.com · AI Visibility Tracker and Agency";
const description =
	"CiteRank.com is an AI visibility tracker and AI search agency for AEO and GEO, founded by Adam Danyal and Julia Danyal. Company facts, what we do, who it is for, pricing and how to reach us.";

export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [{ title }, { name: "description", content: description }, ...ogMeta({ title, description, path: "/about" })],
		links: [{ rel: "canonical", href: canonicalUrl("/about") }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "About", path: "/about" },
			]),
			faqJsonLd(ABOUT_FAQS),
		],
	}),
	component: AboutPage,
});

const { starter, basic, pro, business } = PLANS;

const SOCIAL_LINKS = [
	{ label: "LinkedIn", href: "https://www.linkedin.com/company/citerank" },
	{ label: "YouTube", href: "https://www.youtube.com/@citerank" },
	{ label: "X", href: "https://x.com/tryciterank" },
];

const offerings = [
	{
		title: "The AI Visibility Tracker",
		body: "Puts your buyers' questions to ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, DeepSeek, Mistral, Qwen, Kimi, Google AI Overviews and Google AI Mode, up to four times a day, and keeps every answer in full. CiteRank.com suggests the questions from your website, and you can add or edit them at any time.",
	},
	{
		title: "What the Answers Show",
		body: "How often you are named for each question and each AI, your share of voice against each competitor, how each answer describes you, your position among the brands named, the pages each answer cites, and the web searches an AI ran first.",
	},
	{
		title: "What to Do Next, Ranked",
		body: "About once a week: a missing comparison page, a page AI no longer cites, a review site or best-of list that names competitors but not you, or a forum thread where buyers ask about your field.",
	},
	{
		title: "AI Search Agency",
		body: "Does that work every month: new comparison and guide pages, updates to pages AI stopped citing, review sites, best-of lists, forum answers, guest articles and crawler fixes.",
	},
	{
		title: "A Monthly Report",
		body: "Agency clients get a report each month. It lists every piece of work we did that month, the buyer question each piece targets, and what the AI answers to that question said before the work and after it went live.",
	},
	{
		title: "API and MCP",
		body: "A REST API and an MCP server on every tracker plan, so your own reports and AI assistants such as Claude Code and Cursor can read the data. Pull visibility, share of voice, citations and opportunities, or edit prompts, from your own tools.",
	},
];

const principles = [
	{
		title: "Every Answer Kept, Word for Word",
		body: "Each number traces back to the words an AI wrote, so you can open any score and read the answers behind it. Every answer is stored in full, along with the pages it cited and the web searches it ran before answering, so nothing is lost to a summary.",
	},
	{
		title: `Public, Self-Serve Pricing From $${CLOUD_ENTRY_PRICE_USD}/mo`,
		body: "Tracker prices are published on the pricing page, so you know the cost before you talk to anyone. Sign up, pick a plan and start tracking the same day, with no sales call, demo or quote to wait for.",
	},
	{
		title: "Month-to-Month Billing",
		body: "The tracker bills month to month with no minimum term, and you can cancel any time. Yearly billing is optional and saves two months, so you can see your data first and commit for longer later.",
	},
	{
		title: `Questions Asked ${basic.standardRunsPerDay}× a Day`,
		body: `From the Basic plan up, every question runs ${basic.standardRunsPerDay} times a day in each AI app you choose. AI answers change from one run to the next, so more runs give you trends you can rely on instead of one-off snapshots.`,
	},
	{
		title: "Answers From the Apps Your Buyers Use",
		body: "ChatGPT, Gemini, Perplexity, Copilot, Google AI Overviews and Google AI Mode are read from the same interface people use, so you see the answers your buyers see. The other AI apps are asked directly.",
	},
	{
		title: "Unlimited Seats, API and MCP on Every Plan",
		body: "Every tracker plan includes unlimited team members, the REST API and an MCP server for Claude Code, Cursor and other AI assistants. Your whole team and your own tools get the data, with no per-seat fees and no upgrade needed.",
	},
];

const audiences = [
	"In-house marketing and SEO teams at software companies whose buyers ask ChatGPT which tool to choose",
	"Professional services firms, such as law and accounting firms, whose clients ask AI who to hire",
	"Marketing and SEO agencies tracking AI answers for their own brand and for each of their clients' brands",
	"Founders and marketing leads who want the AI search agency to do the work",
];

function Section({ heading, tinted, children }: { heading: string; tinted?: boolean; children: ReactNode }) {
	return (
		<section className={`border-b border-zinc-200 py-12 lg:py-20 ${tinted ? "bg-zinc-50" : "bg-white"}`}>
			<div className="mx-auto max-w-6xl px-4 md:px-6">
				<h2 className="font-heading max-w-3xl text-3xl text-zinc-950 md:text-4xl">{heading}</h2>
				<div className="mt-8">{children}</div>
			</div>
		</section>
	);
}

function CardGrid({ items, tinted }: { items: { title: string; body: string }[]; tinted?: boolean }) {
	return (
		<div className="grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 md:grid-cols-2 lg:grid-cols-3">
			{items.map((item) => (
				<div key={item.title} className={`p-6 ${tinted ? "bg-zinc-50" : "bg-white"}`}>
					<h3 className="text-lg font-semibold tracking-tight text-zinc-950">{item.title}</h3>
					<p className="mt-2 text-pretty text-sm leading-relaxed text-zinc-600">{item.body}</p>
				</div>
			))}
		</div>
	);
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a
			href={href}
			target="_blank"
			rel={externalRel(href)}
			className="font-medium text-blue-600 underline-offset-4 hover:underline"
		>
			{children}
		</a>
	);
}

function LinkList({ links }: { links: { label: string; href: string }[] }) {
	return (
		<>
			{links.map((link, i) => (
				<span key={link.href}>
					{i > 0 ? <span className="text-zinc-300"> · </span> : null}
					<ExternalLink href={link.href}>{link.label}</ExternalLink>
				</span>
			))}
		</>
	);
}

function AboutPage() {
	const keyFacts: { term: string; detail: ReactNode }[] = [
		{ term: "Company Name", detail: "CiteRank.com, a trading name of Danx Digital Limited" },
		{
			term: "Type",
			detail:
				"AI visibility tracker and AI search agency for answer engine optimization (AEO), generative engine optimization (GEO) and AI SEO",
		},
		{ term: "Founders", detail: "Adam Danyal and Julia Danyal" },
		{
			term: "Registered Company",
			detail: "Danx Digital Limited, registered in the United Kingdom, company number 13275434",
		},
		{ term: "Registered Address", detail: "86-90 Paul Street, London EC2A 4NE, United Kingdom" },
		{ term: "Trade Mark", detail: "CiteRank.com, UK registered trade mark UK00004399266" },
		{ term: "Website", detail: <ExternalLink href="https://citerank.com">citerank.com</ExternalLink> },
		{
			term: "AI Visibility Tracker",
			detail:
				"Shows how often 12 AI apps name a business, how they describe it, which pages they cite, and what to do next",
		},
		{
			term: "AI Search Agency",
			detail:
				"Does the work the tracker ranks, every month, with a monthly report of every piece of work and the AI answers before and after",
		},
		{
			term: "Pricing",
			detail: `AI Visibility Tracker: Starter $${starter.monthlyPriceUsd}/mo, Basic $${basic.monthlyPriceUsd}/mo, Pro $${pro.monthlyPriceUsd}/mo, Business $${business.monthlyPriceUsd}/mo, with unlimited seats on every plan. AI search agency and custom plans on request.`,
		},
		{
			term: "Contract Terms",
			detail: "Month to month, cancel any time; yearly billing is optional and saves two months",
		},
		{
			term: "AI Apps Tracked",
			detail:
				"ChatGPT, Claude, Gemini, Perplexity, Copilot, Grok, DeepSeek, Mistral, Qwen, Kimi, Google AI Overviews and Google AI Mode",
		},
		{
			term: "Contact Email",
			detail: <ExternalLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</ExternalLink>,
		},
		{ term: "Social", detail: <LinkList links={SOCIAL_LINKS} /> },
	];

	return (
		<div className="min-h-screen">
			<Navbar />
			<main>
				<section className="relative overflow-hidden border-b border-zinc-200 bg-white py-16 lg:py-28">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(0_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
					/>
					<div className="relative mx-auto max-w-6xl px-4 md:px-6">
						<div className="max-w-3xl">
							<h1 className="font-heading text-4xl text-balance text-zinc-950 md:text-5xl lg:text-6xl">
								About CiteRank.com
							</h1>
							<p className="mt-6 max-w-2xl text-lg text-pretty text-zinc-600 md:text-xl">
								CiteRank.com shows businesses what AI says about them, and gets them named in the answer. Its AI
								Visibility Tracker shows how often ChatGPT, Gemini and other AI apps name a business and what to change.
								Its AI search agency makes the changes for those who would rather hand the work over.
							</p>
							<p className="mt-4 max-w-2xl text-lg text-pretty text-zinc-600">
								The name CiteRank.com joins two words: cite, what an AI does when it names a source in an answer, and
								rank, where a business stands against its competitors in those answers.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<a href={SIGN_UP_URL} className={buttonVariants({ size: "lg" })}>
									Start Tracking
									<ArrowRight className="size-4" />
								</a>
								<Link to="/agency" className={buttonVariants({ size: "lg", variant: "outline" })}>
									Book an Agency Call
								</Link>
							</div>
						</div>
					</div>
				</section>

				<Section heading="Key Facts About CiteRank.com" tinted>
					<dl className="divide-y divide-zinc-200 overflow-hidden rounded-lg border border-zinc-200 bg-white">
						{keyFacts.map((fact) => (
							<div key={fact.term} className="grid gap-1 px-5 py-4 md:grid-cols-[14rem_1fr] md:gap-6">
								<dt className="text-sm font-semibold text-zinc-950">{fact.term}</dt>
								<dd className="text-sm leading-relaxed text-zinc-600">{fact.detail}</dd>
							</div>
						))}
					</dl>
				</Section>

				<Section heading="What CiteRank.com Does">
					<CardGrid items={offerings} />
				</Section>

				<Section heading="What Makes CiteRank.com Different" tinted>
					<CardGrid items={principles} tinted />
				</Section>

				<Section heading="Who CiteRank.com Is For">
					<p className="max-w-3xl text-pretty text-zinc-600">
						Founders and marketing leads at B2B companies whose buyers ask AI who to choose.
					</p>
					<ul className="mt-6 grid gap-3 md:grid-cols-2">
						{audiences.map((audience) => (
							<li key={audience} className="rounded-lg border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
								{audience}
							</li>
						))}
					</ul>
				</Section>

				<Section heading="Founders" tinted>
					<div className="max-w-3xl space-y-4 text-pretty text-zinc-600">
						<p>
							CiteRank.com was founded by{" "}
							<ExternalLink href="https://www.linkedin.com/in/adamdanyal/">Adam Danyal</ExternalLink>, who has more than
							2 million LinkedIn followers, and Julia Danyal, who has more than 360,000.
						</p>
						<p>
							They also run Chief AI Leader, an exam-based AI certification for leaders, and AI For Leaders, a daily AI
							newsletter read by more than 50,000 leaders.
						</p>
					</div>
				</Section>

				<Faq items={ABOUT_FAQS} />
			</main>
			<Footer />
		</div>
	);
}
