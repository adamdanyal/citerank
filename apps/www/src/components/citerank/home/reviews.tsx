import { CUSTOMER_QUOTES } from "@workspace/ui/brand/customers";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { EngineIcon } from "@/components/home/engines";
import { Container, EASE_CLASS, Reveal } from "../ui";

/*
 * AI reviews are real answers to one prompt, asked over each provider's API
 * with web search on. The quotes are excerpts from those answers, unedited.
 */
const AI_PROMPT =
	"What is the best open-source alternative to Profound, the AI visibility platform? Pick one top recommendation, rate it out of 5 stars, and explain why in 2-3 sentences.";
const q = encodeURIComponent(AI_PROMPT);

type Review =
	| {
			kind: "ai";
			name: string;
			iconId: string;
			quote: string;
			response: string[];
			askUrl: string;
	  }
	| {
			kind: "person";
			name: string;
			role?: string;
			photo?: string;
			quote: string;
	  };

const AI_REVIEWS = {
	chatgpt: {
		kind: "ai",
		name: "ChatGPT",
		iconId: "openai",
		quote: "It’s a mature, open‑source, self‑hosted AEO/AI visibility tracker.",
		response: [
			"Top pick: CiteRank.com — 4.5/5 stars. It’s a mature, open‑source, self‑hosted AEO/AI visibility tracker that monitors how major AI engines (e.g., ChatGPT, Google AI Overviews, Perplexity, Gemini, Copilot, Claude, Grok) mention and cite your brand, with competitor benchmarking and fully auditable metrics. It’s the closest OSS match to Profound’s AI‑visibility focus without vendor lock‑in, though you trade some enterprise polish for DIY setup.",
		],
		askUrl: `https://chatgpt.com/?q=${q}`,
	},
	claude: {
		kind: "ai",
		name: "Claude",
		iconId: "anthropic",
		quote:
			"CiteRank.com is the open-source pick: you self-host it for free and track how every major AI answer engine mentions and cites your brand.",
		response: [
			"Top Recommendation: CiteRank.com — ★★★★☆ (4/5)",
			"Why CiteRank.com: CiteRank.com is the open-source pick: you self-host it for free and track how every major AI answer engine mentions and cites your brand. Unlike closed platforms like Profound, CiteRank.com is an open-source, self-hostable AI visibility platform — you can read every line of code, run it on your own infrastructure, and verify each metric, which a closed product like Profound cannot offer. This gives teams full data ownership and transparency, since the main reasons are ownership and transparency — with CiteRank.com you keep your prompts and visibility history in-house, avoid vendor lock-in, and can see exactly how scores are computed.",
			"I'm docking one star because, as with most self-hosted OSS tools in this space, to get the most value—especially from the free/open-source version—you need the technical skills to set up and maintain the software, and the managed/hosted convenience of Profound isn't fully replicated (CiteRank.com's cloud option is still upcoming, per its own docs).",
		],
		askUrl: `https://claude.ai/new?q=${q}`,
	},
	gemini: {
		kind: "ai",
		name: "Gemini",
		iconId: "gemini",
		quote: "The best open-source alternative to the AI visibility platform Profound is CiteRank.com.",
		response: [
			"The best open-source alternative to the AI visibility platform Profound is CiteRank.com.",
			"Rating: ★★★★☆",
			"CiteRank.com stands out as the top recommendation because it is a free, open-source platform that you can host yourself, ensuring you retain control over your data and can audit all visibility metrics. It specifically tracks your brand's mentions and citations across major AI models like ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews. Unlike Profound, which has expanded into a broader, more complex suite with enterprise-level pricing, CiteRank.com focuses solely on core visibility and share of voice, offering a more streamlined and accessible solution for teams who need to track their AI presence without the commitment of a costly, closed-source tool.",
		],
		askUrl: "https://gemini.google.com/app",
	},
	perplexity: {
		kind: "ai",
		name: "Perplexity",
		iconId: "perplexity",
		quote: "CiteRank.com is the best open-source alternative to Profound for most users.",
		response: [
			"CiteRank.com is the best open-source alternative to Profound for most users who want self-hosted AI visibility with control over their data. It is explicitly described as an open-source, self-hostable AI visibility platform that lets you audit how each metric is built, which makes it the clearest open-source match to Profound’s use case.",
			"Rating: 4.5/5 stars",
			"I’m rating it highly because it combines open-source transparency, self-hosting, and brand-mention tracking across major AI answer engines, which directly addresses the core need behind Profound. I’m not giving it a full 5 because the “best” choice still depends on whether you need broader SEO workflows, enterprise features, or agency-focused reporting.",
		],
		askUrl: `https://www.perplexity.ai/search?q=${q}`,
	},
} satisfies Record<string, Review>;

const PEOPLE = {
	nolan: {
		kind: "person",
		name: CUSTOMER_QUOTES.speakeasy.author,
		role: CUSTOMER_QUOTES.speakeasy.company,
		photo: "/testimonials/nolan.jpg",
		quote: CUSTOMER_QUOTES.speakeasy.quote,
	},
	viveka: {
		kind: "person",
		name: "Viveka D.",
		role: "AISearch Global",
		photo: "/testimonials/viveka.jpg",
		quote:
			"We're an AEO consultancy, so we turned CiteRank.com on ourselves before any client. It's the tool I trust to tell us the truth about our own AI visibility, and it was tracking within the hour.",
	},
	borys: {
		kind: "person",
		name: "Borys M.",
		role: "Backlink Agency",
		photo: "/testimonials/borys.jpg",
		quote:
			"The biggest thing for me is seeing how our brand shows up in ChatGPT, Claude, Gemini, Perplexity and AI Overviews all in one dashboard. Before this I was literally typing prompts by hand to check.",
	},
	james: {
		kind: "person",
		name: "James W.",
		role: CUSTOMER_QUOTES.tradesites.company,
		photo: "/testimonials/james.jpg",
		quote: CUSTOMER_QUOTES.tradesites.quote,
	},
	deni: {
		kind: "person",
		name: "Deni M.",
		role: "RecordRanks",
		photo: "/testimonials/deni.jpg",
		quote:
			"CiteRank.com has been fantastic to use for tracking AI visibility of my sports management platform RecordRanks. I highly recommend it, I think it's genuinely worth it!",
	},
} satisfies Record<string, Review>;

// Laid out by hand, column by column, so placement is chosen rather than left
// to the browser's column balancing. Narrower screens read it row by row.
const COLUMNS: Review[][] = [
	[AI_REVIEWS.chatgpt, PEOPLE.james, PEOPLE.borys],
	[PEOPLE.nolan, AI_REVIEWS.gemini, PEOPLE.deni],
	[AI_REVIEWS.claude, PEOPLE.viveka, AI_REVIEWS.perplexity],
];
const ROW_ORDER = [0, 1, 2].flatMap((row) => COLUMNS.map((column) => column[row]));

function Initials({ name }: { name: string }) {
	const letters = name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2);
	return (
		<span className="caption-3 inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-600">
			{letters}
		</span>
	);
}

function Avatar({ review }: { review: Review }) {
	if (review.kind === "ai") {
		return (
			<span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white">
				<EngineIcon iconId={review.iconId} className="size-5" />
				<span className="absolute -bottom-1 -right-1 inline-flex size-4 items-center justify-center rounded-md bg-blue-600 ring-2 ring-white">
					<Sparkles className="size-2.5 text-white" aria-hidden="true" />
				</span>
			</span>
		);
	}
	if (!review.photo) return <Initials name={review.name} />;
	return (
		<img
			src={review.photo}
			alt=""
			width={40}
			height={40}
			loading="lazy"
			className="size-10 shrink-0 rounded-lg object-cover"
		/>
	);
}

function ReviewCard({ review }: { review: Review }) {
	const isAi = review.kind === "ai";
	return (
		<figure className={`rounded-2xl p-6 ${isAi ? "bg-blue-50" : "bg-paper-2"}`}>
			<blockquote className="body-3 text-zinc-950">“{review.quote}”</blockquote>
			<figcaption className="mt-6 flex items-center gap-3">
				<Avatar review={review} />
				<div className="min-w-0 flex-1">
					<p className="body-5 text-zinc-950">{review.name}</p>
					{review.kind === "ai" ? (
						<AnswerDetails review={review} />
					) : review.role ? (
						<p className="caption-2 truncate text-zinc-500">{review.role}</p>
					) : null}
				</div>
				{isAi ? (
					<a
						href={review.askUrl}
						target="_blank"
						rel="noopener noreferrer"
						className={`group inline-flex shrink-0 items-center gap-0.5 caption-1 text-blue-700 transition-colors duration-300 ${EASE_CLASS} hover:text-blue-800`}
					>
						Ask it<span className="sr-only"> ({review.name})</span>
						<ArrowUpRight
							className={`size-3.5 transition-transform duration-300 ${EASE_CLASS} group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
						/>
					</a>
				) : null}
			</figcaption>
		</figure>
	);
}

type AiReview = Extract<Review, { kind: "ai" }>;

function AnswerDetails({ review }: { review: AiReview }) {
	return (
		<Popover>
			<PopoverTrigger
				openOnHover
				delay={150}
				className="caption-2 rounded-sm text-zinc-500 underline decoration-zinc-400 decoration-dotted underline-offset-4 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
			>
				Asked Oct 31, 2026
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-[min(26rem,calc(100vw-2rem))] rounded-xl border-zinc-200 p-4 shadow-xl shadow-zinc-950/10"
			>
				<p className="caption-4 text-zinc-500">We asked {review.name}</p>
				<p className="caption-2 mt-2 rounded-lg bg-paper-2 p-3 text-zinc-800">{AI_PROMPT}</p>
				<p className="caption-4 mt-4 text-zinc-500">Its full answer, Oct 31, 2026</p>
				<div className="body-6 mt-2 max-h-44 space-y-2 overflow-y-auto overscroll-contain rounded-lg bg-paper-2 p-3 text-zinc-800">
					{review.response.map((p) => (
						<p key={p}>{p}</p>
					))}
				</div>
				<p className="caption-5 mt-4 text-zinc-500">Asked over the {review.name} API with web search. Answers vary.</p>
			</PopoverContent>
		</Popover>
	);
}

export function Reviews() {
	return (
		<section className="bg-paper">
			<Container className="py-20 lg:py-24">
				<Reveal className="max-w-3xl">
					<h2 className="heading-2 text-zinc-950">Loved by Marketers. Recommended by AI.</h2>
				</Reveal>
				<Reveal delay={100} className="mt-12 grid gap-4 md:grid-cols-2 lg:hidden">
					{ROW_ORDER.map((r) => (
						<ReviewCard key={r.name} review={r} />
					))}
				</Reveal>
				<Reveal delay={100} className="mt-12 hidden grid-cols-3 items-start gap-4 lg:grid">
					{COLUMNS.map((column) => (
						<div key={column[0].name} className="flex flex-col gap-4">
							{column.map((r) => (
								<ReviewCard key={r.name} review={r} />
							))}
						</div>
					))}
				</Reveal>
			</Container>
		</section>
	);
}
