import { createFileRoute, Link } from "@tanstack/react-router";
import { BODY, CARD_LIFT, LINK, PILL_QUIET, SMALL, StepRows, SUBHEAD } from "@/components/citerank/v2/kit";
import { PageShell } from "@/components/citerank/v2/shell";
import { CiteRankCta, DirectoryHero, DirectorySection } from "@/components/directory-shell";
import { Faq } from "@/components/faq";
import {
	type Competitor,
	formatFateDate,
	type GraveyardFate,
	getComparisonSlug,
	getScreenshotUrl,
	graveyardFate,
	graveyardTools,
	hasComparisonPage,
} from "@/lib/competitors";
import type { FaqItem } from "@/lib/faqs";
import { breadcrumbJsonLd, canonicalUrl, faqJsonLd, itemListJsonLd, ogMeta } from "@/lib/seo";

const title = "The AEO Graveyard: AI Visibility Tools That Shut Down · CiteRank.com";
const description =
	"AI visibility and AEO tools that shut down, pivoted, or were acquired, with what happened to each and what to do if your tracker disappears.";
const path = "/ai-visibility-tools/graveyard";

// A rounded count reads as prose; the exact number changes every time we add a tool.
// Computed on demand so the tool data stays out of the client entry bundle.
function roundedCount() {
	const n = graveyardTools.length;
	const rounded = Math.round(n / 10) * 10;
	if (rounded > n) return `Nearly ${rounded}`;
	if (rounded < n) return `More than ${rounded}`;
	return `${n}`;
}

function lead() {
	return `${roundedCount()} AI visibility tools have disappeared in the last two years. Most shut down, and the rest pivoted to something else or were bought and folded into another product. When a tracker disappears, its customers have to adjust to a new system or start from scratch.`;
}

function graveyardItems() {
	return graveyardTools.map((c) => ({
		name: c.name,
		path: hasComparisonPage(c) ? `/ai-visibility-tools/${getComparisonSlug(c)}` : undefined,
		description: c.fate?.summary,
	}));
}

const FATE_LABEL: Record<GraveyardFate, string> = {
	"shut-down": "Shut down",
	pivoted: "Pivoted",
	acquired: "Acquired",
};

const STEPS: { title: string; body: string }[] = [
	{
		title: "Export everything while you still can",
		body: "Shutdown notices often give a few weeks. Pull your prompts, competitor list, and as much history as the tool will export: CSV, API, or screenshots of the charts if that’s all there is.",
	},
	{
		title: "Write down how your numbers were made",
		body: "Note which engines you tracked, how often, and in which countries. Visibility scores are not portable between tools, so you need this to explain the jump when you switch.",
	},
	{
		title: "Re-baseline instead of stitching",
		body: "Start the new tool on the same prompts and treat its first few weeks as a fresh baseline. Grafting one vendor’s numbers onto another’s makes the trend line meaningless.",
	},
	{
		title: "Plan your exit before you commit",
		body: "Check whether your data leaves through an API, whether the code is open source and under which license, and whether you can self-host it. A permissive license means the software outlives the company.",
	},
	{
		title: "Move your prompts over",
		body: "In CiteRank.com you can paste a list of prompts in one go, add your competitors, and pick the engines to track. The first runs land within minutes.",
	},
];

const FAQS: FaqItem[] = [
	{
		question: "What happens to my data when an AI visibility tool shuts down?",
		answer:
			"When an AI visibility tool shuts down, your data usually goes with it. Hosted trackers keep your prompts, answers, and history on their servers. Once the service is switched off, nothing is left to export, so export regularly.",
	},
	{
		question: "How does open source protect me if a tool shuts down?",
		answer:
			"With a permissive open-source license like MIT, the code stays usable whatever happens to the company behind it. You can keep running your own copy, fix it, or fork it. A self-hosted install keeps your data in your own database.",
	},
	{
		question: "Can an open-source tool go closed source?",
		answer:
			"Yes. A company can stop publishing new code, as Notra did in October 2026 when it took its AGPL repository private. It can’t take back code it has already released. Anyone with a copy can keep using and forking that version.",
	},
	{
		question: "My AI visibility tool was acquired. Should I switch?",
		answer:
			"You don’t have to switch when your AI visibility tool is acquired, but watch the roadmap. Acquired tools are often folded into the buyer’s product, repriced, or put on a waitlist. Export your data now so you have the option.",
	},
	{
		question: "Can I get my data out of CiteRank.com?",
		answer:
			"Yes. You can get your data out of CiteRank.com through its REST API. It returns each answer in full with its citations, plus your prompts, competitors, and visibility data. The MCP server lets Claude Code and Cursor read it too.",
	},
];

export const Route = createFileRoute("/ai-visibility-tools/graveyard")({
	loader: () => ({ items: graveyardItems() }),
	head: ({ loaderData }) => ({
		meta: [{ title }, { name: "description", content: description }, ...ogMeta({ title, description, path })],
		links: [{ rel: "canonical", href: canonicalUrl(path) }],
		scripts: [
			breadcrumbJsonLd([
				{ name: "Home", path: "/" },
				{ name: "AI Visibility Tool Directory", path: "/ai-visibility-tools" },
				{ name: "AEO Graveyard", path },
			]),
			itemListJsonLd(loaderData?.items ?? []),
			faqJsonLd(FAQS),
		],
	}),
	component: GraveyardPage,
});

const PLOTS = "grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3";

function Plot({ competitor }: { competitor: Competitor }) {
	const fate = graveyardFate(competitor);
	if (!fate || !competitor.fate) return null;
	return (
		<li className={`flex min-w-0 flex-col ${competitor.noScreenshot ? `${CARD_LIFT} p-6` : ""}`}>
			{!competitor.noScreenshot && (
				<div className={`${CARD_LIFT} mb-6 overflow-hidden`}>
					<img
						src={getScreenshotUrl(competitor.slug)}
						alt={`${competitor.name}’s homepage while it was live`}
						width={1280}
						height={800}
						className={`block aspect-[16/10] h-auto w-full object-cover object-top opacity-80 grayscale ${competitor.darkScreenshot ? "invert" : ""}`}
						loading="lazy"
					/>
				</div>
			)}
			<h3 className={`${SUBHEAD} text-ink`}>{competitor.name}</h3>
			<p className={`${SMALL} mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-600`}>
				<span className={PILL_QUIET}>{FATE_LABEL[fate]}</span>
				<time dateTime={competitor.fate.date}>{formatFateDate(competitor.fate.date)}</time>
			</p>
			<p className={`${SMALL} mt-4 text-zinc-600`}>{competitor.tagline}</p>
			<p className={`${BODY} mt-3 flex-1 text-zinc-700`}>{competitor.fate.summary}</p>
			{(hasComparisonPage(competitor) || competitor.fate.source) && (
				<p className={`${SMALL} mt-4 flex flex-wrap gap-x-6 gap-y-2 font-medium`}>
					{hasComparisonPage(competitor) && (
						<Link
							to="/ai-visibility-tools/$slug"
							params={{ slug: getComparisonSlug(competitor) }}
							className={`${LINK} text-ink`}
						>
							CiteRank.com vs {competitor.name}
						</Link>
					)}
					{competitor.fate.source && (
						<a
							href={competitor.fate.source}
							target="_blank"
							rel="noopener noreferrer nofollow"
							className={`${LINK} text-zinc-700`}
						>
							Source
						</a>
					)}
				</p>
			)}
		</li>
	);
}

function GraveyardPage() {
	return (
		<PageShell>
			<DirectoryHero
				back
				title="The AEO graveyard"
				lead={lead()}
				aside={
					<div className="rounded-card bg-white p-6 shadow-lift ring-1 ring-zinc-200">
						<p className="text-[1rem] leading-[1.4] font-medium text-ink">Keep a copy of your history</p>
						<p className={`${SMALL} mt-2 text-zinc-700`}>
							When a hosted tracker goes under, your history goes with it. CiteRank.com’s API lets you keep your own
							copy of every answer and score.{" "}
							<Link to="/" className={`${LINK} text-ink`}>
								Learn more about CiteRank.com
							</Link>
						</p>
					</div>
				}
			/>
			<DirectorySection>
				<h2 className="sr-only">AI visibility tools that shut down, pivoted, or were acquired</h2>
				<ul className={PLOTS}>
					{graveyardTools
						.filter((c) => !c.noScreenshot)
						.map((c) => (
							<Plot key={c.slug} competitor={c} />
						))}
				</ul>
				<ul className={`${PLOTS} mt-14`}>
					{graveyardTools
						.filter((c) => c.noScreenshot)
						.map((c) => (
							<Plot key={c.slug} competitor={c} />
						))}
				</ul>
				<p className={`${SMALL} mt-10 max-w-[70ch] text-zinc-600`}>
					Screenshots were taken while each tool was live. Dates are when the shutdown, pivot, or acquisition was
					announced, or the month the site was found offline.
				</p>
			</DirectorySection>
			<DirectorySection title="Your AI visibility tool shut down. Now what?" pad="wide">
				<StepRows steps={STEPS} />
			</DirectorySection>
			<Faq items={FAQS} />
			<CiteRankCta />
		</PageShell>
	);
}
