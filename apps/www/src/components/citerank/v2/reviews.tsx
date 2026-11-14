import { EngineIcon } from "@/components/home/engines";
import { AI_PROMPT, REVIEW_COLUMNS, type Review } from "../home/reviews";
import { BODY, LEAD, LINK, MONO, PANEL, PANEL_PAD, Page, PanelHead, SMALL } from "./kit";

type AiReview = Extract<Review, { kind: "ai" }>;

/* The head makes two claims, so the reviews stand in two groups: what customers said, then what the AI apps said. */
const REVIEWS = REVIEW_COLUMNS.flat();
/* Longest first: the three long quotes share the first row and the two short ones the second, so neither row has a hole in it. */
const FROM_PEOPLE = REVIEWS.filter((review) => review.kind === "person").sort(
	(a, b) => b.quote.length - a.quote.length,
);
const FROM_AI = REVIEWS.filter((review) => review.kind === "ai");

function Initials({ name }: { name: string }) {
	const letters = name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.slice(0, 2);
	return (
		<span
			className={`${SMALL} inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-paper font-medium text-zinc-700`}
		>
			{letters}
		</span>
	);
}

function Avatar({ review }: { review: Review }) {
	if (review.kind === "ai") {
		return (
			<span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white">
				<EngineIcon iconId={review.iconId} className="size-5" />
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
			decoding="async"
			className="size-10 shrink-0 rounded-full object-cover"
		/>
	);
}

const TEXT_CONTROL = `${LINK} inline-flex min-h-11 items-center text-[0.9375rem] font-medium whitespace-nowrap text-blue-800`;

/* An AI's review sits on rust-tinted paper, because it is the product reviewing itself, and is set a size up: it is a line, not a paragraph. */
function ReviewCard({ review }: { review: Review }) {
	const isAi = review.kind === "ai";
	return (
		<figure
			className={`flex w-full flex-col rounded-card p-6 ${isAi ? "bg-blue-50 sm:p-8 lg:p-6" : "bg-paper-2 sm:p-8"}`}
		>
			<blockquote className={`${isAi ? LEAD : BODY} flex-1 text-ink`}>“{review.quote}”</blockquote>
			<figcaption className="mt-6 flex items-center gap-3">
				<Avatar review={review} />
				<div className="min-w-0 flex-1">
					<p className={`${SMALL} font-medium text-ink`}>{review.name}</p>
					{review.kind === "ai" ? (
						<p className={`${SMALL} text-zinc-600`}>Asked Oct 31, 2026</p>
					) : review.role ? (
						<p className={`${SMALL} truncate text-zinc-600`}>{review.role}</p>
					) : null}
				</div>
			</figcaption>
			{review.kind === "ai" ? (
				<div className="mt-2 flex flex-wrap gap-x-5">
					<AnswerDetails review={review} />
					<a href={review.askUrl} target="_blank" rel="noopener noreferrer" className={TEXT_CONTROL}>
						Ask it yourself<span className="sr-only"> ({review.name})</span>
					</a>
				</div>
			) : null}
		</figure>
	);
}

/*
 * The whole answer opens in the browser's own popover: no script to load, and
 * it closes on a click outside or on Escape.
 */
function AnswerDetails({ review }: { review: AiReview }) {
	const id = `answer-${review.iconId}`;
	return (
		<>
			<button type="button" popoverTarget={id} className={TEXT_CONTROL}>
				See its full answer<span className="sr-only"> ({review.name})</span>
			</button>
			<div
				id={id}
				popover="auto"
				className="m-auto max-h-[85dvh] w-[min(30rem,calc(100%-2rem))] overflow-y-auto rounded-card bg-paper p-6 text-ink shadow-card ring-1 ring-zinc-200 backdrop:bg-ink/60"
			>
				<p className={`${SMALL} text-zinc-600`}>We asked {review.name}</p>
				<p className={`${MONO} mt-2 rounded-lg bg-paper-2 p-3 text-zinc-700`}>{AI_PROMPT}</p>
				<p className={`${SMALL} mt-4 text-zinc-600`}>Its full answer, Oct 31, 2026</p>
				<div className={`${SMALL} mt-2 space-y-2 rounded-lg bg-paper-2 p-3 text-zinc-700`}>
					{review.response.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
				</div>
				<p className={`${SMALL} mt-4 text-zinc-600`}>Asked over the {review.name} API with web search. Answers vary.</p>
				<p className="mt-5">
					<button type="button" popoverTarget={id} popoverTargetAction="hide" className={TEXT_CONTROL}>
						Close
					</button>
				</p>
			</div>
		</>
	);
}

/* Below `lg` a group is a rail that runs past the edge, so the cut-off card is the cue that there are more; each card is as tall as its own quote. */
const RAIL =
	"flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-6 [scrollbar-width:thin] sm:scroll-px-6 sm:px-6 lg:mx-auto lg:max-w-[1440px] lg:overflow-visible lg:px-16 lg:pb-0";
const RAIL_ITEM = "flex w-[19rem] shrink-0 snap-start sm:w-[24rem] lg:w-auto";

export function Reviews() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="Loved by marketers. Recommended by AI." />
			</Page>
			<ul
				aria-label="What customers say"
				className={`${RAIL} mt-10 lg:mt-16 lg:grid lg:grid-cols-6 lg:items-stretch lg:gap-8`}
			>
				{FROM_PEOPLE.map((review, place) => (
					<li key={review.name} className={`${RAIL_ITEM} ${place < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}>
						<ReviewCard review={review} />
					</li>
				))}
			</ul>
			<ul
				aria-label="What AI apps say"
				className={`${RAIL} mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-stretch lg:gap-8`}
			>
				{FROM_AI.map((review) => (
					<li key={review.name} className={RAIL_ITEM}>
						<ReviewCard review={review} />
					</li>
				))}
			</ul>
		</section>
	);
}
