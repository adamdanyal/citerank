import { createFileRoute, Link } from "@tanstack/react-router";
import { getModelMeta } from "@workspace/config/models";
import { CLOUD_ENTRY_PRICE_USD, CLOUD_PLATFORMS, PLANS } from "@workspace/config/plans";
import type { ReactNode } from "react";
import { SocialIcons } from "@/components/citerank/socials";
import { Closing } from "@/components/citerank/v2/closing";
import { Faq } from "@/components/citerank/v2/faq";
import {
	ACTION,
	ACTION_QUIET,
	BODY,
	LEAD,
	LINK,
	PANEL,
	PANEL_PAD,
	PANEL_PAD_WIDE,
	Page,
	PanelHead,
	SMALL,
	SUBHEAD,
} from "@/components/citerank/v2/kit";
import { PageHead, PageShell } from "@/components/citerank/v2/shell";
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
const ENGINE_NAMES = Object.keys(CLOUD_PLATFORMS).map((model) => getModelMeta(model).label);
const ENGINE_COUNT = ENGINE_NAMES.length;

/* Portraits are apps/www/public/founder-adam.jpg and founder-julia.jpg, 512px squares. */
const FOUNDERS = [
	{
		name: "Adam Danyal",
		role: "Founder",
		proof: "2M+ followers",
		href: "https://www.linkedin.com/in/adamdanyal/",
		photo: "/founder-adam.jpg",
	},
	{
		name: "Julia Danyal",
		role: "Co-founder",
		proof: "360K+ followers",
		href: "https://www.linkedin.com/in/juliadanyal/",
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
	`The tracker is built on Elmo, the open-source AI visibility tracker, which we host and extend. It asks your buyers’ questions across ${ENGINE_COUNT} AI apps, ${basic.standardRunsPerDay} times a day, and keeps every answer word for word, so any score can be traced to the exact responses behind it. Plans start at $${CLOUD_ENTRY_PRICE_USD} a month, run month to month, and include your whole team, the API and the MCP server.`,
	"Tracking alone does not change an answer, so we also run the agency. Each month we write the pages your site is missing, update the ones AI stopped citing, pitch you to the review sites and lists it cites, answer buyers in forums, and report the AI answers before and after.",
	"It is for any company whose buyers ask AI who to choose: B2B software, e-commerce, agencies with several client brands, law and accounting firms, local and hospitality businesses. Sign up, add your website, and the Prompt Wizard suggests your buyers’ questions so tracking starts right away. For the agency, book a call.",
];

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
	return (
		<a href={href} target="_blank" rel={externalRel(href)} className={`${LINK} text-ink`}>
			{children}
		</a>
	);
}

function LinkedInMark() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 shrink-0 fill-current">
			<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
		</svg>
	);
}

function Founder({ founder }: { founder: (typeof FOUNDERS)[number] }) {
	return (
		<li>
			<figure>
				<img
					src={founder.photo}
					alt={founder.name}
					width={512}
					height={512}
					loading="lazy"
					decoding="async"
					className="aspect-square w-full rounded-card bg-paper-2 object-cover"
				/>
				<figcaption className="mt-4">
					<p className={`${SUBHEAD} text-ink`}>{founder.name}</p>
					<p className={`${SMALL} mt-1 text-zinc-600`}>{founder.role}</p>
					<p className={`${SMALL} mt-2 text-zinc-700`}>
						<a
							href={founder.href}
							target="_blank"
							rel="noopener noreferrer"
							className={`${LINK} inline-flex items-center gap-2 whitespace-nowrap`}
						>
							<LinkedInMark />
							{founder.proof}
							<span className="sr-only"> on LinkedIn</span>
						</a>
					</p>
				</figcaption>
			</figure>
		</li>
	);
}

/* The statement, the company in four figures, the founders and their reasons, the facts on record, the objections. */
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
			detail: ENGINE_NAMES.join(", "),
		},
		{ term: "Competitors", detail: "Profound, Peec AI, Otterly.AI, Scrunch, Semrush AI Toolkit" },
		{
			term: "Social",
			detail: (
				<SocialIcons className="gap-x-5 gap-y-3" linkClassName="text-zinc-600 hover:text-ink" iconClassName="size-5" />
			),
		},
	];

	return (
		<PageShell>
			<PageHead
				title="We track what AI says about your brand, then do the work to change it"
				lede={
					<>
						CiteRank.com is the AI visibility tracker and AI search agency for{" "}
						<Link to="/answer-engine-optimization" className={`${LINK} text-ink`}>
							AEO
						</Link>{" "}
						and{" "}
						<Link to="/generative-engine-optimization" className={`${LINK} text-ink`}>
							GEO
						</Link>
						. We track how ChatGPT, Gemini, Perplexity and ten other AI apps describe brands, and our agency does the
						work that changes those answers.
					</>
				}
			>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Link to="/agency" className={ACTION}>
						Book an agency call
					</Link>
					<Link to="/pricing" className={ACTION_QUIET}>
						See tracker plans
					</Link>
				</div>
				<p className={`${SMALL} mt-4 max-w-[64ch] text-zinc-600`}>
					Cite is what an AI does when it names a source. Rank is where you stand against competitors in those answers.
					Hence the name.
				</p>
			</PageHead>

			{/* The figures close the opening rather than start a section: no padding above them but the opening's own. */}
			<section className={`${PANEL} pb-7 sm:pb-10 lg:pb-15`}>
				<Page>
					<dl className="grid gap-y-10 border-t border-zinc-200 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:pt-12">
						{NUMBERS.map((item) => (
							<div
								key={item.label}
								className="flex flex-col-reverse justify-end border-zinc-200 sm:even:border-l sm:even:pl-8 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
							>
								<dt className={`${SMALL} mt-3 max-w-[24ch] text-zinc-600`}>{item.label}</dt>
								<dd className="font-heading text-display-s leading-none font-bold tracking-[-0.03em] text-ink">
									{item.value}
								</dd>
							</div>
						))}
					</dl>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD_WIDE}`}>
				<Page className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-16">
					<div className="lg:sticky lg:top-28 lg:self-start">
						<PanelHead title="Why we started CiteRank.com" />
						<ul className="mt-8 grid max-w-[34rem] grid-cols-2 gap-4 sm:gap-8 lg:mt-10">
							{FOUNDERS.map((founder) => (
								<Founder key={founder.name} founder={founder} />
							))}
						</ul>
					</div>
					<div>
						{STORY.map((paragraph, index) => (
							<p
								key={paragraph.slice(0, 24)}
								className={index === 0 ? `${LEAD} max-w-[56ch] text-ink` : `${BODY} mt-6 max-w-[65ch] text-zinc-700`}
							>
								{paragraph}
							</p>
						))}
						<div className="mt-10 flex flex-col gap-x-6 gap-y-4 sm:flex-row sm:items-center">
							<a href={`mailto:${CONTACT_EMAIL}`} className={ACTION_QUIET}>
								Email {CONTACT_EMAIL}
							</a>
							<Link to="/features" className={`${LINK} ${BODY} w-fit font-medium text-ink`}>
								See every feature
							</Link>
						</div>
					</div>
				</Page>
			</section>

			<section className={`${PANEL} ${PANEL_PAD}`}>
				<Page>
					<PanelHead title="Key facts">
						<p className={`${LEAD} text-zinc-600`}>The company on one page, for people and for AI engines.</p>
					</PanelHead>
					<dl className="mt-10 border-b border-zinc-200 lg:mt-16">
						{keyFacts.map((fact) => (
							<div
								key={fact.term}
								className="grid gap-1 border-t border-zinc-200 py-4 lg:grid-cols-12 lg:gap-8 lg:py-5"
							>
								<dt className={`${BODY} font-medium text-ink lg:col-span-4`}>{fact.term}</dt>
								<dd className={`${BODY} max-w-[72ch] text-zinc-600 lg:col-span-8`}>{fact.detail}</dd>
							</div>
						))}
					</dl>
				</Page>
			</section>

			<Faq items={ABOUT_FAQS} />
			<Closing from="marketing-about" />
		</PageShell>
	);
}
