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
	"CiteRank.com is an AEO and GEO platform for tracking brand visibility in AI search, plus an AI search agency, founded by Adam Danyal and Julia Danyal. Company facts, team, pricing, and how to reach us.";

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
		title: "AI Search Visibility Tracking",
		body: "CiteRank.com runs the prompts your buyers ask across ChatGPT, Google AI Overviews, Google AI Mode, Perplexity, Gemini, Copilot, Claude, and more on a schedule. Each prompt gets a visibility score for how often your brand appears, so you can see where you show up and where you don't.",
	},
	{
		title: "Citation Analysis",
		body: "Every answer is broken down into the domains and URLs the model cited and the web searches it ran to find them. That shows which pages answer engines trust in your category and where a mention would move your visibility.",
	},
	{
		title: "Competitor Benchmarking",
		body: "CiteRank.com records which competitors appear alongside you and calculates share of voice across every engine you track. You see who AI recommends instead of you, and on which questions.",
	},
	{
		title: "Self-Serve Plans",
		body: `Monthly tracker plans for teams that would rather skip the sales call, from $${CLOUD_ENTRY_PRICE_USD}/mo. Every plan includes unlimited seats plus REST API and MCP server access.`,
	},
	{
		title: "Ranked Next Steps",
		body: "About once a week, CiteRank.com ranks what to do next: a missing comparison page, a page AI no longer cites, a review site or best-of list that names competitors but not you, or a forum thread where buyers ask about your field.",
	},
	{
		title: "AI Search Agency",
		body: "A done-for-you service that does the work the tracker ranks, from new pages to articles on sites AI answer engines already cite. It runs monthly, with a report listing each piece of work and the prompt it targets.",
	},
];

const principles = [
	{
		title: "Every Answer Kept, Word for Word",
		body: "Each number traces back to the words an AI wrote, so you can open any score and read the answers behind it. Every answer is stored in full, along with the pages it cited and the web searches it ran before answering, so nothing is lost to a summary.",
	},
	{
		title: `Public, Self-Serve Pricing From $${CLOUD_ENTRY_PRICE_USD}/mo`,
		body: `CiteRank.com plans are listed publicly at $${starter.monthlyPriceUsd}, $${basic.monthlyPriceUsd}, $${pro.monthlyPriceUsd}, and $${business.monthlyPriceUsd} a month, and you can sign up without a sales call. Profound has no public entry tier and quotes its Enterprise plan through sales.`,
	},
	{
		title: "Month-to-Month Billing",
		body: "CiteRank.com bills month to month with no minimum term, and annual billing is optional and saves two months. Many enterprise AEO platforms push you into an annual contract before you can see your data.",
	},
	{
		title: `Prompts Checked ${basic.standardRunsPerDay}× a Day`,
		body: `From the $${basic.monthlyPriceUsd}/mo Basic plan, every prompt runs ${basic.standardRunsPerDay} times a day on each platform you track, and Starter checks ChatGPT once a day. AI answers vary from run to run, so more samples means trends you can trust instead of one-off snapshots.`,
	},
	{
		title: "The Same Interfaces Your Buyers Use",
		body: "Consumer products like ChatGPT, Google AI Mode, and Perplexity are scraped from the same interface your buyers use. API-only tools measure a different model configuration than the one people see.",
	},
	{
		title: "Unlimited Seats, API, and MCP on Every Plan",
		body: "Every CiteRank.com plan includes unlimited team members, the REST API, and an MCP server for Claude Code, Cursor, and other AI assistants. Your whole team and your own tools get the data without per-seat fees or an enterprise upgrade.",
	},
];

const audiences = [
	"In-house SEO and content marketing teams at B2B SaaS companies extending their SEO strategy to AI search",
	"E-commerce and DTC brands monitoring product recommendations in ChatGPT and Google AI Overviews",
	"SEO, AEO, and GEO agencies managing AI visibility for multiple client brands, including shareable reports",
	"Founders and marketing leads who want the AI search agency to do the work",
	"Professional services firms, such as law and accounting firms, whose clients ask ChatGPT and Gemini who to hire",
	"Local and hospitality businesses checking how AI assistants describe and recommend them",
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
				"AI visibility tracker and AI search agency for answer engine optimization (AEO), generative engine optimization (GEO), and AI SEO",
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
			term: "Core Offering",
			detail:
				"Tracking how AI answer engines mention, cite, and describe brands, with citation analysis and competitor share of voice",
		},
		{
			term: "Pricing",
			detail: `AI Visibility Tracker: Starter $${starter.monthlyPriceUsd}/mo, Basic $${basic.monthlyPriceUsd}/mo, Pro $${pro.monthlyPriceUsd}/mo, Business $${business.monthlyPriceUsd}/mo, with unlimited seats on every plan. AI search agency and custom plans on request.`,
		},
		{
			term: "Contract Terms",
			detail: "Month to month, cancel any time; optional annual billing that saves two months",
		},
		{
			term: "Services",
			detail:
				"AI visibility tracking, citation analysis, competitor benchmarking, ranked next steps, AI search agency work with a monthly report, REST API and MCP server",
		},
		{
			term: "Contact Email",
			detail: <ExternalLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</ExternalLink>,
		},
		{
			term: "Platforms Tracked",
			detail:
				"ChatGPT, Google AI Overviews, Google AI Mode, Gemini, Perplexity, Microsoft Copilot, Claude, Grok, Mistral, DeepSeek, Qwen, Kimi",
		},
		{ term: "Competitors", detail: "Profound, Peec AI, Otterly.AI, Scrunch, Semrush AI Toolkit" },
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
								CiteRank.com is an AI visibility tracker and AI search agency for answer engine optimization (AEO). It
								tracks how ChatGPT, Google AI Overviews, Perplexity, Gemini, Claude, and other AI answer engines
								mention, cite, and describe brands, for marketing teams, agencies, and software companies.
							</p>
							<p className="mt-4 max-w-2xl text-lg text-pretty text-zinc-600">
								Teams use CiteRank.com for{" "}
								<Link
									to="/answer-engine-optimization"
									className="font-medium text-blue-600 underline-offset-4 hover:underline"
								>
									answer engine optimization (AEO)
								</Link>
								, also called{" "}
								<Link
									to="/generative-engine-optimization"
									className="font-medium text-blue-600 underline-offset-4 hover:underline"
								>
									generative engine optimization (GEO)
								</Link>{" "}
								or AI SEO: measuring and improving how their brand shows up in AI search.
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
						Founders and marketing leads at companies whose buyers ask AI who to choose.
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

				<Section heading="How CiteRank.com Works">
					<div className="grid gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 md:grid-cols-2">
						<div className="bg-white p-6">
							<h3 className="text-lg font-semibold tracking-tight text-zinc-950">Who You Work With</h3>
							<p className="mt-2 text-sm leading-relaxed text-zinc-600">
								You work directly with the team behind CiteRank.com, by email or a booked call. Questions about your
								setup, data, or results are answered by people who know the product inside out.
							</p>
						</div>
						<div className="bg-white p-6">
							<h3 className="text-lg font-semibold tracking-tight text-zinc-950">Communication Channels</h3>
							<p className="mt-2 text-sm leading-relaxed text-zinc-600">
								Email at{" "}
								<a
									href={`mailto:${CONTACT_EMAIL}`}
									className="font-medium text-blue-600 underline-offset-4 hover:underline"
								>
									{CONTACT_EMAIL}
								</a>
								,{" "}
								<Link to="/agency" className="font-medium text-blue-600 underline-offset-4 hover:underline">
									a booked call
								</Link>
								, and the{" "}
								<ExternalLink href="https://www.linkedin.com/company/citerank">LinkedIn community</ExternalLink>. Agency
								clients also get a monthly report of every piece of work, the prompt it targets, and the AI answers
								before and after.
							</p>
						</div>
						<div className="bg-white p-6">
							<h3 className="text-lg font-semibold tracking-tight text-zinc-950">Onboarding</h3>
							<p className="mt-2 text-sm leading-relaxed text-zinc-600">
								Sign up for CiteRank.com and add your website. The Prompt Wizard suggests the questions your buyers ask
								based on your products and competitors, and tracking starts right away. No demo or sales call required.
							</p>
						</div>
						<div className="bg-white p-6">
							<h3 className="text-lg font-semibold tracking-tight text-zinc-950">Turnaround</h3>
							<p className="mt-2 text-sm leading-relaxed text-zinc-600">
								The first check starts right away, and results usually appear within a few minutes. The ranked list of
								what to do next needs a few days of data, then refreshes weekly, and agency work runs every month.
							</p>
						</div>
					</div>
				</Section>

				<Faq items={ABOUT_FAQS} />

				<section className="border-y border-zinc-200 bg-white py-16 lg:py-24">
					<div className="mx-auto max-w-6xl px-4 text-center md:px-6">
						<h2 className="font-heading text-3xl text-zinc-950 md:text-4xl">See How AI Talks About Your Brand</h2>
						<p className="mx-auto mt-4 max-w-xl text-lg text-balance text-zinc-600">
							Start on CiteRank.com from ${CLOUD_ENTRY_PRICE_USD}/mo, month to month, or have our AI search agency do
							the work.
						</p>
						<div className="mt-8 flex flex-wrap justify-center gap-3">
							<a href={SIGN_UP_URL} className={buttonVariants({ size: "sm" })}>
								Start Tracking
								<ArrowRight className="size-3.5" />
							</a>
							<Link to="/agency" className={buttonVariants({ variant: "outline", size: "sm" })}>
								Book a Call
							</Link>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
