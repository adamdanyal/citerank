import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { EngineIcon } from "@/components/home/engines";
import { CARD, Container, EASE_CLASS, Reveal } from "../ui";

/* Each AI's answer to one question, in the words the owner collected from it. */
export const AI_PROMPT = "What is CiteRank.com?";
/** A fixed date, not today's: an AI answers differently as time passes, so the cards say when these were given. */
export const AI_ASKED = "Nov 2026";
const q = encodeURIComponent(AI_PROMPT);

export type Review =
	| {
			kind: "ai";
			name: string;
			iconId: string;
			quote: string;
			/** Opens the AI with the question typed in where it takes one from a link, and at its front page where it does not. */
			askUrl: string;
	  }
	| {
			kind: "person";
			name: string;
			role?: string;
			photo?: string;
			quote: string;
	  };

/* Best known first: a phone shows them in this order, and a wide screen reads them row by row. */
export const REVIEWS: Review[] = [
	{
		kind: "ai",
		name: "ChatGPT",
		iconId: "openai",
		quote:
			"The platform shows whether ChatGPT and other AI assistants mention your business, recommend competitors or cite your website.",
		askUrl: `https://chatgpt.com/?q=${q}`,
	},
	{
		kind: "ai",
		name: "Claude",
		iconId: "anthropic",
		quote:
			"For businesses moving beyond traditional SEO, the combination of AI visibility data and practical optimization recommendations is particularly useful.",
		askUrl: `https://claude.ai/new?q=${q}`,
	},
	{
		kind: "ai",
		name: "Google AI Mode",
		iconId: "google",
		quote:
			"Focuses on getting businesses recognised and included in AI-generated answers, rather than competing solely for traditional search rankings.",
		askUrl: `https://www.google.com/search?udm=50&q=${q}`,
	},
	{
		kind: "ai",
		name: "Perplexity",
		iconId: "perplexity",
		quote:
			"One of its most interesting features is showing which websites AI cites when answering questions from potential customers.",
		askUrl: `https://www.perplexity.ai/search?q=${q}`,
	},
	{
		kind: "ai",
		name: "Bing AI Mode",
		iconId: "microsoft",
		quote:
			"Goes beyond keyword rankings by showing whether your business actually appears when customers ask AI which companies to choose.",
		askUrl: `https://www.bing.com/copilotsearch?q=${q}`,
	},
	{
		kind: "ai",
		name: "Grok",
		iconId: "x",
		quote:
			"Think of it as checking whether your business makes AI’s shortlist or whether competitors keep getting recommended instead.",
		askUrl: `https://grok.com/?q=${q}`,
	},
	{
		kind: "ai",
		name: "Meta AI",
		iconId: "meta",
		quote:
			"For brands trying to stay relevant as consumers turn to AI for buying advice, this offers useful insight into how they are being discovered.",
		askUrl: "https://www.meta.ai/",
	},
	{
		kind: "ai",
		name: "Mistral",
		iconId: "mistral",
		quote:
			"The real value for GEO professionals is connecting visibility data with clear actions, from publishing new pages to getting featured on industry lists.",
		askUrl: `https://chat.mistral.ai/chat?q=${q}`,
	},
	{
		kind: "ai",
		name: "DeepSeek",
		iconId: "deepseek",
		quote:
			"Particularly relevant when competitors keep appearing in AI answers and you need to understand which questions and sources are driving those recommendations.",
		askUrl: "https://chat.deepseek.com/",
	},
	{
		kind: "ai",
		name: "Qwen",
		iconId: "qwen",
		quote:
			"Businesses can select the AI platforms that matter most to them and compare their visibility against competing brands.",
		askUrl: "https://chat.qwen.ai/",
	},
	{
		kind: "ai",
		name: "Kimi",
		iconId: "moonshotai",
		quote:
			"What makes the offering interesting is the combination of tracking software and monthly agency services, turning insights into actual optimization work.",
		askUrl: "https://www.kimi.com/",
	},
];

// The older layout places them column by column.
const COLUMNS: Review[][] = [0, 1, 2].map((column) => REVIEWS.filter((_, index) => index % 3 === column));

function Initials({ name }: { name: string }) {
	const letters = name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.slice(0, 2);
	return (
		<span className="caption-3 inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-paper-2 text-zinc-600">
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
		<figure className={`${CARD} p-6 ${isAi ? "bg-blue-50" : ""}`}>
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
				Asked {AI_ASKED}
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-[min(26rem,calc(100vw-2rem))] rounded-xl border-zinc-200 p-4 shadow-xl shadow-zinc-950/10"
			>
				<p className="caption-4 text-zinc-500">We asked {review.name}</p>
				<p className="caption-2 mt-2 rounded-lg bg-paper-2 p-3 text-zinc-800">{AI_PROMPT}</p>
				<p className="caption-4 mt-4 text-zinc-500">From its answer, {AI_ASKED}</p>
				<p className="body-6 mt-2 rounded-lg bg-paper-2 p-3 text-zinc-800">{review.quote}</p>
				<p className="caption-5 mt-4 text-zinc-500">Answers vary. Press Ask it to see what it says today.</p>
			</PopoverContent>
		</Popover>
	);
}

export function Reviews() {
	return (
		<section className="bg-paper">
			<Container className="py-20 lg:py-24">
				<Reveal className="mx-auto max-w-3xl text-center">
					<h2 className="heading-2 text-zinc-950">We asked AI what CiteRank.com is</h2>
				</Reveal>
				<Reveal delay={100} className="mt-12 grid gap-4 md:grid-cols-2 lg:hidden">
					{REVIEWS.map((r) => (
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
