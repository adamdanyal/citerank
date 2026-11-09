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
import { aboutPageJsonLd, breadcrumbJsonLd, canonicalUrl, faqJsonLd, ogMeta } from "@/lib/seo";

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
			aboutPageJsonLd({
				path: "/about",
				founders: FOUNDERS.map((founder) => ({
					name: founder.name,
					jobTitle: founder.role,
					image: founder.photo,
					sameAs: founder.href ? [founder.href] : undefined,
				})),
			}),
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
		proof: "2M+ followers",
		href: "https://www.linkedin.com/in/adamdanyal/",
		photo: "/founder-adam.jpg",
	},
	{
		name: "Julia Danyal",
		role: "Co-founder",
		proof: "360K+ followers",
		photo: "/founder-julia.jpg",
	},
];

const NUMBERS = [
	{ value: String(ENGINE_COUNT), label: "AI apps tracked" },
	{ value: `${basic.standardRunsPerDay}×`, label: "checks a day, on every plan" },
	{ value: "2.3M+", label: "LinkedIn followers between the founders" },
	{ value: "London", label: "where the company is registered" },
];

/* Written in the founders' voice; every claim is also in the key facts or the FAQ below. */
const STORY = [
	"When a buyer asks ChatGPT, Gemini or Perplexity who to choose, the answer names a few brands and cites a few pages. If you cannot say whether yours is one of them, that is the gap we started CiteRank.com to close.",
	"We are Adam and Julia Danyal. We have more than 2.3 million LinkedIn followers between us, run Chief AI Leader, an exam-based AI certification for leaders, and write AI For Leaders, a daily newsletter read by more than 50,000 leaders. CiteRank.com is our product. It shows what AI says about your brand, and our agency does the work the tracker ranks, every month.",
	`The tracker is built on Elmo, the open-source AI visibility tracker, which we host and extend. It asks your buyers' questions across ${ENGINE_COUNT} AI apps, ${basic.standardRunsPerDay} times a day, and keeps every answer word for word, so any score can be traced to the exact responses behind it. Plans start at $${CLOUD_ENTRY_PRICE_USD} a month, run month to month, and include your whole team, the API and the MCP server.`,
	"Tracking alone does not change an answer, so we also run the agency. Each month we write the pages your site is missing, update the ones AI stopped citing, pitch you to the review sites and lists it cites, answer buyers in forums, and report the AI answers before and after.",
	"It is for any company whose buyers ask AI who to choose: B2B software, e-commerce, agencies with several client brands, law and accounting firms, local and hospitality businesses. Sign up, add your website, and the Prompt Wizard suggests your buyers' questions so tracking starts right away. For the agency, book a call.",
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
	const pill =
		"caption-1 mt-4 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-md bg-blue-50 px-3 py-1 text-blue-800";
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
			<div className="flex flex-col p-4 sm:p-5">
				<p className="heading-6 text-zinc-950">{founder.name}</p>
				<p className="body-6 mt-0.5 text-zinc-600">{founder.role}</p>
				{founder.href ? (
					<a href={founder.href} target="_blank" rel="noopener noreferrer" className={`${pill} hover:bg-blue-100`}>
						<LinkedInMark />
						{founder.proof}
						<span className="sr-only"> on LinkedIn</span>
					</a>
				) : (
					<p className={pill}>
						<LinkedInMark />
						{founder.proof}
						<span className="sr-only"> on LinkedIn</span>
					</p>
				)}
			</div>
		</RevealItem>
	);
}

function AboutPage() {
	const keyFacts: { term: string; detail: ReactNode }[] = [
		{ term: "Company name", detail: "CiteRank.com, a trading name of Danx Digital Limited" },
		{
			term: "Type",
			detail:
				"AI visibility tracker and AI search agency for answer engine optimization (AEO), generative engine optimization (GEO) and AI SEO",
		},
		{ term: "Founders", detail: "Adam Danyal and Julia Danyal" },
		{
			term: "Registered company",
			detail: "Danx Digital Limited, registered in the United Kingdom, company number 13275434",
		},
		{ term: "Registered address", detail: "86-90 Paul Street, London EC2A 4NE, United Kingdom" },
		{
			term: "Trade marks",
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
			term: "Built on",
			detail: (
				<>
					<ExternalLink href="https://github.com/elmohq/elmo">Elmo</ExternalLink>, the open-source AI visibility
					tracker, which CiteRank.com hosts and extends with our in-house AI search agency
				</>
			),
		},
		{
			term: "Core offering",
			detail:
				"Tracking how AI answer engines mention, cite and describe brands, with citation analysis and competitor share of voice",
		},
		{
			term: "Pricing",
			detail: `AI Visibility Tracker: Basic $${basic.monthlyPriceUsd}/mo, Pro $${pro.monthlyPriceUsd}/mo, Business $${business.monthlyPriceUsd}/mo, with unlimited seats on every plan. AI search agency and custom plans on request.`,
		},
		{
			term: "Contract terms",
			detail: "Month to month, cancel any time; optional annual billing that saves two months",
		},
		{
			term: "Services",
			detail:
				"AI visibility tracking, citation analysis, competitor benchmarking, ranked next steps, AI search agency work with a monthly report, REST API and MCP server",
		},
		{ term: "Contact email", detail: <ExternalLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</ExternalLink> },
		{
			term: "Platforms tracked",
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
								We track what AI says about your brand, then do the work to change it
							</h1>
							<p className="body-8 mt-6 text-zinc-600">
								CiteRank.com is the AI visibility tracker and AI search agency for{" "}
								<Link to="/answer-engine-optimization" className={`${QUIET_LINK} text-zinc-950`}>
									AEO
								</Link>{" "}
								and{" "}
								<Link to="/generative-engine-optimization" className={`${QUIET_LINK} text-zinc-950`}>
									GEO
								</Link>
								. We track how ChatGPT, Gemini, Perplexity and nine other AI apps describe brands, and our agency does
								the work that changes those answers.
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
						<div className="grid grid-cols-2 gap-4 sm:gap-5 lg:col-span-6">
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
					<Container className="grid gap-10 py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
						<Reveal className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
							<h2 className="heading-2 text-zinc-950">Why we started CiteRank.com</h2>
						</Reveal>
						<Reveal delay={100} className="lg:col-span-8">
							{STORY.map((paragraph, index) => (
								<p
									key={paragraph.slice(0, 24)}
									className={
										index === 0 ? "body-8 max-w-[60ch] text-zinc-950" : "body-7 mt-6 max-w-[65ch] text-zinc-700"
									}
								>
									{paragraph}
								</p>
							))}
							<div className="mt-10 flex flex-wrap items-center gap-4">
								<a href={`mailto:${CONTACT_EMAIL}`} className={SECONDARY_BUTTON}>
									Email {CONTACT_EMAIL}
								</a>
								<Link to="/features" className={TEXT_LINK}>
									See every feature
									<ArrowRight className="size-4" aria-hidden="true" />
								</Link>
							</div>
						</Reveal>
					</Container>
				</section>

				<section className="bg-white">
					<Container className="py-20 lg:py-24">
						<div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
							<div className="lg:col-span-4">
								<SectionHeading title="Key facts" lede="The company on one page, for people and for AI engines." />
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
