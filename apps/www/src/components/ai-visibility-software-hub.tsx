import { Link } from "@tanstack/react-router";
import { CLOUD_ENTRY_PRICE_USD } from "@workspace/config/plans";
import { cloudSignupUrl } from "@workspace/config/referrals";
import { buttonVariants } from "@workspace/ui/components/button";
import { ArrowRight } from "lucide-react";

const LINK = "font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900";

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
		body: "Shows the prompts and topics where you're missing, so a vague worry becomes a concrete content to-do list.",
	},
];

// Rendered below the comparison directory on /ai-visibility-tools as long-form
// sections — the directory provides the page hero and H1.
export function AiVisibilitySoftwareHub() {
	return (
		<>
			{/* What it does */}
			<section className="border-b border-zinc-200 bg-white py-12 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<div className="max-w-3xl">
						<h2 className="font-heading text-3xl text-zinc-950 md:text-4xl">What AI visibility software does</h2>
						<div className="mt-8 space-y-6 text-[1.0625rem] leading-relaxed text-zinc-600">
							<p>
								AI visibility software tracks how your brand appears in AI search: how often it's mentioned, cited, and
								accurately described across ChatGPT, Perplexity, Gemini, and Google AI Overviews. It answers a question
								traditional analytics can't: when someone asks an AI engine about your category, does it mention you,
								and is it right?
							</p>
							<p>
								Instead of tracking rankings on a results page, it samples the answers themselves. It runs a defined set
								of prompts across multiple AI engines on a schedule and records what comes back: whether your brand is
								mentioned, whether it's{" "}
								<a className={LINK} href="/blog/ai-citations">
									cited with a link
								</a>
								, how it's described, and how often competitors appear instead. Good tools roll those results into a
								share-of-voice metric and point you to where you're missing.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Why it matters */}
			<section className="border-b border-zinc-200 bg-zinc-50 py-12 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<div className="max-w-3xl">
						<h2 className="font-heading text-3xl text-zinc-950 md:text-4xl">Why AI visibility matters now</h2>
						<div className="mt-8 space-y-6 text-[1.0625rem] leading-relaxed text-zinc-600">
							<p>
								Search is shifting from a list of blue links to a synthesized answer. Google now shows{" "}
								<a className={LINK} href="/ai-search/google-ai-overviews">
									AI Overviews
								</a>{" "}
								above the results for many queries, and tools like Perplexity and ChatGPT Search resolve questions
								without a results page at all. For a growing share of searches, buyers read an answer and never click.
							</p>
							<p>
								That changes the unit of visibility. There's often no ranking to hold. There's one answer, and your
								brand is either named in it or it isn't. Being cited becomes the win. This is the premise of{" "}
								<a className={LINK} href="/answer-engine-optimization">
									answer engine optimization
								</a>
								, and AI visibility software is how you measure whether it's working.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Key features */}
			<section className="border-b border-zinc-200 bg-white py-12 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<div className="max-w-3xl">
						<h2 className="font-heading text-3xl text-zinc-950 md:text-4xl">Key features to look for</h2>
						<p className="mt-6 text-[1.0625rem] leading-relaxed text-zinc-600">
							The category is young and tools vary widely. These are the capabilities that separate a genuine AI
							visibility platform from a basic prompt checker.
						</p>
					</div>
					<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{FEATURES.map((feature) => (
							<div key={feature.title} className="rounded-md border border-zinc-200 bg-white p-5">
								<h3 className="font-semibold text-zinc-950">{feature.title}</h3>
								<p className="mt-2 text-sm leading-relaxed text-zinc-600">{feature.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CiteRank.com's approach */}
			<section className="border-b border-zinc-200 bg-zinc-50 py-12 lg:py-20">
				<div className="mx-auto max-w-6xl px-4 md:px-6">
					<div className="max-w-3xl">
						<h2 className="font-heading text-3xl text-zinc-950 md:text-4xl">CiteRank.com's approach</h2>
						<div className="mt-8 space-y-6 text-[1.0625rem] leading-relaxed text-zinc-600">
							<p>
								CiteRank.com is an AI visibility tracker and AI search agency. It tracks mentions, citations, and
								competitor share across ChatGPT, Claude, Gemini, Grok, Perplexity, Bing AI Mode, and Google AI Mode and
								AI Overviews, and because it keeps every answer in full, you can read exactly what every metric is based
								on.
							</p>
							<p>
								The market is full of opaque scoring and inflated pricing. With CiteRank.com you keep every answer and
								can export your data through the API: plans start at ${CLOUD_ENTRY_PRICE_USD}/mo, and the AI search
								agency is there if you would rather not do the work. To see how it compares with the rest of the field,
								read the roundup of the{" "}
								<a className={LINK} href="/blog/best-ai-visibility-tools">
									best AI visibility tools
								</a>{" "}
								or learn{" "}
								<a className={LINK} href="/answer-engine-optimization">
									how to track your brand in AI search
								</a>
								.
							</p>
						</div>
						<div className="mt-8 flex flex-wrap gap-3">
							<a href={cloudSignupUrl("marketing-page-cta")} className={buttonVariants({ size: "sm" })}>
								Start tracking
								<ArrowRight className="size-3.5" />
							</a>
							<Link to="/agency" className={buttonVariants({ variant: "outline", size: "sm" })}>
								Let us do the work
							</Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
