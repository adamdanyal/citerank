import { createFileRoute, Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD, PLANS } from "@workspace/config/plans";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Closing } from "@/components/citerank/home/closing";
import { Faq } from "@/components/citerank/home/faq";
import { SocialIcons } from "@/components/citerank/socials";
import { CARD, Container, QUIET_LINK, Reveal, RevealItem, SECONDARY_BUTTON, TEXT_LINK } from "@/components/citerank/ui";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { externalRel } from "@/lib/external-link";
import { ABOUT_FAQS } from "@/lib/faqs";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

const CONTACT_EMAIL = "team@citerank.com";

const title = "About CiteRank.com · AI Visibility Tracker and Agency";
const description =
	"CiteRank.com tracks brand visibility in AI search and runs an AI search agency. Founded by Adam and Julia Danyal. Company facts, team, pricing and contact.";

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

const { basic, pro, business } = PLANS;
const ENGINE_COUNT = 12;

/* Portraits are apps/www/public/founder-adam.jpg and founder-julia.jpg, 512px squares. */
const FOUNDERS = [
	{
		name: "Adam Danyal",
		role: "Co-founder",
		proof: "2M+ followers on LinkedIn",
		href: "https://www.linkedin.com/in/adamdanyal/",
		photo: "/founder-adam.jpg",
	},
	{
		name: "Julia Danyal",
		role: "Co-founder",
		proof: "360K+ followers on LinkedIn",
		photo: "/founder-julia.jpg",
	},
];

const NUMBERS = [
	{ value: String(ENGINE_COUNT), label: "AI apps tracked" },
	{ value: `${basic.standardRunsPerDay}×`, label: "checks a day, on every plan" },
	{ value: "2.3M+", label: "LinkedIn followers between the founders" },
	{ value: "London", label: "where the company is registered" },
];

const PRINCIPLES = [
	{
		title: "Every answer kept, word for word",
		body: "Open any score and read the answers behind it, with the pages they cited and the searches they ran.",
	},
	{
		title: `Public pricing from $${CLOUD_ENTRY_PRICE_USD} a month`,
		body: `Plans are listed at $${basic.monthlyPriceUsd}, $${pro.monthlyPriceUsd} and $${business.monthlyPriceUsd} a month. You sign up without a sales call.`,
	},
	{
		title: "Month to month",
		body: "No minimum term. Annual billing is optional and saves two months.",
	},
	{
		title: `Prompts checked ${basic.standardRunsPerDay} times a day`,
		body: "AI answers vary from run to run. More samples mean trends you can trust, not snapshots.",
	},
	{
		title: "The interfaces your buyers use",
		body: "ChatGPT, Google AI Mode and Perplexity are checked from the real interface, not approximated through an API.",
	},
	{
		title: "Unlimited seats, API and MCP",
		body: "Your whole team and your own tools get the data on every plan, with no per-seat fees.",
	},
];

const OFFERINGS = [
	{
		title: "AI Search Visibility Tracking",
		body: "Your buyers' questions across 12 AI apps, scored for how often you appear.",
	},
	{ title: "Citation Analysis", body: "The domains and pages each answer cites, and the web searches behind it." },
	{
		title: "Competitor Benchmarking",
		body: "Who AI recommends instead of you, and your share of voice on every engine.",
	},
	{
		title: "Ranked Next Steps",
		body: "About once a week: what to publish, update or get listed on, biggest win first.",
	},
	{
		title: "Self-Serve Plans",
		body: `From $${CLOUD_ENTRY_PRICE_USD} a month, with unlimited seats, a REST API and an MCP server.`,
	},
	{ title: "AI Search Agency", body: "We do the work the tracker ranks and report the AI answers before and after." },
];

const AUDIENCES = [
	"B2B SaaS marketing teams extending SEO to AI search",
	"E-commerce brands watching product recommendations in ChatGPT and AI Overviews",
	"SEO, AEO and GEO agencies managing several client brands",
	"Founders who want the agency to do the work",
	"Law, accounting and other firms whose clients ask AI who to hire",
	"Local and hospitality businesses checking how AI describes them",
];

const WORKING = [
	{ title: "Who You Work With", body: "The team behind the product, by email or a booked call." },
	{
		title: "Onboarding",
		body: "Sign up and add your website. The Prompt Wizard suggests your buyers' questions and tracking starts right away.",
	},
	{
		title: "Turnaround",
		body: "First results in minutes. Ranked next steps after a few days of data, refreshed weekly.",
	},
	{
		title: "Reporting",
		body: "Agency clients get a monthly report of every piece of work and the AI answers before and after.",
	},
];

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a href={href} target="_blank" rel={externalRel(href)} className={`${QUIET_LINK} text-zinc-950`}>
			{children}
		</a>
	);
}

function SectionHeading({ title, lede }: { title: string; lede?: string }) {
	return (
		<Reveal className="max-w-3xl">
			<h2 className="heading-2 text-zinc-950">{title}</h2>
			{lede ? <p className="body-8 mt-6 text-zinc-700">{lede}</p> : null}
		</Reveal>
	);
}

function LinkedInMark() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-current">
			<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
		</svg>
	);
}

function FounderCard({ founder, delay }: { founder: (typeof FOUNDERS)[number]; delay: number }) {
	const pill = "caption-1 mt-4 inline-flex w-fit items-center gap-2 rounded-md bg-blue-50 px-3 py-1 text-blue-800";
	return (
		<RevealItem delay={delay} className={`${CARD} overflow-hidden`}>
			<img
				src={founder.photo}
				alt={founder.name}
				width={512}
				height={512}
				loading="eager"
				className="aspect-square w-full object-cover"
			/>
			<div className="flex flex-col p-5">
				<h2 className="heading-6 text-zinc-950">{founder.name}</h2>
				<p className="body-6 mt-0.5 text-zinc-600">{founder.role}</p>
				{founder.href ? (
					<a href={founder.href} target="_blank" rel="noopener noreferrer" className={`${pill} hover:bg-blue-100`}>
						<LinkedInMark />
						{founder.proof}
					</a>
				) : (
					<p className={pill}>
						<LinkedInMark />
						{founder.proof}
					</p>
				)}
			</div>
		</RevealItem>
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
		{
			term: "Trade Marks",
			detail: (
				<>
					CiteRank (
					<ExternalLink href="https://trademarks.ipo.gov.uk/ipo-tmcase/page/Results/1/UK00004430998">
						UK00004430998
					</ExternalLink>
					) and CiteRank.com (
					<ExternalLink href="https://trademarks.ipo.gov.uk/ipo-tmcase/page/Results/1/UK00004399266">
						UK00004399266
					</ExternalLink>
					), registered UK trade marks of Danx Digital Limited
				</>
			),
		},
		{ term: "Website", detail: <ExternalLink href="https://citerank.com">citerank.com</ExternalLink> },
		{
			term: "Built On",
			detail: (
				<>
					<ExternalLink href="https://github.com/elmohq/elmo">Elmo</ExternalLink>, the open-source AI visibility
					tracker, which CiteRank.com hosts and extends with our in-house AI search agency
				</>
			),
		},
		{
			term: "Core Offering",
			detail:
				"Tracking how AI answer engines mention, cite and describe brands, with citation analysis and competitor share of voice",
		},
		{
			term: "Pricing",
			detail: `AI Visibility Tracker: Basic $${basic.monthlyPriceUsd}/mo, Pro $${pro.monthlyPriceUsd}/mo, Business $${business.monthlyPriceUsd}/mo, with unlimited seats on every plan. AI search agency and custom plans on request.`,
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
		{ term: "Contact Email", detail: <ExternalLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</ExternalLink> },
		{
			term: "Platforms Tracked",
			detail:
				"ChatGPT, Google AI Overviews, Google AI Mode, Gemini, Perplexity, Microsoft Copilot, Claude, Grok, Mistral, DeepSeek, Qwen, Kimi",
		},
		{ term: "Competitors", detail: "Profound, Peec AI, Otterly.AI, Scrunch, Semrush AI Toolkit" },
		{ term: "Social", detail: <SocialIcons linkClassName="text-zinc-500 hover:text-zinc-950" /> },
	];

	return (
		<div className="min-h-screen bg-white antialiased">
			<Navbar />
			<main>
				{/* An editorial opening rather than the homepage hero: the statement on the left, the founders on the right. */}
				<section className="-mt-16 bg-paper">
					<Container className="grid gap-12 pt-32 pb-20 lg:grid-cols-12 lg:items-center lg:gap-16 lg:pt-40 lg:pb-24">
						<div className="lg:col-span-6">
							<p className="caption-3 text-blue-800">About CiteRank.com</p>
							<h1 className="heading-2 mt-6 text-zinc-950">
								We Track What AI Says About Brands, Then Do the Work to Change It
							</h1>
							<p className="body-8 mt-6 text-zinc-600">
								CiteRank.com is the AI visibility tracker and AI search agency for AEO and GEO. We track how ChatGPT,
								Gemini, Perplexity and nine other AI apps describe brands, and our agency does the work that changes
								those answers.
							</p>
							<p className="body-6 mt-6 text-zinc-600">
								Cite is what an AI does when it names a source. Rank is where you stand against competitors in those
								answers. Hence the name.
							</p>
							<div className="mt-8 flex flex-wrap items-center gap-4">
								<Link to="/agency" className={SECONDARY_BUTTON}>
									Book an agency call
								</Link>
								<Link to="/pricing" className={TEXT_LINK}>
									See tracker plans
									<ArrowRight className="size-4" aria-hidden="true" />
								</Link>
							</div>
						</div>
						<div className="grid gap-5 sm:grid-cols-2 lg:col-span-6">
							{FOUNDERS.map((founder, index) => (
								<FounderCard key={founder.name} founder={founder} delay={index * 80} />
							))}
						</div>
					</Container>
				</section>

				<section className="border-zinc-200/80 border-y bg-white">
					<Container className="py-10 lg:py-12">
						<dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
							{NUMBERS.map((item, index) => (
								<RevealItem key={item.label} delay={index * 60} className="flex flex-col">
									<dd className="heading-3 order-1 text-zinc-950">{item.value}</dd>
									<dt className="caption-2 order-2 mt-2 text-zinc-600">{item.label}</dt>
								</RevealItem>
							))}
						</dl>
					</Container>
				</section>

				<section className="bg-paper">
					<Container className="py-20 lg:py-24">
						<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
							<div className="lg:col-span-4">
								<SectionHeading title="What We Believe" lede="Six things every plan is built on." />
							</div>
							<ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
								{PRINCIPLES.map((item, index) => (
									<RevealItem key={item.title} delay={index * 60} className="flex gap-5">
										<span className="caption-1 mt-1 font-mono text-blue-700 tabular-nums">
											{String(index + 1).padStart(2, "0")}
										</span>
										<div>
											<h3 className="title-1 text-zinc-950">{item.title}</h3>
											<p className="body-6 mt-2 text-zinc-600">{item.body}</p>
										</div>
									</RevealItem>
								))}
							</ol>
						</div>
					</Container>
				</section>

				<section className="bg-white">
					<Container className="py-20 lg:py-24">
						<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
							<div className="lg:col-span-4">
								<SectionHeading title="What CiteRank.com Does" />
								<Reveal delay={120} className="mt-6">
									<Link to="/features" className={TEXT_LINK}>
										See every feature
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								</Reveal>
							</div>
							<ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
								{OFFERINGS.map((item, index) => (
									<RevealItem key={item.title} delay={index * 60}>
										<h3 className="title-2 text-zinc-950">{item.title}</h3>
										<p className="body-6 mt-1 text-zinc-600">{item.body}</p>
									</RevealItem>
								))}
							</ul>
						</div>
					</Container>
				</section>

				<section className="bg-paper-2">
					<Container className="py-20 lg:py-24">
						<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
							<div className="lg:col-span-4">
								<SectionHeading title="Who It Is For" lede="Companies whose buyers ask AI who to choose." />
							</div>
							<ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
								{AUDIENCES.map((audience, index) => (
									<RevealItem key={audience} delay={index * 50} className={`${CARD} p-5 body-6 text-zinc-800`}>
										{audience}
									</RevealItem>
								))}
							</ul>
						</div>
					</Container>
				</section>

				<section className="bg-white">
					<Container className="py-20 lg:py-24">
						<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
							<div className="lg:col-span-4">
								<SectionHeading title="Working With Us" />
								<Reveal delay={120} className="mt-6">
									<a href={`mailto:${CONTACT_EMAIL}`} className={SECONDARY_BUTTON}>
										Email {CONTACT_EMAIL}
									</a>
								</Reveal>
							</div>
							<ul className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
								{WORKING.map((item, index) => (
									<RevealItem key={item.title} delay={index * 60} className={`${CARD} p-6`}>
										<h3 className="title-1 text-zinc-950">{item.title}</h3>
										<p className="body-6 mt-2 text-zinc-600">{item.body}</p>
									</RevealItem>
								))}
							</ul>
						</div>
					</Container>
				</section>

				<section className="bg-paper">
					<Container className="py-20 lg:py-24">
						<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
							<div className="lg:col-span-4">
								<SectionHeading title="Key Facts" lede="The company on one page, for people and for AI engines." />
							</div>
							<Reveal delay={100} className={`${CARD} divide-y divide-zinc-200/80 px-6 lg:col-span-8 lg:px-8`}>
								<dl>
									{keyFacts.map((fact) => (
										<div key={fact.term} className="grid gap-1 py-4 md:grid-cols-[11rem_1fr] md:gap-6">
											<dt className="title-4 text-zinc-950">{fact.term}</dt>
											<dd className="body-6 text-zinc-600">{fact.detail}</dd>
										</div>
									))}
								</dl>
							</Reveal>
						</div>
					</Container>
				</section>

				<Faq items={ABOUT_FAQS} />
				<Closing from="marketing-about" />
			</main>
			<Footer />
		</div>
	);
}
