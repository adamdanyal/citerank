import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import type { ReactNode } from "react";
import { ACTION, ACTION_QUIET, BODY, HEADING, LINK, PANEL, PANEL_PAD_WIDE, Page, SUBHEAD } from "./citerank/v2/kit";

const INLINE_LINK = `${LINK} text-ink`;
const PROSE = "max-w-[66ch]";

const FEATURES = [
	{
		title: "Cross-platform tracking",
		body: "Monitors your brand across the engines that matter: ChatGPT, Perplexity, Gemini, Bing AI Mode, and Google AI Overviews, all at once.",
	},
	{
		title: "Mention & citation analysis",
		body: "Separates being named in an answer from being cited with a link, so you can see which content earns traffic.",
	},
	{
		title: "Prompt monitoring",
		body: "Runs a defined set of prompts on a schedule, because a single check is a snapshot and AI answers shift over time.",
	},
	{
		title: "Competitor benchmarking",
		body: "Shows your share of voice against named rivals on the same prompts, the most actionable metric in AI visibility.",
	},
	{
		title: "Sentiment & accuracy",
		body: "Flags when an engine describes your brand incorrectly, so you can correct the record before buyers see it.",
	},
	{
		title: "Recommendations",
		body: "Shows the prompts and topics where you’re missing, so a vague worry becomes a concrete content to-do list.",
	},
];

function Topic({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className="grid gap-6 py-12 first:pt-0 last:pb-0 lg:grid-cols-12 lg:gap-8 lg:py-16">
			<h2 className={`${HEADING} text-ink lg:col-span-5`}>{title}</h2>
			<div className={`${BODY} min-w-0 space-y-5 text-zinc-600 lg:col-span-7`}>{children}</div>
		</div>
	);
}

/*
 * The long read under the directory on /ai-visibility-tools, which provides the
 * page's hero and h1. One section of ruled topics: the head on the left, the
 * text at a reading measure on the right.
 */
export function AiVisibilitySoftwareHub() {
	return (
		<section className={`${PANEL} ${PANEL_PAD_WIDE}`}>
			<Page>
				<div className="divide-y divide-zinc-200">
					<Topic title="What AI visibility software does">
						<p className={PROSE}>
							AI visibility software tracks how your brand appears in AI search: how often it’s mentioned, cited, and
							accurately described across ChatGPT, Perplexity, Gemini, and Google AI Overviews. It answers a question
							traditional analytics can’t: when someone asks an AI engine about your category, does it mention you, and
							is it right?
						</p>
						<p className={PROSE}>
							Instead of tracking rankings on a results page, it samples the answers themselves. It runs a defined set
							of prompts across multiple AI engines on a schedule and records what comes back: whether your brand is
							mentioned, whether it’s{" "}
							<a className={INLINE_LINK} href="/blog/ai-citations">
								cited with a link
							</a>
							, how it’s described, and how often competitors appear instead. Good tools roll those results into a
							share-of-voice metric and point you to where you’re missing.
						</p>
					</Topic>

					<Topic title="Why AI visibility matters now">
						<p className={PROSE}>
							Search is shifting from a list of blue links to a synthesized answer. Google now shows{" "}
							<a className={INLINE_LINK} href="/ai-search/google-ai-overviews">
								AI Overviews
							</a>{" "}
							above the results for many queries, and tools like Perplexity and ChatGPT Search resolve questions without
							a results page at all. For a growing share of searches, buyers read an answer and never click.
						</p>
						<p className={PROSE}>
							That changes the unit of visibility. There’s often no ranking to hold. There’s one answer, and your brand
							is either named in it or it isn’t. Being cited becomes the win. This is the premise of{" "}
							<a className={INLINE_LINK} href="/answer-engine-optimization">
								answer engine optimization
							</a>
							, and AI visibility software is how you measure whether it’s working.
						</p>
					</Topic>

					<Topic title="Key features to look for">
						<p className={PROSE}>
							The category is young and tools vary widely. These are the capabilities that separate a genuine AI
							visibility platform from a basic prompt checker.
						</p>
						<ul className="grid gap-x-8 gap-y-8 pt-5 sm:grid-cols-2">
							{FEATURES.map((feature) => (
								<li key={feature.title}>
									<h3 className={`${SUBHEAD} text-ink`}>{feature.title}</h3>
									<p className="mt-2">{feature.body}</p>
								</li>
							))}
						</ul>
					</Topic>

					<Topic title="CiteRank.com’s approach">
						<p className={PROSE}>
							CiteRank.com is an AI visibility tracker and AI search agency. It tracks mentions, citations, and
							competitor share across ChatGPT, Claude, Gemini, Grok, Perplexity, Bing AI Mode, and Google AI Mode and AI
							Overviews, and because it keeps every answer in full, you can read exactly what every metric is based on.
						</p>
						<p className={PROSE}>
							The market is full of opaque scoring and inflated pricing. With CiteRank.com you keep every answer and can
							export your data through the API: plans start at ${CLOUD_ENTRY_PRICE_USD}/mo, and the AI search agency is
							there if you would rather not do the work. To see how it compares with the rest of the field, read the
							roundup of the{" "}
							<a className={INLINE_LINK} href="/blog/best-ai-visibility-tools">
								best AI visibility tools
							</a>{" "}
							or learn{" "}
							<a className={INLINE_LINK} href="/answer-engine-optimization">
								how to track your brand in AI search
							</a>
							.
						</p>
						<div className="flex flex-col gap-3 pt-3 sm:flex-row sm:flex-wrap">
							<a href={cloudSignupUrl("marketing-page-cta")} className={ACTION}>
								Start tracking
							</a>
							<Link to="/agency" className={ACTION_QUIET}>
								Let us do the work
							</Link>
						</div>
					</Topic>
				</div>
			</Page>
		</section>
	);
}
