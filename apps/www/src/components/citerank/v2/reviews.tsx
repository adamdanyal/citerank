import { EngineIcon } from "@/components/home/engines";
import { AI_PROMPT, REVIEW_COLUMNS, type Review } from "../home/reviews";
import { BODY, LINK, MONO, PANEL, PANEL_PAD, Page, PanelHead, PILL_RUST, SMALL } from "./kit";

const ROW_ORDER = [0, 1, 2].flatMap((row) => REVIEW_COLUMNS.map((column) => column[row]));

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

/* An AI's review sits on rust-tinted paper, because it is the product reviewing itself. */
function ReviewCard({ review }: { review: Review }) {
	const isAi = review.kind === "ai";
	return (
		<figure className={`flex w-full flex-col rounded-card p-6 sm:p-8 ${isAi ? "bg-blue-50" : "bg-paper-2"}`}>
			{isAi ? (
				<p className="mb-5">
					<span className={PILL_RUST}>Asked {review.name}</span>
				</p>
			) : null}
			<blockquote className={`${BODY} flex-1 text-ink`}>“{review.quote}”</blockquote>
			<figcaption className="mt-6 flex items-center gap-3">
				<Avatar review={review} />
				<div className="min-w-0 flex-1">
					<p className={`${SMALL} font-medium text-ink`}>{review.name}</p>
					{review.kind === "ai" ? (
						<AnswerDetails review={review} />
					) : review.role ? (
						<p className={`${SMALL} truncate text-zinc-600`}>{review.role}</p>
					) : null}
				</div>
				{isAi ? (
					<a
						href={review.askUrl}
						target="_blank"
						rel="noopener noreferrer"
						className={`${LINK} shrink-0 text-[0.9375rem] font-medium text-blue-800`}
					>
						Ask it<span className="sr-only"> ({review.name})</span>
					</a>
				) : null}
			</figcaption>
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
			<button
				type="button"
				popoverTarget={id}
				className={`${SMALL} rounded-sm whitespace-nowrap text-zinc-600 underline decoration-zinc-400 decoration-dotted underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust`}
			>
				Asked Oct 31, 2026
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
					<button
						type="button"
						popoverTarget={id}
						popoverTargetAction="hide"
						className={`${LINK} ${SMALL} font-medium text-ink`}
					>
						Close
					</button>
				</p>
			</div>
		</>
	);
}

/*
 * A rail: the reviews run past the edge of the window, so the cut-off card is
 * the cue that there are more.
 */
export function Reviews() {
	return (
		<section className={`${PANEL} ${PANEL_PAD}`}>
			<Page>
				<PanelHead title="Loved by marketers. Recommended by AI." />
			</Page>
			<ul
				aria-label="Reviews"
				className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-6 [scrollbar-width:thin] sm:scroll-px-6 sm:px-6 lg:mt-16 lg:gap-8 lg:scroll-px-[max(4rem,calc((100%-90rem)/2+4rem))] lg:px-[max(4rem,calc((100%-90rem)/2+4rem))]"
			>
				{ROW_ORDER.map((review) => (
					<li key={review.name} className="flex w-[19rem] shrink-0 snap-start sm:w-[24rem]">
						<ReviewCard review={review} />
					</li>
				))}
			</ul>
		</section>
	);
}
