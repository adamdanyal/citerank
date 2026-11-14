import { EngineIcon } from "@/components/home/engines";
import { AI_PROMPT, REVIEW_COLUMNS, type Review } from "../home/reviews";
import { BODY, LINK, MONO, PANEL, PANEL_PAD, Page, PanelHead, SMALL } from "./kit";

const REVIEWS = REVIEW_COLUMNS.flat();

type AiReview = Extract<Review, { kind: "ai" }>;

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

/* An AI's review sits on rust-tinted paper, because it is the product reviewing itself. */
function ReviewCard({ review }: { review: Review }) {
	const isAi = review.kind === "ai";
	return (
		<figure className={`flex w-full flex-col rounded-card p-6 sm:p-8 ${isAi ? "bg-blue-50" : "bg-paper-2"}`}>
			<blockquote className={`${BODY} flex-1 text-ink`}>“{review.quote}”</blockquote>
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
				<div className="mt-2 flex flex-wrap gap-x-6">
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

/*
 * One list, laid out twice. On a wide screen all nine are in view in three
 * columns, each card as tall as its own quote. On a narrow one they are a rail
 * that runs past the edge, so the cut-off card is the cue that there are more.
 */
export function Reviews() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="Loved by marketers. Recommended by AI." />
			</Page>
			<ul
				aria-label="Reviews"
				className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-6 [scrollbar-width:thin] sm:scroll-px-6 sm:px-6 lg:mx-auto lg:mt-16 lg:block lg:max-w-[1440px] lg:columns-3 lg:gap-8 lg:overflow-visible lg:px-16 lg:pb-0"
			>
				{REVIEWS.map((review) => (
					<li
						key={review.name}
						className="flex w-[19rem] shrink-0 snap-start sm:w-[24rem] lg:mb-8 lg:w-auto lg:break-inside-avoid"
					>
						<ReviewCard review={review} />
					</li>
				))}
			</ul>
		</section>
	);
}
