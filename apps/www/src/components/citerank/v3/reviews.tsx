import { ArrowUpRight } from "lucide-react";
import { AI_ASKED, AI_PROMPT, REVIEWS, type Review } from "../home/reviews";
import { AppLogo } from "../v2/app-logo";
import { BODY, CARD, FOCUS, HEAD_GAP, LINK, MONO, Page, SECTION, SectionHead, SMALL, TEXT, TEXT_2 } from "./kit";

type AiReview = Extract<Review, { kind: "ai" }>;

const AVATAR = "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-(--v3-raised)";

function Initials({ name }: { name: string }) {
	const letters = name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.slice(0, 2);
	return <span className={`${AVATAR} ${SMALL} font-medium ${TEXT_2}`}>{letters}</span>;
}

function Avatar({ review }: { review: Review }) {
	if (review.kind === "ai") {
		return (
			<span className={AVATAR}>
				<AppLogo id={review.iconId} className="size-5" />
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

const TEXT_CONTROL = `${LINK} inline-flex min-h-11 items-center text-[0.9375rem] font-medium whitespace-nowrap ${TEXT}`;
/* The two controls on an AI's card share its last line. Padding gives each a full-size target, and the margin takes it back out of the layout. */
const LAST_LINE = `${SMALL} -my-3 rounded-[4px] py-3 transition-colors duration-150 ease-(--v3-ease) ${FOCUS}`;
const ASK = `${LAST_LINE} inline-flex shrink-0 items-center gap-1 self-end font-medium whitespace-nowrap ${TEXT_2} hover:text-(--v3-text)`;

/* One card for every review, a person's or an AI's: the quote, then who said it. */
function ReviewCard({ review }: { review: Review }) {
	return (
		<figure className={`${CARD} flex w-full flex-col p-6`}>
			<blockquote className={`${BODY} flex-1 ${TEXT}`}>“{review.quote}”</blockquote>
			<figcaption className="mt-6 flex items-center gap-3">
				<Avatar review={review} />
				<div className="min-w-0 flex-1">
					<p className={`${SMALL} font-medium ${TEXT}`}>{review.name}</p>
					{review.kind === "ai" ? (
						<AnswerDetails review={review} />
					) : review.role ? (
						<p className={`${SMALL} truncate ${TEXT_2}`}>{review.role}</p>
					) : null}
				</div>
				{review.kind === "ai" ? (
					<a href={review.askUrl} target="_blank" rel="noopener noreferrer" className={ASK}>
						Ask it<span className="sr-only"> ({review.name})</span>
						<ArrowUpRight aria-hidden="true" strokeWidth={1.5} className="size-4" />
					</a>
				) : null}
			</figcaption>
		</figure>
	);
}

/* The question opens in the browser's own popover: no script to load, and it closes on a click outside or on Escape. */
function AnswerDetails({ review }: { review: AiReview }) {
	const id = `answer-${review.iconId}`;
	return (
		<>
			<button
				type="button"
				popoverTarget={id}
				className={`${LAST_LINE} whitespace-nowrap ${TEXT_2} underline decoration-(--v3-text-3) decoration-dotted underline-offset-4 hover:text-(--v3-text)`}
			>
				Asked {AI_ASKED}
				<span className="sr-only">: see the question we asked {review.name}</span>
			</button>
			<div
				id={id}
				popover="auto"
				className={`m-auto max-h-[85dvh] w-[min(30rem,calc(100%-2rem))] overflow-y-auto rounded-[14px] bg-(--v3-card) p-6 shadow-(--v3-shadow-float) ring-1 ring-(--v3-line) backdrop:bg-(--v3-ink)/60 ${TEXT}`}
			>
				<p className={`${SMALL} ${TEXT_2}`}>We asked {review.name}</p>
				<p className={`${MONO} mt-2 rounded-[8px] bg-(--v3-raised) p-3 ${TEXT_2}`}>{AI_PROMPT}</p>
				<p className={`${SMALL} mt-4 ${TEXT_2}`}>Its answer from {AI_ASKED}</p>
				<p className={`${SMALL} mt-2 rounded-[8px] bg-(--v3-raised) p-3 ${TEXT_2}`}>{review.quote}</p>
				<p className={`${SMALL} mt-4 ${TEXT_2}`}>Answers vary. Press Ask it to see what it says today.</p>
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
 * One list, laid out twice. On a wide screen it is a grid of three, read row by
 * row. On a narrow one it is a rail that runs past the edge, so the cut-off
 * card is the cue that there are more.
 */
export function Reviews() {
	return (
		<section className={SECTION}>
			<Page>
				<SectionHead title="We asked AI what CiteRank.com is" />
			</Page>
			<ul
				aria-label="AI answers"
				className={`${HEAD_GAP} flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pt-1 pb-6 [scrollbar-width:thin] sm:scroll-px-6 sm:px-6 lg:mx-auto lg:grid lg:max-w-[1440px] lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-16 lg:pt-0 lg:pb-0`}
			>
				{REVIEWS.map((review) => (
					<li key={review.name} className="flex w-[19rem] shrink-0 snap-start sm:w-[24rem] lg:w-auto">
						<ReviewCard review={review} />
					</li>
				))}
			</ul>
		</section>
	);
}
