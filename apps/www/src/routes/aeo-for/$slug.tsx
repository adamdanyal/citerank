import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PLANS } from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { ArrowRight, Search } from "lucide-react";
import { Closing } from "@/components/citerank/v2/closing";
import { Engines } from "@/components/citerank/v2/engines";
import { Faq } from "@/components/citerank/v2/faq";
import { Hero } from "@/components/citerank/v2/hero";
import { HowItWorks } from "@/components/citerank/v2/how-it-works";
import {
	ACTION,
	ACTION_QUIET_ON_INK,
	BODY,
	CARD,
	LEAD,
	MONO,
	PANEL,
	PANEL_PAD,
	PANEL_PAD_TIGHT,
	Page,
	PanelHead,
	SMALL,
	SUBHEAD,
} from "@/components/citerank/v2/kit";
import { Pricing } from "@/components/citerank/v2/pricing";
import { PageShell } from "@/components/citerank/v2/shell";
import { EngineIcon } from "@/components/home/engines";
import { type AeoVertical, aeoHeadline, aeoVerticals, getAeoVertical } from "@/data/aeo-verticals";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, howToJsonLd, itemListJsonLd, ogMeta } from "@/lib/seo";

export const Route = createFileRoute("/aeo-for/$slug")({
	loader: ({ params }) => {
		const v = getAeoVertical(params.slug);
		if (!v) throw notFound();
		const others = aeoVerticals.filter((x) => x.slug !== v.slug);
		/* The head reads these so the vertical data stays out of the client entry bundle. */
		return {
			vertical: v,
			others,
			headline: aeoHeadline(v),
			otherItems: others.map((o) => ({ name: aeoHeadline(o), path: `/aeo-for/${o.slug}`, description: o.short })),
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const { vertical: v, headline, otherItems } = loaderData;
		const title = v.metaTitle ?? `${headline}: Track AI Visibility · CiteRank.com`;
		const description = v.metaDescription ?? v.short;
		const path = `/aeo-for/${v.slug}`;
		return {
			meta: [{ title }, { name: "description", content: description }, ...ogMeta({ title, description, path })],
			links: [{ rel: "canonical", href: canonicalUrl(path) }],
			scripts: [
				breadcrumbJsonLd([
					{ name: "Home", path: "/" },
					{ name: "AEO by industry", path: "/aeo-for" },
					{ name: headline, path },
				]),
				faqJsonLd(v.faqs),
				howToJsonLd({
					name: `How to improve AI visibility for ${v.audience}`,
					description: v.short,
					steps: v.plays.map((play) => ({ name: play.name, text: play.text })),
				}),
				itemListJsonLd(otherItems),
			],
		};
	},
	component: VerticalPage,
});

const FROM = "marketing-aeo-for-hero";

const PROMPT_ENGINES = [
	{ name: "ChatGPT", iconId: "openai" },
	{ name: "Claude", iconId: "anthropic" },
	{ name: "Gemini", iconId: "gemini" },
	{ name: "Perplexity", iconId: "perplexity" },
	{ name: "AI Overviews", iconId: "google" },
];

function capitalize(s: string) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Renders each match of `pattern` (its first group) with `render`, keyed by where it sits in the text. */
function replaceMatches(text: string, pattern: RegExp, render: (match: string, key: number) => React.ReactNode) {
	const out: React.ReactNode[] = [];
	let last = 0;
	for (const m of text.matchAll(pattern)) {
		out.push(text.slice(last, m.index), render(m[1], m.index));
		last = m.index + m[0].length;
	}
	out.push(text.slice(last));
	return out;
}

/** Bracketed slots like [category] stand for the reader's own names, so they get their own colour. */
function PromptText({ text }: { text: string }) {
	return replaceMatches(text, /(\[[^\]]+\])/g, (slot, key) => (
		<span key={key} className="font-medium text-blue-600">
			{slot}
		</span>
	));
}

/** A prompt quoted inside running copy, set like inline code so it reads as something typed into an engine. */
function InlinePrompt({ text }: { text: string }) {
	return (
		<code className="whitespace-nowrap rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-900 ring-1 ring-zinc-200/80">
			<PromptText text={text} />
		</code>
	);
}

/** Copy can quote prompts in single quotes; those render as inline prompts. Apostrophes are left alone. */
function WithPrompts({ text }: { text: string }) {
	return replaceMatches(text, /(?<=^|\s)'([^']+)'(?=[\s.,;]|$)/g, (prompt, key) => (
		<InlinePrompt key={key} text={prompt} />
	));
}

function Prompts({ vertical }: { vertical: AeoVertical }) {
	const [lead, ...rest] = vertical.intro;
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
				<div className="min-w-0 lg:col-span-6">
					<PanelHead title="Your buyers are asking AI. Is it naming you?">
						<p className={`${LEAD} text-zinc-600`}>{lead}</p>
					</PanelHead>
					<div className={`${BODY} mt-6 max-w-[56ch] space-y-4 text-zinc-600`}>
						{rest.map((p) => (
							<p key={p.slice(0, 32)}>{p}</p>
						))}
					</div>
				</div>
				<div className="min-w-0 lg:col-span-6">
					<div className={CARD}>
						<p className={MONO}>Prompts {vertical.audience} should track</p>
						<ul className="mt-4 space-y-2.5">
							{vertical.examplePrompts.map((p) => (
								<li key={p} className="flex items-center gap-3 rounded-xl bg-paper px-4 py-3 text-[15px] text-ink">
									<Search className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
									<span className="min-w-0 flex-1 truncate font-mono text-[14px]">
										<PromptText text={p} />
									</span>
								</li>
							))}
						</ul>
						<div
							className={`${SMALL} mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-zinc-200 pt-4 text-zinc-600`}
						>
							Tracked up to 4× daily in
							<ul className="flex items-center gap-1.5" aria-label="Engines">
								{PROMPT_ENGINES.map((e) => (
									<li
										key={e.name}
										title={e.name}
										className="inline-flex size-7 items-center justify-center rounded-lg bg-paper"
									>
										<EngineIcon iconId={e.iconId} className="size-3.5" />
										<span className="sr-only">{e.name}</span>
									</li>
								))}
							</ul>
							and more
						</div>
					</div>
				</div>
			</Page>
		</section>
	);
}

function Playbook({ vertical }: { vertical: AeoVertical }) {
	const signupUrl = cloudSignupUrl(FROM);
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title={`The AEO checklist for ${vertical.audience}`} className="max-w-[46rem]">
					<p className={`${LEAD} text-zinc-600`}>
						What gets a brand named in AI answers in your category, and where CiteRank.com shows you the content gaps.
					</p>
				</PanelHead>
				<ol className="mt-12 border-b border-zinc-200">
					{vertical.plays.map((play, i) => (
						<li key={play.name} className="grid gap-2 border-t border-zinc-200 py-6 sm:grid-cols-12 sm:gap-8 sm:py-7">
							<h3 className="flex min-w-0 items-baseline gap-3 font-heading text-[1.375rem] leading-[1.25] font-semibold tracking-[-0.02em] text-ink [overflow-wrap:break-word] sm:col-span-5 sm:text-[1.5rem]">
								<span className={`${MONO} shrink-0 tabular-nums`}>{String(i + 1).padStart(2, "0")}</span>
								{play.name}
							</h3>
							<p className={`${BODY} text-zinc-600 sm:col-span-7`}>{play.text}</p>
						</li>
					))}
				</ol>

				<div className="mt-10 flex flex-col gap-6 rounded-2xl bg-ink p-7 md:flex-row md:items-center md:justify-between md:p-8">
					<div className="max-w-[60ch]">
						<h3 className={`${SUBHEAD} text-paper`}>Where CiteRank.com fits</h3>
						<p className={`${BODY} mt-2 text-zinc-400`}>{vertical.fit}</p>
					</div>
					<div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
						<a href={signupUrl} className={ACTION}>
							Start tracking
						</a>
						<Link to="/agency" className={ACTION_QUIET_ON_INK}>
							Have us do the work
						</Link>
					</div>
				</div>
			</Page>
		</section>
	);
}

function OtherIndustries({ others }: { others: AeoVertical[] }) {
	return (
		<section className={`${PANEL} ${PANEL_PAD_TIGHT}`}>
			<Page>
				<p className={MONO}>CiteRank.com for other industries</p>
				<ul className="mt-5 flex flex-wrap gap-2.5">
					{others.map((o) => (
						<li key={o.slug}>
							<a
								href={`/aeo-for/${o.slug}`}
								className="inline-flex h-9 items-center rounded-full bg-paper-2 px-4 text-[15px] text-ink ring-1 ring-zinc-200 transition-[box-shadow] duration-200 hover:ring-zinc-400"
							>
								{capitalize(o.audience)}
							</a>
						</li>
					))}
				</ul>
			</Page>
		</section>
	);
}

function VerticalPage() {
	const { vertical, others } = Route.useLoaderData() as {
		vertical: AeoVertical;
		others: AeoVertical[];
	};
	const plan = PLANS[vertical.plan];
	const platforms = plan.platformMenu.length === 1 ? "ChatGPT" : `${plan.platformPicks} AI platforms`;
	return (
		<PageShell>
			<Hero title={aeoHeadline(vertical)} lede={<WithPrompts text={vertical.short} />} from={FROM} />
			<Prompts vertical={vertical} />
			<Playbook vertical={vertical} />
			<HowItWorks />
			<Engines />
			<Pricing
				lede={`We recommend ${plan.name} for ${vertical.audience}: ${plan.maxPrompts} prompts across ${platforms}, checked ${plan.standardRunsPerDay}× daily, for $${plan.monthlyPriceUsd}/mo. Unlimited seats on every plan.`}
				recommended={{ plan: vertical.plan, label: `Best for ${vertical.audience}` }}
			/>
			<Faq items={vertical.faqs} />
			<Closing from="marketing-aeo-for-closing" />
			<OtherIndustries others={others} />
		</PageShell>
	);
}
